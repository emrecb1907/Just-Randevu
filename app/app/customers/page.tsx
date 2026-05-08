import Link from "next/link";
import { CalendarPlus, Pencil, Plus, Search, X } from "lucide-react";

import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership } from "@/lib/roles";

type CustomersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("tr-TR").replace(/\D/g, "");
}

function normalizeText(value: string) {
  return value.toLocaleLowerCase("tr-TR").trim();
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const { user, membership } = await requireTenantContext();
  const { customers } = await getTenantDataset(membership);
  const params = searchParams ? await searchParams : {};
  const error = firstParam(params.error);
  const query = firstParam(params.q)?.trim() ?? "";
  const textQuery = normalizeText(query);
  const digitQuery = normalizeSearch(query);
  const filteredCustomers = query
    ? customers.filter((customer) => {
        const haystack = normalizeText(
          `${customer.name} ${customer.firstName} ${customer.lastName} ${customer.email}`,
        );
        const phone = normalizeSearch(customer.phone);

        return (
          haystack.includes(textQuery) ||
          Boolean(digitQuery && phone.includes(digitQuery))
        );
      })
    : customers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Müşteri Takibi</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Müşteriler
          </h1>
        </div>
        <Link
          href="/app/customers/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Yeni müşteri
        </Link>
      </div>
      <form className="flex flex-col gap-2 rounded-[22px] border border-border bg-surface p-3 shadow-panel sm:flex-row sm:items-center">
        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3">
          <Search size={17} className="shrink-0 text-muted-foreground" />
          <input
            name="q"
            defaultValue={query}
            placeholder="İsim veya telefon ile ara"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            autoComplete="off"
          />
        </div>
        <div className="flex gap-2">
          {query ? (
            <Link
              href="/app/customers"
              className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition hover:text-foreground"
              aria-label="Aramayı temizle"
            >
              <X size={17} />
            </Link>
          ) : null}
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
          >
            Ara
          </button>
        </div>
      </form>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      ) : null}
      <section className="overflow-hidden rounded-[24px] border border-border bg-surface">
        <div className="hidden grid-cols-[1.2fr_1fr_1.2fr_112px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground md:grid">
          <span>Müşteri</span>
          <span>Telefon</span>
          <span>E-posta</span>
          <span />
        </div>
        {filteredCustomers.map((customer) => {
          const canEditCustomer =
            canManageMembership(membership) || customer.createdBy === user.profile.id;

          return (
            <article
              key={customer.id}
              className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-[1.2fr_1fr_1.2fr_112px] md:items-center"
            >
              <span className="font-semibold">{customer.name}</span>
              <span className="text-sm text-muted-foreground">
                {customer.phone}
              </span>
              <span className="min-w-0 truncate text-sm text-muted-foreground">
                {customer.email || "E-posta yok"}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/app/calendar/new?customerId=${customer.id}`}
                  className="grid size-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15"
                  aria-label={`${customer.name} için randevu oluştur`}
                  title="Randevu oluştur"
                >
                  <CalendarPlus size={16} />
                </Link>
                {canEditCustomer ? (
                  <Link
                    href={`/app/customers/${customer.id}/edit`}
                    className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
                    aria-label={`${customer.name} düzenle`}
                    title="Düzenle"
                  >
                    <Pencil size={16} />
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
        {filteredCustomers.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            {query ? "Aramaya uygun müşteri bulunamadı." : "Henüz müşteri kaydı yok."}
          </div>
        ) : null}
      </section>
    </div>
  );
}
