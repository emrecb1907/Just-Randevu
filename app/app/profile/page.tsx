import { redirect } from "next/navigation";

import { updateProfileAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { Select } from "@/components/ui/select";
import { requireUserContext } from "@/lib/app-data";
import { isStaffMembership } from "@/lib/roles";

export default async function ProfilePage() {
  const { profile, tenantMembership } = await requireUserContext();

  if (tenantMembership && isStaffMembership(tenantMembership)) {
    redirect("/app/calendar");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Profilim</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Hesap ve Profil
        </h1>
      </div>
      <form
        action={updateProfileAction}
        className="grid gap-4 rounded-[24px] border border-border bg-surface p-5 shadow-panel md:grid-cols-2"
      >
        <input
          type="hidden"
          name="profileId"
          value={profile.id}
        />
        <label className="text-sm font-medium">
          Ad
          <input
            name="firstName"
            required
            minLength={2}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            defaultValue={profile.firstName}
          />
        </label>
        <label className="text-sm font-medium">
          Soyad
          <input
            name="lastName"
            required
            minLength={2}
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            defaultValue={profile.lastName}
          />
        </label>
        <label className="text-sm font-medium">
          E-posta
          <input
            name="email"
            type="email"
            required
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            defaultValue={profile.email}
          />
        </label>
        <PhoneInput defaultValue={profile.phone} />
        <label className="text-sm font-medium">
          Avatar URL
          <input
            name="avatarUrl"
            type="url"
            className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3"
            placeholder="https://..."
            defaultValue={profile.avatarUrl}
          />
        </label>
        <label className="text-sm font-medium">
          Tema
          <Select
            name="theme"
            required
            defaultValue={profile.theme === "dark" ? "dark" : "light"}
            options={[
              { value: "light", label: "Açık" },
              { value: "dark", label: "Koyu" },
            ]}
          />
        </label>
        <div className="flex items-end md:col-span-2">
          <ConfirmSubmitButton
            title="Profil güncellensin mi?"
            description="Profil bilgileri hesap ve işletme üyeliği ekranlarında kullanılacak."
          >
            Profilimi kaydet
          </ConfirmSubmitButton>
        </div>
      </form>
    </div>
  );
}
