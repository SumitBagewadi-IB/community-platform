"use client";

import { useUI } from "./UIProvider";

export default function ReplyBar() {
  const { openComposer } = useUI();

  return (
    <button className="composer-bar" onClick={() => openComposer("reply")}>
      Reply to this topic…
    </button>
  );
}
