import { loadCatalogFromSheet, sheetConfigFromEnv } from "../../src/shared/catalogCore.js";

const baseHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export default async (request) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...baseHeaders, Allow: "GET, HEAD" },
    });
  }

  const catalog = await loadCatalogFromSheet(sheetConfigFromEnv(process.env));
  if (!catalog) {
    return new Response(JSON.stringify({ error: "Catalog unavailable" }), {
      status: 502,
      headers: { ...baseHeaders, "Cache-Control": "no-store" },
    });
  }

  return new Response(JSON.stringify(catalog), {
    status: 200,
    headers: {
      ...baseHeaders,
      "Cache-Control": "public, max-age=60",
      "Netlify-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
};

export const config = { path: "/api/catalog" };
