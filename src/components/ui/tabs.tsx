"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

// ======================================================
// CONTEXTO
// ======================================================

type TabsContextType = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

// ======================================================
// TABS (CONTAINER)
// ======================================================

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// ======================================================
// LISTA DE ABAS
// ======================================================

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-2 border-b border-white/10 pb-2", className)}>
      {children}
    </div>
  );
}

// ======================================================
// BOTÃO DA ABA
// ======================================================

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;

  const active = ctx.value === value;

  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        "px-4 py-2 rounded-md text-sm transition",
        active ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

// ======================================================
// CONTEÚDO DA ABA
// ======================================================

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;

  return <div className={className}>{children}</div>;
}
