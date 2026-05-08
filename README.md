# Just Randevu

Next.js + Supabase ile çok işletmeli randevu, personel, müşteri, stok ve finans yönetimi SaaS uygulaması.

## Kapsam

- Çok işletmeli yapı: `businesses`, `branches`, `profiles`, `business_members`.
- Roller: `super_admin`, `business_owner`, `admin`, `staff`.
- Rol ayrımı: `super_admin` platformu, paketleri, işletmeleri ve abonelikleri yönetir; tenant stok/satış/finans ekranlarını kullanmaz. `business_owner/admin/staff` yalnızca kendi işletme verisini yönetir.
- Paketler: Standart ve Premium.
- Modüler kullanım: `modules`, `plan_modules`, `business_modules`.
- Randevu yaşam döngüsü: müşteri, personel, şube, hizmet, fiyat snapshot, durum ve çakışma kontrolü.
- Premium modüller: stok, ürün satışı, adisyon, gelir-gider, cari, taksit, ödeme, performans, prim, anket, gelişmiş yetki, çoklu şube, paket takip.
- Responsive UI: telefon, tablet, desktop ve geniş desktop.
- Tema: light/dark, primary `#008B47`, accent `#F8CD24`.
- Form güvenliği: Zod doğrulama, +90 telefon normalizasyonu, KVKK zorunluluğu, onay modalı.

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

Gerekli ortam değişkenleri:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` sadece server tarafında kullanılır. Client component içine taşınmaz.

## Komutlar

```bash
npm run dev        # yerel geliştirme
npm run build      # production build
npm run typecheck  # strict TypeScript
npm run lint       # ESLint
npm run test       # Vitest
npm run check      # typecheck + lint + test
```

## Supabase

Migration kaynakları klasörlere ayrıldı:

```txt
supabase/migrations/tables/
supabase/migrations/functions/
supabase/migrations/policies/
supabase/migrations/seeds/
```

Supabase CLI uyumlu versioned migration dosyaları:

```txt
supabase/migrations/20260508003531_initial_schema.sql
supabase/migrations/202605080200_app_rpc.sql
supabase/migrations/202605080210_profiles_email.sql
supabase/migrations/202605080220_profile_and_bootstrap_rpc.sql
supabase/migrations/20260508093851_role_context_rpc.sql
```

Remote projeye uygulamak için:

```bash
supabase db push
```

## RPC Yaşam Döngüleri

Uygulama sayfaları server-side data layer üzerinden RPC ile veriyi çeker. Mock/fallback operasyon verisi tutulmaz; veri yoksa ekranlar boş durum gösterir. Mutasyonlar server action üzerinden RPC çağırır:

- `rpc_get_app_context`
- `rpc_get_user_context`
- `rpc_get_system_context`
- `rpc_upsert_profile`
- `rpc_bootstrap_super_admin`
- `rpc_create_business_with_owner`
- `rpc_create_staff_member`
- `rpc_create_customer`
- `rpc_create_service`
- `rpc_record_income_expense`
- `rpc_create_product_with_stock`
- `rpc_update_business_settings`
- `rpc_toggle_business_module`

## Super Admin Oluşturma

```bash
SUPABASE_URL=... \
SUPABASE_SERVICE_ROLE_KEY=... \
SUPER_ADMIN_EMAIL=... \
SUPER_ADMIN_PASSWORD=... \
node scripts/create-super-admin.mjs
```

Bu script Auth kullanıcısını oluşturur/günceller, profilini bağlar, sistem işletmesini açar, süper admin üyeliğini ve Premium modülleri hazırlar.

Super admin kullanıcısı tenant işletme sahibi olarak değerlendirilmez. `/app` sistem paneli metriklerini, `/app/super-admin` işletme/paket yönetimini gösterir. İşletme sahibi/admin/personel hesapları ise kendi işletmesinin takvim, müşteri, personel, hizmet, stok, finans ve ayar ekranlarını görür.

## Testler

Kurulu testler:

- Zod telefon, para, KVKK ve form coercion kontrolleri.
- Supabase migration/RPC varlık kontrolleri.
- Super admin ve tenant navigasyon sınırı kontrolleri.
- Runtime kaynaklarda mock data modülü/import’u bulunmaması kontrolü.
- TypeScript strict kontrol.
- ESLint sıfır warning kontrol.
- `npm audit --audit-level=moderate` güvenlik kontrolü.
- Production build kontrol.

Çalıştırma:

```bash
npm run check
npm audit --audit-level=moderate
npm run build
```

## Sayfalar

- `/`: premium pricing/welcome sayfası.
- `/login`: super admin, admin ve staff giriş ekranı.
- `/register`: online işletme kaydı.
- `/app`: super admin için platform paneli; tenant kullanıcılar için operasyon paneli.
- `/app/calendar`: personel takvimi ve admin doluluk görünümü.
- `/app/customers`: müşteri kayıtları ve KVKK/WhatsApp izinleri.
- `/app/staff`: personel profilleri ve geçici şifreyle personel oluşturma.
- `/app/services`: hizmet/işlem, süre ve fiyat yönetimi.
- `/app/stock`: ürün ve stok hareketleri.
- `/app/finance`: gelir-gider hareketleri.
- `/app/settings`: işletme ayarları ve modül aç/kapat.
- `/app/profile`: admin/staff profil düzenleme.
- `/app/super-admin`: paket, abonelik ve manuel işletme açma.
- `/kullanim-kosullari`, `/gizlilik-kvkk`: yasal metin sayfaları.

## Notlar

- Müşteri benzersizliği `business_id + phone` düzeyindedir; aynı telefon başka işletmede ayrı müşteri olabilir.
- Modül kapatıldığında veri silinmez, yalnızca menü ve işlem akışlarından gizlenir.
- Finans, stok ve prim akışları modül durumuna göre çalışacak şekilde modellenmiştir.
- `postcss` transitive güvenlik açığı için npm `overrides` ile güvenli sürüm zorlanır.
