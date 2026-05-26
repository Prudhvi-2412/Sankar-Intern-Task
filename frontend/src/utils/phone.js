export function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

export function isPhoneValid(phone) {
  const normalizedPhone = normalizePhone(phone);
  return normalizedPhone.length >= 7 && normalizedPhone.length <= 15;
}