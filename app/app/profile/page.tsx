import { updateProfileAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PhoneInput } from "@/components/phone-input";
import { requireUserContext } from "@/lib/app-data";

export default async function ProfilePage() {
  const { profile } = await requireUserContext();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Profilim</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          Hesap ve Profil
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Admin ve staff kendi profilini düzenler; admin kendi işletmesindeki
          staff profillerini görebilir.
        </p>
      </div>
      <form
        action={updateProfileAction}
        className="grid gap-4 rounded-lg border border-border bg-surface p-4 md:grid-cols-2"
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
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            defaultValue={profile.firstName}
          />
        </label>
        <label className="text-sm font-medium">
          Soyad
          <input
            name="lastName"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            defaultValue={profile.lastName}
          />
        </label>
        <label className="text-sm font-medium">
          E-posta
          <input
            name="email"
            type="email"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            defaultValue={profile.email}
          />
        </label>
        <PhoneInput defaultValue={profile.phone} />
        <label className="text-sm font-medium">
          Avatar URL
          <input
            name="avatarUrl"
            type="url"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            placeholder="https://..."
            defaultValue={profile.avatarUrl}
          />
        </label>
        <label className="text-sm font-medium">
          Tema
          <select
            name="theme"
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3"
            defaultValue={profile.theme}
          >
            <option value="system">Sistem</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
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
