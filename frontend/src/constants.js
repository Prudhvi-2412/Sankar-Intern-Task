export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOURCES = ["Call", "WhatsApp", "Field"];
export const STATUSES = ["Interested", "Not Interested", "Converted"];
export const DEFAULT_PAGE_SIZE = 8;

export function emptyLead() {
  return {
    name: "",
    phone: "",
    source: "Call"
  };
}
