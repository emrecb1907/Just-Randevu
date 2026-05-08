import { CalendarDays, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";

import { TimelineGrid, type TimelineEvent } from "@/components/timeline-grid";
import type { Appointment } from "@/lib/app-data";

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekDays() {
  const now = new Date();
  const monday = new Date(now);
  const dayIndex = (now.getDay() + 6) % 7;
  monday.setDate(now.getDate() - dayIndex);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      id: formatDateKey(date),
      label: date.toLocaleDateString("tr-TR", { weekday: "short" }),
      subLabel: date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
      }),
      muted: date.toDateString() === now.toDateString(),
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
}: {
  appointments: Appointment[];
  opensAt?: string;
  closesAt?: string;
}) {
  const days = weekDays();
  const today = new Date();
  const monthLabel = today.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
  const rangeLabel = `${days[0]?.subLabel ?? ""} - ${days[6]?.subLabel ?? ""} ${today.getFullYear()}`;
  const events: TimelineEvent[] = appointments.map((appointment) => ({
    id: appointment.id,
    columnId: appointment.dateKey,
    startsAt: appointment.start,
    endsAt: addMinutes(appointment.start, appointment.durationMinutes),
    title: appointment.service,
    meta: `${appointment.customer} · ${appointment.staffName}`,
    tone:
      appointment.color === "yellow"
        ? "amber"
        : appointment.color === "purple"
          ? "violet"
        : appointment.color === "rose"
          ? "red"
          : appointment.color,
    href: `/app/calendar/${appointment.id}/edit`,
  }));

  return (
    <section className="space-y-4">
      <div className="rounded-[24px] border border-border bg-surface p-4 shadow-panel lg:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold">{monthLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Randevular işletme çalışma saatleri içinde gösterilir.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm text-muted-foreground">
              <Search size={17} />
              <span>Takvimde ara</span>
            </div>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold">
              <Filter size={16} />
              Filtre
            </button>
            <div className="inline-flex min-h-11 overflow-hidden rounded-xl border border-border bg-muted p-1 text-sm font-semibold">
              <button className="rounded-lg px-3 text-muted-foreground">Gün</button>
              <button className="rounded-lg bg-surface px-3 shadow-sm">Hafta</button>
              <button className="rounded-lg px-3 text-muted-foreground">Ay</button>
            </div>
            <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold">
              <CalendarDays size={16} />
              {rangeLabel}
            </div>
            <button className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground">
              <ChevronLeft size={18} />
            </button>
            <button className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground">
              <ChevronRight size={18} />
            </button>
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
