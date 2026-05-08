import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const { membership } = await requireTenantContext();
  const { services } = await getTenantDataset(membership);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">İşlem ve Hizmetler</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Hizmetler
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hizmet fiyatı randevuya snapshot olarak yazılır; kayıt ve düzenleme
            ayrı sayfalarda yapılır.
          </p>
        </div>
        <Link
          href="/app/services/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni hizmet
        </Link>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="rounded-lg border border-border bg-surface p-4"
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
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold"
            >
              <Pencil size={15} />
              Düzenle
            </Link>
          </article>
        ))}
        {services.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
            Henüz hizmet kaydı yok.
          </div>
        ) : null}
      </section>
    </div>
  );
}
