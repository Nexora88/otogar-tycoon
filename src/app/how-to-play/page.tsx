import Link from "next/link";

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-zinc-200">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-xs text-cyan-500">
          ← Ana sayfa
        </Link>
        <p className="text-[10px] tracking-[0.3em] text-amber-500/80 uppercase mt-6">
          Rehber · 1987
        </p>
        <h1 className="text-3xl font-bold mt-2 mb-2">Nasıl oynanır?</h1>
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
          Direkt terminal kurmazsın. Önce başka firmanın peronunda çırak olursun;
          büyüyünce kendi yazıhaneni açarsın.
        </p>

        <ol className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <li className="border-l-2 border-amber-700 pl-4">
            <strong className="text-white">1. Ad & memleket</strong>
            <br />
            Hitap oluşur (ör. Keşanlı Ahmet). Rastgele şehir + firma + patron.
          </li>
          <li className="border-l-2 border-amber-700 pl-4">
            <strong className="text-white">2. Vardiya</strong>
            <br />
            Sabah çay/gazete, akşam kasa, gece risk. Patron çağırınca yanına git.
            Seçeneklerin güven, birikim ve yorgunluğu etkiler.
          </li>
          <li className="border-l-2 border-amber-700 pl-4">
            <strong className="text-white">3. Rütbe</strong>
            <br />
            Çırak → Yamak → Muavin → … → Bağımsız. İstifa için yeterli birikim
            veya rütbe gerekir.
          </li>
          <li className="border-l-2 border-cyan-700 pl-4">
            <strong className="text-white">4. Terminal</strong>
            <br />
            Belediye mührü, arsa, ruhsat. Birikim kasaya aktarılır.
          </li>
          <li className="border-l-2 border-cyan-700 pl-4">
            <strong className="text-white">5. Sefer</strong>
            <br />
            Hat, bilet, ikram, şoför. <strong className="text-zinc-300">1 otobüs = 1 sefer</strong>.
            Yolda EDS, çevirme, jandarma olabilir.
          </li>
          <li className="border-l-2 border-cyan-700 pl-4">
            <strong className="text-white">6. Lobi</strong>
            <br />
            Oda kodu, X paylaş, sohbet, bilet nabzı (Supabase açıksa canlı).
          </li>
        </ol>

        <div className="mt-10 p-4 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-500">
          Gerçek para yoktur. Küfür ve siyasi içerik yasaktır. Misafir süre
          sınırlıdır; ilerlemeyi saklamak için hesap önerilir.
        </div>

        <Link
          href="/play"
          className="inline-block mt-8 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold text-sm"
        >
          Perona yazıl
        </Link>
      </div>
    </div>
  );
}