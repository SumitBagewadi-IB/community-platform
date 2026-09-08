"use client";

import { useState } from "react";

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggle = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  return (
    <button className={liked ? "liked" : ""} onClick={toggle}>
      &#9825; <span>{likes}</span>
    </button>
  );
}
