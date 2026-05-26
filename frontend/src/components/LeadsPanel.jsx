import React from "react";
import EmptyLeadsState from "./EmptyLeadsState.jsx";
import Pagination from "./Pagination.jsx";
import LeadsTable from "./LeadsTable.jsx";
import LeadsToolbar from "./LeadsToolbar.jsx";

export default function LeadsPanel({
  loading,
  leads,
  hasFilters,
  total,
  totalPages,
  page,
  pageSize,
  search,
  statusFilter,
  sourceFilter,
  onSearchChange,
  onStatusFilterChange,
  onSourceFilterChange,
  onStatusChange,
  onDelete,
  onEdit,
  onClearFilters,
  onPageChange,
  onExportCsv,
  onRefresh
}) {
  return (
    <section className="leads-panel">
      <LeadsToolbar
        search={search}
        statusFilter={statusFilter}
        sourceFilter={sourceFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        onSourceFilterChange={onSourceFilterChange}
        onExportCsv={onExportCsv}
        onClearFilters={onClearFilters}
        hasFilters={hasFilters}
      />

      {leads.length === 0 && !loading ? (
        <EmptyLeadsState hasFilters={hasFilters} onClearFilters={onClearFilters} onRefresh={onRefresh} />
      ) : (
        <LeadsTable loading={loading} leads={leads} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
      )}

      <Pagination total={total} page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={onPageChange} />
    </section>
  );
}
