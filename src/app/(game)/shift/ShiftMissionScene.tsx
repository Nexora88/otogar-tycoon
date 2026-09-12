"use client";

import { useEffect, useMemo, useState } from "react";
import type { DialogueOption, WorkTask } from "@/data/apprenticeContent";

const css = `
@keyframes missionBus{0%{transform:translateX(-35vw);opacity:0}12%{opacity:1}42%{transform:translateX(0)}58%{transform:translateX(0)}100%{transform:translateX(115vw);opacity:.05}}
@keyframes personWalk{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes arm{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(18deg)}}
@keyframes leg{0%,100%{transform:rotate(15deg)}50%{transform:rotate(-15deg)}}
@keyframes steam{0%{opacity:0;transform:translateY(8px)}35%{opacity:.65}100%{opacity:0;transform:translateY(-28px) translateX(7px)}}
@keyframes taskPulse{0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,.18)}50%{box-shadow:0 0 0 16px rgba(245,166,35,0)}}
@keyframes arrowMove{0%,100%{transform:translateX(0);opacity:.55}50%{transform:translateX(9px);opacity:1}}
@keyframes fadeScene{from{opacity:0;transform:scale(.985) translateY(12px)}to{opacity:1;transform:none}}
@keyframes ticket{0%{transform:translateY(15px) rotate(-4deg);opacity:0}100%{transform:none;opacity:1}}
.mission-scene{animation:fadeScene .45s ease both}.mission-bus{animation:missionBus 13s cubic-bezier(.2,.7,.2,1) infinite}.person-walk{animation:personWalk .7s ease-in-out infinite}.arm{transform-origin:top center;animation:arm .55s ease-in-out infinite}.leg{transform-origin:top center;animation:leg .55s ease-in-out infinite}.steam{animation:steam 2s ease-out infinite}.task-pulse{animation:taskPulse 2s infinite}.arrow-move{animation:arrowMove 1.2s ease-in-out infinite}.ticket{animation:ticket .5s ease both}
`;

function Person({left,top,scale=1,shirt="#65705f",delay="0s"}:{left:string;top:string;scale?:number;shirt?:string;delay?:string}){
 return <div className="absolute z-10 pointer-events-none" style={{left,top,transform:`scale(${scale})`,transformOrigin:"bottom center"}}><svg width="60" height="110" viewBox="0 0 60 110" className="person-walk" style={{animationDelay:delay}}><ellipse cx="30" cy="105" rx="16" ry="3" fill="rgba(0,0,0,.4)"/><g className="leg"><path d="M24 69L18 96L13 104" stroke="#282321" strokeWidth="8" strokeLinecap="round"/></g><g className="leg" style={{animationDelay:".25s"}}><path d="M36 69L42 96L47 104" stroke="#302a26" strokeWidth="8" strokeLinecap="round"/></g><path d="M16 48Q30 40 44 48L45 72Q30 78 15 72Z" fill={shirt}/><g className="arm"><path d="M17 51L8 73" stroke={shirt} strokeWidth="7" strokeLinecap="round"/></g><g className="arm" style={{animationDelay:".2s"}}><path d="M43 51L52 72" stroke={shirt} strokeWidth="7" strokeLinecap="round"/></g><circle cx="30" cy="30" r="16" fill="#c8916d"/><path d="M15 29Q16 8 30 10Q45 9 45 29Q36 20 29 21Q21 20 15 29Z" fill="#2b211c"/><circle cx="25" cy="31" r="1.5"/><circle cx="35" cy="31" r="1.5"/></svg></div>
}

function Bus(){return <div className="mission-bus absolute z-20 -left-[18%] bottom-[13%] w-[min(55vw,620px)]"><svg viewBox="0 0 620 200" className="w-full drop-shadow-[0_24px_24px_rgba(0,0,0,.6)]"><defs><linearGradient id="missionBusBody" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ead19b"/><stop offset=".6" stopColor="#c28e4a"/><stop offset="1" stopColor="#674225"/></linearGradient></defs><path d="M42 160Q39 60 78 31H505Q553 33 579 84L590 160Z" fill="url(#missionBusBody)" stroke="#292018" strokeWidth="6"/><path d="M83 47H493Q523 50 543 78H75Z" fill="#16262d"/><path d="M92 51H190V74H88ZM202 51H294V74H199ZM306 51H399V74H303ZM411 51H491Q513 52 527 74H408Z" fill="#28404a" stroke="#716858" strokeWidth="2"/><text x="105" y="123" fontSize="25" fontWeight="900" fill="#fff0c7" letterSpacing="3">NEXORA</text><text x="106" y="143" fontSize="9" fill="#ead6aa" letterSpacing="2">ŞEHİRLERARASI OTOBÜS</text><circle cx="140" cy="171" r="23" fill="#181716"/><circle cx="498" cy="171" r="23" fill="#181716"/></svg></div>}

function Icon({kind}:{kind:WorkTask["kind"]}){
 const map:Record<string,string>={cay:"☕",tost:"🥪",gazete:"📰",temizlik:"🧹",bagaj:"🧳",ikram:"🍪",yolcu:"🎫",kasa:"💵",pis:"🧽",rusvet:"📦",patron_cagri:"📣"};
 return <span className="text-4xl">{map[kind]||"📋"}</span>;
}

function destination(kind:WorkTask["kind"]){
 if(kind==="cay") return "ÇAY OCAĞI";
 if(kind==="tost") return "TOSTÇU";
 if(kind==="gazete") return "GAZETE BAYİİ";
 if(kind==="temizlik"||kind==="pis") return "PERON 07";
 if(kind==="bagaj") return "BAGAJ ALANI";
 if(kind==="ikram") return "ANKARA SEFERİ";
 if(kind==="yolcu") return "YOLCU GİŞESİ";
 if(kind==="kasa") return "YAZIHANE KASASI";
 if(kind==="patron_cagri") return "PATRONUN ODASI";
 return "PERON 07";
}

function numericKind(kind:WorkTask["kind"]){return ["cay","tost","gazete","bagaj","ikram","kasa"].includes(kind)}

export default function ShiftMissionScene({task,onResolve,onExit}:{task:WorkTask;onResolve:(o:DialogueOption)=>void;onExit:()=>void}){
 const [phase,setPhase]=useState<"brief"|"walking"|"action">("brief");
 const [value,setValue]=useState("");
 const [choice,setChoice]=useState<string>(task.options[0]?.id||"");
 useEffect(()=>{setPhase("brief");setValue("");setChoice(task.options[0]?.id||"")},[task.id]);
 const destinationName=destination(task.kind);
 const numeric=numericKind(task.kind);
 const options=useMemo(()=>task.options.slice(0,3),[task.options]);
 const defaultOption=options[0];
 const submit=(option?:DialogueOption)=>{
   const selected=option||options.find(x=>x.id===choice)||defaultOption;
   if(!selected)return;
   onResolve(selected);
 };
 return <>
  <style>{css}</style>
  <section className="mission-scene rounded-3xl overflow-hidden border border-amber-800/50 bg-[#0c0b09] shadow-[0_30px_80px_rgba(0,0,0,.45)]">
   <div className="relative h-[330px] sm:h-[430px] overflow-hidden bg-[radial-gradient(circle_at_50%_22%,rgba(245,166,35,.13),transparent_35%),linear-gradient(180deg,#25282a,#111211)]">
    <div className="absolute left-[5%] top-[9%] w-[39%] h-32 bg-[#5a554b] border-4 border-[#29251f]"><div className="m-3 h-8 bg-[#171512] flex items-center px-3"><span className="text-[8px] tracking-[.3em] text-amber-400 font-black">ESENLER OTOGARI</span></div><div className="grid grid-cols-5 gap-1.5 px-3">{Array.from({length:10}).map((_,i)=><i key={i} className="h-6 bg-[#17242b] border border-zinc-500/60"/>)}</div></div>
    <div className="absolute right-[6%] top-[12%] w-[21%] h-24 bg-[#39352f] border-4 border-[#24211d] text-center"><div className="mt-3 text-[7px] tracking-[.25em] text-amber-400 font-black">YAZIHANE</div><div className="grid grid-cols-2 gap-2 p-3"><i className="h-6 bg-[#15222a]"/><i className="h-6 bg-[#15222a]"/></div></div>
    <div className="absolute inset-x-0 bottom-0 h-[51%] bg-[#11110f]" style={{clipPath:"polygon(0 29%,100% 0,100% 100%,0 100%)"}}/>
    <div className="absolute inset-x-0 top-[55%] h-1 bg-amber-300/30"/>
    <Person left="13%" top="47%" shirt="#566e66" delay=".1s"/><Person left="32%" top="51%" shirt="#87493e" delay=".35s"/><Person left="71%" top="49%" shirt="#415875" delay=".6s"/><Person left="85%" top="46%" shirt="#76513f" delay=".8s"/>
    <Bus/>
    {phase!=="brief"&&<div className="absolute left-[9%] bottom-[21%] z-30 flex items-center gap-3"><div className="w-12 h-20 rounded-t-full bg-amber-500/15 border border-amber-500/30"/><div className="arrow-move text-amber-400 text-3xl">→</div><div className="rounded-xl bg-black/75 border border-amber-500/40 px-3 py-2"><div className="text-[8px] text-zinc-500">HEDEF</div><div className="font-black text-amber-300 text-sm">{destinationName}</div></div></div>}
    {phase==="action"&&task.kind==="cay"&&<div className="absolute right-[22%] bottom-[24%] z-30"><div className="relative w-16 h-12 rounded-b-2xl bg-[#d8c6a2] border-4 border-[#6d573d]"><div className="absolute -right-5 top-2 w-7 h-6 border-4 border-[#6d573d] rounded-full"/><span className="absolute left-5 -top-8 steam text-white/50 text-xl">♨</span></div></div>}
    <div className="absolute left-4 top-4 z-30 flex gap-2"><span className="px-3 py-1.5 rounded-lg bg-black/75 border border-zinc-700 text-[8px] tracking-[.22em] text-amber-300 font-black">GÖREV SAHNESİ</span><span className="px-2 py-1.5 rounded-lg bg-black/50 text-[8px] text-zinc-400">1987 · CANLI</span></div>
    <div className="absolute right-4 bottom-4 text-[8px] text-zinc-600">PERON 07 · {destinationName}</div>
   </div>

   <div className="p-5 sm:p-7">
    <div className="flex items-start gap-4"><div className="task-pulse w-16 h-16 shrink-0 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center"><Icon kind={task.kind}/></div><div className="min-w-0"><div className="text-[9px] tracking-[.28em] text-amber-500 font-black">{task.speakerName.toUpperCase()} · GÖREV</div><h2 className="text-xl sm:text-2xl font-black mt-1">{task.prompt}</h2><p className="text-xs text-zinc-500 mt-2">Önce gerçekten görevin olduğu yere git. Sonra işi tamamla.</p></div></div>

    {phase==="brief"&&<div className="mt-6 flex gap-3"><button onClick={()=>setPhase("walking")} className="flex-1 rounded-2xl bg-amber-500 text-black py-4 font-black hover:bg-amber-400 transition">GÖREVE GİT →</button><button onClick={onExit} className="px-5 rounded-2xl border border-zinc-800 text-zinc-400">Sonra</button></div>}
    {phase==="walking"&&<div className="mt-6 rounded-2xl border border-amber-700/30 bg-amber-500/5 p-5"><div className="flex items-center justify-between text-[10px] text-zinc-500"><span>Çırak yürüyor...</span><span>{destinationName}</span></div><div className="mt-4 h-2 rounded-full bg-zinc-900 overflow-hidden"><div className="h-full w-[78%] bg-amber-500 transition-all"/></div><button onClick={()=>setPhase("action")} className="mt-5 w-full py-3 rounded-xl bg-zinc-100 text-black font-black">{destinationName} · YANINA GİT</button></div>}
    {phase==="action"&&<div className="mt-6 space-y-4">
      {numeric&&<div className="ticket rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><div className="text-[9px] tracking-[.25em] text-zinc-500 font-black">İŞLEM MİKTARI</div><div className="flex gap-3 mt-3"><input type="number" min="1" max="99" value={value} onChange={e=>setValue(e.target.value)} placeholder={task.kind==="cay"?"Kaç bardak?":"Kaç adet?"} className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-amber-500"/><button onClick={()=>submit()} disabled={!value} className="rounded-xl bg-amber-500 text-black px-5 font-black disabled:opacity-35">TAMAMLA</button></div><p className="text-[9px] text-zinc-600 mt-2">Miktarı doğru gir. Yanlış sayı görev sonucunu etkileyebilir.</p></div>}
      {!numeric&&<div className="grid gap-3">{options.map((o,i)=><button key={o.id} onClick={()=>submit(o)} className={`text-left rounded-2xl border p-4 transition-all ${choice===o.id?"border-amber-500 bg-amber-500/10":"border-zinc-800 bg-zinc-950 hover:border-zinc-600"}`}><div className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-full bg-zinc-900 flex items-center justify-center text-amber-400 font-black">{i+1}</span><div><div className="font-bold">{o.label}</div><div className="text-[9px] text-zinc-600 mt-1">Güven {o.trustDelta>=0?`+${o.trustDelta}`:o.trustDelta} · Para {o.moneyDelta>=0?`+${o.moneyDelta}`:o.moneyDelta} ₺</div></div></div></button>)}</div>}
      {numeric&&<div className="grid gap-2">{options.map((o,i)=><button key={o.id} onClick={()=>setChoice(o.id)} className={`text-left rounded-xl border px-4 py-3 text-sm ${choice===o.id?"border-amber-500 bg-amber-500/10":"border-zinc-800 bg-zinc-950"}`}><b className="text-amber-400 mr-2">{i+1}.</b>{o.label}</button>)}</div>}
      <button onClick={onExit} className="w-full py-3 rounded-xl border border-zinc-800 text-zinc-500">Görevi bırak</button>
    </div>}
   </div>
  </section>
 </>;
}
