import React from "react";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";

export default function PageHeader({ theme, onRefresh, onToggleTheme }) {
  return (
    <section className="page-header">
      <div>
        <p className="eyebrow">Mini CRM</p>
        <h1>Lead Management System</h1>
      </div>
      <div className="header-actions">
        <button className="ghost-button" type="button" onClick={onToggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button className="icon-button" type="button" onClick={onRefresh} title="Refresh leads">
          <RefreshCw size={18} />
        </button>
      </div>
    </section>
  );
}
