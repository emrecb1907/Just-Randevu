import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

type TermsSection = {
  title: string;
  body?: string[];
  items?: string[];
};

const definitions = [
  {
    term: "Hizmet Sağlayıcı",
    description:
      "[ŞİRKET_UNVANI], merkezi [MERKEZ_ADRES] adresinde bulunan ve [TİCARET_SİCİL_NO] ticaret sicil numarası ile kayıtlı şirketi ifade eder.",
  },
  {
    term: "Platform",
    description:
      "Hizmet Sağlayıcı tarafından işletilen [ALAN_ADI] alan adlı web sitesi, mobil veya web uygulaması, yönetim paneli ve bunlara bağlı dijital servisleri ifade eder.",
  },
  {
    term: "Kullanıcı",
    description:
      "Platforma erişen, hesap oluşturan, randevu oluşturan, randevu yöneten veya Platformdaki hizmetlerden yararlanan gerçek ya da tüzel kişi temsilcisidir.",
  },
  {
    term: "İşletme",
    description:
      "Kuaför, berber, güzellik salonu, klinik, muayenehane veya benzeri hizmet veren ve Platform üzerinden operasyonlarını yöneten ticari birimi ifade eder.",
  },
  {
    term: "İşletme Yöneticisi",
    description:
      "İşletme hesabını oluşturan veya işletme adına personel, şube, hizmet, müşteri ve randevu kayıtlarını yönetmeye yetkili kullanıcıdır.",
  },
  {
    term: "Personel",
    description:
      "İşletme Yöneticisi tarafından oluşturulan, kendi yetkileri dahilinde takvim, randevu, müşteri ve profil bilgilerine erişebilen kullanıcıdır.",
  },
  {
    term: "Müşteri",
    description:
      "İşletmeden hizmet almak üzere randevu kaydı oluşturulan gerçek kişidir. Müşteri kayıtları işletme bazında tutulur.",
  },
  {
    term: "Hesap",
    description:
      "Kullanıcının e-posta, telefon, şifre ve yetki bilgileriyle Platforma erişmesini sağlayan kullanıcı kaydıdır.",
  },
  {
    term: "Hizmet",
    description:
      "Platform üzerinden sunulan randevu yönetimi, takvim, müşteri takibi, personel yönetimi, stok, finans, adisyon, bildirim ve benzeri dijital işlevlerin tamamıdır.",
  },
  {
    term: "Modül",
    description:
      "Paket ve işletme tercihlerine göre açılıp kapatılabilen, Platform içindeki bağımsız özellik kümelerini ifade eder.",
  },
];

const sections: TermsSection[] = [
  {
    title: "A. Genel Hükümler",
    body: [
      "Bu Kullanım Koşulları, Platformun kullanımı, hesap oluşturulması, işletme ve personel yönetimi, randevu kayıtları, paket ve modül kullanımı ile Platform üzerinden sağlanan diğer dijital hizmetlere ilişkin temel kuralları düzenler.",
      "Platformu ziyaret eden, hesap oluşturan, işletme kaydı açan, personel hesabı oluşturan veya herhangi bir hizmetten yararlanan kişiler bu koşulları okumuş, anlamış ve kabul etmiş sayılır.",
      "Hizmet Sağlayıcı, Platformu bu koşullara, yürürlükteki mevzuata ve Platform içinde yayınlanabilecek ek politika, bilgilendirme ve sözleşmelere uygun şekilde sunar.",
    ],
  },
  {
    title: "B. Hizmetlerin Kapsamı",
    body: [
      "Platform, çok işletmeli randevu ve operasyon yönetimi amacıyla geliştirilmiş bir yazılım hizmetidir. Kullanıcılar, yetkileri ve paket kapsamları dahilinde Platformdaki özelliklerden yararlanabilir.",
      "Hizmetlerin bir bölümü tüm paketlerde sunulabilir; bazı modüller ise yalnızca belirli paketlerde veya işletme bazında aktif edilmesi halinde kullanılabilir. Pakette bulunmayan veya işletmede kapalı olan modüller kullanıcı arayüzünde gösterilmeyebilir.",
      "Hizmet Sağlayıcı, Platformun kapsamını, paket limitlerini, ücretli özellikleri, entegrasyonları ve kullanım koşullarını makul bildirim yapmak kaydıyla değiştirme hakkını saklı tutar.",
    ],
    items: [
      "Randevu, takvim, müşteri ve personel yönetimi",
      "Şube, mesai, hizmet ve işlem tanımları",
      "İşletme paketleri, modül açma ve kapatma işlemleri",
      "Stok, ürün satışı, adisyon, gelir-gider ve performans modülleri",
      "Randevu hatırlatma ve bilgilendirme bildirimleri",
      "Raporlama, kullanım takibi, audit kayıtları ve yönetim panelleri",
    ],
  },
  {
    title: "C. Hizmetlerden Yararlanma Şartları",
    body: [
      "Platformdan yararlanmak için internet erişimi, güncel bir web tarayıcısı, geçerli iletişim bilgileri ve ilgili kullanıcı rolü için oluşturulmuş bir hesap gerekir.",
      "Kullanıcı, kayıt sırasında ve Platformu kullanırken verdiği bilgilerin güncel, doğru ve kendisine ya da temsil ettiği işletmeye ait olduğunu kabul eder. Yanlış, eksik veya üçüncü kişilere ait bilgilerin kullanılmasından doğacak sonuçlardan ilgili kullanıcı sorumludur.",
      "Hizmet Sağlayıcı, bakım, güvenlik, güncelleme, altyapı çalışması, zorunlu teknik müdahale veya kendi kontrolü dışında gelişen nedenlerle Platforma erişimi geçici olarak sınırlayabilir.",
      "Platform, işletmelerin randevu ve operasyon süreçlerini yönetmesi için yazılım altyapısı sağlar. Hizmet Sağlayıcı, işletme ile müşteri arasındaki fiili hizmetin ifasından, randevuya gidilmemesinden veya işletmeden kaynaklanan hizmet aksaklıklarından sorumlu değildir.",
    ],
  },
  {
    title: "D. Kayıtlar, İçerikler ve Kullanıcı Verileri",
    body: [
      "İşletme Yöneticisi, kendi işletmesine ait şube, personel, hizmet, müşteri, randevu, ürün ve finans kayıtlarını Platforma girebilir. Girilen kayıtların hukuka uygunluğu, doğruluğu ve güncelliği ilgili işletmenin sorumluluğundadır.",
      "Kullanıcılar Platforma hukuka, dürüstlük kurallarına, kişilik haklarına, ticari itibara, fikri mülkiyet haklarına ve üçüncü kişilerin gizliliğine aykırı içerik ekleyemez.",
      "Hizmet Sağlayıcı, hukuka, bu koşullara veya Platform güvenliğine aykırı olduğunu değerlendirdiği içerikleri kaldırabilir, erişimi sınırlayabilir veya ilgili kullanıcı hesabı hakkında işlem yapabilir.",
    ],
    items: [
      "Hakaret, tehdit, küfür, ayrımcılık, nefret söylemi veya yanıltıcı beyan içeren kayıtlar yasaktır.",
      "Yetkisiz reklam, spam, manipülatif yorum, gerçek dışı müşteri veya randevu kaydı oluşturulamaz.",
      "Üçüncü kişilerin özel hayatına, sağlık bilgilerine, finansal bilgilerine veya iletişim verilerine aykırı kullanım yapılamaz.",
      "İşletme, müşteri verilerini yalnızca hukuka uygun amaçlarla ve gerekli izinlere sahip olarak işlemelidir.",
    ],
  },
  {
    title: "E. İşletme, Şube ve Personel Yönetimi",
    body: [
      "İşletme kaydı, Platformdaki online kayıt akışıyla İşletme Yöneticisi tarafından veya Hizmet Sağlayıcının yetkili yönetim paneli üzerinden oluşturulabilir.",
      "Personel hesaplarının oluşturulması, yetkilendirilmesi, şube ile ilişkilendirilmesi ve pasife alınması işletme içindeki yetkili kullanıcıların sorumluluğundadır.",
      "Personel, yalnızca kendisine verilen yetkiler çerçevesinde Platformu kullanabilir. Başka bir kullanıcıya ait hesapla işlem yapılması, hesap paylaşılması veya yetkisiz erişim sağlanması yasaktır.",
      "Paket limitleri, şube ve personel sayısı bakımından uygulanır. Limit aşımı halinde Platform yeni kayıt oluşturmayı engelleyebilir veya paket yükseltme talep edebilir.",
    ],
  },
  {
    title: "F. Randevu, Bildirim ve Entegrasyonlar",
    body: [
      "Randevu kayıtlarında müşteri adı, telefon numarası, tarih, saat, personel, hizmet türü, süre, fiyat, not ve durum gibi bilgiler tutulabilir. İşletme, bu bilgilerin doğru girilmesinden sorumludur.",
      "Randevu hatırlatma, WhatsApp, e-posta, SMS veya benzeri bildirimler yalnızca ilgili modülün aktif olması, teknik entegrasyonların çalışması ve gerekli iletişim izinlerinin bulunması halinde gönderilebilir.",
      "Bildirimlerin üçüncü taraf altyapılar üzerinden iletilmesi nedeniyle teslim, gecikme, başarısız gönderim veya operatör kaynaklı sorunlar Hizmet Sağlayıcının tam kontrolünde olmayabilir.",
      "İşletme, müşterilerine bildirim göndermeden önce gerekli açık rıza, ticari elektronik ileti izni veya mevzuatta aranan diğer şartları sağlamakla yükümlüdür.",
    ],
  },
  {
    title: "G. Abonelik, Ücretlendirme ve Fesih",
    body: [
      "Platform, ücretsiz deneme, aylık abonelik, yıllık abonelik veya Hizmet Sağlayıcı tarafından belirlenen farklı ticari modellerle sunulabilir. Güncel paket, limit ve ücret bilgileri Platformda veya teklif dokümanlarında gösterilir.",
      "Abonelik, ödeme sağlayıcısı veya Hizmet Sağlayıcı tarafından onaylandığında başlar. Ödeme başarısızlığı, abonelik iptali, sürenin sona ermesi veya paket düşürme halinde bazı özelliklere erişim kısıtlanabilir.",
      "Kullanıcı veya İşletme Yöneticisi, hesabını kapatma veya aboneliğini sonlandırma talebini Platformdaki ilgili alanlardan ya da [DESTEK_EPOSTA] adresi üzerinden iletebilir.",
      "Hizmet Sağlayıcı, Kullanıcının bu koşullara veya mevzuata aykırı davranması, güvenlik riski oluşturması, yetkisiz kullanım yapması veya Platformun itibarını zedeleyen işlemlerde bulunması halinde hesabı askıya alabilir veya hizmeti sonlandırabilir.",
      "Hesap veya abonelik sona erse bile, mevzuat gereği saklanması gereken kayıtlar, ödeme kayıtları, audit logları ve güvenlik kayıtları yasal süreler boyunca tutulabilir.",
    ],
  },
  {
    title: "H. Sorumluluk ve Garanti Sınırları",
    body: [
      "Platform, makul özen gösterilerek kesintisiz ve güvenli çalışacak şekilde sunulmaya çalışılır. Bununla birlikte internet, bulut altyapısı, üçüncü taraf entegrasyonlar, ödeme kuruluşları, mesajlaşma servisleri veya kullanıcı cihazlarından kaynaklanan aksaklıklar yaşanabilir.",
      "Hizmet Sağlayıcı, Platformdaki işletme, personel, müşteri, hizmet, fiyat, stok veya finans kayıtlarının doğruluğunu garanti etmez. Bu kayıtları oluşturan veya yöneten taraf ilgili işletmedir.",
      "Kullanıcı, Platformu kullanırken yaptığı işlemlerden, verdiği bilgilerden, yetkisiz paylaşımlardan, müşteri verilerinin hukuka aykırı işlenmesinden ve üçüncü kişilerin haklarını ihlal eden kullanımlardan sorumludur.",
      "Hizmet Sağlayıcının ücretli hizmetlere ilişkin sorumluluğu, yürürlükteki zorunlu mevzuat hükümleri saklı kalmak üzere, ilgili abonelik dönemi için ödenen ücretle sınırlı olabilir.",
    ],
  },
  {
    title: "I. Şikayet, Destek ve İade Süreci",
    body: [
      "Platformla ilgili teknik sorun, öneri, itiraz, fatura, ödeme veya abonelik talepleri [DESTEK_EPOSTA] adresine iletilebilir. Hizmet Sağlayıcı, talepleri makul süre içinde inceleyip kayıtlı iletişim kanalları üzerinden yanıtlamaya çalışır.",
      "Kullanıcı, hizmete ilişkin itiraz veya iade talebini işlem tarihinden itibaren makul süre içinde iletmelidir. Talebin değerlendirilebilmesi için hesap bilgisi, ödeme tarihi, paket bilgisi ve talebin dayanağı açıkça belirtilmelidir.",
      "İade ve iptal talepleri, ilgili ödeme sağlayıcısı kuralları, abonelik şartları, tüketici mevzuatı ve ticari kullanıcılar bakımından uygulanabilir sözleşme hükümleri çerçevesinde değerlendirilir.",
      "Hizmet Sağlayıcı, yalnızca kullanım koşullarının okunmaması, yanlış anlaşılması veya kullanıcıdan kaynaklanan hatalı işlem nedeniyle yapılan talepleri reddedebilir.",
    ],
  },
  {
    title: "J. Son Hükümler",
    body: [
      "Hizmet Sağlayıcı, bu Kullanım Koşullarını mevzuat değişiklikleri, ürün güncellemeleri, güvenlik gereklilikleri veya ticari ihtiyaçlar doğrultusunda güncelleyebilir. Güncel metin Platformda yayınlandığı tarihte yürürlüğe girer.",
      "Kullanıcı, kayıtlı iletişim bilgilerinin güncel olmamasından doğabilecek bildirim eksikliklerinden kendisi sorumludur.",
      "Bu Kullanım Koşulları Türkiye Cumhuriyeti kanunlarına tabidir. Zorunlu yetki kuralları saklı kalmak üzere, uyuşmazlıkların çözümünde [YETKİLİ_MAHKEME_VE_İCRA_DAİRELERİ] yetkilidir.",
      "Bu metin, Platformda yayınlandığı tarihten itibaren yürürlüğe girer ve önceki kullanım koşulları metinlerinin yerine geçer.",
    ],
  },
];

export default function TermsPage() {
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
            <FileText size={20} />
          </div>
          <p className="mt-5 text-xs font-black uppercase text-primary">
            Yasal metin şablonu
          </p>
          <h1 className="mt-3 font-display text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl">
            Kullanım Koşulları
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
            Bu metin Platform kullanımı, işletme hesapları, personel yetkileri,
            randevu kayıtları, abonelikler ve modüller için hazırlanmış yeniden
            yazılmış bir taslak metindir.
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4 text-left text-sm leading-6 text-neutral-700 dark:text-neutral-200">
            <p>
              Placeholder alanları yayına çıkmadan önce doldurulmalıdır:
              <strong> [ŞİRKET_UNVANI]</strong>, <strong>[ALAN_ADI]</strong>,{" "}
              <strong>[DESTEK_EPOSTA]</strong>,{" "}
              <strong>[YÜRÜRLÜK_TARİHİ]</strong>.
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
            {sections.map((section) => (
              <a
                key={section.title}
                href={`#${section.title.slice(0, 1).toLowerCase()}`}
                className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-primary/10 hover:text-primary dark:text-neutral-300"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
          <div className="mb-10 rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-black">Tanımlar</h2>
            <dl className="mt-5 grid gap-4">
              {definitions.map((definition) => (
                <div
                  key={definition.term}
                  className="grid gap-1 border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0 dark:border-white/10 sm:grid-cols-[180px_1fr]"
                >
                  <dt className="text-sm font-black text-primary">
                    {definition.term}
                  </dt>
                  <dd className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {definition.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-10">
            {sections.map((section) => (
              <section
                key={section.title}
                id={section.title.slice(0, 1).toLowerCase()}
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
            <p className="font-bold text-primary">Yürürlük</p>
            <p className="mt-2">
              Bu Kullanım Koşulları [YÜRÜRLÜK_TARİHİ] tarihinde yayınlanmak
              üzere hazırlanmıştır. Yayına alınmadan önce şirket bilgileri, alan
              adı, destek e-postası, mahkeme yetkisi ve varsa ödeme/abonelik
              ekleri tamamlanmalıdır.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
