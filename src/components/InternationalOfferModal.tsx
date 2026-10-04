"use client";
import { useCareerStore } from "@/store/careerStore";

export default function InternationalOfferModal(){
  const offer=useCareerStore(s=>s.internationalOffer);
  const accept=useCareerStore(s=>s.acceptInternationalOffer);
  const refuse=useCareerStore(s=>s.refuseInternationalOffer);
  if(!offer)return null;
  return <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/80 backdrop-blur-sm p-5">
    <div className="w-full max-w-xl rounded-3xl border border-red-900/50 bg-zinc-950 p-7 shadow-2xl">
      <div className="text-[10px] tracking-[.4em] text-red-400 font-black">KARANLIK TEKLİF · SINIR HATTI</div>
      <h2 className="text-3xl font-black mt-3">Yurt dışından teklif geldi.</h2>
      <p className="text-zinc-400 mt-3"><b>{offer.country}</b> · {offer.route}</p>
      <div className="mt-5 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">Teklif, kaçak yolcu taşımayı içeriyor. Bu bir suçtur. Yakalanırsan para cezası, sicil kaydı, itibar kaybı ve ruhsat riski doğar.</div>
      <div className="grid grid-cols-2 gap-3 mt-5 text-sm"><div className="rounded-xl bg-white/[0.04] p-3">Ödül <b>{offer.reward.toLocaleString("tr-TR")} ₺</b></div><div className="rounded-xl bg-white/[0.04] p-3">Yakalanma riski <b>%{Math.round(offer.risk*100)}</b></div></div>
      <div className="grid grid-cols-2 gap-3 mt-5"><button onClick={refuse} className="rounded-xl border border-emerald-800 bg-emerald-950/30 py-3 font-black text-emerald-300">TEMİZ KAL</button><button onClick={accept} className="rounded-xl border border-red-800 bg-red-950/40 py-3 font-black text-red-300">RİSKİ KABUL ET</button></div>
    </div>
  </div>;
}
