import type { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export function PageLoadingState() {
  return (
    <div className="mx-auto flex min-h-[52dvh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="grid size-12 place-items-center rounded-xl border border-border bg-surface shadow-panel">
        <Loader2 size={22} className="animate-spin text-primary" />
      </div>
      <h1 className="mt-4 text-xl font-semibold">Sayfa hazırlanıyor</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Bilgiler yüklenirken ekran düzeni sabit tutuluyor.
      </p>
      <div className="mt-6 grid w-full gap-3">
        <div className="h-12 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-12 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export function PageErrorState({
  title = "Bir şey ters gitti",
  description = "Sayfa yüklenirken beklenmeyen bir sorun oluştu.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[52dvh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="grid size-12 place-items-center rounded-xl border border-red-200 bg-red-50 text-red-700 shadow-panel">
        <AlertTriangle size={22} />
      </div>
      <h1 className="mt-4 text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
