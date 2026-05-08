import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { getSystemDataset, requireSuperAdminContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

export default async function SuperAdminPage() {
  await requireSuperAdminContext();
  const system = await getSystemDataset();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Süper Admin</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Paket ve İşletme Yönetimi
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Listeleme, işletme açma ve düzenleme ayrı yönetim akışlarıdır.
          </p>
        </div>
        <Link
          href="/app/super-admin/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          İşletme aç
        </Link>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        {system.plans.map((plan) => (
          <article
            key={plan.key}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.branchLimit} şube ·{" "}
                  {plan.staffLimitScope === "branch"
                    ? `şube başı ${plan.staffLimit} personel`
                    : `${plan.staffLimit} personel`}
                </p>
              </div>
              <p className="text-xl font-semibold">
                {formatCurrency(plan.monthlyPriceCents)}
              </p>
            </div>
            <div className="mt-4 h-px bg-accent" />
            <p className="mt-4 text-sm text-muted-foreground">
              Fiyat ve limitler veritabanındaki paket kaydından okunur.
            </p>
          </article>
        ))}
      </section>
      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.8fr_52px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground">
          <span>İşletme</span>
          <span>Plan</span>
          <span>Abonelik</span>
          <span>Kullanım</span>
          <span />
        </div>
        {system.businesses.map((business) => (
          <article
            key={business.id}
            className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.8fr_52px] gap-3 border-b border-border p-3 text-sm last:border-b-0"
          >
            <span className="font-semibold">{business.name}</span>
            <span>{business.plan === "premium" ? "Premium" : "Standart"}</span>
            <span>{business.subscriptionStatus}</span>
            <span>
              {business.branchCount} şube · {business.memberCount} kullanıcı ·{" "}
              {business.enabledModuleCount} modül
            </span>
            <Link
              href={`/app/super-admin/${business.id}/edit`}
              className="grid size-10 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground"
              aria-label={`${business.name} düzenle`}
            >
              <Pencil size={16} />
            </Link>
          </article>
        ))}
        {system.businesses.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Henüz işletme kaydı yok.
          </div>
        ) : null}
      </section>
    </div>
  );
}
