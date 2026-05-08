import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

type PrivacySection = {
  title: string;
  body?: string[];
  items?: string[];
};

const dataCategories = [
  "Kimlik bilgileri: ad, soyad, kullanıcı rolü, işletme yetkilisi bilgileri",
  "İletişim bilgileri: e-posta, telefon numarası, adres ve bildirim tercihleri",
  "Hesap bilgileri: kullanıcı adı, parola doğrulama kayıtları, oturum ve yetki bilgileri",
  "İşletme bilgileri: işletme adı, şube, personel, hizmet, paket ve modül tercihleri",
  "Randevu bilgileri: müşteri adı, telefon, tarih, saat, hizmet türü, personel, not ve durum bilgileri",
  "Finans ve operasyon bilgileri: ödeme, abonelik, adisyon, stok, gelir-gider ve fatura süreçlerine ilişkin kayıtlar",
  "Teknik veriler: IP adresi, cihaz, tarayıcı, log, çerez, hata kaydı ve kullanım analitiği bilgileri",
  "İletişim izinleri: ticari elektronik ileti, hatırlatma, WhatsApp, e-posta veya SMS tercihleri",
];

const sections: PrivacySection[] = [
  {
    title: "1. Politikanın Amacı",
    body: [
      "Bu Gizlilik ve KVKK Politikası, [PLATFORM_ADI] tarafından sunulan randevu, işletme yönetimi, müşteri takibi, personel yönetimi, abonelik ve modül hizmetleri kapsamında kişisel verilerin hangi amaçlarla işlendiğini açıklar.",
      "Politika; işletme yöneticileri, personeller, müşteriler, ziyaretçiler, demo kullanıcıları ve Platformla iletişime geçen diğer kişilerin kişisel verilerine ilişkin bilgilendirme sağlamak amacıyla hazırlanmıştır.",
      "Bu metin bir taslaktır. Yayına alınmadan önce [ŞİRKET_UNVANI], [ALAN_ADI], [DESTEK_EPOSTA], [VERİ_SORUMLUSU_ADRESİ] ve diğer placeholder alanları gerçek bilgilerle tamamlanmalıdır.",
    ],
  },
  {
    title: "2. Veri Sorumlusu",
    body: [
      "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu [ŞİRKET_UNVANI] olup, merkez adresi [VERİ_SORUMLUSU_ADRESİ] olarak belirtilmiştir.",
      "Veri sorumlusu ile gizlilik, KVKK başvuruları, veri işleme faaliyetleri ve iletişim izinleri hakkında [DESTEK_EPOSTA] adresi üzerinden iletişime geçilebilir.",
    ],
  },
  {
    title: "3. Hukuki Dayanak",
    body: [
      "Kişisel veriler; 6698 sayılı Kişisel Verilerin Korunması Kanunu, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun, 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun, Türk Ticaret Kanunu, Vergi Usul Kanunu, Türk Borçlar Kanunu ve ilgili ikincil mevzuat kapsamında işlenebilir.",
      "Veriler; sözleşmenin kurulması veya ifası, hukuki yükümlülüklerin yerine getirilmesi, bir hakkın tesisi veya korunması, meşru menfaat, açık rıza ve ilgili kişinin kendisi tarafından alenileştirilmiş olması gibi hukuki sebeplere dayanılarak işlenir.",
      "Açık rızaya dayalı işleme faaliyetlerinde kullanıcı, rızasını her zaman geri çekebilir. Rızanın geri çekilmesi, geri çekme tarihinden önce hukuka uygun olarak yapılan işleme faaliyetlerini etkilemez.",
    ],
  },
  {
    title: "4. İşlenen Kişisel Veriler",
    body: [
      "Platformun kullanım şekline, kullanıcının rolüne, aktif edilen modüllere ve entegrasyonlara göre farklı veri kategorileri işlenebilir. Her işletme, kendi müşterileri ve personelleri bakımından yalnızca gerekli ve hukuka uygun verileri Platforma girmelidir.",
    ],
    items: dataCategories,
  },
  {
    title: "5. Kişisel Verilerin İşlenme Amaçları",
    body: [
      "Kişisel veriler, Platformun güvenli ve doğru çalışması, hesap oluşturma, işletme kaydı, personel yönetimi, randevu oluşturma, hizmet ve müşteri kayıtlarının tutulması, paket ve abonelik süreçlerinin yönetilmesi için işlenir.",
      "Veriler ayrıca destek taleplerinin yanıtlanması, teknik hata ve güvenlik kayıtlarının incelenmesi, yetkisiz erişimin önlenmesi, mevzuattan doğan yükümlülüklerin yerine getirilmesi, faturalandırma ve ödeme süreçlerinin yürütülmesi için kullanılabilir.",
      "İletişim izni bulunan kişilere randevu hatırlatmaları, ürün duyuruları, kullanım bildirimleri, kampanya veya memnuniyet anketi gönderilebilir. İletişim tercihi kullanıcı panelinden veya [DESTEK_EPOSTA] üzerinden değiştirilebilir.",
    ],
  },
  {
    title: "6. İşletme ve Müşteri Verileri",
    body: [
      "Platform çok işletmeli bir yapıdadır. Müşteri kayıtları işletme bazında tutulur; bir işletmenin müşteri verileri başka bir işletmenin erişimine açılmaz.",
      "İşletme Yöneticisi, müşteri ve personel verilerini Platforma girerken gerekli aydınlatma, açık rıza, ticari elektronik ileti izni ve diğer hukuki yükümlülükleri yerine getirmekten sorumludur.",
      "Personel kullanıcıları yalnızca kendilerine tanımlanan yetki çerçevesinde müşteri, randevu, takvim veya işletme kayıtlarına erişebilir.",
    ],
  },
  {
    title: "7. Kişisel Verilerin Aktarılması",
    body: [
      "Kişisel veriler, hizmetin sunulması için gerekli olduğu ölçüde barındırma sağlayıcıları, ödeme kuruluşları, mesajlaşma ve bildirim servisleri, e-posta altyapısı, teknik destek sağlayıcıları, analitik hizmetleri, muhasebe ve hukuk danışmanları ile paylaşılabilir.",
      "Yurt dışına veri aktarımı gerektiren servislerde, yürürlükteki KVKK hükümleri ve ilgili Kurul kararları çerçevesinde gerekli hukuki mekanizmalar değerlendirilir.",
      "Yetkili kamu kurum ve kuruluşlarından usulüne uygun talep gelmesi halinde kişisel veriler, kanuni yükümlülüklerin yerine getirilmesi amacıyla ilgili makamlarla paylaşılabilir.",
    ],
  },
  {
    title: "8. Çerez ve Benzeri Teknolojiler",
    body: [
      "Platform, oturumun güvenli şekilde sürdürülebilmesi, kullanıcı tercihlerini hatırlamak, tema seçimi, dil tercihi, performans ölçümü, hata analizi ve hizmet kalitesini geliştirmek amacıyla çerez ve benzeri teknolojiler kullanabilir.",
      "Zorunlu çerezler Platformun çalışması için gereklidir. Analitik, performans, pazarlama veya yeniden hedefleme çerezleri ise kullanıcının tercihine veya ilgili mevzuatta aranan hukuki şartlara göre kullanılabilir.",
      "Tarayıcı ayarları üzerinden çerezler silinebilir, engellenebilir veya sınırlandırılabilir. Bazı çerezlerin kapatılması halinde Platformdaki oturum, güvenlik, tercih kaydı veya bazı panel işlevleri beklenen şekilde çalışmayabilir.",
    ],
  },
  {
    title: "9. Üçüncü Taraf Analitik ve Reklam Araçları",
    body: [
      "Platform, kullanım istatistiklerini anlamak, performansı izlemek, pazarlama kampanyalarını ölçmek veya reklam hedeflemelerini iyileştirmek için üçüncü taraf analitik ve reklam araçlarından yararlanabilir.",
      "Bu araçlar; IP adresi, cihaz bilgisi, tarayıcı bilgisi, ziyaret edilen sayfalar, oturum süresi ve benzeri teknik verileri çerez veya benzeri teknolojiler aracılığıyla işleyebilir.",
      "Yeniden hedefleme, özel hedef kitle veya benzeri reklam faaliyetlerinde e-posta veya telefon gibi bilgiler yalnızca hukuka uygun izinlerin bulunması halinde ve mümkün olduğunca güvenli eşleştirme yöntemleri kullanılarak işlenir.",
      "Aktif edilecek üçüncü taraf servislerin listesi, yayına geçmeden önce [ÇEREZ_POLİTİKASI_URL] veya ilgili tercih panelinde ayrıca gösterilmelidir.",
    ],
  },
  {
    title: "10. Veri Güvenliği",
    body: [
      "Hizmet Sağlayıcı, kişisel verilere yetkisiz erişimi, hukuka aykırı işlemeyi, veri kaybını, değiştirmeyi veya ifşayı önlemek amacıyla makul teknik ve idari tedbirleri uygular.",
      "Bu tedbirler; erişim yetkilendirmesi, rol bazlı izinler, kayıt altına alma, güvenli oturum yönetimi, şifreleme, yedekleme, ağ güvenliği, güvenlik güncellemeleri ve personel farkındalığı süreçlerini içerebilir.",
      "Alınan tedbirlere rağmen kişisel verilerin hukuka aykırı şekilde üçüncü kişilerin eline geçtiğinin tespit edilmesi halinde, yürürlükteki mevzuata uygun şekilde ilgili kişiler ve Kişisel Verileri Koruma Kurulu bilgilendirilir.",
    ],
  },
  {
    title: "11. Saklama Süreleri ve İmha",
    body: [
      "Kişisel veriler, işleme amacı için gerekli süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı, saklama ve ispat yükümlülükleri dikkate alınarak saklanır.",
      "Ticari elektronik ileti onay kayıtları, ileti içeriği, gönderim kayıtları, abonelik, ödeme, fatura, log ve güvenlik kayıtları ilgili mevzuatta belirtilen süreler boyunca tutulabilir.",
      "Saklama süresi sona erdiğinde veya işleme amacı ortadan kalktığında kişisel veriler silinir, yok edilir veya anonim hale getirilir.",
    ],
  },
  {
    title: "12. İlgili Kişinin Hakları",
    body: [
      "KVKK madde 11 kapsamında ilgili kişiler, veri sorumlusuna başvurarak kendileriyle ilgili kişisel veri işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme hakkına sahiptir.",
      "İlgili kişiler ayrıca yurt içinde veya yurt dışında aktarılan üçüncü kişileri öğrenme, eksik veya yanlış işlenen verilerin düzeltilmesini isteme, gerekli şartlarda silme veya yok etme talep etme, bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme haklarını kullanabilir.",
      "Kişisel verilerin münhasıran otomatik sistemlerle analiz edilmesi sonucunda aleyhe bir sonuç ortaya çıkmasına itiraz edilebilir ve kanuna aykırı işleme sebebiyle zarar doğması halinde zararın giderilmesi talep edilebilir.",
    ],
  },
  {
    title: "13. Başvuru Yöntemi",
    body: [
      "KVKK kapsamındaki talepler [DESTEK_EPOSTA] adresine, Platformdaki hesap ayarları bölümünden veya [BAŞVURU_ADRESİ] üzerinden iletilebilir.",
      "Başvuruda ad, soyad, iletişim bilgisi, talebin konusu, kimlik doğrulaması için gerekli bilgiler ve varsa ilgili hesap ya da işletme bilgisi bulunmalıdır.",
      "Başvurular, talebin niteliğine göre en kısa sürede ve en geç yasal süreler içinde sonuçlandırılır. Talebin ayrıca maliyet gerektirmesi halinde mevzuatta belirtilen ücret talep edilebilir.",
    ],
  },
  {
    title: "14. İletişim İzni",
    body: [
      "Kullanıcı, açık rıza ve iletişim izni vermesi halinde; ürün duyuruları, kampanyalar, kullanım önerileri, memnuniyet anketleri, randevu hatırlatmaları ve benzeri bilgilendirmelerin e-posta, SMS, telefon, WhatsApp veya benzeri kanallar üzerinden gönderilmesine izin verebilir.",
      "İletişim izni her zaman geri alınabilir. İzin geri alındığında ticari içerikli gönderimler durdurulur; ancak zorunlu sistem bildirimleri, güvenlik uyarıları, fatura, abonelik ve hizmet kullanımıyla ilgili operasyonel bildirimler gönderilmeye devam edebilir.",
    ],
  },
  {
    title: "15. Uygulanacak Hukuk ve Yetki",
    body: [
      "Bu Gizlilik ve KVKK Politikası Türkiye Cumhuriyeti kanunlarına tabidir.",
      "Politikanın uygulanmasından doğabilecek uyuşmazlıklarda, zorunlu yetki kuralları saklı kalmak üzere [YETKİLİ_MAHKEME_VE_İCRA_DAİRELERİ] yetkilidir.",
    ],
  },
  {
    title: "16. Politika Değişiklikleri",
    body: [
      "Hizmet Sağlayıcı, mevzuat değişiklikleri, ürün güncellemeleri, güvenlik gereklilikleri veya veri işleme faaliyetlerindeki değişiklikler nedeniyle bu politikayı güncelleyebilir.",
      "Güncel politika Platformda yayınlandığı tarihte yürürlüğe girer. Önemli değişikliklerde kayıtlı iletişim kanalları üzerinden ek bilgilendirme yapılabilir.",
    ],
  },
];

export default function PrivacyKvkkPage() {
  return (
    <main className="min-h-dvh bg-white text-[#111111] dark:bg-[#07100B] dark:text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6 lg:px-0">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold"
        >
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
            <ShieldCheck size={20} />
          </div>
          <p className="mt-5 text-xs font-black uppercase text-primary">
            KVKK ve gizlilik şablonu
          </p>
          <h1 className="mt-3 font-display text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl">
            Gizlilik ve KVKK Politikası
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
            Bu politika, Platformda işlenen kişisel veriler, çerezler, veri
            aktarımı, saklama süreleri, ilgili kişi hakları ve iletişim izinleri
            hakkında yeniden yazılmış bir taslak metindir.
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4 text-left text-sm leading-6 text-neutral-700 dark:text-neutral-200">
            <p>
              Yayına çıkmadan önce placeholder alanları doldurun:
              <strong> [ŞİRKET_UNVANI]</strong>, <strong>[ALAN_ADI]</strong>,{" "}
              <strong>[DESTEK_EPOSTA]</strong>,{" "}
              <strong>[VERİ_SORUMLUSU_ADRESİ]</strong>.
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
            <h2 className="font-display text-2xl font-black">
              Veri işleme özeti
            </h2>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
              <p>
                Veri sorumlusu: <strong>[ŞİRKET_UNVANI]</strong>
              </p>
              <p>
                Platform adresi: <strong>[ALAN_ADI]</strong>
              </p>
              <p>
                İletişim ve başvuru adresi: <strong>[DESTEK_EPOSTA]</strong>
              </p>
              <p>
                Yürürlük tarihi: <strong>[YÜRÜRLÜK_TARİHİ]</strong>
              </p>
            </div>
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
            <p className="font-bold text-primary">Önemli not</p>
            <p className="mt-2">
              Bu metin genel bir KVKK ve gizlilik politikası taslağıdır. Yayına
              alınmadan önce veri işleme envanteri, çerez tercih paneli, üçüncü
              taraf servis listesi, saklama süreleri ve açık rıza metinleriyle
              birlikte hukuki kontrolden geçirilmelidir.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
