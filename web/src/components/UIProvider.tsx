"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";

type ComposerMode = "topic" | "reply";

type UIContextValue = {
  composerOpen: boolean;
  composerMode: ComposerMode;
  composerTopicSlug: string | null;
  requestComposer: (mode: ComposerMode, topicSlug?: string) => void;
  closeComposer: () => void;
  signInOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  onSignedIn: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  toast: string | null;
  showToast: (message: string) => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({
  children,
  isSignedIn,
}: {
  children: ReactNode;
  isSignedIn: () => boolean;
}) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>("topic");
  const [composerTopicSlug, setComposerTopicSlug] = useState<string | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingComposer = useRef<{ mode: ComposerMode; topicSlug?: string } | null>(null);

  const openComposerNow = (mode: ComposerMode, topicSlug?: string) => {
    setComposerMode(mode);
    setComposerTopicSlug(topicSlug ?? null);
    setComposerOpen(true);
  };

  const requestComposer = (mode: ComposerMode, topicSlug?: string) => {
    if (isSignedIn()) {
      openComposerNow(mode, topicSlug);
    } else {
      pendingComposer.current = { mode, topicSlug };
      setSignInOpen(true);
    }
  };

  const onSignedIn = () => {
    setSignInOpen(false);
    if (pendingComposer.current) {
      const { mode, topicSlug } = pendingComposer.current;
      pendingComposer.current = null;
      openComposerNow(mode, topicSlug);
    }
  };

  const closeComposer = () => setComposerOpen(false);
  const openSignIn = () => setSignInOpen(true);
  const closeSignIn = () => {
    pendingComposer.current = null;
    setSignInOpen(false);
  };
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  return (
    <UIContext.Provider
      value={{
        composerOpen,
        composerMode,
        composerTopicSlug,
        requestComposer,
        closeComposer,
        signInOpen,
        openSignIn,
        closeSignIn,
        onSignedIn,
        sidebarOpen,
        toggleSidebar,
        toast,
        showToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}
