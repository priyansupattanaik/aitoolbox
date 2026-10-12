import React from "react";
import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS } from "../../utils/sort.js";

export function SortSelect({ value, onChange }) {
  return (
    <label className="sort-select">
      <ArrowUpDown size={15} aria-hidden="true" />
      <span className="sr-only">Sort tools</span>
      <select id="sort-select" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Sort tools">
        {SORT_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
