import { loadCatalogFromSheet, sheetConfigFromEnv } from "../src/shared/catalogCore.js";

const catalog = await loadCatalogFromSheet(sheetConfigFromEnv(process.env));
if (!catalog || catalog.source !== "spreadsheet") {
  console.error("Spreadsheet catalog did not load");
  process.exit(1);
}
const tools = catalog.groups.flatMap((group) => group.tools);
console.log(`Tools: ${tools.length} across ${catalog.groups.length} categories`);
