"use client";

import { ReactNode } from "react";
import { DataProvider, useData } from "./DataProvider";
import { UIProvider } from "./UIProvider";

function UIBridge({ children }: { children: ReactNode }) {
  const { currentUser } = useData();
  return <UIProvider isSignedIn={() => currentUser !== null}>{children}</UIProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <UIBridge>{children}</UIBridge>
    </DataProvider>
  );
}
