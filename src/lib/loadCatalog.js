/**
 * Compatibility bridge for catalog loading.
 * Re-exports the unified catalogService loader.
 */
import { loadCatalogFromSpreadsheet } from "../services/catalogService.js";

export const loadCatalog = loadCatalogFromSpreadsheet;
export default loadCatalog;
