"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useUI } from "./UIProvider";
import { useData } from "./DataProvider";

export default function Header() {
  const { requestComposer, toggleSidebar, openSignIn } = useUI();
  const { currentUser, signOut } = useData();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submitSearch = () => {
    const q = query.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          className="icon-btn mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle categories"
        >
          &#9776;
        </button>

        <Link className="brand" href="/">
          <Image
            src="/images/ib_logo_darkbg.svg"
            alt="Indiabulls Securities"
            width={120}
            height={28}
            style={{ height: 28, width: "auto" }}
            priority
          />
          <span className="brand-name">
            Community
            <small>by Indiabulls Securities</small>
          </span>
        </Link>

        <nav className="main-nav">
          <Link href="/">Latest</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/?sort=top">Top</Link>
          <Link href="/c/announcements">Announcements</Link>
        </nav>

        <div className="search-box">
          <span>&#128269;</span>
          <input
            type="text"
            placeholder="Search the community"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
          />
        </div>

        <div className="header-actions">
          <ThemeToggle />
          {currentUser ? (
            <>
              <span className="avatar" style={{ width: 30, height: 30, fontSize: "0.75rem" }}>
                {currentUser.initials}
              </span>
              <button className="btn btn-ghost hide-on-mobile" onClick={signOut}>
                Sign Out
              </button>
            </>
          ) : (
            <button className="btn btn-ghost hide-on-mobile" onClick={openSignIn}>
              Sign In
            </button>
          )}
          <button className="btn btn-primary" onClick={() => requestComposer("topic")}>
            <span className="hide-on-mobile">+ New Topic</span>
            <span className="show-on-mobile">+ New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
