"use client";

import { useState } from "react";
import { useData } from "./DataProvider";
import { useUI } from "./UIProvider";

function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("email-already-in-use")) return "That email is already registered — try signing in instead.";
  if (code.includes("invalid-credential") || code.includes("wrong-password")) return "Incorrect email or password.";
  if (code.includes("user-not-found")) return "No account found with that email — try creating one.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-email")) return "That doesn't look like a valid email address.";
  if (code.includes("popup-closed-by-user")) return "";
  return "Something went wrong — please try again.";
}

export default function SignInModal() {
  const { signInOpen, closeSignIn, onSignedIn } = useUI();
  const { signIn, signUp, signInWithGoogle } = useData();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setMode("signin");
  };

  const handleClose = () => {
    reset();
    closeSignIn();
  };

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Please enter your name");
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      reset();
      onSignedIn();
    } catch (err) {
      setError(authErrorMessage(err) || (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const submitGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
      reset();
      onSignedIn();
    } catch (err) {
      const msg = authErrorMessage(err);
      if (msg) setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = mode === "signup" ? name.trim() && email.trim() && password.length >= 6 : email.trim() && password;

  return (
    <div
      className={`composer-modal${signInOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="composer-panel" style={{ maxWidth: 380 }}>
        <div className="composer-panel__header">
          <strong>{mode === "signup" ? "Create account" : "Sign in"}</strong>
          <button
            className="icon-btn"
            onClick={handleClose}
            style={{ color: "var(--ib-ink)", borderColor: "var(--ib-border)" }}
          >
            &times;
          </button>
        </div>

        <button
          className="btn btn-outline"
          onClick={submitGoogle}
          disabled={busy}
          style={{ width: "100%", justifyContent: "center", marginBottom: "0.75rem" }}
        >
          Continue with Google
        </button>

        <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--ib-gray-500)", margin: "0.5rem 0" }}>
          or use email
        </div>

        {mode === "signup" && (
          <input
            className="composer__title"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="composer__title"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="composer__title"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) submit();
          }}
        />

        {error && (
          <p style={{ color: "var(--ib-danger)", fontSize: "0.82rem", margin: "0 0 0.5rem" }}>{error}</p>
        )}

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "var(--ib-green)",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "0.75rem",
          }}
        >
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>

        <div className="composer-panel__footer">
          <button className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={!canSubmit || busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
