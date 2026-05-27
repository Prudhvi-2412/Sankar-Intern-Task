import React from "react";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import { SOURCES } from "../constants.js";
import { COUNTRIES } from "../utils/phone.js";

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
        <div className="phone-input-group">
          <select
            className="country-select"
            value={form.countryCode || "IN"}
            onChange={(event) => onChange("countryCode", event.target.value)}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.emoji} {c.prefix || "+... "}
              </option>
            ))}
          </select>
          <input
            required
            maxLength={25}
            inputMode="tel"
            value={form.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            onBlur={() => onBlur("phone")}
            placeholder={
              form.countryCode === "US" ? "(555) 555-5555" :
              form.countryCode === "GB" ? "7700 900077" :
              form.countryCode === "AU" ? "412 345 678" :
              form.countryCode === "SG" ? "8123 4567" :
              "98765 43210"
            }
            aria-invalid={showError("phone")}
          />
        </div>
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
