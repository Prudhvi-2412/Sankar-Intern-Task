import { SOURCES, STATUSES } from "../constants/leads.js";
import { isPhoneValid, normalizePhone } from "../utils/phone.js";

export function validateLeadPayload(payload) {
  const errors = {};
  const name = String(payload.name || "").trim();
  const phone = String(payload.phone || "").trim();
  const source = String(payload.source || "").trim();
  const normalizedPhone = normalizePhone(phone);

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  if (!phone) {
    errors.phone = "Phone is required.";
  } else if (!isPhoneValid(phone)) {
    errors.phone = "Enter a valid phone number with 7 to 15 digits.";
  }

  if (!SOURCES.includes(source)) {
    errors.source = "Source must be Call, WhatsApp, or Field.";
  }

  return {
    data: { name, phone, normalizedPhone, source },
    errors
  };
}

export function validateStatus(status) {
  if (!STATUSES.includes(status)) {
    return "Status must be Interested, Not Interested, or Converted.";
  }

  return null;
}