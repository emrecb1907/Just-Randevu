import Link from "next/link";
import { CalendarClock, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { TimelineGrid, type TimelineEvent } from "@/components/timeline-grid";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

type SchedulePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function addMinutes(time: string, minutes: number) {
  const [hourValue, minuteValue] = time.split(":").map(Number);
  const date = new Date(2026, 0, 1, hourValue ?? 9, minuteValue ?? 0);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const { membership } = await requireTenantContext();
  const { business, staffMembers, appointments, businessHours } =
    await getTenantDataset(membership);
  const params = searchParams ? await searchParams : {};
  const selectedDate = firstParam(params.date);
  const date = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const dateKey = formatDateKey(validDate);
  const weekday = validDate.getDay();
  const dayHours = businessHours.find((item) => item.weekday === weekday);
  const opensAt = dayHours?.isClosed
    ? business.opensAt
    : (dayHours?.opensAt ?? business.opensAt);
  const closesAt = dayHours?.isClosed
    ? business.closesAt
    : (dayHours?.closesAt ?? business.closesAt);
  const dayAppointments = appointments.filter(
    (appointment) => appointment.dateKey === dateKey,
  );
  const columns = staffMembers.map((staff) => ({
    id: staff.id,
    label: staff.name,
    subLabel: staff.branch,
  }));
  const busyEvents: TimelineEvent[] = dayAppointments.map((appointment) => ({
    id: appointment.id,
    columnId: appointment.staffId,
    startsAt: appointment.start,
    endsAt: addMinutes(appointment.start, appointment.durationMinutes),
    title: appointment.customer,
    meta: `${appointment.service} · ${appointment.durationMinutes} dk`,
    tone: "red",
    href: `/app/calendar/${appointment.id}/edit`,
  }));
  const readableDate = validDate.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Vardiya Planı</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Personel Doluluk Takvimi
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Seçili günde personellerin yalnızca randevu doluluklarını görün.
          </p>
        </div>
        <Link
          href="/app/calendar/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
        >
          <Plus size={16} />
          Randevu oluştur
        </Link>
      </div>

      <section className="rounded-[24px] border border-border bg-surface p-4 shadow-panel lg:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <CalendarClock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold capitalize">{readableDate}</h2>
              <p className="text-sm text-muted-foreground">
                {opensAt} - {closesAt} · {staffMembers.length} personel
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/app/schedule?date=${formatDateKey(addDays(validDate, -1))}`}
              className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground"
              aria-label="Önceki gün"
            >
              <ChevronLeft size={18} />
            </Link>
            <Link
              href="/app/schedule"
              className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
            >
              Bugün
            </Link>
            <Link
              href={`/app/schedule?date=${formatDateKey(addDays(validDate, 1))}`}
              className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground"
              aria-label="Sonraki gün"
            >
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {staffMembers.length > 0 ? (
        <TimelineGrid
          columns={columns}
          events={busyEvents}
          startsAt={opensAt}
          endsAt={closesAt}
          emptyText="Bu gün için randevu kaydı yok."
          minColumnWidth={176}
          rowHeight={176}
          showCurrentTime={dateKey === formatDateKey(new Date())}
          slotHref={(staffId, time) =>
            `/app/calendar/new?staffId=${staffId}&startsAt=${dateKey}T${time}`
          }
        />
      ) : (
        <div className="rounded-[22px] border border-border bg-surface p-4 text-sm text-muted-foreground shadow-panel">
          Uygunluk tablosu için önce personel oluşturun.
        </div>
      )}
    </div>
  );
}
