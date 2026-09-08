import Link from "next/link";
import { topics } from "@/lib/data";
import CategoryBadge from "./CategoryBadge";

export default function TopicList() {
  return (
    <div className="content-card">
      <div className="content-card__header">
        <h1>Latest Topics</h1>
        <div className="filter-pills">
          <span className="pill active">Latest</span>
          <span className="pill">Top</span>
          <span className="pill">Unread</span>
        </div>
      </div>

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
    </div>
  );
}
