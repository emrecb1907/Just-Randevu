import Link from "next/link";

import { createAppointmentAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

const appointmentStatuses = [
  "bekliyor",
  "onaylandı",
  "geldi",
  "tamamlandı",
  "iptal",
  "gelmedi",
] as const;

export default async function NewAppointmentPage() {
  const { membership } = await requireTenantContext();
  const { business, branches, customers, staffMembers, services } =
    await getTenantDataset(membership);
  const primaryBranch = branches[0];
  const canCreate =
    primaryBranch && customers.length > 0 && staffMembers.length > 0 && services.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Randevu</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Randevu Oluştur
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seçilen hizmetin o andaki süre ve fiyatı bu randevuda korunur.
        </p>
      </div>
      {canCreate ? (
        <form action={createAppointmentAction} className="grid gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="branchId" value={primaryBranch.id} />
          <label className="text-sm font-medium">Müşteri<select name="customerId" required className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{customers.map((customer) => (<option key={customer.id} value={customer.id}>{customer.name}</option>))}</select></label>
          <label className="text-sm font-medium">Personel<select name="staffId" required className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{staffMembers.map((staff) => (<option key={staff.id} value={staff.id}>{staff.name}</option>))}</select></label>
          <label className="text-sm font-medium">Hizmet<select name="serviceId" required className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{services.map((service) => (<option key={service.id} value={service.id}>{service.name} · {formatCurrency(service.priceCents)}</option>))}</select></label>
          <label className="text-sm font-medium">Zaman<input name="startsAt" type="datetime-local" required className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
          <label className="text-sm font-medium">Durum<select name="status" className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" defaultValue="bekliyor">{appointmentStatuses.map((status) => (<option key={status} value={status}>{status}</option>))}</select></label>
          <label className="text-sm font-medium">Not<input name="note" maxLength={1000} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" placeholder="Opsiyonel" /></label>
          <div className="flex items-end justify-end gap-2 md:col-span-2">
            <Link href="/app/calendar" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
            <ConfirmSubmitButton title="Randevu oluşturulsun mu?" description="Seçilen personelin bu saatte uygunluğu kontrol edilecek ve randevu takvime eklenecek.">Randevu ekle</ConfirmSubmitButton>
          </div>
        </form>
      ) : (
        <div className="rounded-[24px] border border-border bg-surface p-4 text-sm text-muted-foreground shadow-panel">Randevu eklemek için önce müşteri, personel ve hizmet kaydı gerekir.</div>
      )}
    </div>
  );
}
