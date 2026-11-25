import assert from "node:assert";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseCsv, rowsToObjects } from "../src/utils/csvParser.js";
import { safeHttpUrl, hostFromUrl } from "../src/utils/url.js";
import { validateIsoDate, formatSheetDate, sectionKey, compareNames } from "../src/utils/formatters.js";
import { resolveIcon } from "../src/utils/icons.js";
import { buildCatalog, csvTextToRows, loadCatalogFromSheet, DEFAULT_SHEET, sheetConfigFromEnv, humanizeCategoryId } from "../src/shared/catalogCore.js";
import { sortTools, SORT_OPTIONS, isSortId } from "../src/utils/sort.js";
import handler from "../netlify/functions/catalog.mjs";
import recommendHandler from "../netlify/functions/recommend.mjs";
import {
  normalizeQuery, queryKeywords, flattenCatalog, buildCompactCatalog, buildMessages,
  parseModelJson, validatePicks, createRateLimiter, callNim, SYSTEM_PROMPT, MAX_CATALOG_CHARS, DEFAULT_NIM_MODEL,
} from "../src/shared/recommendCore.js";
import { MAX_QUERY_CHARS, MAX_PICKS } from "../src/utils/recommendLimits.js";

console.log("Test 1: CSV Parser...");
const sampleCsv = `\uFEFFid,name,description,url\r
1,"Multi\nline","Said ""Hello"" to world",https://example.com\r
2,Simple,Just text,http://test.org\r
`;
const parsedRows = parseCsv(sampleCsv);
assert.strictEqual(parsedRows.length, 3);
assert.strictEqual(parsedRows[1][1], "Multi\nline");
assert.strictEqual(parsedRows[1][2], 'Said "Hello" to world');
const objects = rowsToObjects(parsedRows);
assert.strictEqual(objects.length, 2);
assert.strictEqual(objects[0].url, "https://example.com");

console.log("Test 2: URL Sanitizer...");
assert.strictEqual(safeHttpUrl("https://example.com/test"), "https://example.com/test");
assert.strictEqual(safeHttpUrl("http://example.com"), "http://example.com/");
for (const bad of ["javascript:alert(1)", " JavaScript:alert(1)", "data:text/html,<script>", "vbscript:x", "file:///etc/passwd", "//evil.com", "/relative", "   ", null, undefined, 42]) {
  assert.strictEqual(safeHttpUrl(bad), null, `should reject ${String(bad)}`);
}
assert.strictEqual(hostFromUrl("https://www.google.com/path"), "google.com");
assert.strictEqual(hostFromUrl("not-a-url"), "");

console.log("Test 3: Formatters...");
assert.strictEqual(validateIsoDate("2026-10-12"), "2026-10-12");
assert.strictEqual(validateIsoDate("2026-02-31"), "");
assert(formatSheetDate("2026-10-12").includes("2026"));
assert.strictEqual(sectionKey("ChatGPT"), "C");
assert.strictEqual(sectionKey("100x"), "#");

console.log("Test 4: Icon Resolver...");
assert(resolveIcon("Share2") != null);
assert(resolveIcon("unknown-icon-xyz") != null);

console.log("Test 5: Catalog builder (server parsing)...");
const toolsCsv = `id,name,description,url,category,icon,date_added,source,source_url,source_screenshot_url,source_note,internal_secret
a,Alpha,First,https://alpha.dev,coding,Code,2026-10-01,GitHub,https://github.com/a,https://aitoolsbox.netlify.app/source-shots/a.jpg,note,SHOULD_NOT_LEAK
b,Beta,Bad links,javascript:alert(1),coding,Code,bad,X,javascript:alert(2),data:image/png;base64,AAAA,,x
,,,,,,,,,,,
c,Gamma,No cat,https://gamma.dev,,,,,,,,
`;
const catsCsv = `id,name,description\ncoding,Coding,Code tools\n`;
assert.strictEqual(csvTextToRows("<!DOCTYPE html><html>"), null);
const built = buildCatalog(csvTextToRows(toolsCsv), csvTextToRows(catsCsv));
assert.strictEqual(built.counts.entries, 3);
assert.strictEqual(built.groups[0].category.name, "Coding");
const [alpha, beta] = built.groups[0].tools;
assert.strictEqual(alpha.url, "https://alpha.dev/");
assert.strictEqual(alpha.host, "alpha.dev");
assert.strictEqual(alpha.sourceScreenshot, "https://aitoolsbox.netlify.app/source-shots/a.jpg");
assert.strictEqual(beta.url, "");
assert.strictEqual(beta.sourceUrl, "");
assert.strictEqual(beta.sourceScreenshot, "");
assert.strictEqual(beta.added, "");
assert.strictEqual(built.groups[1].category.name, "Uncategorized");
assert(!JSON.stringify(built).includes("SHOULD_NOT_LEAK"), "internal columns must be dropped");
assert.deepStrictEqual(Object.keys(alpha).sort(), ["added","category","description","github","host","icon","id","index","name","source","sourceNote","sourceScreenshot","sourceUrl","url"]);
assert.strictEqual(buildCatalog([], []), null);
const extra = buildCatalog(csvTextToRows(`id,name,url,category,date_added
p,Placeholder,https://p.dev,agent-tools,2025-01-01
r,Real,https://r.dev,ai,2026-11-15
`), csvTextToRows(catsCsv));
assert.strictEqual(extra.groups[0].tools[0].added, "", "placeholder date must be treated as unknown");
assert.strictEqual(extra.groups[0].category.name, "Agent Tools");
assert.strictEqual(extra.groups[1].category.name, "AI");
assert.strictEqual(extra.groups[1].tools[0].added, "2026-11-15");
assert.strictEqual(humanizeCategoryId(""), "Uncategorized");
assert(compareNames("/awwwards", "Bolt") < 0, "leading punctuation is ignored when sorting names");
assert(compareNames("@scope/zed", "Alpha") > 0);
assert.strictEqual(sheetConfigFromEnv({}).sheetId, DEFAULT_SHEET.sheetId);
assert.strictEqual(sheetConfigFromEnv({ SHEET_ID: "abc" }).sheetId, "abc");

console.log("Test 6: Browser code never references the spreadsheet...");
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const file of walk("src").filter((f) => !f.includes(join("src", "shared")))) {
  const text = readFileSync(file, "utf8");
  assert(!text.includes(DEFAULT_SHEET.sheetId), `${file} contains the sheet id`);
  assert(!text.includes("docs.google.com"), `${file} references docs.google.com`);
  if (text.includes("shared/catalogCore")) assert.fail(`${file} imports server-only catalogCore`);
  if (text.includes("shared/recommendCore")) assert.fail(`${file} imports server-only recommendCore`);
  assert(!/NVIDIA_API_KEY|integrate\.api\.nvidia\.com|nvapi-/.test(text), `${file} references the NIM key or endpoint`);
}
if (existsSync("dist")) {
  for (const file of walk("dist")) {
    assert(!file.endsWith(".map"), `source map shipped: ${file}`);
    if (/\.(js|html|css)$/.test(file)) {
      const text = readFileSync(file, "utf8");
      assert(!text.includes(DEFAULT_SHEET.sheetId) && !text.includes("docs.google.com"), `${file} leaks sheet`);
      assert(!/NVIDIA_API_KEY|integrate\.api\.nvidia\.com|nvapi-|NIM_MODEL|You recommend tools from/.test(text), `${file} leaks recommender internals`);
    }
  }
}

console.log("Test 8: Sort logic...");
const sample = [
  { name: "beta", added: "2026-10-07", categoryName: "Coding", source: "X", github: "", index: 1 },
  { name: "Alpha", added: "", categoryName: "Agents", source: "GitHub", github: "https://github.com/a", index: 2 },
  { name: "gamma", added: "2026-10-12", categoryName: "", source: "", github: "https://github.com/g", index: 3 },
  { name: "Delta", added: "2025-01-01", categoryName: "Coding", source: "Hacker News", github: "", index: 4 },
];
const names = (id) => sortTools(sample, id).map((t) => t.name);
assert.deepStrictEqual(names("name-asc"), ["Alpha", "beta", "Delta", "gamma"]);
assert.deepStrictEqual(names("name-desc"), ["gamma", "Delta", "beta", "Alpha"]);
assert.deepStrictEqual(names("newest"), ["gamma", "beta", "Delta", "Alpha"]);
assert.deepStrictEqual(names("oldest"), ["Delta", "beta", "gamma", "Alpha"]);
assert.deepStrictEqual(names("category"), ["Alpha", "beta", "Delta", "gamma"]);
assert.deepStrictEqual(names("source"), ["Alpha", "Delta", "beta", "gamma"]);
assert.deepStrictEqual(names("github-first"), ["Alpha", "gamma", "beta", "Delta"]);
assert.deepStrictEqual(names("bogus"), names("name-asc"));
assert.strictEqual(sample[0].name, "beta", "input must not be mutated");
assert.strictEqual(SORT_OPTIONS.length, 7);
assert(isSortId("newest") && !isSortId("x"));
assert.deepStrictEqual(sortTools(undefined), []);


console.log("Test 9: Recommender input limits...");
assert.strictEqual(normalizeQuery(42).ok, false);
assert.strictEqual(normalizeQuery("  ").ok, false);
assert.strictEqual(normalizeQuery("ab").ok, false);
assert.strictEqual(normalizeQuery("x".repeat(MAX_QUERY_CHARS)).ok, true);
assert.strictEqual(normalizeQuery("x".repeat(MAX_QUERY_CHARS + 1)).ok, false);
assert.strictEqual(normalizeQuery("  free\n\tvideo\u0000 editor  ").query, "free video editor");
assert.strictEqual(normalizeQuery("मुझे वीडियो एडिट करना है").ok, true);
assert.strictEqual(normalizeQuery("😀".repeat(MAX_QUERY_CHARS)).ok, true, "length counts characters, not UTF-16 units");
assert.deepStrictEqual(queryKeywords("I need a FREE video editor for YouTube"), ["video", "editor", "youtube"]);
assert(queryKeywords("ଭିଡିଓ ଏଡିଟ କରିବା").length >= 1, "non-Latin scripts produce keywords");

console.log("Test 10: Recommender catalog compaction and prompt...");
const recCatalog = buildCatalog(
  [
    { id: "CutKit", name: "CutKit", description: "Free open-source video editor in the browser", url: "https://cut.example", category: "video-generation" },
    { id: "LogoForge", name: "LogoForge", description: "Design logos | brand marks for free", url: "https://logo.example", category: "creative" },
    { id: "CodePal", name: "CodePal", description: "Terminal coding agent", url: "https://code.example", category: "coding" },
  ],
  [{ id: "video-generation", name: "Video Generation" }, { id: "creative", name: "Creative" }, { id: "coding", name: "Coding" }]
);
const recTools = flattenCatalog(recCatalog);
assert.deepStrictEqual(recTools.map((t) => [t.ref, t.id]), [[1, "CutKit"], [2, "LogoForge"], [3, "CodePal"]]);
const compact = buildCompactCatalog(recTools, "video editor");
assert(compact.text.includes("## Video Generation (video-generation)"));
assert(compact.text.includes("1|CutKit|Free open-source video editor in the browser"));
assert(compact.text.includes("2|LogoForge|Design logos brand marks for free"), "pipes inside fields are flattened");
assert.strictEqual(compact.included, 3);
const bigTools = Array.from({ length: 3000 }, (_, i) => ({
  ref: i + 1, id: `t${i}`, name: `Tool number ${i}`, category: `cat${i % 20}`, categoryName: `Cat ${i % 20}`,
  description: `${i === 2999 ? "video editor " : ""}A fairly long description of what this tool does for people `.repeat(3),
}));
const bigCompact = buildCompactCatalog(bigTools, "video editor", { maxChars: 20000 });
assert(bigCompact.text.length <= 20000, `compact catalog must fit the budget, got ${bigCompact.text.length}`);
assert(bigCompact.included < 3000 && bigCompact.included > 100);
assert(bigCompact.text.includes("3000|Tool number 2999|video editor"), "keyword matches are kept and get descriptions");
const msgs = buildMessages("quiero editar videos", compact.text);
assert.strictEqual(msgs.length, 2);
assert.strictEqual(msgs[0].role, "system");
assert.strictEqual(msgs[0].content, SYSTEM_PROMPT);
assert(/same language/i.test(SYSTEM_PROMPT) && /never invent/i.test(SYSTEM_PROMPT) && /JSON only/i.test(SYSTEM_PROMPT));
assert(msgs[1].content.includes("<<<\nquiero editar videos\n>>>"));
assert(msgs[1].content.includes(compact.text));
assert(MAX_CATALOG_CHARS <= 60000);
assert.strictEqual(DEFAULT_NIM_MODEL.includes("llama-3.3"), false, "llama-3.3-70b reached end of life on NIM");

console.log("Test 11: Recommender JSON parsing fallbacks...");
assert.deepStrictEqual(parseModelJson('{"picks":[{"ref":1,"reason":"a"}]}'), [{ ref: 1, reason: "a" }]);
assert.deepStrictEqual(parseModelJson('```json\n{"picks":[{"ref":2,"reason":"b"}]}\n```'), [{ ref: 2, reason: "b" }]);
assert.deepStrictEqual(parseModelJson('<think>ref 9? {not json}</think>\nHere you go: {"picks":[{"ref":3,"reason":"c } ok"}]} thanks'), [{ ref: 3, reason: "c } ok" }]);
assert.deepStrictEqual(parseModelJson('[{"ref":1,"reason":"x"}]'), [{ ref: 1, reason: "x" }]);
assert.deepStrictEqual(parseModelJson('{"recommendations":[{"ref":1}]}'), [{ ref: 1 }]);
assert.strictEqual(parseModelJson("Sorry, I can't help with that."), null);
assert.strictEqual(parseModelJson('{"picks": [ {"ref": 1, '), null);
assert.strictEqual(parseModelJson(null), null);

console.log("Test 12: Recommender pick validation (no invented tools)...");
const validated = validatePicks(
  [
    { ref: 1, reason: "Edits video <b>free</b>" },
    { ref: 99, reason: "invented ref" },
    { ref: "2", reason: "string ref" },
    { ref: 1, reason: "duplicate" },
    { id: "codepal", reason: "matched by id" },
    { id: "MadeUpTool", reason: "invented id" },
    { name: "LogoForge" },
    null, "x", { ref: 1.5 },
  ],
  recTools
);
assert.deepStrictEqual(validated, [
  { id: "CutKit", reason: "Edits video bfree/b" },
  { id: "LogoForge", reason: "string ref" },
  { id: "CodePal", reason: "matched by id" },
]);
const many = validatePicks(Array.from({ length: 9 }, (_, i) => ({ ref: (i % 3) + 1, reason: "r".repeat(500) })), bigTools.slice(0, 3).map((t) => t));
assert(many.length <= MAX_PICKS);
assert(many.every((p) => p.reason.length <= 220));
assert.deepStrictEqual(validatePicks("nope", recTools), []);

console.log("Test 13: Rate limiter and upstream call...");
const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
assert.strictEqual(rl.check("a", 0).allowed, true);
assert.strictEqual(rl.check("a", 10).allowed, true);
const blocked = rl.check("a", 20);
assert.strictEqual(blocked.allowed, false);
assert(blocked.retryAfter >= 1);
assert.strictEqual(rl.check("b", 20).allowed, true, "limits are per IP");
assert.strictEqual(rl.check("a", 1500).allowed, true, "window slides");
let sentBody;
const okFetch = async (url, init) => {
  assert.strictEqual(url, "https://integrate.api.nvidia.com/v1/chat/completions");
  assert.strictEqual(init.headers.Authorization, "Bearer nvapi-test");
  sentBody = JSON.parse(init.body);
  return new Response(JSON.stringify({ choices: [{ message: { content: '{"picks":[]}' } }] }), { status: 200 });
};
const okCall = await callNim({ apiKey: "nvapi-test", model: "m", messages: msgs, fetchImpl: okFetch });
assert.strictEqual(okCall.ok, true);
assert.strictEqual(okCall.content, '{"picks":[]}');
assert.strictEqual(sentBody.model, "m");
assert.strictEqual(sentBody.stream, false);
const errCall = await callNim({ apiKey: "k", model: "m", messages: msgs, fetchImpl: async () => new Response("secret upstream detail", { status: 401 }) });
assert.deepStrictEqual([errCall.ok, errCall.status, errCall.content], [false, 401, undefined]);
const slowFetch = (url, init) => new Promise((_, reject) => init.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" }))));
const slowCall = await callNim({ apiKey: "k", model: "m", messages: msgs, timeoutMs: 30, fetchImpl: slowFetch });
assert.deepStrictEqual([slowCall.ok, slowCall.status], [false, 504]);

console.log("Test 14: /api/recommend handler guards...");
const savedKey = process.env.NVIDIA_API_KEY;
delete process.env.NVIDIA_API_KEY;
const getRes = await recommendHandler(new Request("http://localhost/api/recommend"), {});
assert.strictEqual(getRes.status, 405);
const noKey = await recommendHandler(new Request("http://localhost/api/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: '{"query":"video editor"}' }), {});
assert.strictEqual(noKey.status, 503);
const noKeyBody = await noKey.json();
assert.match(noKeyBody.error, /unavailable/i);
process.env.NVIDIA_API_KEY = "nvapi-test-not-real";
const badJson = await recommendHandler(new Request("http://localhost/api/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: "{oops" }), { ip: "1.1.1.1" });
assert.strictEqual(badJson.status, 400);
const tooLong = await recommendHandler(new Request("http://localhost/api/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: "y".repeat(MAX_QUERY_CHARS + 1) }) }), { ip: "1.1.1.2" });
assert.strictEqual(tooLong.status, 400);
const notJson = await recommendHandler(new Request("http://localhost/api/recommend", { method: "POST", headers: { "content-type": "text/plain" }, body: "hi" }), { ip: "1.1.1.3" });
assert.strictEqual(notJson.status, 415);
if (savedKey === undefined) delete process.env.NVIDIA_API_KEY;
else process.env.NVIDIA_API_KEY = savedKey;

console.log("Test 7: Live sheet via Netlify Function handler...");
const res = await handler(new Request("http://localhost/api/catalog"));
assert.strictEqual(res.status, 200);
assert.match(res.headers.get("content-type"), /application\/json/);
const live = await res.json();
const totalTools = live.groups.reduce((s, g) => s + g.tools.length, 0);
assert.strictEqual(totalTools, live.counts.entries);
assert(totalTools >= 185, `expected >=185 tools, got ${totalTools}`);
const post = await handler(new Request("http://localhost/api/catalog", { method: "POST" }));
assert.strictEqual(post.status, 405);
const direct = await loadCatalogFromSheet();
assert.strictEqual(direct.counts.entries, totalTools);

const liveCompact = buildCompactCatalog(flattenCatalog(direct), "मुझे वीडियो एडिट करना है");
assert(liveCompact.text.length <= MAX_CATALOG_CHARS);
console.log(`Live compact catalog: ${liveCompact.included}/${liveCompact.total} tools, ${liveCompact.text.length} chars.`);
console.log(`All unit tests passed. Live tools: ${totalTools} across ${live.groups.length} categories.`);
