import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-zinc-200">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-xs text-cyan-500">
          ← Ana sayfa
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-4">Hakkımızda</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          <strong className="text-white">Otogar Tycoon: Peron Savaşları</strong>,
          1980’ler–90’lar Türkiye otogar kültürünü yansıtan tarayıcı tabanlı bir
          yönetim simülasyonudur. Amaç eğlence ve nostaljidir.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed mt-4">
          Geliştirici: <strong className="text-white">Ahmet Eymen Bakraç</strong>
          <br />
          Marka / laboratuvar: <strong className="text-white">Nexora Labs / Nexora AI</strong>
          <br />
          Slogan: Veri · Zekâ · Gelecek
        </p>
        <p className="text-sm text-zinc-500 mt-6">
          Oyun metinleri küfürsüz ve siyasetten uzak tutulmaya çalışılır. Geri
          bildirimleriniz geliştirmeyi şekillendirir.
        </p>
      </div>
    </div>
  );
}