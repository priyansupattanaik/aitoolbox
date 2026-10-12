import assert from "node:assert";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseCsv, rowsToObjects } from "../src/utils/csvParser.js";
import { safeHttpUrl, hostFromUrl } from "../src/utils/url.js";
import { validateIsoDate, formatSheetDate, sectionKey } from "../src/utils/formatters.js";
import { resolveIcon } from "../src/utils/icons.js";
import { buildCatalog, csvTextToRows, loadCatalogFromSheet, DEFAULT_SHEET, sheetConfigFromEnv } from "../src/shared/catalogCore.js";
import { sortTools, SORT_OPTIONS, isSortId } from "../src/utils/sort.js";
import handler from "../netlify/functions/catalog.mjs";

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
assert.strictEqual(sheetConfigFromEnv({}).sheetId, DEFAULT_SHEET.sheetId);
assert.strictEqual(sheetConfigFromEnv({ SHEET_ID: "abc" }).sheetId, "abc");

console.log("Test 6: Browser code never references the spreadsheet...");
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const file of walk("src").filter((f) => !f.includes(join("src", "shared")))) {
  const text = readFileSync(file, "utf8");
  assert(!text.includes(DEFAULT_SHEET.sheetId), `${file} contains the sheet id`);
  assert(!text.includes("docs.google.com"), `${file} references docs.google.com`);
  if (text.includes("shared/catalogCore")) assert.fail(`${file} imports server-only catalogCore`);
}
if (existsSync("dist")) {
  for (const file of walk("dist")) {
    assert(!file.endsWith(".map"), `source map shipped: ${file}`);
    if (/\.(js|html|css)$/.test(file)) {
      const text = readFileSync(file, "utf8");
      assert(!text.includes(DEFAULT_SHEET.sheetId) && !text.includes("docs.google.com"), `${file} leaks sheet`);
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

console.log(`All unit tests passed. Live tools: ${totalTools} across ${live.groups.length} categories.`);
