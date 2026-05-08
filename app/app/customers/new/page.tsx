import Link from "next/link";

import { createCustomerAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { getTenantDataset, requireTenantContext } from "@/lib/app-data";

export default async function NewCustomerPage() {
  const { membership } = await requireTenantContext();
  const { business, branches } = await getTenantDataset(membership);
  const primaryBranch = branches[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Yeni Müşteri</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Müşteri Kaydı Aç
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          KVKK onayı zorunlu, WhatsApp izni ayrı tutulur.
        </p>
      </div>
      {primaryBranch ? (
        <form
          action={createCustomerAction}
          className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2"
        >
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="branchId" value={primaryBranch.id} />
          <label className="text-sm font-medium">
            Ad
            <input
              name="firstName"
              required
              minLength={2}
              className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
              placeholder="Müşteri adı"
            />
          </label>
          <label className="text-sm font-medium">
            Soyad
            <input
              name="lastName"
              required
              minLength={2}
              className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
              placeholder="Müşteri soyadı"
            />
          </label>
          <PhoneInput />
          <label className="text-sm font-medium">
            E-posta
            <input
              name="email"
              type="email"
              className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
              placeholder="opsiyonel"
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Not
            <textarea
              name="notes"
              maxLength={1000}
              className="mt-2 min-h-28 w-full rounded-md border border-border bg-background px-3 py-2"
              placeholder="Alerji, tercih, özel not..."
            />
          </label>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input name="kvkkConsent" type="checkbox" required className="size-4" />
              KVKK onayı alındı
            </label>
            <label className="flex items-center gap-2">
              <input name="whatsappConsent" type="checkbox" className="size-4" />
              WhatsApp hatırlatma izni
            </label>
          </div>
          <div className="flex items-end justify-end gap-2">
            <Link
              href="/app/customers"
              className="inline-flex min-h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold"
            >
              Vazgeç
            </Link>
            <ConfirmSubmitButton
              title="Müşteri kaydı oluşturulsun mu?"
              description="Aynı telefon bu işletmede tekrar açılmayacak; kayıt varsa bilgiler güncellenecek."
            >
              Müşteri kaydet
            </ConfirmSubmitButton>
          </div>
        </form>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          Müşteri kaydı için önce aktif bir şube gerekir.
        </div>
      )}
    </div>
  );
}
