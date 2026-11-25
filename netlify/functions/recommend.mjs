import { loadCatalogFromSheet, sheetConfigFromEnv } from "../../src/shared/catalogCore.js";
import {
  DEFAULT_NIM_MODEL,
  buildCompactCatalog,
  buildMessages,
  callNim,
  createRateLimiter,
  flattenCatalog,
  normalizeQuery,
  parseModelJson,
  validatePicks,
} from "../../src/shared/recommendCore.js";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
};
const json = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });

const UNAVAILABLE = "The AI assistant is unavailable right now. Please use the search box instead.";
const FAILED = "The AI assistant couldn't answer just now. Please try again in a moment.";
const CATALOG_TTL_MS = 5 * 60 * 1000;
const limiter = createRateLimiter({ limit: 6, windowMs: 60000 });

// TEMP-MODEL-EVAL: allow-listed model override used only to compare NIM models after deploy. Remove before finishing.
const EVAL_MODELS = new Set([
  "mistralai/mistral-large-4-1t-a52b",
  "nvidia/nemotron-3-ultra-550b-a55b",
  "nvidia/nemotron-3.5-lightning-30b-a3b",
  "nvidia/nemotron-3.5-super-vl-120b-a12b",
  "moonshotai/kimi-k3.1-pro",
  "z-ai/glm-5.3-flash",
  "minimaxai/minimax-m3.1-flash",
  ]);

let cached = { at: 0, tools: null };
async function getTools() {
  if (cached.tools && Date.now() - cached.at < CATALOG_TTL_MS) return cached.tools;
  const catalog = await loadCatalogFromSheet(sheetConfigFromEnv(process.env));
  if (!catalog) return cached.tools; // serve stale if the sheet is briefly unreachable
  cached = { at: Date.now(), tools: flattenCatalog(catalog) };
  return cached.tools;
}

export default async (request, context) => {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" }, { Allow: "POST" });

  const apiKey = (process.env.NVIDIA_API_KEY || "").trim();
  if (!apiKey) return json(503, { error: UNAVAILABLE });

  if (!(request.headers.get("content-type") || "").includes("application/json")) return json(415, { error: "Send JSON." });
  const raw = await request.text();
  if (raw.length > 4000) return json(413, { error: "Request too large." });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const evalModel = typeof body?.model === "string" && EVAL_MODELS.has(body.model) ? body.model : ""; // TEMP-MODEL-EVAL

  const ip = context?.ip || request.headers.get("x-nf-client-connection-ip") || "unknown";
  const rl = evalModel ? { allowed: true } : limiter.check(ip); // TEMP-MODEL-EVAL exemption
  if (!rl.allowed) {
    return json(429, { error: "Too many requests. Please wait a minute and try again." }, { "Retry-After": String(rl.retryAfter) });
  }

  const q = normalizeQuery(body?.query);
  if (!q.ok) return json(400, { error: q.error });

  const tools = await getTools();
  if (!tools?.length) return json(502, { error: FAILED });

  const model = evalModel || (process.env.NIM_MODEL || "").trim() || DEFAULT_NIM_MODEL;
  // TEMP-MODEL-EVAL knobs (bounded), only with an allow-listed eval model.
  const eo = evalModel && body.evalOpts && typeof body.evalOpts === "object" ? body.evalOpts : {};
  const maxChars = Number.isInteger(eo.maxChars) && eo.maxChars >= 8000 && eo.maxChars <= 42000 ? eo.maxChars : undefined;
  const extraBody = {};
  if (eo.thinkingOff === true) extraBody.chat_template_kwargs = { enable_thinking: false, thinking: false };
  if (Number.isInteger(eo.maxTokens) && eo.maxTokens >= 200 && eo.maxTokens <= 4000) extraBody.max_tokens = eo.maxTokens;
  if (eo.temperature === 1) extraBody.temperature = 1;
  if (eo.noTopP === true) extraBody.top_p = undefined;
  if (eo.jsonMode === true) extraBody.response_format = { type: "json_object" };
  const compact = buildCompactCatalog(tools, q.query, maxChars ? { maxChars } : undefined);
  const result = await callNim({
    apiKey, model, messages: buildMessages(q.query, compact.text),
    extraBody, debug: Boolean(evalModel), timeoutMs: evalModel ? 24000 : 20000,
  });
  const evalMeta = evalModel ? { model, upstreamStatus: result.status, ms: result.ms, included: compact.included, chars: compact.text.length, detail: result.detail, info: result.info } : undefined; // TEMP-MODEL-EVAL

  if (!result.ok) {
    console.error(`recommend: upstream status ${result.status} after ${result.ms}ms`);
    return json(502, { error: FAILED, eval: evalMeta });
  }
  const parsed = parseModelJson(result.content);
  if (!parsed) {
    console.error("recommend: model reply was not valid JSON");
    return json(502, { error: FAILED, eval: evalMeta });
  }
  const picks = validatePicks(parsed, tools);
  return json(200, { picks, eval: evalMeta });
};

export const config = {
  path: "/api/recommend",
  method: "POST",
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
