import Link from "next/link";
import { Topic } from "@/lib/data";
import CategoryBadge from "./CategoryBadge";

export type Pill = {
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  title?: string;
};

export default function TopicTable({
  topics,
  heading,
  pills,
}: {
  topics: Topic[];
  heading: string;
  pills?: Pill[];
}) {
  return (
    <div className="content-card">
      <div className="content-card__header">
        <h1>{heading}</h1>
        {pills && (
          <div className="filter-pills">
            {pills.map((p) =>
              p.href && !p.disabled ? (
                <Link key={p.label} href={p.href} className={`pill${p.active ? " active" : ""}`}>
                  {p.label}
                </Link>
              ) : (
                <span
                  key={p.label}
                  className="pill"
                  title={p.title}
                  style={p.disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                >
                  {p.label}
                </span>
              )
            )}
          </div>
        )}
      </div>

      {topics.length === 0 ? (
        <p style={{ padding: "2rem 1.25rem", color: "var(--ib-gray-500)", margin: 0 }}>
          No topics here yet — be the first to start one.
        </p>
      ) : (
        <table className="topic-list">
          <thead>
            <tr>
              <th>Topic</th>
              <th className="num">Replies</th>
              <th className="num">Views</th>
              <th className="num">Activity</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.slug}>
                <td>
                  <div className="topic-title">
                    <Link href={`/topic/${topic.slug}`}>{topic.title}</Link>
                  </div>
                  <div className="topic-meta">
                    {topic.pinned && <span className="pinned-tag">Pinned</span>}
                    <CategoryBadge categorySlug={topic.categorySlug} />
                  </div>
                </td>
                <td className="num">{topic.replies}</td>
                <td className="num">{topic.views}</td>
                <td className="num activity">{topic.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
