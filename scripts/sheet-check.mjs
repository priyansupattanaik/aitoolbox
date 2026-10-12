import { loadCatalog } from "../src/lib/loadCatalog.js";

const catalog = await loadCatalog();
if (!catalog || catalog.source !== "spreadsheet") {
  console.error("Spreadsheet catalog did not load");
  process.exit(1);
}

const tools = catalog.groups.flatMap((group) => group.tools);
const ids = new Set(tools.map((tool) => tool.id));
if (tools.length < 180) {
  console.error(`Expected the full spreadsheet, got ${tools.length} tools`);
  process.exit(1);
}
for (const id of ["ToffeeShare", "Codync", "GroundedDoneClaim"]) {
  if (!ids.has(id)) {
    console.error(`Missing spreadsheet tool ${id}`);
    process.exit(1);
  }
}
console.log(`Tools: ${tools.length} across ${catalog.groups.length} categories`);
