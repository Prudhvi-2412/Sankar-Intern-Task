import React from "react";

export default function ToastStack({ toasts }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.variant}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}