import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { deleteCustomerAction, updateCustomerAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { Select } from "@/components/ui/select";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";
import { canManageMembership, isStaffMembership } from "@/lib/roles";

type EditCustomerPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { customerId } = await params;
  const { user, membership } = await requireTenantContext();
  const { business, branches, customers } = await getTenantDataset(membership);
  const customer = customers.find((item) => item.id === customerId);
  const primaryBranch = branches[0];
  const staffView = isStaffMembership(membership);

  if (!customer) {
    notFound();
  }

  if (!canManageMembership(membership) && customer.createdBy !== user.profile.id) {
    redirect("/app/customers?error=Bu müşteri kaydını sadece oluşturan personel düzenleyebilir.");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Müşteri Düzenleme</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {customer.name}
        </h1>
      </div>
      <form
        action={updateCustomerAction}
        className="grid gap-4 rounded-[24px] border border-border bg-surface p-4 md:grid-cols-2"
      >
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="customerId" value={customer.id} />
        <label className="text-sm font-medium">
          Ad
          <input
            name="firstName"
            required
            minLength={2}
            defaultValue={customer.firstName}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          />
        </label>
        <label className="text-sm font-medium">
          Soyad
          <input
            name="lastName"
            required
            minLength={2}
            defaultValue={customer.lastName}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          />
        </label>
        <PhoneInput defaultValue={customer.phone} />
        {staffView ? (
          <input
            type="hidden"
            name="branchId"
            value={customer.branchId || primaryBranch?.id}
          />
        ) : (
          <label className="text-sm font-medium">
            Şube
            <Select
              name="branchId"
              required
              defaultValue={customer.branchId || primaryBranch?.id}
              options={branches.map((branch) => ({
                value: branch.id,
                label: branch.name,
              }))}
            />
          </label>
        )}
        <label className="text-sm font-medium">
          E-posta
          <input
            name="email"
            type="email"
            defaultValue={customer.email}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
          />
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Not
          <textarea
            name="notes"
            maxLength={1000}
            defaultValue={customer.notes}
            className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background px-3 py-2"
          />
        </label>
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              name="kvkkConsent"
              type="checkbox"
              required
              defaultChecked={customer.kvkkConsent}
              className="size-4"
            />
            KVKK onayı alındı
          </label>
          <label className="flex items-center gap-2">
            <input
              name="whatsappConsent"
              type="checkbox"
              defaultChecked={customer.whatsappConsent}
              className="size-4"
            />
            WhatsApp hatırlatma izni
          </label>
        </div>
        <div className="flex items-end justify-end gap-2">
          <Link
            href="/app/customers"
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
          >
            Vazgeç
          </Link>
          <ConfirmSubmitButton
            title="Müşteri güncellensin mi?"
            description="Müşteri kaydı bu işletme kapsamında güncellenecek."
          >
            Güncelle
          </ConfirmSubmitButton>
        </div>
      </form>
      {staffView ? null : (
        <form action={deleteCustomerAction} className="rounded-[24px] border border-red-200 bg-red-50 p-4">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="customerId" value={customer.id} />
          <ConfirmSubmitButton
            title="Müşteri silinsin mi?"
            description="Müşteri pasife alınacak; geçmiş randevu kayıtları korunacak."
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-700"
          >
            Müşteriyi sil
          </ConfirmSubmitButton>
        </form>
      )}
    </div>
  );
}
