"use client";
import { motion } from "framer-motion";

/** Decorative floating clouds, balloons and butterflies for section backgrounds. Purely visual, aria-hidden. */
export function Cloud({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      width="120"
      height="60"
      viewBox="0 0 120 60"
      animate={{ x: ["-10vw", "110vw"] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear", delay }}
    >
      <ellipse cx="30" cy="40" rx="28" ry="18" fill="white" opacity="0.85" />
      <ellipse cx="60" cy="28" rx="34" ry="24" fill="white" opacity="0.85" />
      <ellipse cx="92" cy="40" rx="24" ry="16" fill="white" opacity="0.85" />
    </motion.svg>
  );
}

export function Balloon({ color = "#FF8FB1", className = "", delay = 0 }: { color?: string; className?: string; delay?: number }) {
  return (
    <motion.svg
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      width="40"
      height="90"
      viewBox="0 0 40 90"
      animate={{ y: [0, -18, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <ellipse cx="20" cy="24" rx="18" ry="22" fill={color} />
      <path d="M20 46 L20 90" stroke="#a89" strokeWidth="1.5" />
    </motion.svg>
  );
}

export function Butterfly({ color = "#CDB4FF", className = "", delay = 0 }: { color?: string; className?: string; delay?: number }) {
  return (
    <motion.svg
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      width="34"
      height="28"
      viewBox="0 0 34 28"
      animate={{ x: [0, 30, 0, -20, 0], y: [0, -14, 4, -10, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.g animate={{ scaleX: [1, 0.6, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
        <ellipse cx="10" cy="10" rx="9" ry="7" fill={color} />
        <ellipse cx="24" cy="10" rx="9" ry="7" fill={color} opacity="0.85" />
      </motion.g>
      <rect x="15.5" y="4" width="2" height="18" rx="1" fill="#5b4b3a" />
    </motion.svg>
  );
}

export function SunFace({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      width="140"
      height="140"
      viewBox="0 0 140 140"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      <g fill="#FFD93D">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="66" y="0" width="8" height="26" rx="4" transform={`rotate(${i * 30} 70 70)`} />
        ))}
      </g>
      <circle cx="70" cy="70" r="38" fill="#FFD93D" />
      <circle cx="58" cy="64" r="4" fill="#4a3b00" />
      <circle cx="82" cy="64" r="4" fill="#4a3b00" />
      <path d="M55 82 Q70 96 85 82" stroke="#4a3b00" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="76" r="5" fill="#FF8FB1" opacity="0.6" />
      <circle cx="90" cy="76" r="5" fill="#FF8FB1" opacity="0.6" />
    </motion.svg>
  );
}

export function Rainbow({ className = "" }: { className?: string }) {
  const colors = ["#FF8FB1", "#FFA552", "#FFD93D", "#7ED957", "#6EC6FF", "#CDB4FF"];
  return (
    <motion.svg
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      width="360"
      height="180"
      viewBox="0 0 360 180"
      initial={{ opacity: 0.7 }}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      {colors.map((c, i) => (
        <path
          key={c}
          d={`M ${10 + i * 14} 180 A ${170 - i * 14} ${170 - i * 14} 0 0 1 ${350 - i * 14} 180`}
          stroke={c}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </motion.svg>
  );
}

export function Star({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      aria-hidden
      className={`absolute pointer-events-none ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#FFD93D"
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2.4, repeat: Infinity, delay }}
    >
      <path d="M12 0 L14.5 8.5 L23 9 L16 14.5 L18.5 23 L12 18 L5.5 23 L8 14.5 L1 9 L9.5 8.5 Z" />
    </motion.svg>
  );
}
