"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import TopicTable from "@/components/TopicTable";
import { useData } from "@/components/DataProvider";
import { getCategory } from "@/lib/data";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { topics } = useData();
  const category = getCategory(slug);

  if (!category) notFound();

  const list = topics.filter((t) => t.categorySlug === slug);

  return (
    <div className="container">
      <div className="layout">
        <Sidebar />
        <main>
          <div className="breadcrumb">
            <Link href="/">Latest</Link> &rsaquo; {category.name}
          </div>
          <TopicTable topics={list} heading={category.name} />
        </main>
      </div>
    </div>
  );
}
