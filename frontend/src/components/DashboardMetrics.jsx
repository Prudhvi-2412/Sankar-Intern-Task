import React from "react";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/circle-check.js";
import Phone from "lucide-react/dist/esm/icons/phone.js";
import Users from "lucide-react/dist/esm/icons/users.js";
import MetricCard from "./MetricCard.jsx";

export default function DashboardMetrics({ dashboard }) {
  return (
    <section className="metrics-grid" aria-label="Lead summary">
      <MetricCard icon={<Users size={20} />} label="Total Leads" value={dashboard.total} />
      <MetricCard icon={<Phone size={20} />} label="Interested" value={dashboard.interested} />
      <MetricCard icon={<CheckCircle2 size={20} />} label="Converted" value={dashboard.converted} />
      <MetricCard icon={<BarChart3 size={20} />} label="Not Interested" value={dashboard.notInterested} />
    </section>
  );
}
