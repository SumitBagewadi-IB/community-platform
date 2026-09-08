"use client";

import { useState } from "react";
import { useData } from "./DataProvider";
import { useUI } from "./UIProvider";

export default function SignInModal() {
  const { signInOpen, closeSignIn, onSignedIn } = useUI();
  const { signIn } = useData();
  const [name, setName] = useState("");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    signIn(trimmed);
    setName("");
    onSignedIn();
  };

  return (
    <div
      className={`composer-modal${signInOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSignIn();
      }}
    >
      <div className="composer-panel" style={{ maxWidth: 380 }}>
        <div className="composer-panel__header">
          <strong>Sign in</strong>
          <button
            className="icon-btn"
            onClick={closeSignIn}
            style={{ color: "var(--ib-ink)", borderColor: "var(--ib-border)" }}
          >
            &times;
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--ib-gray-500)", marginTop: 0 }}>
          This is a local preview session — no account is created and nothing leaves your
          browser. Real sign-in arrives with the backend.
        </p>

        <input
          className="composer__title"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          autoFocus
        />

        <div className="composer-panel__footer">
          <button className="btn btn-outline" onClick={closeSignIn}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={!name.trim()}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
