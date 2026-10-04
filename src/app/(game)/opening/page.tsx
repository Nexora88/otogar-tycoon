"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const scenes=[
{image:"/story/esenler-morning.svg",year:"1987",place:"ESENLER OTOGARI",line:"Bazı hikâyeler bir otobüsle başlar.",sub:"Bazıları ise bir insanın ilk kez “ben de yapabilirim” demesiyle."},
{image:"/story/terminal-night.svg",year:"1987",place:"GECE VARDİYASI",line:"Burada herkesin bir derdi var.",sub:"Yolcu, kaptan, patron… ve sen."},
{image:"/story/bursa-rain.svg",year:"1988",place:"İSTANBUL → BURSA",line:"İlk kararın para kazandırmayabilir.",sub:"Ama karakterini gösterir."},
{image:"/story/boardroom.svg",year:"1991",place:"YÖNETİM MASASI",line:"Sonra mesele otobüs olmaktan çıkar.",sub:"İsim. Güven. Sermaye. Kontrol."}
];

export default function OpeningPage(){
 const router=useRouter();const[index,setIndex]=useState(0);const[started,setStarted]=useState(false);const scene=scenes[index];
 useEffect(()=>{if(!started)return;const t=setTimeout(()=>index<scenes.length-1?setIndex(v=>v+1):router.push("/shift"),3600);return()=>clearTimeout(t)},[started,index,router]);
 return <main className="fixed inset-0 bg-black text-white overflow-hidden">
  {scenes.map((s,i)=><img key={s.image} src={s.image} alt="" className={"absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 "+(i===index?"opacity-100":"opacity-0")}/>)}
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20"/>
  <div className="absolute top-0 left-0 right-0 p-5 sm:p-8 flex justify-between">
   <div><div className="text-[9px] tracking-[.45em] text-amber-400 font-black">NEXORA INTERACTIVE</div><div className="text-[10px] text-white/45 tracking-widest mt-1">OTOGAR TYCOON · ORIGINAL STORY</div></div>
   <button onClick={()=>router.push("/shift")} className="text-[10px] tracking-widest text-white/50 border border-white/10 rounded-full px-3 py-2">ATLA</button>
  </div>
  {!started?<div className="absolute inset-0 flex items-center justify-center px-6 text-center"><div className="max-w-3xl">
   <div className="text-[10px] tracking-[.55em] text-amber-400 font-black mb-5">1987 · İSTANBUL</div>
   <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-none">Bir Otobüs.<br/><span className="text-amber-400">Bir İsim.</span><br/>Bir Hayat.</h1>
   <p className="mt-6 text-sm sm:text-base text-white/60 max-w-xl mx-auto">Bir otogarın kalabalığında başlayan hikâyenin nereye gideceğine sen karar vereceksin.</p>
   <button onClick={()=>setStarted(true)} className="mt-9 px-8 py-4 rounded-full bg-white text-black font-black text-sm hover:scale-105 transition">HİKÂYEYİ BAŞLAT</button>
  </div></div>:
  <div className="absolute left-0 right-0 bottom-0 p-6 sm:p-12"><div className="max-w-5xl mx-auto">
   <div className="flex items-center gap-3 text-[10px] tracking-[.3em] text-amber-400 font-black"><span>{scene.year}</span><span className="w-8 h-px bg-amber-400/50"/><span>{scene.place}</span></div>
   <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mt-3 max-w-4xl">{scene.line}</h2><p className="text-sm sm:text-lg text-white/55 mt-3">{scene.sub}</p>
   <div className="mt-6 flex gap-1">{scenes.map((_,i)=><div key={i} className={"h-1 rounded-full transition-all duration-700 "+(i<=index?"w-12 bg-amber-400":"w-6 bg-white/20")}/>)}</div>
  </div></div>}
 </main>;
}