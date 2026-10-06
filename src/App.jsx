import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import {
  ArrowUpRight,
  Brain,
  Code,
  Cpu,
  Database,
  DownloadSimple,
  FilmStrip,
  Image,
  Lightning,
  LockSimple,
  MagnifyingGlass,
  Microphone,
  PaintBrush,
  Palette,
  PenNib,
  Robot,
  ShareNetwork,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import fallbackCatalog from "./data/catalog.json";
import { loadCatalog } from "./lib/loadCatalog";

const ICONS = {
  "text-generation": PenNib,
  "image-generation": Image,
  coding: Code,
  audio: Microphone,
  "agent-harnesses": Robot,
  "agent-skills": Sparkle,
  "video-generation": FilmStrip,
  "memory-rag": Database,
  "ml-infra": Cpu,
  "security-osint": ShieldCheck,
  productivity: Lightning,
  research: MagnifyingGlass,
  "file-sharing": ShareNetwork,
  "software-downloads": DownloadSimple,
  privacy: LockSimple,
  "ui-ux-design": Palette,
  creative: PaintBrush,
};

const spring = { type: "spring", bounce: 0, duration: 0.45 };
const page = "mx-auto w-full max-w-[920px] px-5";

function useFinePointer() {
  const [fine, setFine] = useState(() => window.matchMedia("(pointer: fine)").matches);
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const apply = () => setFine(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return fine;
}

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="9" width="17" height="17" rx="5" fill="var(--accent)" opacity="0.28" />
      <rect x="11" y="6" width="17" height="17" rx="5" fill="var(--accent)" />
    </svg>
  );
}

function FlowField() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  useEffect(() => {
    if (reduce) return undefined;
    const move = (event) => {
      px.set(event.clientX / window.innerWidth - 0.5);
      py.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, px, py]);
  if (reduce) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Orb className="left-[-6rem] top-[8%] drift-a" factor={36} px={px} py={py} />
      <Orb className="right-[-8rem] top-[36%] drift-b" factor={-48} px={px} py={py} />
      <Orb className="left-[18%] bottom-[-8rem] drift-c" factor={22} px={px} py={py} />
    </div>
  );
}

function Orb({ className, factor, px, py }) {
  const x = useTransform(px, (value) => value * factor);
  const y = useTransform(py, (value) => value * factor * 0.75);
  const sx = useSpring(x, { bounce: 0, duration: 1.1 });
  const sy = useSpring(y, { bounce: 0, duration: 1.3 });
  return (
    <motion.span className={`orb ${className}`} style={{ x: sx, y: sy }}>
      <span className="orb-core" />
    </motion.span>
  );
}

export default function App() {
  const path = window.location.pathname;
  if (path !== "/" && path !== "/index.html") return <Missing />;
  return <Directory />;
}

function Missing() {
  return (
    <div className="relative min-h-[100dvh]">
      <FlowField />
      <Bar title={fallbackCatalog.site.title} />
      <main className={`relative z-10 ${page} pt-16`}>
        <h1 className="max-w-[12ch] text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em]">
          This page is not in the directory.
        </h1>
        <p className="mt-4 max-w-[36rem] text-[var(--secondary)]">The address does not match a page on this site.</p>
        <a className="pressable mt-8 inline-flex min-h-11 items-center rounded-[12px] bg-[var(--accent)] px-4 font-semibold text-[var(--accent-ink)]" href="/">
          Back to the directory
        </a>
      </main>
    </div>
  );
}

function Bar({ title }) {
  return (
    <header className="material sticky top-0 z-20 h-16 border-b border-[var(--line)]">
      <div className={`${page} flex h-16 items-center`}>
        <a href="#top" className="inline-flex items-center gap-2.5 whitespace-nowrap text-[1.0625rem] font-semibold tracking-[-0.03em]">
          <Logo />
          {title}
        </a>
      </div>
    </header>
  );
}

function Directory() {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [catalog, setCatalog] = useState(fallbackCatalog);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(() => readFilter());
  const ids = useMemo(() => new Set(catalog.groups.map((group) => group.category.id)), [catalog]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const live = await loadCatalog();
      if (cancelled) return;
      if (live) setCatalog(live);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onHash = () => setFilter(readFilter());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target?.isContentEditable) return;
      event.preventDefault();
      document.getElementById("q")?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const active = ids.has(filter) ? filter : "";
  const visibleGroups = catalog.groups
    .map((group) => ({
      ...group,
      tools: group.tools.filter((tool) => {
        if (active && tool.category !== active) return false;
        if (!q) return true;
        const blob = [tool.name, tool.description, tool.host, tool.url, group.category.name].join(" ").toLowerCase();
        return blob.includes(q);
      }),
    }))
    .filter((group) => group.tools.length > 0);
  const shown = visibleGroups.reduce((sum, group) => sum + group.tools.length, 0);

  useEffect(() => {
    const row = document.getElementById("category-row");
    if (!row) return undefined;
    const align = () => {
      const pressed = row.querySelector('[aria-pressed="true"]');
      if (!pressed || row.scrollWidth <= row.clientWidth + 1) return;
      const rowBox = row.getBoundingClientRect();
      const chipBox = pressed.getBoundingClientRect();
      const delta = chipBox.left - rowBox.left - (rowBox.width - chipBox.width) / 2;
      if (Math.abs(delta) < 2) return;
      row.scrollBy({ left: delta, behavior: reduce ? "auto" : "smooth" });
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(row);
    return () => observer.disconnect();
  }, [active, reduce]);

  const choose = (id) => {
    const next = id && ids.has(id) ? id : "";
    const url = next ? `#${next}` : window.location.pathname + window.location.search;
    history.pushState(null, "", url);
    setFilter(next);
  };

  const fade = reduce ? { duration: 0.2 } : spring;

  if (loading) {
    return (
      <div className="relative min-h-[100dvh]">
        <FlowField />
        <Bar title={catalog.site.title} />
        <main className={`relative z-10 ${page} pt-16`}>
          <p className="text-[var(--secondary)]" aria-live="polite">
            Loading catalog…
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh]">
      <FlowField />
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-30 focus:rounded-[12px] focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-[var(--accent-ink)]" href="#catalog">
        Skip to the catalog
      </a>
      <Bar title={catalog.site.title} />
      <main className={`relative z-10 ${page} pb-24`}>
        <header id="top" className="pb-8 pt-10 md:pt-14">
          <motion.h1
            className="text-[clamp(2.75rem,7vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fade}
          >
            {catalog.site.title}
          </motion.h1>
          <motion.p
            className="mt-3 max-w-[28rem] text-[var(--secondary)]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? fade : { ...spring, delay: 0.05 }}
          >
            {catalog.counts.entries} AI entries in {catalog.counts.categories} groups.
          </motion.p>
          <motion.form
            role="search"
            className="mt-8 max-w-[28rem]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? fade : { ...spring, delay: 0.1 }}
            onSubmit={(event) => {
              event.preventDefault();
              document.querySelector("[data-tool]")?.focus();
            }}
          >
            <label htmlFor="q" className="mb-2 block text-[0.9375rem] font-semibold tracking-[-0.01em]">
              Search
            </label>
            <input
              id="q"
              name="q"
              type="search"
              value={query}
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Name or description"
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-[12px] border border-transparent bg-[var(--fill)] px-4 text-[1.0625rem] text-[var(--ink)] outline-none placeholder:text-[var(--tertiary)] focus-visible:border-[var(--accent)]"
            />
          </motion.form>
        </header>

        <p id="result-count" className="text-[0.8125rem] tracking-[-0.006em] text-[var(--tertiary)]" aria-live="polite">
          Showing {shown} of {catalog.counts.entries}.
        </p>

        <div id="catalog" className="scroll-mt-20 pt-4">
          <div className="sticky top-16 z-10 -mx-5 bg-[var(--bg)] px-5 py-3">
            <div id="category-row" className="chip-row flex gap-2 overflow-x-auto" role="toolbar" aria-label="Categories">
              <Chip pressed={!active} onClick={() => choose("")} count={catalog.counts.entries}>All</Chip>
              {catalog.groups.map((group) => (
                <Chip
                  key={group.category.id}
                  pressed={active === group.category.id}
                  onClick={() => choose(group.category.id)}
                  count={group.tools.length}
                >
                  {group.category.name}
                </Chip>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            {shown === 0 ? (
              <motion.div
                key="empty"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={fade}
                className="mt-6 rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-5 py-8 shadow-[var(--shadow)]"
              >
                <p>No entry matches &quot;{query.trim()}&quot;.</p>
                <button
                  type="button"
                  className="pressable mt-4 min-h-11 font-semibold text-[var(--accent)]"
                  onClick={() => {
                    setQuery("");
                    choose("");
                  }}
                >
                  Show every entry
                </button>
              </motion.div>
            ) : (
              <motion.div key={active || "all"} className="mt-4 flex flex-col gap-12">
                {visibleGroups.map((group) => {
                  const Icon = ICONS[group.category.id] || Brain;
                  return (
                    <motion.section
                      key={group.category.id}
                      id={group.category.id}
                      className="scroll-mt-24"
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={fade}
                    >
                      <div className="mb-3 flex items-center gap-2.5">
                        <Icon size={20} weight="regular" aria-hidden="true" className="text-[var(--accent)]" />
                        <h2 className="text-[1.375rem] font-semibold leading-[1.15] tracking-[-0.022em]">{group.category.name}</h2>
                      </div>
                      <p className="mb-4 text-[0.9375rem] text-[var(--secondary)]">{group.category.description}</p>
                      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AnimatePresence initial={false}>
                          {group.tools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} reduce={reduce} fine={fine} fade={fade} />
                          ))}
                        </AnimatePresence>
                      </ul>
                    </motion.section>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer className="relative z-10 border-t border-[var(--line)]">
        <p className={`${page} flex items-center gap-2.5 py-6 text-[0.9375rem] text-[var(--secondary)]`}>
          <Logo size={20} />
          {catalog.site.author}
        </p>
      </footer>
    </div>
  );
}

function ToolCard({ tool, reduce, fine, fade }) {
  const ref = useRef(null);
  const [hot, setHot] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spot = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, var(--spot), transparent 72%)`;
  const reactive = fine && !reduce;
  return (
    <motion.li
      layout
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={fade}
      className="min-w-0"
    >
      <motion.a
        ref={ref}
        data-tool
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        onPointerEnter={() => setHot(true)}
        onPointerLeave={() => setHot(false)}
        onPointerMove={(event) => {
          if (!reactive || !ref.current) return;
          const box = ref.current.getBoundingClientRect();
          mx.set(event.clientX - box.left);
          my.set(event.clientY - box.top);
        }}
        whileHover={reactive ? { y: -3 } : undefined}
        whileTap={reduce ? undefined : { scale: 0.985 }}
        transition={spring}
        className="relative flex h-full min-h-[9.5rem] flex-col overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]"
      >
        {reactive && hot ? <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: spot }} /> : null}
        <span className="relative flex items-start justify-between gap-3">
          <span className="font-semibold tracking-[-0.018em]">{tool.name}</span>
          <ArrowUpRight size={16} weight="regular" aria-hidden="true" className="mt-1 shrink-0 text-[var(--accent)]" />
        </span>
        <span className="relative mt-2 text-[0.9375rem] text-[var(--secondary)]">{tool.description}</span>
        <span className="relative mt-auto pt-4 text-[0.8125rem] tracking-[-0.006em] text-[var(--tertiary)]">
          {tool.host}
          <span className="sr-only"> opens in a new tab</span>
        </span>
      </motion.a>
    </motion.li>
  );
}

function Chip({ pressed, onClick, count, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`pressable inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[12px] px-3 text-[0.9375rem] ${
        pressed ? "bg-[var(--accent)] font-semibold text-[var(--accent-ink)]" : "bg-[var(--fill)] text-[var(--ink)]"
      }`}
    >
      <span>{children}</span>
      <span className={pressed ? "" : "text-[var(--tertiary)]"}>{count}</span>
    </button>
  );
}

function readFilter() {
  return decodeURIComponent(window.location.hash.replace(/^#/, ""));
}
