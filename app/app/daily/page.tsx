import Link from "next/link";
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";

import { updateAppointmentStatusAction } from "@/app/actions";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import {
  appointmentStatusLabel,
  appointmentStatusOptions,
} from "@/lib/status-labels";

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type DailyPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function dateFromKey(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date();
  }

  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function DailyPage({ searchParams }: DailyPageProps) {
  const { membership } = await requireTenantContext();
  const { business, appointments, customers, services, staffMembers } =
    await getTenantDataset(membership);
  const params = searchParams ? await searchParams : {};
  const today = new Date();
  const todayKey = formatDateKey(today);
  const requestedDate = dateFromKey(firstParam(params.date));
  const validDate =
    formatDateKey(requestedDate) > todayKey ? today : requestedDate;
  const selectedDateKey = formatDateKey(validDate);
  const dayAppointments = appointments.filter(
    (appointment) => appointment.dateKey === selectedDateKey,
  );
  const canCreateAppointment =
    customers.length > 0 && staffMembers.length > 0 && services.length > 0;
  const isToday = selectedDateKey === todayKey;
  const nextDate = addDays(validDate, 1);
  const canGoForward = formatDateKey(nextDate) <= todayKey;
  const readableDate = validDate.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Günlük Akış</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Günlük İşlemler
          </h1>
        </div>
        {canCreateAppointment && isToday ? (
          <Link
            href="/app/calendar/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
          >
            <CalendarPlus size={16} />
            Yeni randevu
          </Link>
        ) : null}
      </div>

      <section className="rounded-[22px] border border-border bg-surface p-3 shadow-panel">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-base font-semibold capitalize">{readableDate}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/app/daily?date=${formatDateKey(addDays(validDate, -1))}`}
              className="grid min-h-10 min-w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground"
              aria-label="Önceki gün"
            >
              <ChevronLeft size={18} />
            </Link>
            <Link
              href="/app/daily"
              className="inline-flex min-h-10 items-center rounded-xl border border-border bg-background px-3 text-sm font-semibold"
            >
              Bugün
            </Link>
            {canGoForward ? (
              <Link
                href={`/app/daily?date=${formatDateKey(nextDate)}`}
                className="grid min-h-10 min-w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground"
                aria-label="Sonraki gün"
              >
                <ChevronRight size={18} />
              </Link>
            ) : (
              <span
                className="grid min-h-10 min-w-10 place-items-center rounded-xl border border-border bg-muted text-muted-foreground opacity-50"
                aria-label="Sonraki gün yok"
              >
                <ChevronRight size={18} />
              </span>
            )}
            <form className="flex items-center gap-2">
              <input
                name="date"
                type="date"
                max={todayKey}
                defaultValue={selectedDateKey}
                className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm"
              />
              <button
                type="submit"
                className="min-h-10 rounded-xl bg-primary px-3 text-sm font-semibold text-white"
              >
                Git
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-panel">
        <div className="grid grid-cols-[0.7fr_1fr_1fr_1.8fr] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground">
          <span>Saat</span>
          <span>Müşteri</span>
          <span>Hizmet</span>
          <span>Durum</span>
        </div>
        {dayAppointments.map((appointment) => (
          <article
            key={appointment.id}
            className="grid gap-3 border-b border-border p-4 last:border-b-0 lg:grid-cols-[0.7fr_1fr_1fr_1.8fr] lg:items-center"
          >
            <div>
              <p className="font-semibold">{appointment.start}</p>
              <p className="text-xs text-muted-foreground">
                {appointmentStatusLabel(appointment.status)}
              </p>
            </div>
            <div>
              <p className="font-semibold">{appointment.customer}</p>
              <p className="text-xs text-muted-foreground">{appointment.phone}</p>
            </div>
            <div>
              <p className="font-semibold">{appointment.service}</p>
              <p className="text-xs text-muted-foreground">{appointment.staffName}</p>
            </div>
            <form action={updateAppointmentStatusAction} className="flex flex-wrap gap-2">
              <input type="hidden" name="businessId" value={business.id} />
              <input type="hidden" name="appointmentId" value={appointment.id} />
              <input type="hidden" name="returnDate" value={selectedDateKey} />
              {appointmentStatusOptions.map((status) => (
                <button
                  key={status.value}
                  type="submit"
                  name="status"
                  value={status.value}
                  className={
                    appointment.status === status.value
                      ? "min-h-9 rounded-xl bg-primary px-3 text-xs font-semibold text-white"
                      : "min-h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  }
                >
                  {status.label}
                </button>
              ))}
            </form>
          </article>
        ))}
        {dayAppointments.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Bu gün için işlem yok.
          </div>
        ) : null}
      </section>
    </div>
  );
}
