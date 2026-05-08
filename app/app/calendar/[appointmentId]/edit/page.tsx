import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteAppointmentAction, updateAppointmentAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

type EditAppointmentPageProps = {
  params: Promise<{
    appointmentId: string;
  }>;
};

const appointmentStatuses = [
  "bekliyor",
  "onaylandı",
  "geldi",
  "tamamlandı",
  "iptal",
  "gelmedi",
] as const;

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default async function EditAppointmentPage({ params }: EditAppointmentPageProps) {
  const { appointmentId } = await params;
  const { membership } = await requireTenantContext();
  const { business, branches, appointments, customers, staffMembers, services } =
    await getTenantDataset(membership);
  const appointment = appointments.find((item) => item.id === appointmentId);
  const primaryBranch = branches[0];

  if (!appointment) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Randevu Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {appointment.customer}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Randevu bilgileri ve bağlı finans hareketi birlikte güncellenir.
        </p>
      </div>
      <form action={updateAppointmentAction} className="grid gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="appointmentId" value={appointment.id} />
        <label className="text-sm font-medium">Şube<select name="branchId" required defaultValue={appointment.branchId || primaryBranch?.id} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{branches.map((branch) => (<option key={branch.id} value={branch.id}>{branch.name}</option>))}</select></label>
        <label className="text-sm font-medium">Müşteri<select name="customerId" required defaultValue={appointment.customerId} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{customers.map((customer) => (<option key={customer.id} value={customer.id}>{customer.name}</option>))}</select></label>
        <label className="text-sm font-medium">Personel<select name="staffId" required defaultValue={appointment.staffId} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{staffMembers.map((staff) => (<option key={staff.id} value={staff.id}>{staff.name}</option>))}</select></label>
        <label className="text-sm font-medium">Hizmet<select name="serviceId" required defaultValue={appointment.serviceId || services[0]?.id} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{services.map((service) => (<option key={service.id} value={service.id}>{service.name}</option>))}</select></label>
        <label className="text-sm font-medium">Zaman<input name="startsAt" type="datetime-local" required defaultValue={toDateTimeLocal(appointment.startsAt)} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">Durum<select name="status" defaultValue={appointment.status} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{appointmentStatuses.map((status) => (<option key={status} value={status}>{status}</option>))}</select></label>
        <label className="text-sm font-medium md:col-span-2">Not<input name="note" maxLength={1000} defaultValue={appointment.note} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link href="/app/calendar" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
          <ConfirmSubmitButton title="Randevu güncellensin mi?" description="Randevu bilgileri ve varsa bağlı ödeme hareketi birlikte güncellenecek.">Güncelle</ConfirmSubmitButton>
        </div>
      </form>
      <form action={deleteAppointmentAction} className="rounded-[24px] border border-red-200 bg-red-50 p-4">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="appointmentId" value={appointment.id} />
        <ConfirmSubmitButton title="Randevu silinsin mi?" description="Bu randevu ve varsa bağlı ödeme hareketi kaldırılacak. Bu işlem geri alınamaz." className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700">
          Randevuyu sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
