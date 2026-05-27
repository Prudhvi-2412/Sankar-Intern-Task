import { useEffect, useMemo, useState } from "react";
import { createLead, fetchAllLeads, fetchLeads, removeLead, updateLead, updateLeadStatus } from "../api/leadsApi.js";
import { DEFAULT_PAGE_SIZE, SOURCES, emptyLead } from "../constants.js";
import {
  COUNTRIES,
  getCountryCodeFromPhone,
  validatePhoneByCountry,
  formatPhoneForSubmit,
  getLocalNumberOnly,
  normalizePhone
} from "../utils/phone.js";

function createToastId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildLeadErrors(form) {
  const errors = {};
  const name = String(form.name || "").trim();
  const phone = String(form.phone || "").trim();
  const source = String(form.source || "").trim();
  const countryCode = form.countryCode || "IN";

  // Validate Name
  const nameRegex = /^[a-zA-Z\s'.\-]+$/;
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  } else if (!nameRegex.test(name)) {
    errors.name = "Name can only contain letters, spaces, hyphens, periods, or apostrophes.";
  }

  // Validate Phone
  if (!phone) {
    errors.phone = "Phone is required.";
  } else if (!validatePhoneByCountry(phone, countryCode)) {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (country && country.code !== "INTL") {
      errors.phone = `Enter a valid ${country.name} phone number (${country.digitsLength.join(" or ")} digits).`;
    } else {
      errors.phone = "Enter a valid phone number with 7 to 15 digits.";
    }
  }

  // Validate Source
  if (!SOURCES.includes(source)) {
    errors.source = "Choose a valid source.";
  }

  return errors;
}

function buildCsv(rows) {
  const headers = ["Name", "Phone", "Source", "Status", "Created At", "Updated At"];
  const lines = rows.map((row) =>
    [row.name, row.phone, row.source, row.status, row.created_at, row.updated_at]
      .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
      .join(",")
  );

  return [headers.map((value) => `"${value}"`).join(","), ...lines].join("\n");
}

export function useLeadsManager() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 1
  });
  const [form, setForm] = useState(() => ({
    ...emptyLead(),
    countryCode: "IN"
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    try {
      return window.localStorage.getItem("lead-theme") || "light";
    } catch (e) {
      console.warn("Failed to read theme from localStorage:", e);
      return "light";
    }
  });

  const hasFilters = Boolean(search.trim() || statusFilter || sourceFilter);

  const dashboard = useMemo(() => {
    return {
      total: leads.length,
      interested: leads.filter((lead) => lead.status === "Interested").length,
      converted: leads.filter((lead) => lead.status === "Converted").length,
      notInterested: leads.filter((lead) => lead.status === "Not Interested").length,
      updated: leads.filter((lead) => lead.updated_at).length
    };
  }, [leads]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lead-theme", theme);
      }
    } catch (e) {
      console.warn("Failed to write theme to localStorage:", e);
    }
  }, [theme]);

  useEffect(() => {
    setPagination((current) => (current.page === 1 ? current : { ...current, page: 1 }));
  }, [search, statusFilter, sourceFilter]);

  async function loadLeads(targetPage = pagination.page) {
    const pageNum = typeof targetPage === "number" ? targetPage : pagination.page;
    setLoading(true);

    try {
      const response = await fetchLeads({
        search,
        status: statusFilter,
        source: sourceFilter,
        page: pageNum,
        limit: pagination.limit
      });

      setLeads(response.data);
      setPagination((current) => ({
        ...current,
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));

      if (response.data.length === 0 && targetPage > 1 && response.pagination.total > 0) {
        await loadLeads(response.pagination.totalPages);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadLeads(pagination.page);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search, statusFilter, sourceFilter, pagination.page]);

  function showToast(message, variant = "info") {
    const id = createToastId();
    setToasts((current) => [...current, { id, message, variant }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }

  function setFieldValue(field, value) {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    setErrors(buildLeadErrors(nextForm));
  }

  function handleFieldBlur(field) {
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(buildLeadErrors(form));
  }

  function validateBeforeSubmit() {
    const nextErrors = buildLeadErrors(form);
    setErrors(nextErrors);
    setSubmitAttempted(true);
    return Object.keys(nextErrors).length === 0;
  }

  function startEditLead(lead) {
    setEditingLeadId(lead.id);
    const countryCode = getCountryCodeFromPhone(lead.phone);
    const localPhone = getLocalNumberOnly(lead.phone, countryCode);
    setForm({
      name: lead.name,
      phone: localPhone,
      source: lead.source,
      countryCode: countryCode
    });
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
  }

  function cancelEditLead() {
    setEditingLeadId(null);
    setForm({
      ...emptyLead(),
      countryCode: "IN"
    });
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateBeforeSubmit()) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phone: formatPhoneForSubmit(form.phone, form.countryCode),
        source: form.source
      };

      if (editingLeadId) {
        await updateLead(editingLeadId, payload);
        showToast("Lead updated successfully.", "success");
      } else {
        await createLead(payload);
        showToast("Lead added successfully.", "success");
      }

      cancelEditLead();
      await loadLeads(editingLeadId ? pagination.page : 1);
    } catch (error) {
      if (error.status === 409) {
        setErrors((current) => ({ ...current, ...(error.errors || {}) }));
      }

      if (error.status === 400 && error.errors) {
        setErrors(error.errors);
      }

      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const lead = await updateLeadStatus(id, status);
      setLeads((current) => current.map((item) => (item.id === id ? lead : item)));
      showToast("Lead status updated.", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  }

  async function handleDelete(id) {
    if (typeof window !== "undefined" && !window.confirm("Delete this lead? This action cannot be undone.")) {
      return;
    }

    try {
      await removeLead(id);
      showToast("Lead deleted.", "success");
      await loadLeads(pagination.page);
    } catch (error) {
      showToast(error.message, "error");
    }
  }

  function handleSearchChange(value) {
    setSearch(value);
  }

  function handleStatusFilterChange(value) {
    setStatusFilter(value);
  }

  function handleSourceFilterChange(value) {
    setSourceFilter(value);
  }

  function handlePageChange(nextPage) {
    setPagination((current) => ({ ...current, page: nextPage }));
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setSourceFilter("");
  }

  async function exportCsv() {
    try {
      const response = await fetchAllLeads({
        search,
        status: statusFilter,
        source: sourceFilter
      });

      const csv = buildCsv(response.data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("CSV export downloaded.", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  }

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return {
    dashboard,
    editingLeadId,
    form,
    errors,
    touched,
    hasFilters,
    leads,
    loading,
    saving,
    submitAttempted,
    theme,
    toasts,
    total: pagination.total,
    totalPages: pagination.totalPages,
    page: pagination.page,
    pageSize: pagination.limit,
    search,
    sourceFilter,
    statusFilter,
    setFieldValue,
    handleFieldBlur,
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
    updateStatus: handleStatusChange,
    deleteLead: handleDelete,
    toggleTheme
  };
}
