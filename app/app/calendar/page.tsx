import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { CalendarBoard } from "@/components/calendar-board";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { isStaffMembership } from "@/lib/roles";

type CalendarPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function dateFromKey(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date();
  }

  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

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

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const { membership } = await requireTenantContext();
  const { business, appointments, staffMembers, customers, services } =
    await getTenantDataset(membership);
  const params = searchParams ? await searchParams : {};
  const selectedDate = dateFromKey(firstParam(params.date));
  const lastRangeDay = addDays(selectedDate, 6);
  const firstWeekKey = formatDateKey(selectedDate);
  const lastWeekKey = formatDateKey(lastRangeDay);
  const weekAppointments = appointments.filter(
    (appointment) =>
      appointment.dateKey >= firstWeekKey && appointment.dateKey <= lastWeekKey,
  );
  const staffView = isStaffMembership(membership);
  const canCreateAppointment =
    customers.length > 0 && staffMembers.length > 0 && services.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Randevu Yönetimi</p>
          <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
            Takvim
          </h1>
        </div>
        {canCreateAppointment ? (
          <Link
            href="/app/calendar/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm"
          >
            <Plus size={16} />
            Yeni randevu
          </Link>
        ) : null}
      </div>
      <CalendarBoard
        appointments={appointments}
        opensAt={business.opensAt}
        closesAt={business.closesAt}
        canEditAppointments={!staffView}
        selectedDate={selectedDate}
      />
      {!canCreateAppointment ? (
        <div className="rounded-[22px] border border-border bg-surface p-4 text-sm text-muted-foreground shadow-panel">
          Randevu eklemek için önce müşteri, personel ve hizmet kaydı gerekir.
        </div>
      ) : null}
      <section className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-panel">
        <div className="overflow-x-auto">
          <div className="min-w-[620px]">
            <div className={staffView ? "grid grid-cols-[0.9fr_1fr_1fr_1fr] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground" : "grid grid-cols-[0.9fr_1fr_1fr_1fr_52px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground"}>
              <span>Zaman</span>
              <span>Müşteri</span>
              <span>Personel</span>
              <span>Hizmet</span>
              {staffView ? null : <span />}
            </div>
            {weekAppointments.map((appointment) => (
              <article key={appointment.id} className={staffView ? "grid grid-cols-[0.9fr_1fr_1fr_1fr] gap-3 border-b border-border p-3 text-sm last:border-b-0" : "grid grid-cols-[0.9fr_1fr_1fr_1fr_52px] gap-3 border-b border-border p-3 text-sm last:border-b-0"}>
                <span className="font-semibold">{appointment.day} {appointment.start}</span>
                <span>{appointment.customer}</span>
                <span>{appointment.staffName}</span>
                <span>{appointment.service}</span>
                {staffView ? null : (
                  <Link href={`/app/calendar/${appointment.id}/edit`} className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground" aria-label="Randevu düzenle">
                    <Pencil size={16} />
                  </Link>
                )}
              </article>
            ))}
            {weekAppointments.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                Bu hafta randevu kaydı yok.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
