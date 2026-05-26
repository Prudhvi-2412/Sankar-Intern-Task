import { API_URL } from "../constants.js";

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.errors = data.errors || {};
    throw error;
  }

  return data;
}

export async function fetchLeads({ search, status, source, page = 1, limit = 8 }) {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);
  if (source) params.set("source", source);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const response = await fetch(`${API_URL}/leads?${params.toString()}`);
  return parseResponse(response);
}

export async function createLead(payload) {
  const response = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function updateLead(id, payload) {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function updateLeadStatus(id, status) {
  const response = await fetch(`${API_URL}/leads/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  return parseResponse(response);
}

export async function fetchAllLeads({ search, status, source }) {
  return fetchLeads({ search, status, source, page: 1, limit: 1000 });
}

export async function removeLead(id) {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Unable to delete lead.");
  }
}
