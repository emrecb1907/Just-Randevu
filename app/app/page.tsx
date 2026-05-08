import {
  Building2,
  CalendarDays,
  CreditCard,
  PackageCheck,
  Users,
  WalletCards,
} from "lucide-react";

import { CalendarBoard } from "@/components/calendar-board";
import { MetricCard } from "@/components/metric-card";
import { ModuleCard } from "@/components/module-card";
import { StaffDensityBoard } from "@/components/staff-density-board";
import {
  getSystemDataset,
  getTenantDataset,
  requireTenantContext,
  requireUserContext,
} from "@/lib/app-data";
import { modules } from "@/lib/product-model";
import { formatCurrency } from "@/lib/utils";

export default async function AppPage() {
  const context = await requireUserContext();

  if (context.isSuperAdmin) {
    const system = await getSystemDataset();

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Süper Admin</p>
            <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
              Platform Yönetimi
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              İşletmeler, abonelikler, paket gelirleri ve modül kataloğu.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="İşletme"
            value={String(system.metrics.businesses)}
            hint="Aktif ve pasif tenant kayıtları"
            icon={Building2}
          />
          <MetricCard
            label="Aktif abonelik"
            value={String(system.metrics.activeSubscriptions)}
            hint="Paket satışı yapılan işletmeler"
            icon={CreditCard}
          />
          <MetricCard
            label="Bekleyen abonelik"
            value={String(system.metrics.pendingSubscriptions)}
            hint="Ödeme veya aktivasyon bekleyenler"
            icon={PackageCheck}
          />
          <MetricCard
            label="Aylık paket geliri"
            value={formatCurrency(system.metrics.monthlyRecurringCents)}
            hint="Aktif aboneliklerin plan fiyatı toplamı"
            icon={WalletCards}
          />
        </div>

        <section className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground">
            <span>İşletme</span>
            <span>Plan</span>
            <span>Abonelik</span>
            <span>Kullanım</span>
          </div>
          {system.businesses.map((business) => (
            <article
              key={business.id}
              className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] gap-3 border-b border-border p-3 text-sm last:border-b-0"
            >
              <span className="font-semibold">{business.name}</span>
              <span>{business.plan === "premium" ? "Premium" : "Standart"}</span>
              <span>{business.subscriptionStatus}</span>
              <span>
                {business.branchCount} şube · {business.memberCount} kullanıcı
              </span>
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

  const { membership } = await requireTenantContext();
  const tenant = await getTenantDataset(membership);
  const {
    business,
    financeSummary,
    staffMembers,
    appointments,
    customers,
    stockItems,
    activeModules,
    branches,
  } = tenant;
  const criticalStockCount = stockItems.filter(
    (item) => item.stock <= item.critical,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            {business.plan === "premium" ? "Premium" : "Standart"} ·{" "}
            {branches.length} şube
          </p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Operasyon Paneli
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Randevu, personel, müşteri, stok, finans ve paket kullanım özeti.
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm">
          Slot: <span className="font-semibold">{business.slotMinutes} dk</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Bugünkü randevu"
          value={String(appointments.length)}
          hint={`${appointments.filter((appointment) => appointment.status === "iptal").length} iptal · ${appointments.filter((appointment) => appointment.status === "gelmedi").length} gelmedi`}
          icon={CalendarDays}
        />
        <MetricCard
          label="Aktif müşteri"
          value={String(customers.length)}
          hint="Telefon benzersizliği işletme bazlı"
          icon={Users}
        />
        <MetricCard
          label="Aylık ciro"
          value={formatCurrency(financeSummary.monthlyRevenueCents)}
          hint="Tamamlanan randevu ve adisyonlar"
          icon={WalletCards}
        />
        <MetricCard
          label="Kritik stok"
          value={String(criticalStockCount)}
          hint={
            activeModules.includes("stock")
              ? "Kritik eşiğe göre hesaplanır"
              : "Stok modülü kapalı"
          }
          icon={PackageCheck}
        />
      </div>

      <CalendarBoard appointments={appointments} />
      <StaffDensityBoard
        appointments={appointments}
        staffMembers={staffMembers}
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Personel Performansı</h2>
          <div className="mt-4 space-y-3">
            {staffMembers.map((staff) => (
              <div key={staff.id}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{staff.name}</span>
                  <span className="text-muted-foreground">
                    {staff.utilization}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${staff.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold">Paket Kullanımı</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <div className="flex justify-between">
                <span>Şube</span>
                <span className="font-semibold">
                  {branches.length} / {business.branchLimit}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div className="h-2 w-2/3 rounded-full bg-primary" />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>Merkez personel</span>
                <span className="font-semibold">
                  {staffMembers.length} / {business.staffLimitPerBranch}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div className="h-2 w-3/5 rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Modül Durumu</h2>
          <p className="text-sm text-muted-foreground">
            Paket + işletme aç/kapat kontrolü
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.key}
              module={module}
              activeModules={activeModules}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
