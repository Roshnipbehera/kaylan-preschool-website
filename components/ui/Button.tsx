"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-candy text-white hover:bg-candy/90 focus-visible:ring-candy",
  secondary: "bg-sky text-[#3a2e4d] hover:bg-sky/90 focus-visible:ring-sky",
  outline: "border-2 border-candy text-candy bg-white hover:bg-candy/10 focus-visible:ring-candy",
  ghost: "bg-transparent text-[#3a2e4d] hover:bg-black/5 focus-visible:ring-lavender",
  danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold shadow-sm transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
