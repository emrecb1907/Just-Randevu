import Link from "next/link";
import { notFound } from "next/navigation";

import {
  superAdminDeleteBusinessAction,
  superAdminUpdateBusinessAction,
} from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { getSystemDataset, requireSuperAdminContext } from "@/lib/app-data";

type EditBusinessPageProps = {
  params: Promise<{
    businessId: string;
  }>;
};

export default async function EditBusinessPage({ params }: EditBusinessPageProps) {
  const { businessId } = await params;
  await requireSuperAdminContext();
  const system = await getSystemDataset();
  const business = system.businesses.find((item) => item.id === businessId);

  if (!business) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">İşletme Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {business.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Plan, iletişim ve aktiflik durumu Supabase üzerinde güncellenir.
        </p>
      </div>
      <form action={superAdminUpdateBusinessAction} className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2">
        <input type="hidden" name="businessId" value={business.id} />
        <label className="text-sm font-medium">İşletme adı<input name="name" required minLength={2} defaultValue={business.name} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">E-posta<input name="email" type="email" defaultValue={business.email} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" /></label>
        <PhoneInput defaultValue={business.phone} required={false} />
        <label className="text-sm font-medium">Plan<select name="plan" defaultValue={business.plan} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3">{system.plans.map((plan) => (<option key={plan.key} value={plan.key}>{plan.name}</option>))}</select></label>
        <label className="text-sm font-medium">Slot<select name="slotMinutes" defaultValue={business.slotMinutes} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3">{[5, 10, 15, 20, 30].map((slot) => (<option key={slot} value={slot}>{slot} dakika</option>))}</select></label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="isActive" type="checkbox" defaultChecked={business.isActive} className="size-4" />
          Aktif
        </label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link href="/app/super-admin" className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
          <ConfirmSubmitButton title="İşletme güncellensin mi?" description="İşletme bilgileri, planı ve aktiflik durumu Supabase üzerinde güncellenecek.">Güncelle</ConfirmSubmitButton>
        </div>
      </form>
      <form action={superAdminDeleteBusinessAction} className="rounded-lg border border-red-200 bg-red-50 p-4">
        <input type="hidden" name="businessId" value={business.id} />
        <ConfirmSubmitButton title="İşletme silinsin mi?" description="İşletme pasife alınacak; veri geçmişi korunacak." className="inline-flex min-h-10 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-sm font-semibold text-red-700">
          İşletmeyi sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
