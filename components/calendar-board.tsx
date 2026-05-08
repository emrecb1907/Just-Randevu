import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { TimelineGrid, type TimelineEvent } from "@/components/timeline-grid";
import type { Appointment } from "@/lib/app-data";

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function weekDays(baseDate: Date) {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(baseDate, index);
    return {
      id: formatDateKey(date),
      label: date.toLocaleDateString("tr-TR", { weekday: "short" }),
      subLabel: date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
      }),
      muted: date.toDateString() === today.toDateString(),
    };
  });
}

function addMinutes(time: string, minutes: number) {
  const [hourValue, minuteValue] = time.split(":").map(Number);
  const date = new Date(2026, 0, 1, hourValue ?? 9, minuteValue ?? 0);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
}

export function CalendarBoard({
  appointments,
  opensAt = "09:00",
  closesAt = "18:00",
  canEditAppointments = true,
  selectedDate,
}: {
  appointments: Appointment[];
  opensAt?: string;
  closesAt?: string;
  canEditAppointments?: boolean;
  selectedDate?: Date;
}) {
  const baseDate = selectedDate ?? new Date();
  const days = weekDays(baseDate);
  const monthLabel = baseDate.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
  const previousWeekDate = addDays(baseDate, -7);
  const nextWeekDate = addDays(baseDate, 7);
  const rangeLabel = `${days[0]?.subLabel ?? ""} - ${days[6]?.subLabel ?? ""} ${baseDate.getFullYear()}`;
  const events: TimelineEvent[] = appointments.map((appointment) => ({
    id: appointment.id,
    columnId: appointment.dateKey,
    startsAt: appointment.start,
    endsAt: addMinutes(appointment.start, appointment.durationMinutes),
    title: appointment.service,
    meta: `${appointment.customer} · ${appointment.staffName}`,
    details: [
      { label: "Saat", value: `${appointment.start} - ${addMinutes(appointment.start, appointment.durationMinutes)}` },
      { label: "Müşteri", value: appointment.customer },
      { label: "Hizmet", value: appointment.service },
      { label: "Personel", value: appointment.staffName },
      { label: "Telefon", value: appointment.phone },
    ],
    tone:
      appointment.color === "yellow"
        ? "amber"
        : appointment.color === "purple"
          ? "violet"
        : appointment.color === "rose"
          ? "red"
          : appointment.color,
    ...(canEditAppointments
      ? { href: `/app/calendar/${appointment.id}/edit`, actionLabel: "Detaya git" }
      : {}),
  }));

  return (
    <section className="space-y-4">
      <div className="rounded-[22px] border border-border bg-surface p-3 shadow-panel">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-base font-semibold capitalize">{monthLabel}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/app/calendar?date=${formatDateKey(previousWeekDate)}`}
              className="grid min-h-10 min-w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground"
              aria-label="Önceki hafta"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="inline-flex min-h-10 items-center rounded-xl border border-border bg-background px-3 text-sm font-semibold">
              {rangeLabel}
            </div>
            <Link
              href={`/app/calendar?date=${formatDateKey(nextWeekDate)}`}
              className="grid min-h-10 min-w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground"
              aria-label="Sonraki hafta"
            >
              <ChevronRight size={18} />
            </Link>
            <Link
              href="/app/calendar"
              className="inline-flex min-h-10 items-center rounded-xl border border-border bg-background px-3 text-sm font-semibold"
            >
              Bu hafta
            </Link>
          </div>
        </div>
      </div>
      <TimelineGrid
        columns={days}
        events={events}
        startsAt={opensAt}
        endsAt={closesAt}
        emptyText="Bu hafta randevu kaydı bulunmuyor."
        rowHeight={176}
        showCurrentTime
        slotHref={(dateKey, time) => `/app/calendar/new?startsAt=${dateKey}T${time}`}
      />
    </section>
  );
}
