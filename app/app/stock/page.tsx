import Link from "next/link";
import { Boxes, Pencil, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { SurfaceCard } from "@/components/surface-card";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership } from "@/lib/roles";
import { formatCurrency } from "@/lib/utils";

export default async function StockPage() {
  const { membership } = await requireTenantContext();

  if (!canManageMembership(membership)) {
    redirect("/app/calendar");
  }

  const { stockItems, activeModules } = await getTenantDataset(membership);

  if (!activeModules.includes("stock")) {
    redirect("/app/settings");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Premium Modül</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Stok Yönetimi
          </h1>
        </div>
        <Link
          href="/app/stock/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni ürün
        </Link>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {stockItems.map((item) => {
          const critical = item.stock <= item.critical;
          return (
            <SurfaceCard
              as="article"
              key={item.id}
              className="shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">{item.unit}</p>
                </div>
                <Boxes
                  className={critical ? "text-accent" : "text-primary"}
                  size={20}
                />
              </div>
              <p className="mt-5 text-3xl font-semibold">{item.stock}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Kritik: {item.critical} · Değer:{" "}
                {formatCurrency(item.valueCents)}
              </p>
              <Link
                href={`/app/stock/${item.id}/edit`}
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold"
              >
                <Pencil size={15} />
                Düzenle
              </Link>
            </SurfaceCard>
          );
        })}
        {stockItems.length === 0 ? (
          <SurfaceCard className="text-sm text-muted-foreground">
            Henüz ürün kaydı yok.
          </SurfaceCard>
        ) : null}
      </section>
    </div>
  );
}
