import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { CalendarBoard } from "@/components/calendar-board";
import { StaffDensityBoard } from "@/components/staff-density-board";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function CalendarPage() {
  const { membership } = await requireTenantContext();
  const { appointments, staffMembers, customers, services } = await getTenantDataset(membership);
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
          <p className="mt-2 text-sm text-muted-foreground">
            Çakışma kontrolü Supabase tarafında; randevu oluşturma ve düzenleme
            ayrı akışlarda yapılır.
          </p>
        </div>
        {canCreateAppointment ? (
          <Link
            href="/app/calendar/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-white shadow-sm"
          >
            <Plus size={16} />
            Yeni randevu
          </Link>
        ) : null}
      </div>
      <CalendarBoard appointments={appointments} />
      <StaffDensityBoard
        appointments={appointments}
        staffMembers={staffMembers}
      />
      {!canCreateAppointment ? (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          Randevu eklemek için önce müşteri, personel ve hizmet kaydı gerekir.
        </div>
      ) : null}
      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[1fr_1fr_52px] border-b border-border bg-muted/50 p-3 text-xs font-semibold text-muted-foreground md:grid-cols-[0.9fr_1fr_1fr_1fr_52px]">
          <span>Zaman</span>
          <span>Müşteri</span>
          <span className="hidden md:block">Personel</span>
          <span className="hidden md:block">Hizmet</span>
          <span />
        </div>
        {appointments.map((appointment) => (
          <article key={appointment.id} className="grid grid-cols-[1fr_1fr_52px] gap-3 border-b border-border p-3 text-sm last:border-b-0 md:grid-cols-[0.9fr_1fr_1fr_1fr_52px]">
            <span className="font-semibold">{appointment.day} {appointment.start}</span>
            <span>{appointment.customer}</span>
            <span className="hidden md:block">{appointment.staffName}</span>
            <span className="hidden md:block">{appointment.service}</span>
            <Link href={`/app/calendar/${appointment.id}/edit`} className="grid size-10 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground" aria-label="Randevu düzenle">
              <Pencil size={16} />
            </Link>
          </article>
        ))}
        {appointments.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            Henüz randevu kaydı yok.
          </div>
        ) : null}
      </section>
    </div>
  );
}
