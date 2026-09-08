"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CategoryBadge from "@/components/CategoryBadge";
import LikeButton from "@/components/LikeButton";
import ReplyBar from "@/components/ReplyBar";
import { useUI } from "@/components/UIProvider";
import { useData } from "@/components/DataProvider";
import { getCategory } from "@/lib/data";
import { subscribeTopic, subscribeTopicPosts, type TopicSummary, type Post } from "@/lib/firestore";
import { formatRelativeTime } from "@/lib/format";

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { showToast } = useUI();
  const { isAdmin, deleteTopic, setTopicLocked } = useData();
  const [topic, setTopic] = useState<TopicSummary | null | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const unsub = subscribeTopic(slug, setTopic, () => setLoadError(true));
    return unsub;
  }, [slug]);

  useEffect(() => {
    const unsub = subscribeTopicPosts(slug, setPosts, () => setLoadError(true));
    return unsub;
  }, [slug]);

  useEffect(() => {
    if (topic) document.title = `${topic.title} — Indiabulls Securities Community`;
  }, [topic]);

  if (loadError) {
    return (
      <div className="container">
        <div className="layout">
          <Sidebar />
          <main>
            <p style={{ padding: "2rem 0", color: "var(--ib-danger)" }}>
              Couldn&apos;t load this topic right now — please refresh.
            </p>
          </main>
        </div>
      </div>
    );
  }

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

  const handleDeleteTopic = async () => {
    if (!window.confirm(`Delete "${topic.title}" and all its replies? This can't be undone.`)) return;
    setBusy(true);
    try {
      await deleteTopic(topic.slug);
      showToast("Topic deleted");
      router.push("/");
    } catch {
      showToast("Couldn't delete topic");
      setBusy(false);
    }
  };

  const handleToggleLock = async () => {
    setBusy(true);
    try {
      await setTopicLocked(topic.slug, !topic.locked);
      showToast(topic.locked ? "Topic unlocked" : "Topic locked");
    } catch {
      showToast("Couldn't update topic");
    } finally {
      setBusy(false);
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <CategoryBadge categorySlug={topic.categorySlug} />
              {topic.locked && <span className="pinned-tag">Locked</span>}
            </div>
            {isAdmin && (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                <button className="btn btn-outline" onClick={handleToggleLock} disabled={busy}>
                  {topic.locked ? "Unlock topic" : "Lock topic"}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleDeleteTopic}
                  disabled={busy}
                  style={{ color: "var(--ib-danger)", borderColor: "var(--ib-danger)" }}
                >
                  Delete topic
                </button>
              </div>
            )}
          </div>

          <div className="post-stream">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} topicSlug={topic.slug} onShare={handleShare} />
            ))}
          </div>

          {topic.locked ? (
            <p style={{ textAlign: "center", color: "var(--ib-gray-500)", fontSize: "0.85rem", marginTop: "1rem" }}>
              This topic is locked — no new replies.
            </p>
          ) : (
            <ReplyBar topicSlug={topic.slug} />
          )}
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
  const { requestComposer, showToast } = useUI();
  const { isAdmin, deletePost, banUser } = useData();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete this post by ${post.authorName}?`)) return;
    setBusy(true);
    try {
      await deletePost(topicSlug, post.id);
      showToast("Post deleted");
    } catch {
      showToast("Couldn't delete post");
    } finally {
      setBusy(false);
    }
  };

  const handleBan = async () => {
    if (!window.confirm(`Ban ${post.authorName} from posting? They'll still be able to read and sign in.`)) return;
    setBusy(true);
    try {
      await banUser(post.authorId, `Banned from post in ${topicSlug}`);
      showToast(`${post.authorName} has been banned`);
    } catch {
      showToast("Couldn't ban user");
    } finally {
      setBusy(false);
    }
  };

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
          {isAdmin && (
            <>
              <button onClick={handleDelete} disabled={busy} style={{ color: "var(--ib-danger)" }}>
                Delete
              </button>
              <button onClick={handleBan} disabled={busy} style={{ color: "var(--ib-danger)" }}>
                Ban author
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
