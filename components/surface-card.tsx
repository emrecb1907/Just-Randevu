import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function SurfaceCard<T extends ElementType = "section">({
  as,
  children,
  className,
  ...props
}: SurfaceCardProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      className={cn(
        "rounded-[24px] border border-border bg-surface p-4 shadow-panel",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
