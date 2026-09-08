"use client";

import { useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CategoryBadge from "@/components/CategoryBadge";
import LikeButton from "@/components/LikeButton";
import ReplyBar from "@/components/ReplyBar";
import { useData } from "@/components/DataProvider";
import { useUI } from "@/components/UIProvider";
import { getCategory } from "@/lib/data";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getTopic } = useData();
  const { requestComposer, showToast } = useUI();
  const topic = getTopic(slug);

  useEffect(() => {
    if (topic) document.title = `${topic.title} — Indiabulls Securities Community`;
  }, [topic]);

  if (!topic) notFound();

  const category = getCategory(topic.categorySlug);

  const handleShare = () => {
    const url = `${window.location.origin}/topic/${topic.slug}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => showToast("Link copied to clipboard"),
        () => showToast("Couldn't copy link")
      );
    } else {
      showToast("Copy isn't supported in this browser");
    }
  };

  return (
    <div className="container">
      <div className="layout">
        <Sidebar />
        <main>
          <div className="breadcrumb">
            <Link href="/">Latest</Link> &rsaquo;{" "}
            <Link href={`/c/${topic.categorySlug}`}>{category?.name}</Link>
          </div>

          <div className="topic-header">
            <h1>{topic.title}</h1>
            <CategoryBadge categorySlug={topic.categorySlug} />
          </div>

          <div className="post-stream">
            {topic.posts.map((post, i) => (
              <article className="post-card" key={i}>
                <div className="avatar">{post.initials}</div>
                <div>
                  <div className="post-byline">
                    <span className="username">{post.author}</span>
                    {post.isOp && <span className="op-badge">OP</span>}
                    <time>{post.timeAgo}</time>
                  </div>
                  <div className="post-body">
                    {post.body.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="post-actions">
                    <LikeButton initialLikes={post.likes} />
                    <button onClick={() => requestComposer("reply", topic.slug)}>
                      &#8617; Reply
                    </button>
                    <button onClick={handleShare}>&#128279; Share</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ReplyBar topicSlug={topic.slug} />
        </main>
      </div>
    </div>
  );
}
