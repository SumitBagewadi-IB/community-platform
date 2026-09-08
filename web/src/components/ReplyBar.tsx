"use client";

import { useUI } from "./UIProvider";

export default function ReplyBar({ topicSlug }: { topicSlug: string }) {
  const { requestComposer } = useUI();

  return (
    <button className="composer-bar" onClick={() => requestComposer("reply", topicSlug)}>
      Reply to this topic…
    </button>
  );
}
