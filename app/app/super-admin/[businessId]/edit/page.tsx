import Link from "next/link";
import { notFound } from "next/navigation";

import {
  superAdminDeleteBusinessAction,
  superAdminUpdateBusinessAction,
} from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { SurfaceCard } from "@/components/surface-card";
import { getSystemDataset, requireSuperAdminContext } from "@/lib/app-data";
import { formatCurrency } from "@/lib/utils";

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
          Plan, iletişim, çalışma saatleri ve aktiflik durumunu yönetin.
        </p>
      </div>
      <SurfaceCard>
        <div className="grid gap-3 text-sm md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Plan</p>
            <p className="mt-1 font-semibold">
              {business.plan === "premium" ? "Premium" : "Standart"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Abonelik</p>
            <p className="mt-1 font-semibold">{business.subscriptionStatus}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Abonelik tutarı</p>
            <p className="mt-1 font-semibold">
              {formatCurrency(business.subscriptionPriceCents)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Kullanım</p>
            <p className="mt-1 font-semibold">
              {business.branchCount} şube · {business.memberCount} kullanıcı
            </p>
          </div>
        </div>
      </SurfaceCard>
      <form action={superAdminUpdateBusinessAction} className="grid gap-4 rounded-[22px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2">
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="slotMinutes" value={business.slotMinutes} />
        <label className="text-sm font-medium">İşletme adı<input name="name" required minLength={2} defaultValue={business.name} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">E-posta<input name="email" type="email" defaultValue={business.email} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <PhoneInput defaultValue={business.phone} required={false} />
        <label className="text-sm font-medium">Plan<select name="plan" defaultValue={business.plan} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3">{system.plans.map((plan) => (<option key={plan.key} value={plan.key}>{plan.name}</option>))}</select></label>
        <label className="text-sm font-medium">Açılış saati<input name="opensAt" type="time" defaultValue={business.opensAt} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="text-sm font-medium">Kapanış saati<input name="closesAt" type="time" defaultValue={business.closesAt} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="isActive" type="checkbox" defaultChecked={business.isActive} className="size-4" />
          Aktif
        </label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link href="/app/super-admin" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
          <ConfirmSubmitButton title="İşletme güncellensin mi?" description="İşletme bilgileri, paketi, çalışma saatleri ve aktiflik durumu kaydedilecek.">Güncelle</ConfirmSubmitButton>
        </div>
      </form>
      <form action={superAdminDeleteBusinessAction} className="rounded-[22px] border border-red-200 bg-red-50 p-4">
        <input type="hidden" name="businessId" value={business.id} />
        <ConfirmSubmitButton title="İşletme pasife alınsın mı?" description="İşletme listede pasif duruma alınacak. Geçmiş kayıtlar korunur, ihtiyaç olursa yeniden aktif edilebilir." className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700">
          İşletmeyi sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
