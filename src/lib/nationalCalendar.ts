export type DayMood = "normal" | "national" | "mourning";
export type CalendarBeat = { mood: DayMood; code: string; title: string; paperLine: string; phoneFrom: string; phoneBody: string; bakracLine: string; themeClass: string; };
function md(d: Date) { return `${d.getMonth()+1}-${d.getDate()}`; }
export function getCalendarBeat(now = new Date(), gameDay?: number): CalendarBeat {
  const key = gameDay ? ({314:"11-10",113:"4-23",139:"5-19",242:"8-30",302:"10-29",77:"3-18"} as Record<number,string>)[gameDay] || "" : md(now);
  if(key==="11-10") return {mood:"mourning",code:"10kasim",title:"10 Kasım",paperLine:"HAKİKİ PERON · ÖZEL BASKI: Saat 09.05. Gazi Mustafa Kemal Atatürk'ü saygı ve minnetle anıyoruz.",phoneFrom:"Nexora Labs",phoneBody:"10 Kasım. Bugün ekranlar sadeleşiyor; saygıyla anıyoruz.",bakracLine:"Bugün peronlarda sessizlik, kalplerde saygı. Atamızı anıyoruz.",themeClass:"ot-mood-mourning"};
  const days: Record<string,Omit<CalendarBeat,"mood"|"themeClass">> = {
    "4-23":{code:"23nisan",title:"23 Nisan",paperLine:"HAKİKİ PERON · BAYRAM BASKISI: 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı.",phoneFrom:"Nexora Labs",phoneBody:"23 Nisan Ulusal Egemenlik ve Çocuk Bayramımız kutlu olsun! Peronlarda çocuk sesleri var.",bakracLine:"Nexora Labs olarak 23 Nisan Ulusal Egemenlik ve Çocuk Bayramımızı kutluyoruz."},
    "5-19":{code:"19mayis",title:"19 Mayıs",paperLine:"HAKİKİ PERON · BAYRAM BASKISI: 19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı.",phoneFrom:"Nexora Labs",phoneBody:"19 Mayıs kutlu olsun! Gençlik, hareket ve umut bugün peronlarda.",bakracLine:"Nexora Labs olarak 19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramımızı kutluyoruz."},
    "8-30":{code:"30agustos",title:"30 Ağustos",paperLine:"HAKİKİ PERON · BAYRAM BASKISI: 30 Ağustos Zafer Bayramı.",phoneFrom:"Nexora Labs",phoneBody:"30 Ağustos Zafer Bayramımız kutlu olsun. Yollar açık, başımız dik.",bakracLine:"Nexora Labs olarak Zafer Bayramımızı kutluyoruz."},
    "10-29":{code:"29ekim",title:"29 Ekim",paperLine:"HAKİKİ PERON · CUMHURİYET BASKISI: Cumhuriyetimizin kuruluşunun yıl dönümü.",phoneFrom:"Nexora Labs",phoneBody:"Cumhuriyet Bayramımız kutlu olsun! Otogar Tycoon bugün Cumhuriyet coşkusunda.",bakracLine:"Nexora Labs olarak Cumhuriyet Bayramımızı kutluyoruz."},
    "3-18":{code:"18mart",title:"18 Mart",paperLine:"HAKİKİ PERON · ÖZEL BASKI: Çanakkale Şehitlerini Anma Günü.",phoneFrom:"Nexora Labs",phoneBody:"18 Mart. Şehitlerimizi saygı ve minnetle anıyoruz.",bakracLine:"Çanakkale şehitlerimizi saygı ve minnetle anıyoruz."}
  };
  const n=days[key]; if(n){const m=n.code==="18mart"; return {...n,mood:m?"mourning":"national",themeClass:m?"ot-mood-mourning":"ot-mood-national"};}
  return {mood:"normal",code:"none",title:"",paperLine:"",phoneFrom:"",phoneBody:"",bakracLine:"",themeClass:""};
}
export function calendarHeadlineForPaper(beat: CalendarBeat): string|null { return beat.mood==="normal"?null:beat.paperLine; }