import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function CustomersPage() {
  const { membership } = await requireTenantContext();
  const { customers } = await getTenantDataset(membership);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Müşteri Takibi</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Müşteriler
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Telefon benzersizliği işletme bazlıdır; kayıt açma ve düzenleme ayrı
            akışlarda yapılır.
          </p>
        </div>
        <Link
          href="/app/customers/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni müşteri
        </Link>
      </div>
      <section className="overflow-hidden rounded-[24px] border border-border bg-surface">
        <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.8fr_56px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground md:grid">
          <span>Müşteri</span>
          <span>Telefon</span>
          <span>Son işlem</span>
          <span>Durum</span>
          <span />
        </div>
        {customers.map((customer) => (
          <article
            key={customer.id}
            className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-[1.2fr_1fr_1fr_0.8fr_56px] md:items-center"
          >
            <span className="font-semibold">{customer.name}</span>
            <span className="text-sm text-muted-foreground">
              {customer.phone}
            </span>
            <span className="text-sm">{customer.lastService}</span>
            <span className="w-fit rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
              {customer.status}
            </span>
            <Link
              href={`/app/customers/${customer.id}/edit`}
              className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
              aria-label={`${customer.name} düzenle`}
            >
              <Pencil size={16} />
            </Link>
          </article>
        ))}
        {customers.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Henüz müşteri kaydı yok.
          </div>
        ) : null}
      </section>
    </div>
  );
}
