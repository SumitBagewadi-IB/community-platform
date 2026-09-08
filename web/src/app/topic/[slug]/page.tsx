"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CategoryBadge from "@/components/CategoryBadge";
import LikeButton from "@/components/LikeButton";
import ReplyBar from "@/components/ReplyBar";
import { useUI } from "@/components/UIProvider";
import { getCategory } from "@/lib/data";
import { subscribeTopic, subscribeTopicPosts, type TopicSummary, type Post } from "@/lib/firestore";
import { formatRelativeTime } from "@/lib/format";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useUI();
  const [topic, setTopic] = useState<TopicSummary | null | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsub = subscribeTopic(slug, setTopic);
    return unsub;
  }, [slug]);

  useEffect(() => {
    const unsub = subscribeTopicPosts(slug, setPosts);
    return unsub;
  }, [slug]);

  useEffect(() => {
    if (topic) document.title = `${topic.title} — Indiabulls Securities Community`;
  }, [topic]);

  if (topic === undefined) {
    return (
      <div className="container">
        <div className="layout">
          <Sidebar />
          <main>
            <p style={{ padding: "2rem 0", color: "var(--ib-gray-500)" }}>Loading…</p>
          </main>
        </div>
      </div>
    );
  }

  if (topic === null) notFound();

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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} topicSlug={topic.slug} onShare={handleShare} />
            ))}
          </div>

          <ReplyBar topicSlug={topic.slug} />
        </main>
      </div>
    </div>
  );
}

function PostCard({
  post,
  topicSlug,
  onShare,
}: {
  post: Post;
  topicSlug: string;
  onShare: () => void;
}) {
  const { requestComposer } = useUI();

  return (
    <article className="post-card">
      <div className="avatar">{post.authorInitials}</div>
      <div>
        <div className="post-byline">
          <span className="username">{post.authorName}</span>
          {post.isOp && <span className="op-badge">OP</span>}
          <time>{formatRelativeTime(post.createdAt)}</time>
        </div>
        <div className="post-body">
          {post.body.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className="post-actions">
          <LikeButton topicSlug={topicSlug} postId={post.id} likedBy={post.likedBy} />
          <button onClick={() => requestComposer("reply", topicSlug)}>&#8617; Reply</button>
          <button onClick={onShare}>&#128279; Share</button>
        </div>
      </div>
    </article>
  );
}
