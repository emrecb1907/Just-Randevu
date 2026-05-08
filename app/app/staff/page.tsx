import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership } from "@/lib/roles";
import { formatCurrency } from "@/lib/utils";

const roleLabel = {
  business_owner: "İşletme sahibi",
  admin: "Yönetici",
  staff: "Personel",
  super_admin: "Süper admin",
} as const;

export default async function StaffPage() {
  const { membership } = await requireTenantContext();

  if (!canManageMembership(membership)) {
    redirect("/app/calendar");
  }

  const { staffMembers } = await getTenantDataset(membership);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Personel</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Personel Listesi
          </h1>
        </div>
        <Link
          href="/app/staff/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni personel
        </Link>
      </div>
      <section className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-panel">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr_0.7fr_72px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground">
              <span>Personel</span>
              <span>Rol</span>
              <span>Şube</span>
              <span>Doluluk</span>
              <span>Ciro</span>
              <span />
            </div>
            {staffMembers.map((staff) => (
              <article
                key={staff.id}
                className="grid grid-cols-[1.3fr_0.8fr_0.7fr_0.7fr_0.7fr_72px] items-center gap-3 border-b border-border p-3 text-sm last:border-b-0"
              >
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 font-semibold text-primary">
                {staff.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-semibold">{staff.name}</h2>
              </div>
            </div>
            <span className="text-muted-foreground">
              {roleLabel[staff.role] ?? staff.role}
            </span>
            <span>{staff.branch}</span>
            <span>{staff.utilization}%</span>
            <span>{formatCurrency(staff.revenueCents)}</span>
            <Link
              href={`/app/staff/${staff.id}/edit`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold"
              aria-label={`${staff.name} düzenle`}
            >
              <Pencil size={15} />
            </Link>
              </article>
            ))}
            {staffMembers.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                Henüz personel kaydı yok.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
