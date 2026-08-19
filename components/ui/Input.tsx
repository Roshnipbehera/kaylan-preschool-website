"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block font-heading text-sm font-semibold text-[#3a2e4d]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] placeholder:text-[#3a2e4d]/40",
            "focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy transition-colors",
            error && "border-red-400 focus:ring-red-400 focus:border-red-400",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="mt-1 text-xs text-[#3a2e4d]/60">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-xs font-semibold text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
