import { useCallback, useEffect, useRef, useState } from "react";
import fallbackCatalog from "../data/catalog.json";
import { loadCatalogFromSpreadsheet } from "../services/catalogService.js";

/**
 * Custom hook to manage the catalog lifecycle with offline fallback and leak protection.
 *
 * @returns {{
 *   catalog: object|null,
 *   loading: boolean,
 *   error: string|null,
 *   isFallback: boolean,
 *   reloadCatalog: () => Promise<void>
 * }}
 */
export function useCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const mountedRef = useRef(true);

  const fetchCatalog = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const liveData = await loadCatalogFromSpreadsheet();
      if (!mountedRef.current) return;

      if (liveData && liveData.groups && liveData.groups.length > 0) {
        setCatalog(liveData);
        setIsFallback(false);
      } else {
        console.info("[useCatalog] Live spreadsheet unavailable, using local catalog fallback.");
        setCatalog({ ...fallbackCatalog, source: "saved" });
        setIsFallback(true);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("[useCatalog] Error loading catalog:", err);
      setError(err instanceof Error ? err.message : "Failed to load catalog");
      setCatalog({ ...fallbackCatalog, source: "saved" });
      setIsFallback(true);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchCatalog();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchCatalog]);

  return {
    catalog,
    loading,
    error,
    isFallback,
    reloadCatalog: fetchCatalog,
  };
}
