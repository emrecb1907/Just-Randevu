import Link from "next/link";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export type TimelineColumn = {
  id: string;
  label: string;
  subLabel?: string;
  muted?: boolean;
};

export type TimelineEventTone = "blue" | "green" | "amber" | "red" | "violet" | "neutral";

export type TimelineEvent = {
  id: string;
  columnId: string;
  startsAt: string;
  endsAt: string;
  title: string;
  meta?: string;
  tone?: TimelineEventTone;
  href?: string;
  subtle?: boolean;
};

type TimelineGridProps = {
  columns: TimelineColumn[];
  events: TimelineEvent[];
  startsAt: string;
  endsAt: string;
  emptyText?: string;
  minColumnWidth?: number;
  rowHeight?: number;
  showCurrentTime?: boolean;
  slotHref?: (columnId: string, startsAt: string) => string | null;
  slotStepMinutes?: number;
};

const toneClass: Record<TimelineEventTone, string> = {
  blue: "border-sky-200 bg-sky-50 text-sky-950",
  green: "border-emerald-200 bg-emerald-50 text-emerald-950",
  amber: "border-amber-200 bg-amber-50 text-amber-950",
  red: "border-rose-200 bg-rose-50 text-rose-950",
  violet: "border-violet-200 bg-violet-50 text-violet-950",
  neutral: "border-border bg-muted text-muted-foreground",
};

function toMinutes(value: string) {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  return (hourValue ?? 0) * 60 + (minuteValue ?? 0);
}

function hourLabels(startsAt: string, endsAt: string) {
  const start = Math.floor(toMinutes(startsAt) / 60);
  const end = Math.ceil(toMinutes(endsAt) / 60);

  return Array.from({ length: Math.max(1, end - start + 1) }, (_, index) => {
    const hour = start + index;
    return `${String(hour).padStart(2, "0")}:00`;
  });
}

export function TimelineGrid({
  columns,
  events,
  startsAt,
  endsAt,
  emptyText = "Bu aralıkta kayıt yok.",
  minColumnWidth = 136,
  rowHeight = 168,
  showCurrentTime = false,
  slotHref,
  slotStepMinutes = 30,
}: TimelineGridProps) {
  const labels = hourLabels(startsAt, endsAt);
  const startMinute = toMinutes(startsAt);
  const endMinute = toMinutes(endsAt);
  const totalMinutes = Math.max(60, endMinute - startMinute);
  const bodyHeight = Math.max(rowHeight * (labels.length - 1), 360);
  const gridColumns = `82px repeat(${columns.length}, minmax(${minColumnWidth}px, 1fr))`;
  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const currentTop =
    ((currentMinute - startMinute) / totalMinutes) * bodyHeight;
  const currentTimeLabel = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
  const currentTimeVisible =
    showCurrentTime && currentMinute >= startMinute && currentMinute <= endMinute;
  const slotMinutes = Math.max(5, slotStepMinutes);
  const slotStarts = Array.from(
    { length: Math.max(0, Math.floor((endMinute - startMinute) / slotMinutes)) },
    (_, index) => startMinute + index * slotMinutes,
  );

  return (
    <div className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-panel">
      <div className="overflow-x-auto">
        <div style={{ minWidth: 82 + columns.length * minColumnWidth }}>
          <div
            className="grid border-b border-border bg-muted/40"
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="border-r border-border px-3 py-4 text-xs font-semibold text-muted-foreground">
              Saat
            </div>
            {columns.map((column) => (
              <div
                key={column.id}
                className={cn(
                  "border-r border-border px-4 py-3 text-center last:border-r-0",
                  column.muted && "bg-muted/50",
                )}
              >
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  {column.label}
                </p>
                {column.subLabel ? (
                  <p className="mt-1 truncate text-sm font-semibold text-foreground">
                    {column.subLabel}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <div
            className="relative grid"
            style={{ gridTemplateColumns: gridColumns, height: bodyHeight }}
          >
            <div className="border-r border-border">
              {labels.slice(0, -1).map((label) => (
                <div
                  key={label}
                  className="border-b border-border px-3 pt-3 text-right text-sm font-semibold text-muted-foreground"
                  style={{ height: rowHeight }}
                >
                  {label}
                </div>
              ))}
            </div>
            {columns.map((column) => (
              <div
                key={column.id}
                className={cn(
                  "relative border-r border-border last:border-r-0",
                  column.muted && "bg-muted/30",
                )}
              >
                {labels.slice(0, -1).map((label) => (
                  <div
                    key={label}
                    className="border-b border-border"
                    style={{ height: rowHeight }}
                  />
                  ))}
                {slotHref
                  ? slotStarts.map((slotStart) => {
                      const slotEnd = slotStart + slotMinutes;
                      const busy = events
                        .filter((event) => event.columnId === column.id)
                        .some(
                          (event) =>
                            slotStart < toMinutes(event.endsAt) &&
                            slotEnd > toMinutes(event.startsAt),
                        );
                      const time = `${String(Math.floor(slotStart / 60)).padStart(
                        2,
                        "0",
                      )}:${String(slotStart % 60).padStart(2, "0")}`;
                      const href = busy ? null : slotHref(column.id, time);

                      if (!href) {
                        return null;
                      }

                      return (
                        <Link
                          key={`${column.id}-${time}`}
                          href={href}
                          className="group absolute left-2 right-2 z-[2] grid place-items-center rounded-xl border border-dashed border-transparent text-primary transition hover:border-primary/40 hover:bg-primary/5 focus-visible:border-primary/60 focus-visible:bg-primary/10"
                          style={{
                            top:
                              ((slotStart - startMinute) / totalMinutes) *
                                bodyHeight +
                              5,
                            height: Math.max(
                              34,
                              (slotMinutes / totalMinutes) * bodyHeight - 10,
                            ),
                          }}
                          aria-label={`${time} için randevu ekle`}
                        >
                          <span className="grid size-8 place-items-center rounded-full border border-primary/30 bg-surface text-primary opacity-100 shadow-sm transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                            <Plus size={16} />
                          </span>
                        </Link>
                      );
                    })
                  : null}
                {events
                  .filter((event) => event.columnId === column.id)
                  .map((event) => {
                    const top =
                      ((toMinutes(event.startsAt) - startMinute) / totalMinutes) *
                      bodyHeight;
                    const height =
                      ((toMinutes(event.endsAt) - toMinutes(event.startsAt)) /
                        totalMinutes) *
                      bodyHeight;
                    const content = (
                      <>
                        <div className="border-b border-current/15 bg-white/35 px-3 py-1.5 font-semibold">
                          {event.startsAt} - {event.endsAt}
                        </div>
                        <div className="px-3 py-2">
                          <p className="line-clamp-2 font-semibold leading-5">
                            {event.title}
                          </p>
                          {event.meta ? (
                            <p className="mt-1 truncate opacity-80">{event.meta}</p>
                          ) : null}
                        </div>
                      </>
                    );

                    const eventStyle = {
                      top: Math.max(8, top + 8),
                      height: Math.max(96, height - 10),
                      zIndex: event.subtle ? 1 : 5,
                    };

                    return event.href ? (
                      <Link
                        key={event.id}
                        href={event.href}
                        className={cn(
                          "absolute left-2 right-2 overflow-hidden rounded-2xl border text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                          toneClass[event.tone ?? "blue"],
                          event.subtle && "opacity-70 shadow-none",
                        )}
                        style={eventStyle}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute left-2 right-2 overflow-hidden rounded-2xl border text-xs shadow-sm",
                          toneClass[event.tone ?? "blue"],
                          event.subtle && "opacity-70 shadow-none",
                        )}
                        style={eventStyle}
                      >
                        {content}
                      </div>
                    );
                  })}
              </div>
            ))}
            {currentTimeVisible ? (
              <div
                className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
                style={{ top: currentTop }}
              >
                <span className="w-[82px] pr-2 text-right text-[11px] font-bold text-danger">
                  {currentTimeLabel}
                </span>
                <span className="h-px flex-1 bg-danger shadow-[0_0_0_1px_rgba(217,45,32,0.14)]" />
              </div>
            ) : null}
            {events.length === 0 ? (
              <div className="pointer-events-none absolute inset-x-24 top-8 rounded-xl border border-dashed border-border bg-background/80 p-4 text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
