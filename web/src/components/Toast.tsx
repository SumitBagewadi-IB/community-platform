"use client";

import { useUI } from "./UIProvider";

export default function Toast() {
  const { toast } = useUI();
  if (!toast) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--ib-ink)",
        color: "var(--ib-bg)",
        padding: "0.6rem 1.1rem",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 600,
        zIndex: 200,
        boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
      }}
    >
      {toast}
    </div>
  );
}
