import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CategoryBadge from "@/components/CategoryBadge";
import LikeButton from "@/components/LikeButton";
import ReplyBar from "@/components/ReplyBar";
import { getCategory, getTopic, topics } from "@/lib/data";

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  return {
    title: topic ? `${topic.title} — Indiabulls Securities Community` : "Topic not found",
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const category = getCategory(topic.categorySlug);

  return (
    <div className="container">
      <div className="layout">
        <Sidebar />
        <main>
          <div className="breadcrumb">
            <Link href="/">Latest</Link> &rsaquo; <a href="#">{category?.name}</a>
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
                    <button>&#8617; Reply</button>
                    <button>&#128279; Share</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <ReplyBar />
        </main>
      </div>
    </div>
  );
}
