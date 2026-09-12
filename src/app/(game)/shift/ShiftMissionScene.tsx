"use client";

import { useEffect, useMemo, useState } from "react";
import type { DialogueOption, WorkTask } from "@/data/apprenticeContent";

const css = `
@keyframes sceneIn{from{opacity:0;transform:scale(.98) translateY(16px);filter:blur(3px)}to{opacity:1;transform:none;filter:none}}
@keyframes busDrive{0%{transform:translate3d(-48vw,0,0)}18%{transform:translate3d(-18vw,0,0)}38%{transform:translate3d(0,0,0)}55%{transform:translate3d(2vw,0,0)}78%{transform:translate3d(18vw,0,0)}100%{transform:translate3d(52vw,0,0)}}
@keyframes wheel{to{transform:rotate(360deg)}}
@keyframes personWalk{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes armA{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(17deg)}}
@keyframes armB{0%,100%{transform:rotate(15deg)}50%{transform:rotate(-18deg)}}
@keyframes legA{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}}
@keyframes legB{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}
@keyframes apprenticeWalk{0%{transform:translateX(0)}100%{transform:translateX(56vw)}}
@keyframes apprenticeBob{0%,100%{translate:0 0}50%{translate:0 -5px}}
@keyframes steam{0%{opacity:0;transform:translateY(5px) scale(.7)}25%{opacity:.65}100%{opacity:0;transform:translateY(-28px) translateX(8px) scale(1.2)}}
@keyframes signBlink{0%,48%,100%{opacity:1}50%,56%{opacity:.35}}
@keyframes lightSweep{0%{transform:translateX(-120%)}100%{transform:translateX(180%)}}
@keyframes dust{0%{opacity:0;transform:translateX(0) scale(.5)}35%{opacity:.25}100%{opacity:0;transform:translateX(90px) scale(1.8)}}
@keyframes pulseTarget{0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,.18)}50%{box-shadow:0 0 0 18px rgba(245,166,35,0)}}
@keyframes progress{from{width:0}to{width:100%}}
@keyframes dialogue{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}
@keyframes arrow{0%,100%{transform:translateX(0)}50%{transform:translateX(8px)}}
.mission-scene{animation:sceneIn .55s cubic-bezier(.2,.8,.2,1) both}.mission-bus{animation:busDrive 12s cubic-bezier(.15,.65,.2,1) infinite}.wheel{transform-box:fill-box;transform-origin:center;animation:wheel 1.1s linear infinite}.person{animation:personWalk .65s ease-in-out infinite}.arm-a{transform-origin:top center;animation:armA .55s ease-in-out infinite}.arm-b{transform-origin:top center;animation:armB .55s ease-in-out infinite}.leg-a{transform-origin:top center;animation:legA .55s ease-in-out infinite}.leg-b{transform-origin:top center;animation:legB .55s ease-in-out infinite}.steam{animation:steam 2s ease-out infinite}.sign{animation:signBlink 2.7s infinite}.target{animation:pulseTarget 2s infinite}.sweep{animation:lightSweep 3.8s ease-in-out infinite}.dust{animation:dust 2.2s ease-out infinite}.dialogue{animation:dialogue .35s ease both}.arrow{animation:arrow 1.1s ease-in-out infinite}
`;

type Props={task:WorkTask;onResolve:(o:DialogueOption)=>void;onExit:()=>void};

function Person({left,top,shirt="#52665e",delay="0s",scale=1}:{left:string;top:string;shirt?:string;delay?:string;scale?:number}){
 return <div className="absolute z-20 pointer-events-none" style={{left,top,transform:`scale(${scale})`,transformOrigin:"bottom center"}}><svg width="58" height="108" viewBox="0 0 58 108" className="person" style={{animationDelay:delay}}><ellipse cx="29" cy="104" rx="15" ry="3" fill="rgba(0,0,0,.48)"/><g className="leg-a"><path d="M24 69L19 94L13 103" stroke="#272421" strokeWidth="8" strokeLinecap="round"/></g><g className="leg-b" style={{animationDelay:".25s"}}><path d="M34 69L40 94L46 103" stroke="#302a26" strokeWidth="8" strokeLinecap="round"/></g><path d="M15 46Q29 39 43 46L45 72Q29 78 14 72Z" fill={shirt}/><g className="arm-a"><path d="M16 50L7 72" stroke={shirt} strokeWidth="7" strokeLinecap="round"/></g><g className="arm-b" style={{animationDelay:".2s"}}><path d="M42 50L51 72" stroke={shirt} strokeWidth="7" strokeLinecap="round"/></g><circle cx="29" cy="29" r="15" fill="#c88f6a"/><path d="M15 28Q16 9 29 9Q43 9 44 28Q37 20 29 20Q21 20 15 28Z" fill="#27211e"/><circle cx="24" cy="30" r="1.4"/><circle cx="34" cy="30" r="1.4"/></svg></div>
}

function Apprentice({walking}:{walking:boolean}){
 return <div className={`absolute z-50 left-[9%] bottom-[19%] ${walking?"transition-none":"transition-transform duration-500"}`} style={walking?{animation:"apprenticeWalk 2.4s cubic-bezier(.2,.75,.2,1) forwards"}:undefined}>
  <div style={{animation:walking?"apprenticeBob .34s ease-in-out infinite":"none"}}>
   <svg width="58" height="112" viewBox="0 0 58 112" className="drop-shadow-[0_12px_10px_rgba(0,0,0,.55)">
    <ellipse cx="29" cy="108" rx="15" ry="3" fill="rgba(0,0,0,.5)"/>
    <g className="leg-a"><path d="M24 72L18 98L13 106" stroke="#171717" strokeWidth="8" strokeLinecap="round"/></g>
    <g className="leg-b"><path d="M34 72L40 98L46 106" stroke="#24201d" strokeWidth="8" strokeLinecap="round"/></g>
    <path d="M14 47Q29 40 44 47L43 76Q29 82 15 76Z" fill="#b38a49" stroke="#241d18" strokeWidth="2"/>
    <path d="M16 51L7 73" stroke="#b38a49" strokeWidth="7" strokeLinecap="round"/><path d="M42 51L51 72" stroke="#b38a49" strokeWidth="7" strokeLinecap="round"/>
    <circle cx="29" cy="29" r="16" fill="#c9906b"/><path d="M13 28Q14 7 29 8Q45 8 46 28Q39 18 29 20Q20 18 13 28Z" fill="#29211d"/>
    <path d="M19 19Q29 12 39 19" fill="none" stroke="#29211d" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="24" cy="30" r="1.5"/><circle cx="34" cy="30" r="1.5"/>
   </svg>
  </div>
 </div>
}

function Bus(){return <div className="mission-bus absolute z-30 left-[-45%] bottom-[11%] w-[min(72vw,690px)]"><svg viewBox="0 0 690 220" className="w-full drop-shadow-[0_30px_30px_rgba(0,0,0,.65)"><defs><linearGradient id="busBody2" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f0d9a1"/><stop offset=".52" stopColor="#c38d49"/><stop offset="1" stopColor="#6c4426"/></linearGradient><linearGradient id="glass2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#496674"/><stop offset=".55" stopColor="#17262e"/><stop offset="1" stopColor="#0d171c"/></linearGradient></defs><path d="M48 171Q47 77 82 36Q99 18 132 18H549Q590 20 619 56L644 95L649 171Z" fill="url(#busBody2)" stroke="#241d18" strokeWidth="7"/><path d="M88 43H532Q565 44 594 76L605 89H78Z" fill="url(#glass2)" stroke="#171b1d" strokeWidth="5"/><path d="M103 48H202V84H96ZM215 48H316V84H208ZM329 48H430V84H322ZM443 48H528Q553 49 572 72L581 84H438Z" fill="#263d47" stroke="#65747a" strokeWidth="2"/><path d="M77 112H608" stroke="#f5e0a6" strokeWidth="5" opacity=".45"/><text x="100" y="151" fontSize="29" fontWeight="900" fill="#fff1c7" letterSpacing="4">NEXORA</text><text x="103" y="168" fontSize="9" fill="#e6cf9c" letterSpacing="2.8">ŞEHİRLERARASI · 1987</text><rect x="532" y="119" width="61" height="22" rx="4" fill="#161616"/><text x="541" y="135" fontSize="10" fill="#f4bd55" fontWeight="800">07</text><g className="wheel"><circle cx="151" cy="178" r="28" fill="#171717"/><circle cx="151" cy="178" r="14" fill="#70665b"/><circle cx="151" cy="178" r="6" fill="#252525"/></g><g className="wheel"><circle cx="535" cy="178" r="28" fill="#171717"/><circle cx="535" cy="178" r="14" fill="#70665b"/><circle cx="535" cy="178" r="6" fill="#252525"/></g></svg><div className="dust absolute -right-4 bottom-4 w-12 h-4 rounded-full bg-zinc-400/20 dust"/></div>}

function TaskIcon({kind}:{kind:WorkTask["kind"]}){const map:Record<string,string>={cay:"☕",tost:"🥪",gazete:"📰",temizlik:"🧹",bagaj:"🧳",ikram:"🍪",yolcu:"🎫",kasa:"💵",pis:"🧽",rusvet:"📦",patron_cagri:"📣"};return <span className="text-4xl leading-none">{map[kind]||"📋"}</span>}
function destination(kind:WorkTask["kind"]){if(kind==="cay")return "ÇAY OCAĞI";if(kind==="tost")return "TOSTÇU";if(kind==="gazete")return "GAZETE BAYİİ";if(kind==="temizlik"||kind==="pis")return "PERON 07";if(kind==="bagaj")return "BAGAJ ALANI";if(kind==="ikram")return "ANKARA SEFERİ";if(kind==="yolcu")return "YOLCU GİŞESİ";if(kind==="kasa")return "YAZIHANE KASASI";if(kind==="patron_cagri")return "PATRONUN ODASI";return "PERON 07"}
function numericKind(kind:WorkTask["kind"]){return ["cay","tost","gazete","bagaj","ikram","kasa"].includes(kind)}

export default function ShiftMissionScene({task,onResolve,onExit}:Props){
 const [phase,setPhase]=useState<"brief"|"walking"|"action">("brief");const [value,setValue]=useState("");const [choice,setChoice]=useState(task.options[0]?.id||"");
 useEffect(()=>{setPhase("brief");setValue("");setChoice(task.options[0]?.id||"")},[task.id,task.options]);
 const target=destination(task.kind);const numeric=numericKind(task.kind);const options=useMemo(()=>task.options.slice(0,3),[task.options]);const selected=options.find(x=>x.id===choice)||options[0];
 const submit=(o?:DialogueOption)=>{const picked=o||selected;if(picked)onResolve(picked)};
 return <><style>{css}</style><section className="mission-scene overflow-hidden rounded-[28px] border border-amber-800/50 bg-[#090909] shadow-[0_35px_100px_rgba(0,0,0,.58)]">
  <div className="relative h-[390px] sm:h-[520px] overflow-hidden bg-[#1a1c1c]">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_18%,rgba(255,191,80,.16),transparent_28%),linear-gradient(180deg,#313536 0%,#191b1b 56%,#0d0e0e 100%)]"/>
   <div className="absolute left-[4%] top-[8%] w-[45%] h-[145px] bg-[#55534e] border-[5px] border-[#292622] shadow-2xl"><div className="h-10 px-4 flex items-center justify-between bg-[#171614] border-b border-zinc-700"><span className="text-[9px] tracking-[.35em] text-amber-400 font-black">ESENLER OTOGARI</span><span className="sign text-[8px] text-red-400">● CANLI</span></div><div className="grid grid-cols-5 gap-2 p-4">{Array.from({length:10}).map((_,i)=><div key={i} className="h-8 bg-[#18272e] border border-zinc-500/50 shadow-inner"/>)}</div></div>
   <div className="absolute right-[5%] top-[11%] w-[23%] h-[110px] bg-[#3c3933] border-[5px] border-[#25221e] shadow-xl"><div className="text-center mt-4 text-[8px] tracking-[.4em] text-amber-400 font-black">YAZIHANE</div><div className="grid grid-cols-2 gap-2 p-4"><div className="h-7 bg-[#14242c]"/><div className="h-7 bg-[#14242c]"/></div></div>
   <div className="absolute inset-x-0 bottom-0 h-[53%] bg-[#11110f]" style={{clipPath:"polygon(0 22%,100% 0,100% 100%,0 100%)"}}/>
   <div className="absolute inset-x-0 bottom-[25%] h-[3px] bg-amber-300/20"/><div className="absolute left-[8%] bottom-[20%] w-28 h-20 border border-amber-500/20 bg-amber-500/5 target"/>
   <Person left="20%" top="53%" shirt="#53695e" delay=".1s" scale={.9}/><Person left="42%" top="56%" shirt="#88483d" delay=".32s" scale={.82}/><Person left="70%" top="53%" shirt="#3d5873" delay=".58s" scale={.9}/><Person left="84%" top="49%" shirt="#74503d" delay=".78s" scale={.86}/>
   <div className="absolute left-[6%] bottom-[13%] z-10 w-28 h-5 rounded-full bg-black/35 blur-md"/><Bus/><Apprentice walking={phase==="walking"}/>
   <div className="sweep absolute inset-y-0 left-[-30%] w-[25%] skew-x-[-18deg] bg-white/5 pointer-events-none"/>
   {phase!=="brief"&&<div className="absolute left-[54%] bottom-[42%] z-[60] dialogue"><div className="rounded-2xl border border-amber-500/35 bg-black/85 px-4 py-3 shadow-2xl backdrop-blur"><div className="text-[7px] tracking-[.25em] text-zinc-500">HEDEF</div><div className="text-sm font-black text-amber-200">{target}</div></div></div>}
   {phase==="action"&&<div className="absolute right-[21%] bottom-[25%] z-40"><div className="relative w-20 h-14 rounded-b-2xl bg-[#dbc8a3] border-4 border-[#6a5239] shadow-xl"><div className="absolute -right-7 top-2 w-8 h-7 border-4 border-[#6a5239] rounded-full"/><span className="steam absolute left-7 -top-10 text-white/50 text-2xl">♨</span></div></div>}
   <div className="absolute left-4 top-4 z-50 flex gap-2"><span className="rounded-lg border border-amber-500/30 bg-black/75 px-3 py-2 text-[8px] tracking-[.25em] text-amber-300 font-black">GÖREV SAHNESİ</span><span className="rounded-lg bg-black/55 px-3 py-2 text-[8px] text-zinc-400">1987 · CANLI</span></div>
   <div className="absolute right-4 bottom-4 z-50 text-[8px] tracking-[.18em] text-zinc-600">PERON 07 · {target}</div>
  </div>
  <div className="p-5 sm:p-7 bg-[linear-gradient(180deg,#111110,#0b0b0b)]">
   <div className="flex items-start gap-4"><div className="target flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10"><TaskIcon kind={task.kind}/></div><div className="min-w-0 flex-1"><div className="text-[9px] tracking-[.3em] text-amber-500 font-black">{task.speakerName.toUpperCase()} · GÖREV</div><h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight">{task.prompt}</h2><p className="mt-2 text-xs leading-5 text-zinc-500">Görev noktası artık gerçekten sahnede. Çırağı oraya yürüt, karakterle karşılaş ve işi tamamla.</p></div></div>
   {phase==="brief"&&<div className="mt-6 grid grid-cols-[1fr_auto] gap-3"><button onClick={()=>setPhase("walking")} className="rounded-2xl bg-amber-500 py-4 text-sm font-black text-black shadow-[0_10px_30px_rgba(245,166,35,.18)] transition hover:bg-amber-400">GÖREVE GİT <span className="arrow inline-block ml-2">→</span></button><button onClick={onExit} className="rounded-2xl border border-zinc-800 px-5 text-zinc-400">Sonra</button></div>}
   {phase==="walking"&&<div className="mt-6 rounded-2xl border border-amber-700/30 bg-amber-500/[.04] p-5"><div className="flex justify-between text-[10px] font-bold text-zinc-500"><span>ÇIRAK HEDEFE YÜRÜYOR</span><span className="text-amber-400">{target}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-900"><div className="h-full w-full origin-left bg-gradient-to-r from-amber-700 via-amber-400 to-amber-200" style={{animation:"progress 2.4s cubic-bezier(.2,.8,.2,1) both"}}/></div><div className="mt-4 text-[9px] text-zinc-600">Çırak perondan ayrıldı. Hedefe doğru ilerliyor...</div><button onClick={()=>setPhase("action")} className="mt-5 w-full rounded-xl bg-zinc-100 py-3 font-black text-black transition hover:bg-white">{target} · ETKİLEŞİME GEÇ</button></div>}
   {phase==="action"&&<div className="mt-6 space-y-4"><div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3"><div className="text-[8px] tracking-[.25em] text-emerald-500 font-black">ETKİLEŞİM BAŞLADI</div><div className="mt-1 text-sm font-bold text-zinc-200">{task.speakerName} seninle konuşuyor ve görev sonucunu bekliyor.</div></div>{numeric&&<div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-4"><div className="text-[9px] tracking-[.25em] text-zinc-500 font-black">İŞLEM MİKTARI</div><div className="mt-3 flex gap-3"><input type="number" min="1" max="99" value={value} onChange={e=>setValue(e.target.value)} placeholder={task.kind==="cay"?"Kaç bardak?":"Kaç adet?"} className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base outline-none focus:border-amber-500"/><button onClick={()=>submit()} disabled={!value} className="rounded-xl bg-amber-500 px-5 font-black text-black disabled:opacity-30">TAMAMLA</button></div></div>}{!numeric&&<div className="grid gap-3">{options.map((o,i)=><button key={o.id} onClick={()=>{setChoice(o.id);submit(o)}} className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:-translate-y-0.5 hover:border-amber-700"><div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-amber-400 font-black">{i+1}</span><div className="flex-1"><div className="font-bold text-zinc-100">{o.label}</div><div className="mt-1 text-[9px] text-zinc-600">Güven {o.trustDelta>=0?`+${o.trustDelta}`:o.trustDelta} · Para {o.moneyDelta>=0?`+${o.moneyDelta}`:o.moneyDelta}</div></div><span className="arrow text-amber-500 opacity-0 transition group-hover:opacity-100">→</span></div></button>)}</div>}<button onClick={onExit} className="w-full rounded-xl border border-zinc-900 py-3 text-[10px] font-black tracking-[.2em] text-zinc-600 hover:text-zinc-300">GÖREVİ BIRAK</button></div>}
  </div>
 </section></>
}
