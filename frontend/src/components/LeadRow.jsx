import React from "react";
import Trash2 from "lucide-react/dist/esm/icons/trash-2.js";
import { STATUSES } from "../constants.js";

export default function LeadRow({ lead, onStatusChange, onDelete, onEdit }) {
  return (
    <tr>
      <td>
        <strong>{lead.name}</strong>
      </td>
      <td>{lead.phone}</td>
      <td>
        <span className="pill">{lead.source}</span>
      </td>
      <td>
        <select
          className="status-select"
          value={lead.status}
          onChange={(event) => onStatusChange(lead.id, event.target.value)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
      <td>{new Date(lead.created_at).toLocaleDateString()}</td>
      <td>{new Date(lead.updated_at).toLocaleDateString()}</td>
      <td className="actions">
        <button className="ghost-button row-button" type="button" onClick={() => onEdit(lead)}>
          Edit
        </button>
        <button className="danger-button" type="button" onClick={() => onDelete(lead.id)} title="Delete lead">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
}
