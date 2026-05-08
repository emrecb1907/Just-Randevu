import {
  Building2,
  CalendarDays,
  CreditCard,
  PackageCheck,
  Users,
  WalletCards,
} from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import {
  getSystemDataset,
  getTenantDataset,
  requireTenantContext,
  requireUserContext,
} from "@/lib/app-data";
import { isStaffMembership } from "@/lib/roles";
import { appointmentStatusLabel, subscriptionStatusLabel } from "@/lib/status-labels";
import { formatCurrency } from "@/lib/utils";

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
            hint="Aktif aboneliklerin kayıtlı ücret toplamı"
            icon={WalletCards}
          />
        </div>

        <section className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-panel">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
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
                  <span>{subscriptionStatusLabel(business.subscriptionStatus)}</span>
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
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { membership } = await requireTenantContext();
  const staffView = isStaffMembership(membership);
  const tenant = await getTenantDataset(membership);
  const {
    business,
    financeSummary,
    appointments,
    customers,
    stockItems,
    activeModules,
  } = tenant;
  const criticalStockCount = stockItems.filter(
    (item) => item.stock <= item.critical,
  ).length;
  const todayKey = formatDateKey(new Date());
  const todayAppointments = appointments.filter(
    (appointment) => appointment.dateKey === todayKey,
  );
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "tamamlandı",
  );
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "bekliyor" &&
      !Number.isNaN(new Date(appointment.startsAt).getTime()) &&
      new Date(appointment.startsAt) >= new Date(),
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Operasyon Paneli
          </h1>
        </div>
        <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-sm">
          Çalışma saati:{" "}
          <span className="font-semibold">
            {business.opensAt} - {business.closesAt}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Bugünkü randevu"
          value={String(todayAppointments.length)}
          hint={`${todayAppointments.filter((appointment) => appointment.status === "iptal").length} ${appointmentStatusLabel("iptal")} · ${todayAppointments.filter((appointment) => appointment.status === "gelmedi").length} ${appointmentStatusLabel("gelmedi")}`}
          icon={CalendarDays}
        />
        <MetricCard
          label={staffView ? "Tamamlanan iş" : "Aktif müşteri"}
          value={String(staffView ? completedAppointments.length : customers.length)}
          hint={staffView ? "Size atanmış tamamlanan randevular" : "Telefon benzersizliği işletme bazlı"}
          icon={Users}
        />
        <MetricCard
          label="Aylık ciro"
          value={formatCurrency(financeSummary.monthlyRevenueCents)}
          hint="Tamamlanan randevu ve adisyonlar"
          icon={WalletCards}
        />
        <MetricCard
          label={staffView ? "Yaklaşan randevu" : "Kritik stok"}
          value={String(staffView ? upcomingAppointments.length : criticalStockCount)}
          hint={
            staffView
              ? "Henüz tamamlanmamış gelecek randevular"
              : activeModules.includes("stock")
                ? "Kritik eşiğe göre hesaplanır"
                : "Stok modülü kapalı"
          }
          icon={staffView ? CalendarDays : PackageCheck}
        />
      </div>
    </div>
  );
}
