import { MAX_QUERY_CHARS } from "../utils/recommendLimits.js";

const GENERIC_ERROR = "The AI assistant couldn't answer just now. Please try again in a moment.";

/**
 * Asks the same-origin /api/recommend function for tool picks.
 * @param {string} query
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ picks: { id: string, reason: string }[] }>}
 */
export async function fetchRecommendations(query, signal) {
  const trimmed = String(query || "").trim().slice(0, MAX_QUERY_CHARS);
  let response;
  try {
    response = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: trimmed }),
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new Error("Couldn't reach the AI assistant. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message = typeof data?.error === "string" && data.error.length < 200 ? data.error : GENERIC_ERROR;
    throw new Error(message);
  }
  const picks = Array.isArray(data?.picks)
    ? data.picks.filter((p) => p && typeof p.id === "string").map((p) => ({ id: p.id, reason: typeof p.reason === "string" ? p.reason : "" }))
    : [];
  return { picks };
}
