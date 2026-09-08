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
  if (code.includes("too-many-requests")) return "Too many attempts — please wait a bit and try again.";
  if (code.includes("popup-closed-by-user")) return "";
  return "Something went wrong — please try again.";
}

type Mode = "signin" | "signup" | "reset";

export default function SignInModal() {
  const { signInOpen, closeSignIn, onSignedIn } = useUI();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useData();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setNotice("");
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
        reset();
        onSignedIn();
      } else if (mode === "reset") {
        await resetPassword(email.trim());
        setNotice("If that email has an account, a reset link is on its way.");
      } else {
        await signIn(email.trim(), password);
        reset();
        onSignedIn();
      }
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

  const canSubmit =
    mode === "signup"
      ? Boolean(name.trim() && email.trim() && password.length >= 6)
      : mode === "reset"
        ? Boolean(email.trim())
        : Boolean(email.trim() && password);

  const title = mode === "signup" ? "Create account" : mode === "reset" ? "Reset password" : "Sign in";
  const submitLabel = mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in";

  return (
    <div
      className={`composer-modal${signInOpen ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="composer-panel" style={{ maxWidth: 380 }}>
        <div className="composer-panel__header">
          <strong>{title}</strong>
          <button
            className="icon-btn"
            onClick={handleClose}
            aria-label="Close"
            style={{ color: "var(--ib-ink)", borderColor: "var(--ib-border)" }}
          >
            &times;
          </button>
        </div>

        {mode !== "reset" && (
          <>
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
          </>
        )}

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
          onKeyDown={(e) => {
            if (e.key === "Enter" && mode === "reset" && canSubmit) submit();
          }}
        />
        {mode !== "reset" && (
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
        )}

        {mode === "signin" && (
          <button
            type="button"
            onClick={() => {
              setError("");
              setNotice("");
              setMode("reset");
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "var(--ib-gray-500)",
              fontSize: "0.78rem",
              cursor: "pointer",
              marginBottom: "0.6rem",
              textDecoration: "underline",
            }}
          >
            Forgot password?
          </button>
        )}

        {error && <p style={{ color: "var(--ib-danger)", fontSize: "0.82rem", margin: "0 0 0.5rem" }}>{error}</p>}
        {notice && <p style={{ color: "var(--ib-green-deep)", fontSize: "0.82rem", margin: "0 0 0.5rem" }}>{notice}</p>}

        <button
          type="button"
          onClick={() => {
            setError("");
            setNotice("");
            setMode(mode === "signup" ? "signin" : mode === "reset" ? "signin" : "signup");
          }}
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
          {mode === "signup"
            ? "Already have an account? Sign in"
            : mode === "reset"
              ? "Back to sign in"
              : "New here? Create an account"}
        </button>

        <div className="composer-panel__footer">
          <button className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={!canSubmit || busy}>
            {busy ? "Please wait…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
