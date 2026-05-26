import React from "react";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import { SOURCES } from "../constants.js";

export default function LeadForm({
  form,
  errors,
  saving,
  editingLeadId,
  submitAttempted,
  touched,
  onSubmit,
  onChange,
  onBlur,
  onCancelEdit
}) {
  const showError = (field) => Boolean(errors[field] && (submitAttempted || touched[field]));

  return (
    <form className="lead-form" onSubmit={onSubmit} noValidate>
      <div className="section-title">
        <h2>{editingLeadId ? "Edit Lead" : "Add Lead"}</h2>
        <Plus size={18} />
      </div>

      <label>
        Name
        <input
          required
          maxLength={100}
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          onBlur={() => onBlur("name")}
          placeholder="Customer name"
          aria-invalid={showError("name")}
        />
        {showError("name") && <span className="field-error">{errors.name}</span>}
      </label>

      <label>
        Phone
        <input
          required
          maxLength={25}
          inputMode="tel"
          value={form.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          onBlur={() => onBlur("phone")}
          placeholder="+91 98765 43210"
          aria-invalid={showError("phone")}
        />
        {showError("phone") && <span className="field-error">{errors.phone}</span>}
      </label>

      <label>
        Source
        <select
          required
          value={form.source}
          onChange={(event) => onChange("source", event.target.value)}
          onBlur={() => onBlur("source")}
          aria-invalid={showError("source")}
        >
          {SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
        {showError("source") && <span className="field-error">{errors.source}</span>}
      </label>

      <div className="form-actions">
        {editingLeadId && (
          <button className="ghost-button" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button className="primary-button" type="submit" disabled={saving}>
          <Plus size={17} />
          {saving ? "Saving..." : editingLeadId ? "Update Lead" : "Add Lead"}
        </button>
      </div>
    </form>
  );
}
