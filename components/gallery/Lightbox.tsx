"use client";

// Accessible fullscreen lightbox for the public Gallery page. Built as a
// dedicated component (rather than reusing components/ui/Modal.tsx) because
// it needs a chrome-less fullscreen presentation plus prev/next keyboard
// navigation, which the general-purpose content-slot Modal doesn't support.
// Shares the same portal + focus-trap + ESC-to-close approach as
// context/ModalContext.tsx for consistency.

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types/gallery";

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const item = items[index];

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Tab") {
        // Simple focus trap: keep focus on the dialog container since it's
        // the only interactive surface besides the buttons within it.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [goPrev, goNext, onClose]);

  if (!item) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.caption ?? "Gallery item"}
          tabIndex={-1}
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col items-center focus:outline-none"
        >
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:top-0 sm:-right-14"
          >
            <X size={24} />
          </button>

          {items.length > 1 && (
            <button
              onClick={goPrev}
              aria-label="Previous item"
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:-left-14"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex max-h-[80vh] w-full items-center justify-center"
          >
            {item.type === "image" ? (
              <div className="relative h-[70vh] w-full">
                <Image
                  src={item.url}
                  alt={item.caption ?? "Gallery photo"}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="rounded-2xl object-contain"
                />
              </div>
            ) : item.url.includes("youtube.com") || item.url.includes("youtu.be") ? (
              <iframe
                src={item.url}
                title={item.caption ?? "Gallery video"}
                className="aspect-video w-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={item.url} controls className="max-h-[70vh] w-full rounded-2xl" />
            )}
          </motion.div>

          {items.length > 1 && (
            <button
              onClick={goNext}
              aria-label="Next item"
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:-right-14"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {item.caption && <p className="mt-4 max-w-2xl text-center text-sm text-white/80">{item.caption}</p>}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
