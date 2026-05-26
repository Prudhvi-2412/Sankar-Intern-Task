import React from "react";

export default function Pagination({ total, page, totalPages, pageSize, onPageChange }) {
  if (total === 0) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="pagination-bar">
      <p>
        Showing {start}-{end} of {total}
      </p>
      <div className="pagination-actions">
        <button className="ghost-button" type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button className="ghost-button" type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}