"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ComposerMode = "topic" | "reply";

type UIContextValue = {
  composerOpen: boolean;
  composerMode: ComposerMode;
  openComposer: (mode: ComposerMode) => void;
  closeComposer: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>("topic");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openComposer = (mode: ComposerMode) => {
    setComposerMode(mode);
    setComposerOpen(true);
  };
  const closeComposer = () => setComposerOpen(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <UIContext.Provider
      value={{
        composerOpen,
        composerMode,
        openComposer,
        closeComposer,
        sidebarOpen,
        toggleSidebar,
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
