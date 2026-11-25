import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { ToolCard } from "../tools/ToolCard.jsx";
import { fetchRecommendations } from "../../services/recommendService.js";
import { MAX_QUERY_CHARS, MIN_QUERY_CHARS } from "../../utils/recommendLimits.js";

/**
 * "Ask AI" box: the visitor describes a need in any language and gets 3–5
 * tools picked from this catalog, shown as regular tool cards with a reason.
 *
 * @param {{ tools: Array<{ id: string, index: number }> }} props
 */
export function AskAI({ tools }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [picks, setPicks] = useState([]);
  const controllerRef = useRef(null);
  const inputId = useId();
  const hintId = useId();
  const statusId = useId();

  useEffect(() => () => controllerRef.current?.abort(), []);

  const toolById = useMemo(() => new Map(tools.map((t) => [t.id, t])), [tools]);
  const results = useMemo(
    () => picks.map((p) => ({ tool: toolById.get(p.id), reason: p.reason })).filter((r) => r.tool),
    [picks, toolById]
  );

  const length = [...text].length;
  const tooShort = text.trim().length < MIN_QUERY_CHARS;
  const loading = status === "loading";

  const submit = async (event) => {
    event.preventDefault();
    if (loading || tooShort) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");
    setError("");
    try {
      const { picks: next } = await fetchRecommendations(text, controller.signal);
      setPicks(next);
      setStatus("done");
    } catch (err) {
      if (err?.name === "AbortError") return;
      setPicks([]);
      setError(err?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const clear = () => {
    controllerRef.current?.abort();
    setText("");
    setPicks([]);
    setError("");
    setStatus("idle");
  };

  return (
    <section className="ask-ai" aria-labelledby={`${inputId}-title`}>
      <form className="ask-ai-form" onSubmit={submit}>
        <label id={`${inputId}-title`} htmlFor={inputId} className="ask-ai-label">
          <Sparkles size={16} aria-hidden="true" />
          Not sure what you need? Describe it in any language
        </label>
        <div className="ask-ai-row">
          <textarea
            id={inputId}
            className="ask-ai-input"
            rows={2}
            value={text}
            maxLength={MAX_QUERY_CHARS}
            placeholder="e.g. I want to edit videos for free · मुझे मुफ्त में लोगो बनाना है · quiero resumir PDFs"
            aria-describedby={`${hintId} ${statusId}`}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
            }}
          />
          <div className="ask-ai-actions">
            <button type="submit" className="ask-ai-btn" disabled={loading || tooShort} aria-busy={loading}>
              {loading ? <Loader2 size={15} className="ask-ai-spin" aria-hidden="true" /> : <Sparkles size={15} aria-hidden="true" />}
              {loading ? "Thinking…" : "Ask AI"}
            </button>
            {(status !== "idle" || text) && (
              <button type="button" className="ask-ai-clear" onClick={clear} aria-label="Clear AI request and results">
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <p id={hintId} className="ask-ai-hint">
          Picks come only from this directory. {length}/{MAX_QUERY_CHARS}
        </p>
      </form>

      <div id={statusId} className="ask-ai-status" role="status" aria-live="polite">
        {loading && "Finding the best tools for you…"}
        {status === "error" && <span className="ask-ai-error">{error}</span>}
        {status === "done" && results.length === 0 && "No tool in this directory matches that yet. Try describing it differently."}
        {status === "done" && results.length > 0 && `Suggested ${results.length} ${results.length === 1 ? "tool" : "tools"}:`}
      </div>

      {status === "done" && results.length > 0 && (
        <div className="tools-grid ask-ai-results">
          {results.map(({ tool, reason }) => (
            <ToolCard key={`ai-${tool.index}-${tool.id}`} tool={tool} domId={`ai-tool-${tool.index}`} reason={reason} />
          ))}
        </div>
      )}
    </section>
  );
}
