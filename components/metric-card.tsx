import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, hint, icon: Icon }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-4 h-px bg-accent" />
      <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
    </section>
  );
}
