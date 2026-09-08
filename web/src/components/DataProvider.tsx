"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  subscribeTopics,
  createTopic,
  createReply,
  toggleLike as toggleLikeFn,
  type TopicSummary,
} from "@/lib/firestore";

type SessionUser = {
  uid: string;
  name: string;
  initials: string;
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toSessionUser(user: FirebaseUser): SessionUser {
  const name = user.displayName || user.email?.split("@")[0] || "User";
  return { uid: user.uid, name, initials: initialsOf(name) };
}

type DataContextValue = {
  topics: TopicSummary[];
  topicsLoading: boolean;
  addTopic: (title: string, body: string, categorySlug: string) => Promise<string>;
  addReply: (topicSlug: string, body: string) => Promise<void>;
  toggleLike: (topicSlug: string, postId: string, currentlyLiked: boolean) => Promise<void>;
  currentUser: SessionUser | null;
  authLoading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeTopics((t) => {
      setTopics(t);
      setTopicsLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? toSessionUser(user) : null);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const requireUser = (): SessionUser => {
    if (!currentUser) throw new Error("Not signed in");
    return currentUser;
  };

  const addTopic = async (title: string, body: string, categorySlug: string) => {
    const user = requireUser();
    return createTopic(title, body, categorySlug, { uid: user.uid, name: user.name, initials: user.initials });
  };

  const addReply = async (topicSlug: string, body: string) => {
    const user = requireUser();
    await createReply(topicSlug, body, { uid: user.uid, name: user.name, initials: user.initials });
  };

  const toggleLike = async (topicSlug: string, postId: string, currentlyLiked: boolean) => {
    const user = requireUser();
    await toggleLikeFn(topicSlug, postId, user.uid, currentlyLiked);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    setCurrentUser({ uid: cred.user.uid, name, initials: initialsOf(name) });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <DataContext.Provider
      value={{
        topics,
        topicsLoading,
        addTopic,
        addReply,
        toggleLike,
        currentUser,
        authLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
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
