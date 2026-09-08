"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { categories } from "@/lib/data";
import { useData } from "@/components/DataProvider";

export default function CategoriesPage() {
  const { topics } = useData();

  return (
    <div className="container">
      <div className="layout">
        <Sidebar />
        <main>
          <div className="content-card">
            <div className="content-card__header">
              <h1>All Categories</h1>
            </div>
            <table className="topic-list">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="num">Topics</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const count = topics.filter((t) => t.categorySlug === cat.slug).length;
                  return (
                    <tr key={cat.slug}>
                      <td>
                        <div className="topic-title">
                          <Link
                            href={`/c/${cat.slug}`}
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                          >
                            <span className="cat-dot" style={{ background: cat.color }} />
                            {cat.name}
                          </Link>
                        </div>
                      </td>
                      <td className="num">{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
