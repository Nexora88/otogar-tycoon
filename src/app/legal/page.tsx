import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 antialiased">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#0f0d0b] to-[#070605]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12 pb-24">
        <Link href="/" className="text-sm text-amber-500/90 hover:text-amber-400">
          ← Açılış
        </Link>

        <p className="mt-8 text-[11px] tracking-[0.35em] text-amber-600 font-bold">
          NEXORA · YASAL
        </p>
        <h1 className="mt-2 text-3xl font-black">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
            Yasal bilgilendirme
          </span>
        </h1>
        <p className="mt-2 text-xs text-stone-500">
          Otogar Tycoon · Son güncelleme: 2026 · Özet metin (oyun içi)
        </p>

        <div className="mt-10 space-y-8 text-sm text-stone-400 leading-relaxed">
          <Section title="1. Simülasyon — gerçek para yok">
            Otogar Tycoon eğlence amaçlı bir tarayıcı oyunudur. Oyun içi kasa,
            bilet, borç, aidat ve benzeri değerler <strong className="text-stone-200">sanal</strong>
            dır. Gerçek para ile alım-satım, kumar, bahis veya yatırım yoktur.
            Kazanç vaadi verilmez.
          </Section>

          <Section title="2. Hizmetin niteliği">
            Oyun “olduğu gibi” sunulur. Erken erişim / geliştirme sürecinde
            özellikler değişebilir, sıfırlanabilir veya geçici olarak
            kesilebilir. Kritik ilerleme için hesap oluşturman önerilir; misafir
            oturumları sınırlı olabilir.
          </Section>

          <Section title="3. Hesap ve iletişim">
            Kayıt sırasında e-posta ve seçtiğin ad / firma adı işlenebilir
            (Supabase veya benzeri altyapı). Şifreni başkasıyla paylaşma.
            Topluluk alanlarında (lobi, sohbet) küfür, nefret, yasa dışı teşvik
            ve kişisel veri ifşası yasaktır; ihlalde kısıtlama uygulanabilir.
          </Section>

          <Section title="4. Fikri mülkiyet">
            Otogar Tycoon adı, görsel dil, metinler ve Nexora markası geliştiriciye
            aittir. İzinsiz kopyalama, yeniden satma veya markayı yanıltıcı
            kullanma yasaktır. Oyundaki Atatürk portresi ve kamuya açık tarihi
            imgeler saygı çerçevesinde, eğitim/simülasyon bağlamında kullanılır.
          </Section>

          <Section title="5. Üçüncü taraf">
            Giriş/kayıt ve canlı oda için Supabase vb. hizmetler kullanılabilir.
            Bu sağlayıcıların kendi gizlilik politikaları geçerlidir. Vercel veya
            barındırma tarafındaki loglar teknik gerekliliklerle sınırlıdır.
          </Section>

          <Section title="6. Sorumluluk sınırı">
            Oyundan doğan dolaylı kayıp, veri kaybı veya kesinti için geliştirici
            azami ölçüde yasal sınırlar içinde sorumluluk kabul eder. İnternet
            bağlantın, cihazın ve tarayıcın senin sorumluluğundadır.
          </Section>

          <Section title="7. Yaş ve uygun içerik">
            Oyun genel kitleye yönelik yönetim simülasyonudur; şiddet veya cinsel
            içerik amaçlanmaz. Yine de ebeveyn denetimi önerilir. Bölgesel yasal
            yaş sınırlarına uy.
          </Section>

          <Section title="8. İletişim">
            Geliştirici: <strong className="text-stone-200">Ahmet Eymen Bakraç</strong>
            {" · "}
            Nexora Labs. Proje sayfası ve destek kanalları açılış / hakkında
            bölümünden duyurulur.
          </Section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-300 to-orange-500"
          >
            Hesap oluştur
          </Link>
          <Link
            href="/about"
            className="px-5 py-2.5 rounded-xl border border-stone-700 text-sm text-stone-400"
          >
            Hakkında
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-stone-200 font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}