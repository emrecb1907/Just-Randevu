import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "accent";
  children: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "border border-border bg-surface text-foreground hover:border-primary",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
