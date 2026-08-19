"use client";

import { MotionConfig } from "framer-motion";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ModalProvider } from "@/context/ModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user" makes every Framer Motion animation in the app
    // respect the OS/browser `prefers-reduced-motion` setting automatically,
    // without changing any per-component animation code or the default
    // (non-reduced-motion) experience.
    <MotionConfig reducedMotion="user">
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <ModalProvider>{children}</ModalProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </MotionConfig>
  );
}
