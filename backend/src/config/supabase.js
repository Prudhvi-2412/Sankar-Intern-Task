import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./env.js";

function normalizeSupabaseUrl(url) {
  if (!url) {
    return url;
  }

  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

if (!hasSupabaseConfig) {
  console.warn(
    "Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env."
  );
}

export const supabase = hasSupabaseConfig
  ? createClient(normalizeSupabaseUrl(SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export function ensureSupabase(res) {
  if (supabase) {
    return true;
  }

  res.status(500).json({
    message: "Supabase is not configured.",
    detail: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env."
  });
  return false;
}

export function sendSupabaseError(res, error) {
  console.error(error);
  return res.status(500).json({
    message: "Database request failed.",
    detail: error.message
  });
}