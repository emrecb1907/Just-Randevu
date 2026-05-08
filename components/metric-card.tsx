import type { LucideIcon } from "lucide-react";

import { SurfaceCard } from "@/components/surface-card";

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, hint, icon: Icon }: MetricCardProps) {
  return (
    <SurfaceCard className="shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-4 h-px bg-accent" />
      <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
    </SurfaceCard>
  );
}
