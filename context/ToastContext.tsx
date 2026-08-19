"use client";

// Thin wrapper around the `sonner` toast library so the rest of the app
// depends on our own useToast() hook (easy to swap libraries later)
// instead of importing `sonner` directly everywhere.

import { createContext, useContext, useMemo } from "react";
import { toast as sonnerToast, Toaster } from "sonner";

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const api = useMemo<ToastApi>(
    () => ({
      success: (message: string) => sonnerToast.success(message),
      error: (message: string) => sonnerToast.error(message),
      info: (message: string) => sonnerToast(message),
    }),
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
