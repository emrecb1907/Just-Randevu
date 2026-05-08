import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, SlidersHorizontal } from "lucide-react";

type PolicySection = {
  title: string;
  body?: string[];
  items?: string[];
};

const cookieTypes = [
  {
    title: "Zorunlu ve Operasyonel",
    description:
      "Oturum güvenliği, kimlik doğrulama, yetkilendirme, yük dengeleme, dolandırıcılık önleme, tercih kaydı ve çerez tercihinin hatırlanması için kullanılır. Bu teknolojiler devre dışı bırakılamaz.",
  },
  {
    title: "Fonksiyonel",
    description:
      "Tema, dil, panel görünümü, sık kullanılan işletme veya şube seçimi gibi deneyimi kolaylaştıran tercihleri hatırlamak için kullanılabilir.",
  },
  {
    title: "Analitik ve Performans",
    description:
      "Platform trafiğini, sayfa performansını, hata kayıtlarını ve özellik kullanımını toplu olarak anlamaya yardımcı olur. Bu veriler hizmet kalitesini ve ürün kararlarını iyileştirmek için kullanılabilir.",
  },
  {
    title: "Pazarlama ve Reklam",
    description:
      "İzin verilmesi halinde kampanya performansını ölçmek, yeniden hedefleme yapmak, ilgi alanlarına uygun teklifleri göstermek ve reklam sıklığını yönetmek için kullanılabilir.",
  },
];

const sections: PolicySection[] = [
  {
    title: "1. Politikanın Amacı",
    body: [
      "Bu Çerezler, SDK'ler ve Web İzleme Politikası, [PLATFORM_ADI] tarafından sunulan randevu, müşteri, personel, şube, stok, finans, abonelik ve bildirim yönetimi hizmetleri sırasında cihaz verilerinin nasıl işlendiğini açıklamak amacıyla hazırlanmıştır.",
      "Politika; web sitesi ziyaretçileri, demo kullanıcıları, işletme yöneticileri, personeller ve Platform üzerinden hizmet alan diğer kullanıcılar için geçerlidir.",
      "Bu metin yayına alınmadan önce [ŞİRKET_UNVANI], [ALAN_ADI], [DESTEK_EPOSTA], [YÜRÜRLÜK_TARİHİ] ve varsa üçüncü taraf servis listesi gibi placeholder alanları gerçek bilgilerle tamamlanmalıdır.",
    ],
  },
  {
    title: "2. Çerez Nedir?",
    body: [
      "Çerezler, Platformu ziyaret ettiğinizde veya kullandığınızda tarayıcınız ya da cihazınız üzerinde saklanan küçük metin dosyalarıdır. Çerezler sayesinde oturumun güvenli şekilde sürdürülmesi, tercihlerin hatırlanması ve temel özelliklerin doğru çalışması mümkün olur.",
      "Bazı çerezler yalnızca tarayıcı oturumu boyunca tutulur ve tarayıcı kapatıldığında silinir. Bazı çerezler ise belirli bir saklama süresi boyunca cihazınızda kalır ve sonraki ziyaretlerde tercihlerinizi hatırlamamızı sağlar.",
      "Tarayıcınızı çerezleri tamamen reddedecek şekilde ayarlayabilirsiniz. Ancak zorunlu çerezlerin engellenmesi, giriş yapma, randevu yönetme, panel tercihlerini koruma veya güvenli oturum sürdürme gibi temel işlevlerin bozulmasına neden olabilir.",
    ],
  },
  {
    title: "3. Benzer Teknolojiler",
    body: [
      "Çerezler, cihaz verilerini çevrimiçi olarak işlemenin tek yöntemi değildir. Web işaretçileri, izleme pikselleri, piksel etiketleri, log kayıtları, yerel depolama alanları ve benzeri teknikler de kullanılabilir.",
      "Bu teknolojiler, Platformdaki sayfalar arasında trafik akışını anlamamıza, hata ve performans sorunlarını incelememize, bir kampanya bağlantısından gelip gelmediğinizi ölçmemize ve hizmet güvenliğini artırmamıza yardımcı olabilir.",
      "Çoğu benzer teknoloji çerezlerle birlikte çalışır. Bu nedenle çerezleri reddetmeniz, bu teknolojilerin ölçüm, hatırlama veya kişiselleştirme işlevlerini de etkileyebilir.",
    ],
  },
  {
    title: "4. SDK Kullanımı",
    body: [
      "Platformun web veya mobil uygulama sürümlerinde yazılım geliştirme kitleri (SDK'ler) kullanılabilir. SDK'ler; cihaz türü, uygulama sürümü, oturum bilgisi, hata kaydı ve Platformla etkileşim gibi teknik verileri toplayabilir.",
      "Örneğin bir işletme yöneticisinin randevu oluşturma akışında nerede hata aldığını, bir personel kullanıcısının takvim ekranını hangi cihazdan kullandığını veya bir kampanya bağlantısının kayıt akışına etkisini anlamak için SDK verilerinden yararlanılabilir.",
      "SDK'ler yalnızca ilgili hizmetin çalışması, güvenliği, performansı, analitiği veya izin verilen pazarlama faaliyetleri için gerekli olduğu ölçüde kullanılır.",
    ],
  },
  {
    title: "5. Kullandığımız Teknoloji Türleri",
    body: [
      "Çerezleri ve benzer teknolojileri aşağıdaki kategorilerde sınıflandırıyoruz. Zorunlu ve operasyonel teknolojiler Platformun çalışması için gereklidir; diğer kategoriler tercihlerinize veya ilgili mevzuatta aranan şartlara göre kullanılır.",
    ],
  },
  {
    title: "6. Çerezleri Devre Dışı Bırakma",
    body: [
      "Zorunlu olmayan çerezleri, Platformda gösterilen çerez tercih barı üzerinden reddedebilir veya hepsini kabul edebilirsiniz. Reddet seçeneği kullanıldığında fonksiyonel, analitik, performans, pazarlama ve reklam amaçlı çerezler devre dışı bırakılır; operasyonel çerezler çalışmaya devam eder.",
      "Tarayıcı ayarlarınız üzerinden çerezleri silebilir, tüm çerezleri engelleyebilir veya belirli siteler için izinleri sınırlandırabilirsiniz. Çerezleri silmeniz, daha önce verdiğiniz tercihin cihazınızdan kaldırılmasına ve tercih barının yeniden gösterilmesine neden olabilir.",
      "Çerez ve web izleme teknolojilerini devre dışı bırakmanız artık hiçbir bildirim, reklam veya uygulama içeriği görmeyeceğiniz anlamına gelmez. Kişiselleştirilmiş içerikler yerine genel içerikler veya kişiselleştirilmemiş duyurular görebilirsiniz.",
    ],
  },
  {
    title: "7. Tercihlerin Saklanması",
    body: [
      "Çerez tercihinizi hatırlamak için tarayıcınıza yalnızca bu kararı kaydeden operasyonel bir tercih kaydı yerleştirilir. Bu kayıt, analitik veya pazarlama amacıyla değil, tercih ekranının gereksiz şekilde tekrar gösterilmemesi için kullanılır.",
      "Teknik nedenlerle tercih kaydı, yalnızca tercih yaptığınız tarayıcı ve cihaz için geçerlidir. Farklı bir tarayıcı veya cihaz kullandığınızda, gizli sekmede gezindiğinizde ya da çerezleri sildiğinizde tercihinizi yeniden belirlemeniz gerekebilir.",
    ],
  },
  {
    title: "8. Üçüncü Taraf Servisler",
    body: [
      "Platform; barındırma, güvenlik, hata izleme, analitik, ödeme, mesajlaşma, e-posta, WhatsApp, SMS, reklam ölçümü veya müşteri destek araçları gibi üçüncü taraf hizmetlerden yararlanabilir.",
      "Bu servisler kendi çerezlerini veya benzer teknolojilerini kullanabilir. Yayına geçmeden önce kullanılan servislerin adı, amacı, sağlayıcısı, saklama süresi ve yurt dışı aktarım bilgisi [ÇEREZ_TABLOSU_URL] veya bu politika altında ayrıca listelenmelidir.",
    ],
  },
  {
    title: "9. Politika Değişiklikleri",
    body: [
      "Hizmet Sağlayıcı; mevzuat değişiklikleri, ürün güncellemeleri, yeni entegrasyonlar veya çerez kullanımındaki değişiklikler nedeniyle bu politikayı güncelleyebilir.",
      "Güncel politika Platformda yayınlandığı tarihte yürürlüğe girer. Önemli değişikliklerde kullanıcı arayüzü, e-posta veya kayıtlı iletişim kanalları üzerinden ek bilgilendirme yapılabilir.",
    ],
  },
  {
    title: "10. İletişim",
    body: [
      "Çerezler, SDK'ler, web izleme tercihleri veya kişisel verilerin işlenmesiyle ilgili sorularınızı [DESTEK_EPOSTA] adresine ya da İletişim sayfasındaki kanallara iletebilirsiniz.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Çerezler Politikası | Just Randevu",
  description:
    "Just Randevu çerez, SDK ve web izleme teknolojileri hakkında bilgilendirme.",
};

export default function CookiesPolicyPage() {
  return (
    <main className="min-h-dvh bg-white text-[#111111] dark:bg-[#07100B] dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6 lg:px-0">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-md bg-[#111111] text-xs font-bold text-white dark:bg-white dark:text-[#07100B]">
            JR
          </span>
          Just Randevu
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-xs font-semibold shadow-sm transition hover:border-primary dark:border-white/10 dark:bg-white/10"
        >
          <ArrowLeft size={14} />
          Ana sayfa
        </Link>
      </header>

      <section className="relative isolate overflow-hidden px-5 pb-12 pt-8 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute left-1/2 top-36 -z-10 h-72 w-[980px] -translate-x-1/2 rounded-[100%] opacity-90 blur-3xl dark:opacity-55"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(0,139,71,0.42), transparent 34%), radial-gradient(circle at 50% 40%, rgba(248,205,36,0.72), transparent 34%), radial-gradient(circle at 80% 50%, rgba(0,139,71,0.42), transparent 34%)",
          }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-md bg-[#111111] text-white shadow-lg dark:bg-white dark:text-[#07100B]">
            <Cookie size={20} />
          </div>
          <p className="mt-5 text-xs font-black uppercase text-primary">
            Çerez ve izleme teknolojileri
          </p>
          <h1 className="mt-3 font-display text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl">
            Çerezler, SDK'ler ve Web İzleme Politikası
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
            Bu politika, Platformda kullanılan zorunlu operasyonel çerezleri,
            tercihlerinize bağlı teknolojileri ve bunları nasıl
            yönetebileceğinizi açıklar.
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4 text-left text-sm leading-6 text-neutral-700 dark:text-neutral-200">
            <p>
              Zorunlu operasyonel çerezler reddedilemez. Diğer teknolojiler
              çerez barındaki tercihinize göre kabul edilir veya reddedilir.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-20 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-0">
        <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 lg:sticky lg:top-5">
          <p className="text-xs font-black uppercase text-neutral-500">
            İçindekiler
          </p>
          <nav className="mt-4 grid gap-2">
            {sections.map((section, index) => (
              <a
                key={section.title}
                href={`#bolum-${index + 1}`}
                className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-primary/10 hover:text-primary dark:text-neutral-300"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="mb-10 rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <SlidersHorizontal size={18} />
              </span>
              <div>
                <h2 className="font-display text-2xl font-black">
                  Tercih özeti
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  Çerez barında "Reddet" seçildiğinde zorunlu ve operasyonel
                  çerezler korunur; fonksiyonel, analitik, performans,
                  pazarlama ve reklam amaçlı teknolojiler devre dışı bırakılır.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-2">
            {cookieTypes.map((type) => (
              <section
                key={type.title}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="text-base font-black text-primary">
                  {type.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {type.description}
                </p>
              </section>
            ))}
          </div>

          <div className="grid gap-10">
            {sections.map((section, index) => (
              <section
                key={section.title}
                id={`bolum-${index + 1}`}
                className="scroll-mt-8"
              >
                <h2 className="font-display text-2xl font-black">
                  {section.title}
                </h2>
                <div className="mt-4 grid gap-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                  {section.body?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.items ? (
                  <ul className="mt-5 grid gap-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6">
                        <span className="mt-2 size-2.5 shrink-0 rounded-sm bg-gradient-to-br from-primary to-accent" />
                        <span className="text-neutral-700 dark:text-neutral-200">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-primary/25 bg-primary/5 p-5 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
            <p className="font-bold text-primary">Yasal kontrol notu</p>
            <p className="mt-2">
              Bu metin, Platformun mevcut ürün kapsamına göre uyarlanmış genel
              bir taslaktır. Yayına alınmadan önce kullanılan üçüncü taraf
              araçlar, saklama süreleri, açık rıza akışları ve yurt dışı aktarım
              değerlendirmeleriyle birlikte hukuki kontrolden geçirilmelidir.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
