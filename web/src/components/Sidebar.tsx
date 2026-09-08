"use client";

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
            <a href="#">
              <span className="cat-dot" style={{ background: cat.color }} />
              {cat.name}
            </a>
          </li>
        ))}
      </ul>

      <h4>Community</h4>
      <ul className="category-list">
        <li>
          <a href="#">9,00,000+ members</a>
        </li>
        <li>
          <a href="#">Guidelines</a>
        </li>
      </ul>
    </aside>
  );
}
