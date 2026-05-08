import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { deleteStaffAction, updateStaffAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { Select } from "@/components/ui/select";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership } from "@/lib/roles";

type EditStaffPageProps = {
  params: Promise<{
    memberId: string;
  }>;
};

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { memberId } = await params;
  const { membership } = await requireTenantContext();

  if (!canManageMembership(membership)) {
    redirect("/app/calendar");
  }

  const { business, branches, staffMembers } = await getTenantDataset(membership);
  const staff = staffMembers.find((item) => item.id === memberId);

  if (!staff) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Personel Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {staff.name}
        </h1>
      </div>
      <form
        action={updateStaffAction}
        className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="memberId" value={staff.id} />
        <input type="hidden" name="profileId" value={staff.profileId} />
        <label className="text-sm font-medium">
          Ad
          <input name="firstName" required minLength={2} defaultValue={staff.firstName} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" />
        </label>
        <label className="text-sm font-medium">
          Soyad
          <input name="lastName" required minLength={2} defaultValue={staff.lastName} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" />
        </label>
        <label className="text-sm font-medium">
          E-posta
          <input name="email" type="email" required defaultValue={staff.email} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3" />
        </label>
        <PhoneInput defaultValue={staff.phone} />
        <label className="text-sm font-medium">
          Şube
          <Select
            name="branchId"
            required
            defaultValue={staff.branchId}
            options={branches.map((branch) => ({
              value: branch.id,
              label: branch.name,
            }))}
          />
        </label>
        <label className="text-sm font-medium">
          Rol
          <Select
            name="role"
            defaultValue={staff.role === "admin" ? "admin" : "staff"}
            options={[
              { value: "staff", label: "Personel" },
              { value: "admin", label: "Yönetici" },
            ]}
          />
        </label>
        <div className="flex items-end justify-end gap-2 md:col-span-2">
          <Link href="/app/staff" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold">
            Vazgeç
          </Link>
          <ConfirmSubmitButton
            title="Personel güncellensin mi?"
            description="Personelin iletişim bilgileri, şubesi ve rolü birlikte güncellenecek."
          >
            Güncelle
          </ConfirmSubmitButton>
        </div>
      </form>
      {staff.role === "business_owner" ? null : (
        <form action={deleteStaffAction} className="rounded-[24px] border border-red-200 bg-red-50 p-4">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="memberId" value={staff.id} />
          <ConfirmSubmitButton
            title="Personel silinsin mi?"
            description="Personel üyeliği pasife alınacak; geçmiş randevu ve ciro kayıtları korunacak."
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700"
          >
            Personeli sil
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
