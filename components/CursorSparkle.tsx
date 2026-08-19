"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#FFD93D", "#FF8FB1", "#6EC6FF", "#7ED957", "#CDB4FF", "#FFA552"];

export default function CursorSparkle() {
  const lastRef = useRef(0);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastRef.current < 60) return;
      lastRef.current = now;

      const el = document.createElement("div");
      const size = 6 + Math.random() * 6;
      el.className = "sparkle-cursor";
      el.style.left = `${e.clientX - size / 2}px`;
      el.style.top = `${e.clientY - size / 2}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 650);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return null;
}
