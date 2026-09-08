"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "./UIProvider";
import { useData } from "./DataProvider";
import { categories } from "@/lib/data";

export default function ComposerModal() {
  const { composerOpen, composerMode, composerTopicSlug, closeComposer } = useUI();
  const { addTopic, addReply } = useData();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0].slug);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setTitle("");
    setBody("");
    setCategorySlug(categories[0].slug);
    setError("");
  };

  const handleClose = () => {
    reset();
    closeComposer();
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (composerMode === "topic") {
        if (!title.trim() || !body.trim()) return;
        const slug = await addTopic(title.trim(), body.trim(), categorySlug);
        reset();
        closeComposer();
        router.push(`/topic/${slug}`);
      } else {
        if (!body.trim() || !composerTopicSlug) return;
        await addReply(composerTopicSlug, body.trim());
        reset();
        closeComposer();
      }
    } catch {
      setError("Couldn't post that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(composerMode === "topic" ? title.trim() && body.trim() : body.trim());

  return (
    <div
      className={`composer-modal${composerOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="composer-panel">
        <div className="composer-panel__header">
          <strong>{composerMode === "topic" ? "New Topic" : "Reply"}</strong>
          <button
            className="icon-btn"
            onClick={handleClose}
            style={{ color: "var(--ib-ink)", borderColor: "var(--ib-border)" }}
          >
            &times;
          </button>
        </div>

        {composerMode === "topic" && (
          <>
            <input
              className="composer__title"
              type="text"
              placeholder="Title — be specific and imagine you're asking another investor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <select
              className="composer__title"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              aria-label="Category"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        )}
        <textarea
          className="composer__body"
          placeholder={composerMode === "topic" ? "Write your post here…" : "Write your reply…"}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          autoFocus={composerMode === "reply"}
        />

        {error && (
          <p style={{ color: "var(--ib-danger)", fontSize: "0.82rem", margin: "0.5rem 0 0" }}>{error}</p>
        )}

        <div className="composer-panel__footer">
          <button className="btn btn-outline" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? "Posting…" : composerMode === "topic" ? "Post Topic" : "Post Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
