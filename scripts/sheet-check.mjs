const SHEET = "1-IwOX6VT-09OXTnzturlks0VtvcRHtPrIIx58jCMfrM";
const sheets = ["Tools", "Categories"];

for (const name of sheets) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}&_=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const first = (text.split(/\r?\n/)[0] || "").slice(0, 120);
  console.log(`${name}: ${res.status} ${first}`);
  if (!res.ok || text.trimStart().startsWith("<")) process.exitCode = 1;
}
