import Link from "next/link";

import { createStaffAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function NewStaffPage() {
  const { membership } = await requireTenantContext();
  const { business, branches } = await getTenantDataset(membership);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Personel</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Personel Hesabı Aç
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Auth kullanıcısı, profil ve işletme üyeliği birlikte oluşturulur.
        </p>
      </div>
      <form
        action={createStaffAction}
        className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="forcePasswordChange" value="true" />
        <label className="text-sm font-medium">
          Ad
          <input name="firstName" required minLength={2} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="Personel adı" />
        </label>
        <label className="text-sm font-medium">
          Soyad
          <input name="lastName" required minLength={2} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="Personel soyadı" />
        </label>
        <label className="text-sm font-medium">
          E-posta
          <input name="email" type="email" required className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="personel@justrandevu.com" />
        </label>
        <PhoneInput />
        <label className="text-sm font-medium">
          Şube
          <select name="branchId" required className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3">
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Rol
          <select name="role" className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" defaultValue="staff">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Geçici şifre
          <input name="temporaryPassword" type="password" required minLength={10} maxLength={72} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3" placeholder="En az 10 karakter" />
        </label>
        <div className="flex items-end justify-end gap-2">
          <Link href="/app/staff" className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold">
            Vazgeç
          </Link>
          <ConfirmSubmitButton
            title="Personel hesabı açılsın mı?"
            description="Personel ilk girişte şifre değiştirmeye yönlendirilecek."
          >
            Personel oluştur
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
