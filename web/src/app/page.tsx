"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopicTable, { Pill } from "@/components/TopicTable";
import { useData } from "@/components/DataProvider";

function HomeContent() {
  const { topics, topicsLoading, topicsError } = useData();
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const sort = searchParams.get("sort") === "top" ? "top" : "latest";

  let list = topics;
  let heading = "Latest Topics";

  if (q) {
    const needle = q.toLowerCase();
    list = topics.filter((t) => t.title.toLowerCase().includes(needle));
    heading = `Search results for "${q}"`;
  } else if (sort === "top") {
    list = [...topics].sort((a, b) => b.views - a.views);
    heading = "Top Topics";
  } else {
    // Pinned topics always float to the top, regardless of recent activity.
    list = [...topics].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }

  const pills: Pill[] | undefined = q
    ? undefined
    : [
        { label: "Latest", href: "/", active: sort === "latest" },
        { label: "Top", href: "/?sort=top", active: sort === "top" },
        {
          label: "Unread",
          disabled: true,
          title: "Per-user read tracking isn't built yet — coming in a future pass",
        },
      ];

  return (
    <div className="container">
      <div className="layout">
        <Sidebar />
        <main>
          {q && (
            <p style={{ margin: "0 0 0.75rem" }}>
              <Link href="/">&larr; Clear search</Link>
            </p>
          )}
          {topicsError ? (
            <div className="content-card">
              <p style={{ padding: "2rem 1.25rem", color: "var(--ib-danger)", margin: 0 }}>{topicsError}</p>
            </div>
          ) : topicsLoading ? (
            <div className="content-card">
              <p style={{ padding: "2rem 1.25rem", color: "var(--ib-gray-500)", margin: 0 }}>
                Loading topics…
              </p>
            </div>
          ) : (
            <TopicTable topics={list} heading={heading} pills={pills} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
