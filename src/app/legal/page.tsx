import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-zinc-200">
      <div className="max-w-2xl mx-auto px-4 py-12 prose-invert">
        <Link href="/" className="text-xs text-cyan-500">
          ← Ana sayfa
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Yasal bilgilendirme</h1>

        <h2 className="text-lg font-semibold text-white mt-8">1. Simülasyon</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Otogar Tycoon yalnızca bir <strong>oyun / simülasyondur</strong>.
          Gerçek para yatırma, çekme, bahis veya kumar yoktur. Oyun içi ₺ birimleri
          sanal ve eğlence amaçlıdır; hiçbir mali değer taşımaz.
        </p>

        <h2 className="text-lg font-semibold text-white mt-8">2. Hesap adları</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Kullanıcı adları küfür, hakaret, nefret söylemi, yasa dışı teşvik veya
          siyasi propaganda içeremez. Uygunsuz isimler silinebilir veya hesap
          kısıtlanabilir.
        </p>

        <h2 className="text-lg font-semibold text-white mt-8">3. İçerik</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Oyun atmosferi dönemsel nostalji sunar; şiddet veya suç ögeleri kurmaca
          ve abartılıdır. Gerçek hayatta yasa dışı davranış teşvik edilmez.
        </p>

        <h2 className="text-lg font-semibold text-white mt-8">4. Veri</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Misafir oyun tarayıcıda (localStorage) saklanır. Hesap oluşturursanız
          kimlik doğrulama için Supabase kullanılabilir. Gerekli teknik veriler
          dışında satılmaz.
        </p>

        <h2 className="text-lg font-semibold text-white mt-8">5. Sorumluluk</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Hizmet “olduğu gibi” sunulur. Kayıp, kesinti veya kayıt silinmesinden
          doğan zararlardan geliştirici sorumlu tutulamaz. 18 yaş altı oyuncular
          veli gözetiminde oynamalıdır.
        </p>

        <p className="text-xs text-zinc-600 mt-10">
          Son güncelleme: 2026 · Ahmet Eymen Bakraç / Nexora Labs
        </p>
      </div>
    </div>
  );
}