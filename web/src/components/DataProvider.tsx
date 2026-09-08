"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { topics as seedTopics, Topic, Post } from "@/lib/data";

const TOPICS_KEY = "ib-community-topics";
const USER_KEY = "ib-community-user";

type User = {
  name: string;
  initials: string;
};

function loadTopics(): Topic[] {
  if (typeof window === "undefined") return seedTopics;
  try {
    const raw = localStorage.getItem(TOPICS_KEY);
    return raw ? (JSON.parse(raw) as Topic[]) : seedTopics;
  } catch {
    return seedTopics;
  }
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "topic";
}

type DataContextValue = {
  topics: Topic[];
  getTopic: (slug: string) => Topic | undefined;
  addTopic: (title: string, body: string, categorySlug: string) => Topic;
  addReply: (topicSlug: string, body: string) => void;
  currentUser: User | null;
  signIn: (name: string) => void;
  signOut: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  // Start from seed data so server and first client render match exactly
  // (localStorage doesn't exist during SSR). Real persisted data — added
  // topics/replies, the mock session — loads in via effect right after
  // mount instead, avoiding a hydration mismatch.
  const [topics, setTopics] = useState<Topic[]>(seedTopics);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Deliberately not a lazy useState initializer: localStorage can't be
    // read during SSR, so doing it there would desync server/client output
    // on the very first render. Reading it post-mount instead — a one-time
    // sync from an external store — is what this effect is for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTopics(loadTopics());
    setCurrentUser(loadUser());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
    } catch {
      /* private mode / storage blocked — additions just won't persist */
    }
  }, [topics]);

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      else localStorage.removeItem(USER_KEY);
    } catch {
      /* private mode / storage blocked — session just won't persist */
    }
  }, [currentUser]);

  const getTopic = (slug: string) => topics.find((t) => t.slug === slug);

  const addTopic = (title: string, body: string, categorySlug: string): Topic => {
    const author = currentUser?.name ?? "Guest";
    const initials = currentUser?.initials ?? "GU";
    let slug = slugify(title);
    if (topics.some((t) => t.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    const newTopic: Topic = {
      slug,
      title,
      categorySlug,
      replies: 0,
      views: "1",
      activity: "just now",
      posts: [
        {
          author,
          initials,
          timeAgo: "just now",
          isOp: true,
          likes: 0,
          body: [body],
        },
      ],
    };
    setTopics((prev) => [newTopic, ...prev]);
    return newTopic;
  };

  const addReply = (topicSlug: string, body: string) => {
    const author = currentUser?.name ?? "Guest";
    const initials = currentUser?.initials ?? "GU";
    const newPost: Post = {
      author,
      initials,
      timeAgo: "just now",
      likes: 0,
      body: [body],
    };
    setTopics((prev) =>
      prev.map((t) =>
        t.slug === topicSlug
          ? { ...t, posts: [...t.posts, newPost], replies: t.replies + 1, activity: "just now" }
          : t
      )
    );
  };

  const signIn = (name: string) => {
    setCurrentUser({ name, initials: initialsOf(name) });
  };
  const signOut = () => setCurrentUser(null);

  return (
    <DataContext.Provider
      value={{ topics, getTopic, addTopic, addReply, currentUser, signIn, signOut }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
