import crypto from "crypto";
import fs from "fs";

const md = fs.readFileSync(new URL("./data.MD", import.meta.url), "utf8");

function parse(markdown) {
  const site = {};
  const about = [];
  const categories = [];
  const tools = [];
  let section = "";
  let current = null;
  let aboutLines = [];

  const flushAbout = () => {
    const text = aboutLines.join("\n").trim();
    aboutLines = [];
    if (!text) return;
    text.split(/\n\s*\n/).forEach((part) => {
      const paragraph = part.trim();
      if (paragraph) about.push(paragraph);
    });
  };

  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      if (section === "about") flushAbout();
      section = line.slice(3).trim().toLowerCase();
      current = null;
      continue;
    }
    if (section === "site" && line.startsWith("- ")) {
      const match = line.match(/^- ([a-z]+): (.*)$/);
      if (match) site[match[1]] = match[2];
      continue;
    }
    if (section === "about") {
      aboutLines.push(line);
      continue;
    }
    if ((section === "categories" || section === "tools") && line.startsWith("### ")) {
      current = { id: line.slice(4).trim() };
      (section === "categories" ? categories : tools).push(current);
      continue;
    }
    if (current && line.startsWith("- ")) {
      const match = line.match(/^- ([a-z]+): (.*)$/);
      if (match) current[match[1]] = match[2];
    }
  }
  if (section === "about") flushAbout();
  return { site, about, categories, tools };
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function hostname(url) {
  return new URL(url).hostname.replace(/^www\./, "");
}

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

const data = parse(md);
const { site, about, categories, tools } = data;

if (!site.title || !site.author || !site.language) {
  throw new Error("data.MD is missing site title, author, or language");
}
if (about.length === 0) throw new Error("data.MD has no about paragraphs");

const categoryById = new Map();
for (const category of categories) {
  for (const key of ["id", "name", "description", "icon"]) {
    if (!category[key]) throw new Error(`Category missing ${key}: ${category.id || "(no id)"}`);
  }
  if (categoryById.has(category.id)) throw new Error(`Duplicate category ${category.id}`);
  categoryById.set(category.id, category);
}

const seenTools = new Set();
for (const tool of tools) {
  for (const key of ["id", "name", "description", "url", "category", "icon"]) {
    if (!tool[key]) throw new Error(`Tool missing ${key}: ${tool.id || tool.name || "(unknown)"}`);
  }
  if (seenTools.has(tool.id)) throw new Error(`Duplicate tool ${tool.id}`);
  seenTools.add(tool.id);
  if (!categoryById.has(tool.category)) {
    throw new Error(`Tool ${tool.id} uses unknown category ${tool.category}`);
  }
  hostname(tool.url);
}

const groups = [];
for (const tool of tools) {
  const last = groups[groups.length - 1];
  if (!last || last.category.id !== tool.category) {
    groups.push({ category: categoryById.get(tool.category), tools: [] });
  }
  groups[groups.length - 1].tools.push(tool);
}

const description = `${site.title} lists ${plural(tools.length, "entry", "entries")} in ${plural(categories.length, "category", "categories")}. Each name, description, and link is copied from data.MD.`;
const stamp = crypto
  .createHash("sha256")
  .update(tools.map((tool) => `${tool.id}\t${tool.name}\t${tool.url}`).join("\n"))
  .digest("hex")
  .slice(0, 16);

let index = 0;
const catalog = {
  site,
  about,
  description,
  stamp,
  counts: { entries: tools.length, categories: categories.length },
  groups: groups.map((group) => ({
    category: {
      id: group.category.id,
      name: group.category.name,
      description: group.category.description,
    },
    tools: group.tools.map((tool) => {
      index += 1;
      return {
        id: tool.id,
        name: tool.name,
        description: tool.description,
        url: tool.url,
        host: hostname(tool.url),
        category: tool.category,
        index,
      };
    }),
  })),
};

fs.mkdirSync(new URL("./src/data", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("./src/data/catalog.json", import.meta.url), JSON.stringify(catalog, null, 2) + "\n", "utf8");

const itemList = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: site.title,
  description,
  inLanguage: site.language,
  author: { "@type": "Person", name: site.author },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, position) => ({
      "@type": "ListItem",
      position: position + 1,
      name: tool.name,
      description: tool.description,
      url: tool.url,
    })),
  },
};
const jsonLd = JSON.stringify(itemList).replace(/</g, "\\u003c");

const html = `<!DOCTYPE html>
<html lang="${esc(site.language)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(site.title)}: ${tools.length} entries in ${categories.length} categories</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="${esc(site.author)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#050505">
  <meta property="og:title" content="${esc(site.title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(site.title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
`;

const banned = ["Next-Gen", "most powerful", "No paywalls", "Community driven", "Community Driven", "supercharge", "unlock new", "100%", "\u2014", "\u2013"];
for (const phrase of banned) {
  if (html.includes(phrase)) throw new Error("Generated page contains omitted claim or dash: " + phrase);
}
for (const tool of tools) {
  if (!JSON.stringify(catalog).includes(tool.url) || !JSON.stringify(catalog).includes(tool.name)) {
    throw new Error("Catalog is missing " + tool.id);
  }
}

fs.writeFileSync(new URL("./index.html", import.meta.url), html, "utf8");
console.log("wrote catalog.json and index.html: " + tools.length + " entries, " + categories.length + " categories, stamp " + stamp);

