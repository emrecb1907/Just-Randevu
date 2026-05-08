import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { SurfaceCard } from "@/components/surface-card";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const { membership } = await requireTenantContext();
  const { services } = await getTenantDataset(membership);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Hizmetler</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Hizmetler
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hizmet sürelerini ve ücretlerini yönetin. Mevcut randevular eski
            ücretleriyle korunur.
          </p>
        </div>
        <Link
          href="/app/services/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni hizmet
        </Link>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <SurfaceCard
            as="article"
            key={service.id}
            className="shadow-sm"
          >
            <p className="text-sm font-semibold text-primary">
              {service.category}
            </p>
            <h2 className="mt-2 text-lg font-semibold">{service.name}</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>{service.duration} dk</span>
              <span className="font-semibold">
                {formatCurrency(service.priceCents)}
              </span>
            </div>
            <Link
              href={`/app/services/${service.id}/edit`}
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold"
            >
              <Pencil size={15} />
              Düzenle
            </Link>
          </SurfaceCard>
        ))}
        {services.length === 0 ? (
          <SurfaceCard className="text-sm text-muted-foreground">
            Henüz hizmet kaydı yok.
          </SurfaceCard>
        ) : null}
      </section>
    </div>
  );
}
