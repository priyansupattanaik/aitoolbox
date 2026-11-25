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

  const ip = context?.ip || request.headers.get("x-nf-client-connection-ip") || "unknown";
  const rl = limiter.check(ip);
  if (!rl.allowed) {
    return json(429, { error: "Too many requests. Please wait a minute and try again." }, { "Retry-After": String(rl.retryAfter) });
  }

  if (!(request.headers.get("content-type") || "").includes("application/json")) return json(415, { error: "Send JSON." });
  const raw = await request.text();
  if (raw.length > 4000) return json(413, { error: "Request too large." });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const q = normalizeQuery(body?.query);
  if (!q.ok) return json(400, { error: q.error });

  const tools = await getTools();
  if (!tools?.length) return json(502, { error: FAILED });

  const model = (process.env.NIM_MODEL || "").trim() || DEFAULT_NIM_MODEL;
  const compact = buildCompactCatalog(tools, q.query);
  const result = await callNim({ apiKey, model, messages: buildMessages(q.query, compact.text) });

  if (!result.ok) {
    console.error(`recommend: upstream status ${result.status} after ${result.ms}ms`);
    return json(502, { error: FAILED });
  }
  const parsed = parseModelJson(result.content);
  if (!parsed) {
    console.error("recommend: model reply was not valid JSON");
    return json(502, { error: FAILED });
  }
  const picks = validatePicks(parsed, tools);
  return json(200, { picks });
};

export const config = {
  path: "/api/recommend",
  method: "POST",
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
