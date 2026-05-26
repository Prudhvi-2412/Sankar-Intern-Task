import { SOURCES, STATUSES } from "../constants/leads.js";
import { ensureSupabase, sendSupabaseError, supabase } from "../config/supabase.js";
import { validateLeadPayload, validateStatus } from "../validators/leads.js";

function isDuplicateError(error) {
  return error?.code === "23505" || error?.message?.toLowerCase().includes("duplicate");
}

function conflictPhoneError(res) {
  return res.status(409).json({
    message: "A lead with this phone number already exists.",
    errors: {
      phone: "This phone number already exists."
    }
  });
}

export async function createLead(req, res) {
  if (!ensureSupabase(res)) return;

  const { data, errors } = validateLeadPayload(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      name: data.name,
      phone: data.phone,
      normalized_phone: data.normalizedPhone,
      source: data.source,
      status: "Interested"
    })
    .select()
    .single();

  if (error) {
    if (isDuplicateError(error)) {
      return conflictPhoneError(res);
    }

    return sendSupabaseError(res, error);
  }

  return res.status(201).json(lead);
}

export async function listLeads(req, res) {
  if (!ensureSupabase(res)) return;

  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "").trim();
  const source = String(req.query.source || "").trim();
  const page = Math.max(1, Number.parseInt(String(req.query.page || "1"), 10) || 1);
  const limit = Math.min(1000, Math.max(1, Number.parseInt(String(req.query.limit || "8"), 10) || 8));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("leads").select("*", { count: "exact" }).order("created_at", {
    ascending: false
  });

  if (search) {
    const safeSearch = search.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(`name.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`);
  }

  if (STATUSES.includes(status)) {
    query = query.eq("status", status);
  }

  if (SOURCES.includes(source)) {
    query = query.eq("source", source);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return sendSupabaseError(res, error);
  }

  return res.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.max(1, Math.ceil((count || 0) / limit))
    }
  });
}

export async function updateLead(req, res) {
  if (!ensureSupabase(res)) return;

  const { data, errors } = validateLeadPayload(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  const { data: existingLead, error: lookupError } = await supabase
    .from("leads")
    .select("id")
    .eq("normalized_phone", data.normalizedPhone)
    .neq("id", req.params.id)
    .maybeSingle();

  if (lookupError) {
    return sendSupabaseError(res, lookupError);
  }

  if (existingLead) {
    return conflictPhoneError(res);
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .update({
      name: data.name,
      phone: data.phone,
      normalized_phone: data.normalizedPhone,
      source: data.source,
      updated_at: new Date().toISOString()
    })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    if (isDuplicateError(error)) {
      return conflictPhoneError(res);
    }

    return sendSupabaseError(res, error);
  }

  return res.json(lead);
}

export async function updateLeadStatus(req, res) {
  if (!ensureSupabase(res)) return;

  const status = String(req.body.status || "").trim();
  const statusError = validateStatus(status);

  if (statusError) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: { status: statusError }
    });
  }

  const { data, error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    return sendSupabaseError(res, error);
  }

  return res.json(data);
}

export async function deleteLead(req, res) {
  if (!ensureSupabase(res)) return;

  const { error } = await supabase.from("leads").delete().eq("id", req.params.id);

  if (error) {
    return sendSupabaseError(res, error);
  }

  return res.status(204).send();
}