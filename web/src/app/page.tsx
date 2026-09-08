"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopicTable, { Pill } from "@/components/TopicTable";
import { useData } from "@/components/DataProvider";
import { parseCount } from "@/lib/data";

function HomeContent() {
  const { topics } = useData();
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
    list = [...topics].sort((a, b) => parseCount(b.views) - parseCount(a.views));
    heading = "Top Topics";
  }

  const pills: Pill[] | undefined = q
    ? undefined
    : [
        { label: "Latest", href: "/", active: sort === "latest" },
        { label: "Top", href: "/?sort=top", active: sort === "top" },
        {
          label: "Unread",
          disabled: true,
          title: "Needs sign-in + a backend to track what you've read — coming with the backend build",
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
          <TopicTable topics={list} heading={heading} pills={pills} />
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
