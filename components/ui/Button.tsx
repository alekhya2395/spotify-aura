"use client";

import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "spotify";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-spotify-green text-black font-bold hover:bg-spotify-green-light",
  secondary:
    "bg-spotify-elevated text-white font-semibold border border-white/[0.06] hover:bg-spotify-highlight hover:border-white/[0.1]",
  ghost: "bg-transparent text-spotify-text-secondary hover:text-white",
  spotify: "bg-white text-black font-bold",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-1.5 text-[11px]",
  md: "px-5 py-2.5 text-[13px]",
  lg: "px-6 py-3 text-[14px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
