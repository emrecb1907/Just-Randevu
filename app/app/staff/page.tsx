import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

export default async function StaffPage() {
  const { membership } = await requireTenantContext();
  const { staffMembers } = await getTenantDataset(membership);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Personel Yönetimi</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Personeller
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Oluşturma, yetki güncelleme ve pasife alma ayrı akışlarda yapılır.
          </p>
        </div>
        <Link
          href="/app/staff/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni personel
        </Link>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {staffMembers.map((staff) => (
          <article
            key={staff.id}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-md bg-primary/10 font-semibold text-primary">
                {staff.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-semibold">{staff.name}</h2>
                <p className="text-sm text-muted-foreground">{staff.role}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Şube</dt>
                <dd>{staff.branch}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Doluluk</dt>
                <dd>{staff.utilization}%</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Ciro</dt>
                <dd>{formatCurrency(staff.revenueCents)}</dd>
              </div>
            </dl>
            <Link
              href={`/app/staff/${staff.id}/edit`}
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold"
            >
              <Pencil size={15} />
              Düzenle
            </Link>
          </article>
        ))}
        {staffMembers.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
            Henüz personel kaydı yok.
          </div>
        ) : null}
      </section>
    </div>
  );
}
