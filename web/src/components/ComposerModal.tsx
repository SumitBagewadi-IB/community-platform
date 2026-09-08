"use client";

import { useUI } from "./UIProvider";

export default function ComposerModal() {
  const { composerOpen, composerMode, closeComposer } = useUI();

  return (
    <div
      className={`composer-modal${composerOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeComposer();
      }}
    >
      <div className="composer-panel">
        <div className="composer-panel__header">
          <strong>{composerMode === "topic" ? "New Topic" : "Reply"}</strong>
          <button
            className="icon-btn"
            onClick={closeComposer}
            style={{ color: "var(--ib-ink)", borderColor: "var(--ib-border)" }}
          >
            &times;
          </button>
        </div>

        {composerMode === "topic" && (
          <input
            className="composer__title"
            type="text"
            placeholder="Title — be specific and imagine you're asking another investor"
          />
        )}
        <textarea
          className="composer__body"
          placeholder={composerMode === "topic" ? "Write your post here…" : "Write your reply…"}
        />

        <div className="composer-panel__footer">
          <button className="btn btn-outline" onClick={closeComposer}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={closeComposer}>
            {composerMode === "topic" ? "Post Topic" : "Post Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
