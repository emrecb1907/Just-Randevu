import { Plus, Search } from "lucide-react";

import { Button } from "@/components/button";
import type { Appointment } from "@/lib/app-data";
import { cn } from "@/lib/utils";

const hours = ["09", "10", "11", "12", "13", "14", "15", "16"];

const colorMap = {
  blue: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100",
  green:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  yellow:
    "border-yellow-200 bg-yellow-50 text-yellow-950 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-100",
  purple:
    "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-100",
  rose: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100",
};

function startTop(start: string) {
  const [hourValue, minuteValue] = start.split(":").map(Number);
  const hour = hourValue ?? 9;
  const minute = minuteValue ?? 0;
  return Math.max(0, (hour - 9) * 72 + (minute / 60) * 72);
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
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("tr-TR", {
        weekday: "short",
        day: "numeric",
      }),
    };
  });
}

export function CalendarBoard({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const days = weekDays();
  const today = new Date();
  const todayLabel = today.toLocaleDateString("tr-TR", {
    month: "short",
    day: "2-digit",
  });
  const monthLabel = today.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-panel">
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-md border border-border bg-background text-center">
            <span className="block text-[11px] font-semibold text-muted-foreground">
              {todayLabel.split(" ")[1]?.toUpperCase() ?? ""}
            </span>
            <span className="block text-xl font-semibold">
              {todayLabel.split(" ")[0]}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{monthLabel}</h2>
            <p className="text-sm text-muted-foreground">
              Personel takvimi ve admin doluluk görünümü
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            className="px-3"
            aria-label="Takvimde ara"
          >
            <Search size={17} />
          </Button>
          <Button variant="secondary">Bugün</Button>
          <Button variant="secondary">Hafta</Button>
          <Button>
            <Plus size={17} />
            Randevu ekle
          </Button>
        </div>
      </div>

      <div className="block border-b border-border p-3 md:hidden">
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="rounded-md border border-border bg-background p-3 text-sm text-muted-foreground">
              Bu aralıkta randevu kaydı bulunmuyor.
            </p>
          ) : null}
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className={cn(
                "rounded-md border p-3",
                colorMap[appointment.color],
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {appointment.customer}
                  </p>
                  <p className="text-xs">{appointment.service}</p>
                </div>
                <span className="text-xs font-semibold">
                  {appointment.start}
                </span>
              </div>
              <p className="mt-2 text-xs">
                {appointment.day} · {appointment.staffName} ·{" "}
                {appointment.durationMinutes} dk
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[68px_repeat(7,minmax(120px,1fr))] border-b border-border">
            <div className="border-r border-border" />
            {days.map((day) => (
              <div
                key={day.key}
                className="border-r border-border px-3 py-3 text-center text-xs font-semibold text-muted-foreground last:border-r-0"
              >
                {day.label}
              </div>
            ))}
          </div>
          <div className="relative grid grid-cols-[68px_repeat(7,minmax(120px,1fr))]">
            <div className="border-r border-border">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-[72px] border-b border-border px-2 pt-3 text-right text-xs text-muted-foreground"
                >
                  {hour}:00
                </div>
              ))}
            </div>
            {days.map((day) => (
              <div
                key={day.key}
                className="relative border-r border-border last:border-r-0"
              >
                {hours.map((hour) => (
                  <div key={hour} className="h-[72px] border-b border-border" />
                ))}
                {appointments
                  .filter((appointment) => appointment.dateKey === day.key)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className={cn(
                        "absolute left-2 right-2 rounded-md border p-2 text-xs shadow-sm",
                        colorMap[appointment.color],
                      )}
                      style={{
                        top: `${startTop(appointment.start) + 8}px`,
                        height: `${Math.max(48, appointment.durationMinutes * 1.2)}px`,
                      }}
                    >
                      <p className="truncate font-semibold">
                        {appointment.service}
                      </p>
                      <p className="truncate">{appointment.customer}</p>
                      <p>{appointment.start}</p>
                    </div>
                  ))}
              </div>
            ))}
            <div className="pointer-events-none absolute left-0 right-0 top-[392px] border-t border-dashed border-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
