"use client";

import { useState } from "react";
import { useData } from "./DataProvider";
import { useUI } from "./UIProvider";

export default function LikeButton({
  topicSlug,
  postId,
  likedBy,
}: {
  topicSlug: string;
  postId: string;
  likedBy: string[];
}) {
  const { currentUser, toggleLike } = useData();
  const { openSignIn, showToast } = useUI();
  const [busy, setBusy] = useState(false);

  const liked = Boolean(currentUser && likedBy.includes(currentUser.uid));
  const count = likedBy.length;

  const handleClick = async () => {
    if (!currentUser) {
      openSignIn();
      return;
    }
    setBusy(true);
    try {
      await toggleLike(topicSlug, postId, liked);
    } catch {
      showToast("Couldn't save your like — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button className={liked ? "liked" : ""} onClick={handleClick} disabled={busy}>
      &#9825; <span>{count}</span>
    </button>
  );
}
