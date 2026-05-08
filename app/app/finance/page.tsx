import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { isStaffMembership } from "@/lib/roles";
import { financeSourceLabel, financeTypeLabel } from "@/lib/status-labels";
import { formatCurrency } from "@/lib/utils";

export default async function FinancePage() {
  const { membership } = await requireTenantContext();
  const { financeSummary, financeRows, activeModules } = await getTenantDataset(membership);
  const staffView = isStaffMembership(membership);

  if (!activeModules.includes("finance")) {
    redirect(staffView ? "/app/calendar" : "/app/settings");
  }
  const rows = [
    ["Günlük gelir", financeSummary.dailyRevenueCents],
    ["Aylık gelir", financeSummary.monthlyRevenueCents],
    ["Gider", financeSummary.expensesCents],
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Premium Modül</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Finans
          </h1>
        </div>
        {staffView ? null : (
          <Link
            href="/app/finance/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
          >
            <Plus size={16} />
            Yeni kayıt
          </Link>
        )}
      </div>
      <section className="rounded-[24px] border border-border bg-surface p-4">
        <div className="grid gap-3 md:grid-cols-3">
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
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className={staffView ? "grid grid-cols-4 border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground" : "grid grid-cols-[1fr_1fr_1fr_1fr_52px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground"}>
              <span>Tip</span>
              <span>Kategori</span>
              <span>Tutar</span>
              <span>Kaynak</span>
              {staffView ? null : <span />}
            </div>
            {financeRows.map((entry) => (
              <article
                key={entry.id}
                className={staffView ? "grid grid-cols-4 gap-3 border-b border-border p-3 text-sm last:border-b-0" : "grid grid-cols-[1fr_1fr_1fr_1fr_52px] gap-3 border-b border-border p-3 text-sm last:border-b-0"}
              >
                <span className="font-semibold">{financeTypeLabel(entry.type)}</span>
                <span>{entry.category}</span>
                <span>{formatCurrency(entry.amountCents)}</span>
                <span className="text-muted-foreground">
                  {financeSourceLabel(entry.source)}
                </span>
                {staffView ? null : (
                  <Link
                    href={`/app/finance/${entry.id}/edit`}
                    className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
                    aria-label={`${entry.category} düzenle`}
                  >
                    <Pencil size={16} />
                  </Link>
                )}
              </article>
            ))}
            {financeRows.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                Henüz finans kaydı yok.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
