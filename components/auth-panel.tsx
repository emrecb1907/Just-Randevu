"use client";

import Link from "next/link";
import {
  Apple,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { loginAction, registerBusinessAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { PasswordField } from "@/components/password-field";

type AuthMode = "login" | "register";

const fieldBase =
  "mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-[#111111] shadow-[0_1px_0_rgba(17,17,17,0.03)] outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/10 dark:text-white";
const phoneShell =
  "mt-2 flex min-h-11 overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm text-[#111111] shadow-[0_1px_0_rgba(17,17,17,0.03)] transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:border-white/10 dark:bg-white/10 dark:text-white";
const phoneInputClass =
  "min-w-0 flex-1 bg-transparent px-4 outline-none placeholder:text-neutral-400";

const visualRows = [
  { time: "09:00", title: "Hizmet", staff: "Personel", tone: "blue" },
  { time: "12:00", title: "Bakım", staff: "Ekip", tone: "green" },
  { time: "14:30", title: "Görüşme", staff: "Uzman", tone: "yellow" },
];

function normalizeVisiblePhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("90")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

export function AuthPanel({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "register";
  const formSpacing = isRegister ? "mt-4 space-y-2.5" : "mt-6 space-y-3";
  const dividerSpacing = isRegister ? "my-3" : "my-4";

  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-y-auto bg-[#EEF0F2] px-4 py-4 text-[#111111] dark:bg-[#07100B] dark:text-white sm:px-6 lg:p-3 xl:p-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,139,71,0.18), transparent 34%), radial-gradient(circle at 50% 10%, rgba(248,205,36,0.22), transparent 32%), radial-gradient(circle at 80% 24%, rgba(0,139,71,0.18), transparent 34%)",
        }}
        aria-hidden="true"
      />

      <section className="w-full max-w-7xl rounded-2xl border border-white/70 bg-white/40 p-2 shadow-[0_30px_100px_rgba(17,24,39,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:min-h-[calc(100dvh-1.5rem)] xl:min-h-[calc(100dvh-2rem)]">
        <div className="grid overflow-hidden rounded-xl bg-white p-5 dark:bg-[#0B1710] lg:min-h-[calc(100dvh-2.5rem)] lg:grid-cols-[1fr_1.08fr] lg:gap-4 lg:p-4 xl:min-h-[calc(100dvh-3rem)] xl:gap-5 xl:p-5">
          <div className="flex min-h-[640px] flex-col px-2 py-4 sm:px-8 lg:min-h-0 lg:px-8 lg:py-2 xl:px-10">
            <Link
              href="/"
              className="flex items-center gap-3 text-base font-bold"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-[#111111] text-[11px] font-black text-white dark:bg-white dark:text-[#07100B]">
                JR
              </span>
              Just Randevu
            </Link>

            <div className="mx-auto flex w-full max-w-[410px] flex-1 flex-col justify-center py-8 lg:py-1 xl:py-2">
              <div className="text-center">
                <h1 className="font-display text-[38px] font-black leading-[1.02] tracking-normal xl:text-[42px]">
                  {isRegister ? "İşletme kaydı" : "Tekrar hoş geldiniz"}
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-neutral-500 dark:text-neutral-300">
                  {isRegister
                    ? "İşletmenizi oluşturun, paketinizi seçin ve personel takvimini kurmaya başlayın."
                    : "Süper admin, işletme admini ve personel hesapları için tek giriş ekranı."}
                </p>
              </div>

              <form
                action={isRegister ? registerBusinessAction : loginAction}
                className={formSpacing}
              >
                {isRegister ? (
                  <>
                    <input type="hidden" name="plan" value="premium" />
                    <input type="hidden" name="slotMinutes" value="10" />
                    <label className="block text-xs font-bold">
                      İşletme adı
                      <input
                        name="businessName"
                        type="text"
                        required
                        className={fieldBase}
                        placeholder="İşletme adı"
                      />
                    </label>
                    <label className="block text-xs font-bold">
                      Yetkili ad soyad
                      <div className="relative">
                        <input
                          name="ownerName"
                          type="text"
                          required
                          className={`${fieldBase} pr-11`}
                          placeholder="Yetkili ad soyad"
                        />
                        <UserRound
                          size={18}
                          className="absolute right-4 top-[calc(50%+4px)] -translate-y-1/2 text-neutral-400"
                          aria-hidden="true"
                        />
                      </div>
                    </label>
                  </>
                ) : null}

                <label className="block text-xs font-bold">
                  E-posta
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      className={`${fieldBase} pr-11`}
                      placeholder="eposta@alanadi.com"
                    />
                    <Mail
                      size={18}
                      className="absolute right-4 top-[calc(50%+4px)] -translate-y-1/2 text-neutral-400"
                      aria-hidden="true"
                    />
                  </div>
                </label>

                {isRegister ? (
                  <label className="block text-xs font-bold">
                    Telefon
                    <div className={phoneShell}>
                      <span className="grid place-items-center border-r border-neutral-200 bg-neutral-50 px-3 text-sm font-black text-neutral-500 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                        +90
                      </span>
                      <input
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        required
                        maxLength={16}
                        pattern="[1-9][0-9]{9}"
                        title="Telefon numarası 10 haneli olmalı. Örnek: 5321234567"
                        onInput={(event) => {
                          const input = event.currentTarget;
                          input.value = normalizeVisiblePhone(input.value);
                        }}
                        className={phoneInputClass}
                        placeholder="5321234567"
                      />
                      <span className="grid place-items-center px-3 text-neutral-400">
                        <Phone size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </label>
                ) : null}

                <PasswordField
                  name="password"
                  label="Şifre"
                  minLength={isRegister ? 10 : 8}
                  placeholder="••••••••••"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="block text-xs font-bold"
                  inputClassName="rounded-xl border-neutral-200 bg-white px-4 text-[#111111] shadow-[0_1px_0_rgba(17,17,17,0.03)] dark:border-white/10 dark:bg-white/10 dark:text-white"
                />

                {!isRegister ? (
                  <div className="flex items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-300">
                    <label className="flex items-center gap-2">
                      <span className="grid size-4 place-items-center rounded-sm border border-neutral-300 bg-white dark:border-white/20 dark:bg-white/10" />
                      Beni hatırla
                    </label>
                    <Link href="/login" className="font-semibold text-primary">
                      Şifremi unuttum
                    </Link>
                  </div>
                ) : null}

                {isRegister ? (
                  <label className="flex items-start gap-2 text-xs leading-5 text-neutral-500 dark:text-neutral-300">
                    <input
                      name="kvkkConsent"
                      type="checkbox"
                      required
                      className="mt-1 size-4 rounded border-neutral-300"
                    />
                    Kullanım koşullarını ve KVKK aydınlatma metnini okudum,
                    işletme kaydı için onaylıyorum.
                  </label>
                ) : null}

                {isRegister ? (
                  <ConfirmSubmitButton
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,139,71,0.28)] transition hover:bg-primary/90"
                    title="İşletme kaydı oluşturulsun mu?"
                    description="İşletme, merkez şube, yetkili hesabı ve paket modülleri oluşturulacak. Kaydı tamamlayınca panele yönlendirileceksiniz."
                  >
                    İşletmeyi oluştur
                  </ConfirmSubmitButton>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,139,71,0.28)] transition hover:bg-primary/90"
                  >
                    Giriş yap
                    <ArrowRight size={16} />
                  </button>
                )}
              </form>

              <div
                className={`${dividerSpacing} flex items-center gap-4 text-xs text-neutral-400`}
              >
                <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
                {isRegister ? "veya hızlı başla" : "veya giriş yap"}
                <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
                >
                  <span className="font-black text-primary">G</span>
                  Google
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
                >
                  <Apple size={17} />
                  Apple
                </button>
              </div>

              <p className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-300">
                {isRegister ? "Zaten hesabınız var mı?" : "Hesabınız yok mu?"}{" "}
                <Link
                  href={isRegister ? "/login" : "/register"}
                  className="font-bold text-primary"
                >
                  {isRegister ? "Giriş yapın." : "Şimdi kaydolun."}
                </Link>
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-2 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
              <span>Copyright © 2026 Just Randevu.</span>
              <Link
                href="/gizlilik-kvkk"
                className="transition hover:text-primary"
              >
                Gizlilik politikası
              </Link>
            </div>
          </div>

          <AuthVisual isRegister={isRegister} />
        </div>
      </section>
    </main>
  );
}

function AuthVisual({ isRegister }: { isRegister: boolean }) {
  return (
    <aside className="relative hidden h-full min-h-0 overflow-hidden rounded-xl bg-primary px-7 py-5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] lg:flex lg:flex-col lg:justify-center xl:px-10 xl:py-7">
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute -left-28 top-8 size-[460px] rounded-full border-[72px] border-white/20" />
        <div className="absolute -right-20 top-72 size-[330px] rounded-full border-[64px] border-white/20" />
        <div className="absolute bottom-20 right-24 h-52 w-72 rounded-[42px] border border-dashed border-white/30" />
        <div className="absolute left-32 top-0 h-full w-28 bg-black/10" />
        <div className="absolute bottom-0 right-0 h-60 w-96 bg-accent/15" />
      </div>

      <div className="relative z-10 max-w-xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
          <CalendarDays size={15} />
          {isRegister ? "Yeni işletme kurulumu" : "Operasyon paneli"}
        </p>
        <h2 className="font-display text-[34px] font-black leading-[1.02] tracking-normal xl:text-[40px]">
          {isRegister
            ? "Randevu düzeninizi ilk günden net kurun."
            : "Ekibinizi ve randevularınızı zahmetsiz yönetin."}
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-5 text-white/80">
          Takvim, personel, müşteri, stok ve finans modülleri tek panelde.
          İhtiyacınız olan özellikleri açın, kalanı sakin bırakın.
        </p>
      </div>

      <div className="relative z-10 mt-4 xl:mt-5">
        <div className="w-full rounded-xl border border-white/25 bg-white/95 p-3.5 text-[#111111] shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur xl:p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-primary">MAYIS 2026</p>
              <p className="text-2xl font-black leading-none">Takvim</p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold">
                Hafta
              </span>
              <span className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white">
                Randevu ekle
              </span>
            </div>
          </div>

          <div className="relative min-h-[178px] overflow-hidden rounded-2xl border border-neutral-200 bg-white xl:min-h-[198px]">
            <div className="grid grid-cols-[68px_repeat(4,1fr)] border-b border-neutral-200 text-center text-xs font-bold text-neutral-500">
              <div className="border-r border-neutral-200 py-2.5" />
              {["Pzt", "Sal", "Çar", "Per"].map((day) => (
                <div
                  key={day}
                  className="border-r border-neutral-200 py-2.5 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[68px_repeat(4,1fr)] text-xs text-neutral-500">
              {["09:00", "10:00", "11:00", "12:00"].map((hour) => (
                <div key={hour} className="contents">
                  <div className="border-b border-r border-neutral-200 px-3 py-3 xl:py-3.5">
                    {hour}
                  </div>
                  {[0, 1, 2, 3].map((cell) => (
                    <div
                      key={`${hour}-${cell}`}
                      className="min-h-9 border-b border-r border-neutral-200 last:border-r-0 xl:min-h-10"
                    />
                  ))}
                </div>
              ))}
            </div>

            {visualRows.map((row, index) => (
              <div
                key={row.title}
                className={
                  row.tone === "blue"
                    ? "absolute left-[30%] top-[54px] w-[38%] rounded-xl border border-sky-200 bg-sky-50 p-2.5 text-sky-900 shadow-sm xl:top-[58px] xl:p-3"
                    : row.tone === "green"
                      ? "absolute right-[9%] top-[103px] w-[36%] rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-900 shadow-sm xl:top-[110px] xl:p-3"
                      : "absolute bottom-2 right-[2%] w-[34%] rounded-xl border border-accent bg-accent/15 p-2.5 text-[#3D2B00] shadow-sm xl:bottom-3 xl:p-3"
                }
              >
                <p className="text-xs font-black xl:text-sm">{row.title}</p>
                <p className="mt-1 text-xs font-bold">
                  {row.time} · {row.staff}
                </p>
                {index === 1 ? (
                  <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-primary text-white">
                    <Check size={12} />
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-2 left-5 grid w-36 gap-1.5 rounded-2xl border border-white/35 bg-white/90 p-2.5 text-[#111111] shadow-[0_20px_55px_rgba(0,0,0,0.18)] xl:bottom-3 xl:left-7 xl:w-40 xl:p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">Bugün</span>
            <BarChart3 size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-black">24</p>
          <p className="text-xs text-neutral-500">randevu</p>
          <div className="h-2 rounded-full bg-neutral-100">
            <div className="h-full w-4/5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </aside>
  );
}
