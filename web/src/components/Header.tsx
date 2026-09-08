"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useUI } from "./UIProvider";

export default function Header() {
  const { openComposer, toggleSidebar } = useUI();

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
          <Link href="/" className="active">
            Latest
          </Link>
          <Link href="#">Categories</Link>
          <Link href="#">Top</Link>
          <Link href="#">Announcements</Link>
        </nav>

        <div className="search-box">
          <span>&#128269;</span>
          <input type="text" placeholder="Search the community" aria-label="Search" />
        </div>

        <div className="header-actions">
          <ThemeToggle />
          <button className="btn btn-ghost hide-on-mobile">Sign In</button>
          <button className="btn btn-primary" onClick={() => openComposer("topic")}>
            <span className="hide-on-mobile">+ New Topic</span>
            <span className="show-on-mobile">+ New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
