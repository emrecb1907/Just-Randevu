import Link from "next/link";
import { redirect } from "next/navigation";

import { createStaffAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PasswordField } from "@/components/password-field";
import { PhoneInput } from "@/components/phone-input";
import { Select } from "@/components/ui/select";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership } from "@/lib/roles";

export default async function NewStaffPage() {
  const { membership } = await requireTenantContext();

  if (!canManageMembership(membership)) {
    redirect("/app/calendar");
  }

  const { business, branches } = await getTenantDataset(membership);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Personel</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Personel Hesabı Aç
        </h1>
      </div>
      <form
        action={createStaffAction}
        className="grid gap-4 rounded-[22px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="forcePasswordChange" value="true" />
        <label className="text-sm font-medium">
          Ad
          <input name="firstName" required minLength={2} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" placeholder="Personel adı" />
        </label>
        <label className="text-sm font-medium">
          Soyad
          <input name="lastName" required minLength={2} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" placeholder="Personel soyadı" />
        </label>
        <label className="text-sm font-medium">
          E-posta
          <input name="email" type="email" required className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" placeholder="personel@justrandevu.com" />
        </label>
        <PhoneInput />
        <label className="text-sm font-medium">
          Şube
          <Select
            name="branchId"
            required
            placeholder="Şube seçiniz"
            options={branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Personel bu şubenin takviminde ve vardiya planında görünür.
          </span>
        </label>
        <label className="text-sm font-medium">
          Rol
          <Select
            name="role"
            placeholder="Rol seçiniz"
            options={[
              { value: "staff", label: "Personel" },
              { value: "admin", label: "Yönetici" },
            ]}
          />
        </label>
        <PasswordField name="temporaryPassword" label="Geçici şifre" autoComplete="new-password" />
        <div className="flex items-end justify-end gap-2">
          <Link href="/app/staff" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">
            Vazgeç
          </Link>
          <ConfirmSubmitButton
            title="Personel hesabı açılsın mı?"
            description="Personel seçilen şubeye bağlanacak ve ilk girişinde geçici şifresini değiştirmesi istenecek."
          >
            Personel oluştur
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
