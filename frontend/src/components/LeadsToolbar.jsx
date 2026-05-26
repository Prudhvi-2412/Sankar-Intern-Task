import React from "react";
import Search from "lucide-react/dist/esm/icons/search.js";
import { SOURCES, STATUSES } from "../constants.js";

export default function LeadsToolbar({
  search,
  statusFilter,
  sourceFilter,
  onSearchChange,
  onStatusFilterChange,
  onSourceFilterChange,
  onExportCsv,
  onClearFilters,
  hasFilters
}) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={17} />
        <input
          aria-label="Search leads"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name or phone"
        />
      </div>

      <select aria-label="Filter by status" value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
        <option value="">All statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select aria-label="Filter by source" value={sourceFilter} onChange={(event) => onSourceFilterChange(event.target.value)}>
        <option value="">All sources</option>
        {SOURCES.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </select>

      <div className="toolbar-actions">
        <button className="ghost-button" type="button" onClick={onExportCsv}>
          Export CSV
        </button>
        <button className="ghost-button" type="button" onClick={onClearFilters} disabled={!hasFilters}>
          Clear filters
        </button>
      </div>
    </div>
  );
}
