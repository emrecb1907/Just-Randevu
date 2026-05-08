import type { ModuleDefinition, ModuleKey } from "@/lib/product-model";
import { cn } from "@/lib/utils";

type ModuleCardProps = {
  module: ModuleDefinition;
  activeModules: ModuleKey[];
};

export function ModuleCard({ module, activeModules }: ModuleCardProps) {
  const Icon = module.icon;
  const active = activeModules.includes(module.key);

  return (
    <article className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-md",
            active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold">{module.name}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-[11px] font-semibold",
                active
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {active ? "Açık" : "Kapalı"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {module.description}
          </p>
        </div>
      </div>
    </article>
  );
}
