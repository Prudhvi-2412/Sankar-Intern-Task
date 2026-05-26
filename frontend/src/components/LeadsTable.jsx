import React from "react";
import EmptyTableRow from "./EmptyTableRow.jsx";
import LeadRow from "./LeadRow.jsx";
import TableSkeletonRow from "./TableSkeletonRow.jsx";

export default function LeadsTable({ loading, leads, onStatusChange, onDelete, onEdit }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 5 }).map((_, index) => <TableSkeletonRow key={index} columns={7} />)}

          {!loading && leads.length === 0 && <EmptyTableRow message="No leads found." columns={7} />}

          {!loading &&
            leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
