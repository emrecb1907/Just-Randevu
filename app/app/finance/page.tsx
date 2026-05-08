import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

export default async function FinancePage() {
  const { membership } = await requireTenantContext();
  const { financeSummary, financeRows, activeModules } = await getTenantDataset(membership);

  if (!activeModules.includes("finance")) {
    redirect("/app/settings");
  }
  const rows = [
    ["Günlük gelir", financeSummary.dailyRevenueCents],
    ["Aylık gelir", financeSummary.monthlyRevenueCents],
    ["Gider", financeSummary.expensesCents],
    ["Cari alacak", financeSummary.receivablesCents],
    ["Vadesi gelen taksit", financeSummary.installmentDueCents],
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Premium Modül</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Finans
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manuel kayıt ve düzenleme ayrı sayfalarda; otomatik randevu gelirleri
            kayıt listesinde izlenir.
          </p>
        </div>
        <Link
          href="/app/finance/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni kayıt
        </Link>
      </div>
      <section className="rounded-[24px] border border-border bg-surface p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-background p-4"
            >
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-xl font-semibold">
                {formatCurrency(value)}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="overflow-hidden rounded-[24px] border border-border bg-surface">
        <div className="grid grid-cols-[1fr_1fr_1fr_52px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground md:grid-cols-[1fr_1fr_1fr_1fr_52px]">
          <span>Tip</span>
          <span>Kategori</span>
          <span>Tutar</span>
          <span className="hidden md:block">Kaynak</span>
          <span />
        </div>
        {financeRows.map((entry) => (
          <article
            key={entry.id}
            className="grid grid-cols-[1fr_1fr_1fr_52px] gap-3 border-b border-border p-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_1fr_1fr_52px]"
          >
            <span className="font-semibold">{entry.type}</span>
            <span>{entry.category}</span>
            <span>{formatCurrency(entry.amountCents)}</span>
            <span className="hidden text-muted-foreground md:block">
              {entry.source}
            </span>
            <Link
              href={`/app/finance/${entry.id}/edit`}
              className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
              aria-label={`${entry.category} düzenle`}
            >
              <Pencil size={16} />
            </Link>
          </article>
        ))}
        {financeRows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Henüz finans kaydı yok.
          </div>
        ) : null}
      </section>
    </div>
  );
}
