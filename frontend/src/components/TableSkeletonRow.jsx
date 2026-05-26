import React from "react";

export default function TableSkeletonRow({ columns = 6 }) {
  return (
    <tr className="skeleton-row">
      <td colSpan={columns}>
        <div className="skeleton-line" />
      </td>
    </tr>
  );
}