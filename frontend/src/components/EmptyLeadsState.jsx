import React from "react";

export default function EmptyLeadsState({ hasFilters, onClearFilters, onRefresh }) {
  return (
    <div className="empty-card">
      <h3>{hasFilters ? "No leads match your filters" : "No leads yet"}</h3>
      <p>
        {hasFilters
          ? "Try clearing the current filters or refresh the list."
          : "Add the first lead using the form on the left."
        }
      </p>
      <div className="empty-card-actions">
        {hasFilters && (
          <button className="ghost-button" type="button" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
        <button className="ghost-button" type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>
    </div>
  );
}