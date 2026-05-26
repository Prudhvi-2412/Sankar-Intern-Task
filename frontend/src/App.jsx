import React from "react";
import DashboardMetrics from "./components/DashboardMetrics.jsx";
import ToastStack from "./components/ToastStack.jsx";
import LeadForm from "./components/LeadForm.jsx";
import LeadsPanel from "./components/LeadsPanel.jsx";
import PageHeader from "./components/PageHeader.jsx";
import { useLeadsManager } from "./hooks/useLeadsManager.js";

export default function App() {
  const {
    dashboard,
    editingLeadId,
    form,
    errors,
    hasFilters,
    leads,
    loading,
    saving,
    submitAttempted,
    touched,
    theme,
    toasts,
    total,
    totalPages,
    page,
    pageSize,
    search,
    sourceFilter,
    statusFilter,
    handleFieldBlur,
    setFieldValue,
    handlePageChange,
    handleSearchChange,
    handleSourceFilterChange,
    handleStatusFilterChange,
    handleSubmit,
    loadLeads,
    clearFilters,
    exportCsv,
    startEditLead,
    cancelEditLead,
    updateStatus,
    deleteLead,
    toggleTheme
  } = useLeadsManager();

  return (
    <main className="app-shell">
      <PageHeader theme={theme} onRefresh={loadLeads} onToggleTheme={toggleTheme} />

      <DashboardMetrics dashboard={dashboard} />

      <ToastStack toasts={toasts} />

      <section className="workspace-grid">
        <LeadForm
          form={form}
          errors={errors}
          saving={saving}
          editingLeadId={editingLeadId}
          submitAttempted={submitAttempted}
          touched={touched}
          onSubmit={handleSubmit}
          onChange={setFieldValue}
          onBlur={handleFieldBlur}
          onCancelEdit={cancelEditLead}
        />

        <LeadsPanel
          loading={loading}
          leads={leads}
          hasFilters={hasFilters}
          total={total}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          search={search}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          onSourceFilterChange={handleSourceFilterChange}
          onStatusChange={updateStatus}
          onDelete={deleteLead}
          onEdit={startEditLead}
          onClearFilters={clearFilters}
          onPageChange={handlePageChange}
          onExportCsv={exportCsv}
          onRefresh={loadLeads}
        />
      </section>
    </main>
  );
}
