import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 antialiased">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#0f0d0b] to-[#070605]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,#f59e0b22,transparent_55%)]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12 pb-20">
        <Link
          href="/"
          className="text-sm text-amber-500/90 hover:text-amber-400 transition"
        >
          ← Açılış
        </Link>

        <p className="mt-8 text-[11px] tracking-[0.35em] text-amber-600 font-bold">
          NEXORA · HİKÂYE
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-red-500">
            Hakkımızda
          </span>
        </h1>

        <div className="mt-8 space-y-5 text-sm text-stone-400 leading-relaxed">
          <p>
            <strong className="text-stone-100">Otogar Tycoon: Peron Savaşları</strong>
            , 1980’ler–90’lar Anadolu otogarının tozunu, çayını, korna ve esnaf
            hesabını tarayıcıya taşıyan bir yönetim simülasyonudur.
          </p>
          <p>
            Geliştirici{" "}
            <strong className="text-amber-200/90">Ahmet Eymen Bakraç</strong>,
            Nexora Labs altında nostalji ile “terminal ağalığı” gerilimini
            birleştirir: sefer, kadro, vergi, gazete, kapı ve peron kapışması.
          </p>
          <p>
            <span className="text-cyan-300/90 font-medium">Nexora</span> — veri,
            zekâ, yerli yazılım. Bu oyun o yolda bir durak; eğlence ve üretim
            yan yana.
          </p>
          <p>
            <strong className="text-stone-200">Gerçek para yoktur.</strong> Kumar
            yoktur. Amaç “bir otobüs firması yönetiyorum” hissi. İçerik küfürsüz
            ve siyasetsiz tutulmaya çalışılır.
          </p>
          <p className="text-stone-500">
            Canlı oda ve presence altyapısı gelişmeye açıktır. Yol haritasında
            daha derin çok oyunculu peron savaşları vardır.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/play"
            className="px-6 py-3 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-300 to-orange-500"
          >
            Oyna
          </Link>
          <Link
            href="/how-to-play"
            className="px-6 py-3 rounded-xl border border-cyan-600/40 text-cyan-200 text-sm"
          >
            Nasıl oynanır
          </Link>
          <Link
            href="/legal"
            className="px-6 py-3 rounded-xl border border-stone-700 text-stone-400 text-sm"
          >
            Yasal
          </Link>
        </div>
      </div>
    </div>
  );
}