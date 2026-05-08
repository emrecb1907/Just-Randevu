import Link from "next/link";

import { superAdminCreateBusinessAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { getSystemDataset, requireSuperAdminContext } from "@/lib/app-data";

export default async function NewBusinessPage() {
  await requireSuperAdminContext();
  const system = await getSystemDataset();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni İşletme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          İşletme ve Admin Aç
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          İşletme, admin profili, merkez şube, abonelik ve modüller birlikte oluşturulur.
        </p>
      </div>
      <form action={superAdminCreateBusinessAction} className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2">
        <input type="hidden" name="kvkkConsent" value="on" />
        <label className="text-sm font-medium">İşletme adı<input name="businessName" required minLength={2} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="Yeni İşletme" /></label>
        <label className="text-sm font-medium">Admin ad soyad<input name="ownerName" required minLength={2} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="İşletme Admini" /></label>
        <label className="text-sm font-medium">Admin e-posta<input name="email" type="email" required className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="admin@isletme.com" /></label>
        <PhoneInput />
        <label className="text-sm font-medium">Plan<select name="plan" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" defaultValue="standard">{system.plans.map((plan) => (<option key={plan.key} value={plan.key}>{plan.name}</option>))}</select></label>
        <label className="text-sm font-medium">Slot<select name="slotMinutes" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" defaultValue="15">{[5, 10, 15, 20, 30].map((slot) => (<option key={slot} value={slot}>{slot} dakika</option>))}</select></label>
        <label className="text-sm font-medium">Geçici şifre<input name="password" type="password" required minLength={10} maxLength={72} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="En az 10 karakter" /></label>
        <div className="flex items-end justify-end gap-2">
          <Link href="/app/super-admin" className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold">Vazgeç</Link>
          <ConfirmSubmitButton title="İşletme manuel açılsın mı?" description="Süper admin akışı işletme, admin profili, merkez şube, abonelik ve modülleri oluşturur.">İşletme aç</ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
