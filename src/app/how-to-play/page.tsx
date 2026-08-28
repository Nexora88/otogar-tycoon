import Link from "next/link";

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-zinc-200">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-xs text-cyan-500">
          ← Ana sayfa
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Nasıl oynanır?</h1>
        <ol className="space-y-6 text-sm text-zinc-400 leading-relaxed list-decimal list-inside">
          <li>
            <strong className="text-white">Terminal kur</strong> — İl seç, belediye
            mührü bas, arsa ve ruhsat öde.
          </li>
          <li>
            <strong className="text-white">Kadro al</strong> — Şoför / muavin
            mülakatı. İstersen eski firmayı ara (istihbarat).
          </li>
          <li>
            <strong className="text-white">Sefer planla</strong> — Hat, bilet, ikram.
            Bir şoför aynı anda tek seferde olur.
          </li>
          <li>
            <strong className="text-white">Ofis</strong> — Vergi, kredi, gazete
            (sabah/akşam), not defteri, çay.
          </li>
          <li>
            <strong className="text-white">Risk</strong> — Yorgun şoför, kaçak bagaj,
            müfettiş, mafya haraç. Dengeli oyna.
          </li>
        </ol>
        <Link
          href="/play"
          className="inline-block mt-10 px-6 py-3 rounded-xl bg-cyan-500 text-black font-semibold text-sm"
        >
          Oyuna başla
        </Link>
      </div>
    </div>
  );
}