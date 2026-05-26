import React from "react";

export default function EmptyTableRow({ message, columns = 6 }) {
  return (
    <tr>
      <td colSpan={columns} className="empty-state">
        {message}
      </td>
    </tr>
  );
}
