import assert from "node:assert";
import { parseCsv, rowsToObjects } from "../src/utils/csvParser.js";
import { safeHttpUrl, hostFromUrl } from "../src/utils/url.js";
import { validateIsoDate, formatSheetDate, compareNames, sectionKey } from "../src/utils/formatters.js";
import { resolveIcon } from "../src/utils/icons.js";
import { loadCatalog } from "../src/lib/loadCatalog.js";

// Test 1: CSV parser RFC 4180
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
assert.strictEqual(objects[0].id, "1");
assert.strictEqual(objects[0].name, "Multi\nline");
assert.strictEqual(objects[0].description, 'Said "Hello" to world');
assert.strictEqual(objects[0].url, "https://example.com");

// Test 2: URL Sanitizer
console.log("Test 2: URL Sanitizer...");
assert.strictEqual(safeHttpUrl("https://example.com/test"), "https://example.com/test");
assert.strictEqual(safeHttpUrl("http://example.com"), "http://example.com/");
assert.strictEqual(safeHttpUrl("javascript:alert(1)"), null);
assert.strictEqual(safeHttpUrl("data:text/html,<script>"), null);
assert.strictEqual(safeHttpUrl("   "), null);
assert.strictEqual(safeHttpUrl(null), null);
assert.strictEqual(hostFromUrl("https://www.google.com/path"), "google.com");
assert.strictEqual(hostFromUrl("http://github.com"), "github.com");
assert.strictEqual(hostFromUrl("not-a-url"), "");

// Test 3: Date and String Formatters
console.log("Test 3: Formatters...");
assert.strictEqual(validateIsoDate("2026-10-12"), "2026-10-12");
assert.strictEqual(validateIsoDate("2026-02-31"), ""); // Invalid date in February
assert.strictEqual(validateIsoDate("not-a-date"), "");
assert(formatSheetDate("2026-10-12").includes("October") && formatSheetDate("2026-10-12").includes("2026"));
assert.strictEqual(formatSheetDate("invalid"), "");
assert.strictEqual(sectionKey("ChatGPT"), "C");
assert.strictEqual(sectionKey("100x"), "#");
assert.strictEqual(sectionKey("@tool"), "#");

// Test 4: Icon Resolver
console.log("Test 4: Icon Resolver...");
assert(resolveIcon("Share2") != null);
assert(resolveIcon("share-2") != null);
assert(resolveIcon("Brain") != null);
assert(resolveIcon("git-commit-horizontal") != null);
assert(resolveIcon("unknown-icon-xyz") != null); // Returns fallback Sparkles

// Test 5: Live Catalog
console.log("Test 5: Live Catalog Loader...");
const catalog = await loadCatalog();
assert(catalog != null);
assert.strictEqual(catalog.source, "spreadsheet");
assert(catalog.groups.length >= 17);
const totalTools = catalog.groups.reduce((sum, g) => sum + g.tools.length, 0);
assert(totalTools >= 185);

console.log(`✓ All unit tests passed! Total tools verified: ${totalTools} across ${catalog.groups.length} categories.`);
