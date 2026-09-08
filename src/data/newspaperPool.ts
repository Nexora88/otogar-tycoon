import type { NewsItem } from "@/store/gameStore";

export type NewsKind =
  | "economy"
  | "rival"
  | "crash"
  | "bayram"
  | "player"
  | "kulis"
  | "gundem";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function uid(prefix: string, day: number) {
  return `${prefix}-${day}-${Math.floor(Math.random() * 1e5)}`;
}

type Ctx = {
  day: number;
  fuelPrice: number;
  pendingFuel?: number;
  companyName: string;
  terminalName?: string;
  bayram: boolean;
  reputation: number;
  lastEventType?: string | null;
};

function item(
  day: number,
  kind: NewsKind,
  title: string,
  body: string
): NewsItem {
  return {
    id: uid(kind, day),
    title,
    body,
    tag: kind,
  };
}

const ECONOMY = [
  (f: number) => ({
    title: `MAZOT ${f} ₺`,
    body: "Şoförler pompa kuyruğunda. Kısa hatlarda bilet konuşuluyor.",
  }),
  (f: number) => ({
    title: "Yarın zam mı indirim mi?",
    body: `Piyasa ${f} ₺ bandında. Akşam baskısında netleşir.`,
  }),
  () => ({
    title: "Lastik ve yedek pahalı",
    body: "Garaj ustaları ‘eski model bulunmuyor’ diyor.",
  }),
];

const RIVAL = [
  {
    title: "Rakip fiyat kırdı — Keşan hattı",
    body: "Peronda yolcu kayması iddiası.",
  },
  {
    title: "Boncuk Turizm gece seferi",
    body: "Ankara–İstanbul ek sefer. Çığırtkanlar ses yarışında.",
  },
  {
    title: "Yıldız Seyahat yeni otobüs",
    body: "Travego silüeti otoparkta görüldü.",
  },
];

const CRASH = [
  {
    title: "TEM’de zincirleme kaza",
    body: "Seferler aksadı. Firmalardan açıklama bekleniyor.",
  },
  {
    title: "Bolu’da lastik patlaması",
    body: "Yolcular 40 dakika bekledi.",
  },
];

const BAYRAM = [
  {
    title: "BAYRAM TRAFİĞİ",
    body: "Peronlar doldu. Zabıta fahiş fiyata bakıyor.",
  },
  {
    title: "Kara bilet dönemi mi?",
    body: "Bazı gişelerde fiyat katlandı iddiası.",
  },
];

const COLOR = [
  {
    title: "Esnaf FM nostalji",
    body: "Çay ocağında radyo açık.",
  },
  {
    title: "Yerli malı afişleri",
    body: "Otogar duvarında eski sloganlar.",
  },
  {
    title: "Nexora vitrin ışığı",
    body: "1987 model radyo sergisi merak uyandırdı.",
  },
];

const EVENING = [
  {
    title: "AKŞAM: Peronlar yavaşlıyor",
    body: "Gündüz seferleri kapanırken hesaplar konuşuluyor.",
  },
  {
    title: "Gece kaptanları mesaide",
    body: "Takograf yeşil, termos dolu.",
  },
  {
    title: "Yazıhanede defter kapanışı",
    body: "Eksik kasa dedikodusu; isim yok.",
  },
];

const MAFIA = [
  {
    title: "Çay ocağında isim fısıldandı",
    body: "Esnaf konuşmuyor. ‘Aidat’ kelimesi havada.",
  },
  {
    title: "Gece ziyareti iddiası",
    body: "Yazıhane kapısı geç saatte çalındı deniyor.",
  },
];

export function buildMorningPaper(ctx: Ctx): NewsItem[] {
  const out: NewsItem[] = [];
  const f = ctx.fuelPrice;
  const eco = pick(ECONOMY);
  const e = typeof eco === "function" ? eco(f) : eco;
  out.push(item(ctx.day, "economy", e.title, e.body));

  if (ctx.pendingFuel && ctx.pendingFuel !== 0) {
    const up = ctx.pendingFuel > 0;
    out.push(
      item(
        ctx.day,
        "economy",
        up ? "YARIN ZAM SİNYALİ" : "YARIN İNDİRİM",
        up
          ? `Pompalarda +${Math.abs(ctx.pendingFuel)} ₺ konuşuluyor.`
          : `Mazotta −${Math.abs(ctx.pendingFuel)} ₺ söylentisi.`
      )
    );
  }

  if (ctx.bayram) {
    const b = pick(BAYRAM);
    out.push(item(ctx.day, "bayram", b.title, b.body));
  }

  if (Math.random() > 0.35) {
    const r = pick(RIVAL);
    out.push(item(ctx.day, "rival", r.title, r.body));
  }

  if (Math.random() > 0.55) {
    const c = pick(CRASH);
    out.push(item(ctx.day, "crash", c.title, c.body));
  }

  const col = pick(COLOR);
  out.push(item(ctx.day, "economy", col.title, col.body));

  if (Math.random() > 0.7) {
    const m = pick(MAFIA);
    out.push(item(ctx.day, "kulis", m.title, m.body));
  }

  if (ctx.companyName && ctx.reputation >= 40 && Math.random() > 0.6) {
    out.push(
      item(
        ctx.day,
        "player",
        `${ctx.companyName} peronda anılıyor`,
        `${ctx.terminalName || "Terminal"} tarafında hareket. İtibar ${ctx.reputation}.`
      )
    );
  }

  if (ctx.reputation < 25 && Math.random() > 0.5) {
    out.push(
      item(
        ctx.day,
        "player",
        `Şikâyet: ${ctx.companyName}`,
        "Yolcu memnuniyeti düşük diyenler var."
      )
    );
  }

  return out.slice(0, 7);
}

export function buildEveningPaper(ctx: Ctx): NewsItem[] {
  const out: NewsItem[] = [];
  const base = pick(EVENING);
  out.push(item(ctx.day, "economy", base.title, base.body));

  if (ctx.pendingFuel && ctx.pendingFuel !== 0) {
    out.push(
      item(
        ctx.day,
        "economy",
        "Akşam: yarın pompa",
        `Beklenen: ${ctx.pendingFuel > 0 ? "+" : ""}${ctx.pendingFuel} ₺.`
      )
    );
  }

  if (Math.random() > 0.5) {
    const r = pick(RIVAL);
    out.push(item(ctx.day, "rival", `Akşam: ${r.title}`, r.body));
  }

  if (Math.random() > 0.6) {
    const c = pick(COLOR);
    out.push(item(ctx.day, "economy", c.title, c.body));
  }

  return out.slice(0, 6);
}

export function rollPendingFuelDelta(): number {
  const r = Math.random();
  if (r < 0.2) return 0;
  if (r < 0.45) return 1 + Math.floor(Math.random() * 3);
  if (r < 0.6) return -(1 + Math.floor(Math.random() * 2));
  return Math.random() > 0.5 ? 2 : -1;
}