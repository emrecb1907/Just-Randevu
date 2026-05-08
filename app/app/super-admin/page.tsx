import Link from "next/link";
import { Building2, CreditCard, Pencil, Plus, Search, UserRound } from "lucide-react";

import { getSystemDataset, requireSuperAdminContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

type SuperAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SuperAdminPage({
  searchParams,
}: SuperAdminPageProps) {
  await requireSuperAdminContext();
  const system = await getSystemDataset();
  const params = searchParams ? await searchParams : {};
  const query = firstParam(params.q)?.trim().toLocaleLowerCase("tr-TR") ?? "";
  const businesses = query
    ? system.businesses.filter((business) =>
        [
          business.name,
          business.email,
          business.phone,
          business.plan,
          business.subscriptionStatus,
        ]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(query),
      )
    : system.businesses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Süper Admin</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            İşletmeler
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            İşletmeleri arayın, paketlerini görün, profillerine ve düzenleme
            akışlarına geçin.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/app/super-admin/plans"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-bold text-foreground shadow-sm"
          >
            <CreditCard size={16} />
            Paket yönetimi
          </Link>
          <Link
            href="/app/super-admin/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
          >
            <Plus size={16} />
            İşletme aç
          </Link>
        </div>
      </div>

      <section className="rounded-[24px] border border-border bg-surface p-4 shadow-panel">
        <form className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              name="q"
              defaultValue={query}
              placeholder="İşletme, e-posta, telefon veya paket ara"
              className="min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <button className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">
            Ara
          </button>
        </form>

        <div className="overflow-hidden rounded-[18px] border border-border">
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-[1.2fr_0.75fr_0.75fr_0.8fr_1fr_92px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground">
                <span>İşletme</span>
                <span>Plan</span>
                <span>Abonelik</span>
                <span>Tutar</span>
                <span>Kullanım</span>
                <span />
              </div>
              {businesses.map((business) => (
                <article
                  key={business.id}
                  className="grid grid-cols-[1.2fr_0.75fr_0.75fr_0.8fr_1fr_92px] gap-3 border-b border-border p-3 text-sm last:border-b-0"
                >
              <div className="min-w-0">
                <p className="truncate font-semibold">{business.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {business.email || "E-posta yok"} · {business.phone || "Telefon yok"}
                </p>
              </div>
              <span>{business.plan === "premium" ? "Premium" : "Standart"}</span>
              <span>{business.subscriptionStatus}</span>
              <span>{formatCurrency(business.subscriptionPriceCents)}</span>
              <span>
                {business.branchCount} şube · {business.memberCount} kullanıcı ·{" "}
                {business.enabledModuleCount} modül
              </span>
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/app/super-admin/${business.id}/edit`}
                  className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
                  aria-label={`${business.name} profiline git`}
                >
                  <UserRound size={16} />
                </Link>
                <Link
                  href={`/app/super-admin/${business.id}/edit`}
                  className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
                  aria-label={`${business.name} düzenle`}
                >
                  <Pencil size={16} />
                </Link>
              </div>
                </article>
              ))}
              {businesses.length === 0 ? (
                <div className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
                  <Building2 size={18} />
                  Aramanıza uyan işletme kaydı yok.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
