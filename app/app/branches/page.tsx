import Link from "next/link";
import { Building2, Pencil, Plus } from "lucide-react";

import { SurfaceCard } from "@/components/surface-card";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

type BranchesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BranchesPage({ searchParams }: BranchesPageProps) {
  const { membership } = await requireTenantContext();
  const { business, branches, staffMembers } = await getTenantDataset(membership);
  const params = searchParams ? await searchParams : {};
  const error = firstParam(params.error);
  const canAddBranch = branches.length < business.branchLimit;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Şube Yönetimi</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Şubeler
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Personel bir şubeye bağlı çalışır. Çoklu şube paketinde yeni şube
            açabilir, personel ve randevu formlarında şubeyi seçebilirsiniz.
          </p>
        </div>
        {canAddBranch ? (
          <Link
            href="/app/branches/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
          >
            <Plus size={16} />
            Şube ekle
          </Link>
        ) : (
          <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            Paket limiti: {branches.length}/{business.branchLimit} şube
          </div>
        )}
      </div>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-2">
        {branches.map((branch) => {
          const branchStaff = staffMembers.filter(
            (staff) => staff.branchId === branch.id,
          );

          return (
            <SurfaceCard
              as="article"
              key={branch.id}
              className="shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{branch.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {branch.address || "Adres girilmedi"}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/app/branches/${branch.id}/edit`}
                  className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
                  aria-label={`${branch.name} düzenle`}
                >
                  <Pencil size={16} />
                </Link>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border bg-background p-3">
                  <dt className="text-xs text-muted-foreground">Telefon</dt>
                  <dd className="mt-1 font-semibold">{branch.phone || "-"}</dd>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <dt className="text-xs text-muted-foreground">Personel</dt>
                  <dd className="mt-1 font-semibold">{branchStaff.length}</dd>
                </div>
              </dl>
            </SurfaceCard>
          );
        })}
      </section>
    </div>
  );
}
