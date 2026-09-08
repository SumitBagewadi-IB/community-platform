"use client";

import Link from "next/link";
import { categories } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function Sidebar() {
  const { sidebarOpen } = useUI();

  return (
    <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
      <h4>Categories</h4>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link href={`/c/${cat.slug}`}>
              <span className="cat-dot" style={{ background: cat.color }} />
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>

      <h4>Community</h4>
      <ul className="category-list">
        <li>
          <span style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.45rem 0.6rem", fontSize: "0.87rem", fontWeight: 600, color: "var(--ib-gray-500)" }}>
            9,00,000+ members
          </span>
        </li>
        <li>
          <Link href="/guidelines">Guidelines</Link>
        </li>
      </ul>
    </aside>
  );
}
