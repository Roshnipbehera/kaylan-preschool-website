"use client";

// Re-exports the global modal system for convenience so consumers can
// `import { useModal } from "@/components/ui/Modal"` alongside other ui/
// primitives. Actual implementation lives in context/ModalContext.tsx.
export { useModal, ModalProvider } from "@/context/ModalContext";
