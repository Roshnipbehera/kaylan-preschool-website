"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalOptions {
  title?: string;
  content: React.ReactNode;
}

interface ModalApi {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalApi | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  const openModal = useCallback((options: ModalOptions) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setModal(options);
  }, []);
  const closeModal = useCallback(() => {
    setModal(null);
    // Return focus to whatever element opened the modal, once it unmounts.
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modal, closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {mounted &&
        modal &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={modal.title ?? "Dialog"}
              tabIndex={-1}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl focus:outline-none"
            >
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="absolute right-4 top-4 rounded-full p-1 text-[#3a2e4d]/60 hover:bg-black/5 hover:text-[#3a2e4d] focus:outline-none focus-visible:ring-2 focus-visible:ring-candy"
              >
                <span aria-hidden="true">✕</span>
              </button>
              {modal.title && <h2 className="mb-3 font-heading text-xl text-[#3a2e4d] pr-6">{modal.title}</h2>}
              {modal.content}
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
