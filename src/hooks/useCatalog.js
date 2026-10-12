import { useCallback, useEffect, useRef, useState } from "react";
import { loadCatalogFromSpreadsheet } from "../services/catalogService.js";

/**
 * Loads the catalog from the Google Sheet. The sheet is the only data source:
 * there is no bundled fallback, so a failed fetch surfaces an error with retry.
 *
 * @returns {{
 *   catalog: object|null,
 *   loading: boolean,
 *   error: string|null,
 *   reloadCatalog: () => Promise<void>
 * }}
 */
export function useCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } else {
        setCatalog(null);
        setError("Could not load the catalog from Google Sheets.");
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("[useCatalog] Error loading catalog:", err);
      setCatalog(null);
      setError(err instanceof Error ? err.message : "Could not load the catalog from Google Sheets.");
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
    reloadCatalog: fetchCatalog,
  };
}
