export const COUNTRIES = [
  { code: "IN", name: "India", prefix: "+91", digitsLength: [10], emoji: "🇮🇳" },
  { code: "US", name: "United States", prefix: "+1", digitsLength: [10], emoji: "🇺🇸" },
  { code: "GB", name: "United Kingdom", prefix: "+44", digitsLength: [10, 11], emoji: "🇬🇧" },
  { code: "AU", name: "Australia", prefix: "+61", digitsLength: [9], emoji: "🇦🇺" },
  { code: "SG", name: "Singapore", prefix: "+65", digitsLength: [8], emoji: "🇸🇬" },
  { code: "INTL", name: "Other / International", prefix: "", digitsLength: null, emoji: "🌐" }
];

export function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

export function isPhoneValid(phone) {
  const validCharsRegex = /^\+?[0-9\s\-()]+$/;
  if (!validCharsRegex.test(phone)) {
    return false;
  }
  const normalizedPhone = normalizePhone(phone);
  return normalizedPhone.length >= 7 && normalizedPhone.length <= 15;
}

export function getCountryCodeFromPhone(phone) {
  const normalized = normalizePhone(phone);
  if (normalized.startsWith("91")) return "IN";
  if (normalized.startsWith("1")) return "US";
  if (normalized.startsWith("44")) return "GB";
  if (normalized.startsWith("61")) return "AU";
  if (normalized.startsWith("65")) return "SG";
  return "INTL";
}

export function validatePhoneByCountry(phone, countryCode) {
  const validCharsRegex = /^\+?[0-9\s\-()]+$/;
  if (!validCharsRegex.test(phone)) {
    return false;
  }

  const normalized = normalizePhone(phone);
  const country = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES.find((c) => c.code === "INTL");

  if (country.code === "INTL") {
    return normalized.length >= 7 && normalized.length <= 15;
  }

  const normPrefix = country.prefix.replace(/\D/g, "");
  let digits = normalized;

  if (normalized.startsWith(normPrefix)) {
    digits = normalized.slice(normPrefix.length);
  }

  return country.digitsLength.includes(digits.length);
}

export function formatPhoneForSubmit(phone, countryCode) {
  const trimmed = String(phone || "").trim();
  const country = COUNTRIES.find((c) => c.code === countryCode);
  if (!country || country.code === "INTL") {
    return trimmed;
  }

  const norm = trimmed.replace(/\D/g, "");
  const normPrefix = country.prefix.replace(/\D/g, "");

  if (norm.startsWith(normPrefix)) {
    return trimmed;
  }

  return `${country.prefix} ${trimmed}`;
}

export function getLocalNumberOnly(phone, countryCode) {
  const trimmed = String(phone || "").trim();
  const country = COUNTRIES.find((c) => c.code === countryCode);
  if (!country || country.code === "INTL") {
    return trimmed;
  }

  const normPrefix = country.prefix.replace(/\D/g, "");
  const normalized = trimmed.replace(/\D/g, "");

  if (normalized.startsWith(normPrefix)) {
    const escapedPrefix = country.prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${escapedPrefix}\\s*`);
    if (regex.test(trimmed)) {
      return trimmed.replace(regex, "");
    }

    const prefixRegex = new RegExp(`^(\\+?${normPrefix})\\s*`);
    return trimmed.replace(prefixRegex, "");
  }

  return trimmed;
}