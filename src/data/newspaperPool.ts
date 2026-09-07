import type { NewsItem, NewsKind } from "@/store/gameStore";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function uid(prefix: string, day: number) {
  return `${prefix}-${day}-${Math.floor(Math.random() * 1e5)}`;
}

type Ctx = {
  day: number;
  fuelPrice: number;
  pendingFuel: number;
  companyName: string;
  terminalName: string;
  bayram: boolean;
  reputation: number;
  lastEventType?: string | null;
};

const ECONOMY_H = [
  (f: number) =>
    ({
      headline: `MAZOT ${f} ₺ — peron hesapları değişti`,
      body: "Şoförler pompa kuyruğunda. Kısa hatlarda bilet konuşuluyor.",
    }) as const,
  (f: number) =>
    ({
      headline: "Yarın zam mı indirim mi?",
      body: `Piyasa ${f} ₺ bandında. Akşam baskısında netleşir deniyor.`,
    }) as const,
  () =>
    ({
      headline: "Lastik ve yedek parça pahalı",
      body: "Garaj ustaları ‘eski model bulunmuyor’ diyor.",
    }) as const,
  () =>
    ({
      headline: "Gişe cirosu mevsimlik dalgalanıyor",
      body: "Öğrenci tatili bitti, iş seferi arttı.",
    }) as const,
];

const RIVAL_H = [
  {
    headline: "Rakip firma fiyat kırdı — Keşan hattı",
    body: "Peronda yolcu kayması iddiası. Esnaf ‘haksız rekabet’ diyor.",
  },
  {
    headline: "Boncuk Turizm gece seferi açtı",
    body: "Ankara–İstanbul ek sefer. Çığırtkanlar ses yarışında.",
  },
  {
    headline: "Yıldız Seyahat yeni otobüs aldı",
    body: "Travego silüeti otoparkta görüldü. Dedikodu büyüdü.",
  },
  {
    headline: "Sahil Express bilette kampanya",
    body: "‘Öğrenci indirimi’ afişleri perona asıldı.",
  },
];

const CRASH_H = [
  {
    headline: "TEM’de zincirleme kaza — seferler aksadı",
    body: "Yaralılar var. Firmalardan açıklama bekleniyor.",
  },
  {
    headline: "Bolu Dağı’nda lastik patlaması",
    body: "Yolcular 40 dakika bekledi. İkram tartışması çıktı.",
  },
  {
    headline: "Virajda savrulma: ayna kırıldı",
    body: "Şahitler ‘hız yüksekti’ diyor. Soruşturma açıldı.",
  },
];

const BAYRAM_H = [
  {
    headline: "BAYRAM TRAFİĞİ: peronlar doldu",
    body: "Bilet tavanı gevşedi. Zabıta fahiş fiyata göz kulak.",
  },
  {
    headline: "Kara bilet dönemi mi?",
    body: "Bazı gişelerde fiyat 3’e katlandı iddiası.",
  },
];

const COLOR_H = [
  {
    headline: "Esnaf FM’de nostalji kuşağı",
    body: "Çay ocağında radyo açık. Peron ritim tutuyor.",
  },
  {
    headline: "Yerli malı afişleri yenilendi",
    body: "Otogar duvarında ‘herkes onu kullanmalı’ yazısı.",
  },
  {
    headline: "Anıtkabir tabelası yol kenarında",
    body: "Şoförler ‘selam durmadan geçilmez’ diyor.",
  },
  {
    headline: "Pişmaniye satıcısı gece nöbetinde",
    body: "‘Buyurun pişmaniye’ sesi 2 nolu peronda.",
  },
  {
    headline: "Nexora Elektronik vitrin ışığı",
    body: "1987 model radyo sergisi merak uyandırdı.",
  },
];

const EVENING_H = [
  {
    headline: "AKŞAM: Peronlar yavaşlıyor",
    body: "Gündüz seferleri kapanırken hesaplar konuşuluyor.",
  },
  {
    headline: "Gece seferi kaptanları mesaide",
    body: "Takograf yeşil, çay termosu dolu.",
  },
  {
    headline: "Yazıhanede defter kapanışı",
    body: "Eksik kasa dedikodusu; isim yok.",
  },
  {
    headline: "Otopark farları söndü mü?",
    body: "Nöbetçi ‘kontrol edin’ anonsu yaptı.",
  },
];

const MAFIA_WHISPER = [
  {
    headline: "Çay ocağında isim fısıldandı",
    body: "Esnaf konuşmuyor. ‘Aidat’ kelimesi havada.",
  },
  {
    headline: "Gece ziyareti iddiası",
    body: "Yazıhane kapısı geç saatte çalındı deniyor.",
  },
];

function item(
  day: number,
  kind: NewsKind,
  headline: string,
  body: string,
  aboutPlayer = false
): NewsItem {
  return {
    id: uid(kind, day),
    headline,
    body,
    kind,
    aboutPlayer,
    day,
  };
}

export function buildMorningPaper(ctx: Ctx): NewsItem[] {
  const out: NewsItem[] = [];
  const f = ctx.fuelPrice;

  // Mazot / ekonomi (her sabah 1)
  const eco = pick(ECONOMY_H);
  const e =
    typeof eco === "function"
      ? eco(f)
      : (eco as { headline: string; body: string });
  out.push(item(ctx.day, "economy", e.headline, e.body));

  if (ctx.pendingFuel !== 0) {
    const up = ctx.pendingFuel > 0;
    out.push(
      item(
        ctx.day,
        "economy",
        up ? "YARIN ZAM SİNYALİ" : "YARIN İNDİRİM BEKLENTİSİ",
        up
          ? `Pompalarda +${Math.abs(ctx.pendingFuel)} ₺ konuşuluyor.`
          : `Mazotta −${Math.abs(ctx.pendingFuel)} ₺ söylentisi.`,
      )
    );
  }

  if (ctx.bayram) {
    const b = pick(BAYRAM_H);
    out.push(item(ctx.day, "bayram", b.headline, b.body));
  }

  if (Math.random() > 0.35) {
    const r = pick(RIVAL_H);
    out.push(item(ctx.day, "rival", r.headline, r.body));
  }

  if (Math.random() > 0.55) {
    const c = pick(CRASH_H);
    out.push(item(ctx.day, "crash", c.headline, c.body));
  }

  const col = pick(COLOR_H);
  out.push(item(ctx.day, "economy", col.headline, col.body));

  if (Math.random() > 0.7) {
    const m = pick(MAFIA_WHISPER);
    out.push(item(ctx.day, "rival", m.headline, m.body));
  }

  if (ctx.companyName && ctx.reputation >= 40 && Math.random() > 0.6) {
    out.push(
      item(
        ctx.day,
        "player",
        `${ctx.companyName} peronda anılıyor`,
        `${ctx.terminalName || "Terminal"} tarafında hareket var. İtibar ${ctx.reputation}.`,
        true
      )
    );
  }

  if (ctx.reputation < 25 && Math.random() > 0.5) {
    out.push(
      item(
        ctx.day,
        "player",
        `Şikâyet defteri: ${ctx.companyName}`,
        "Yolcu memnuniyeti düşük diyenler var.",
        true
      )
    );
  }

  return out.slice(0, 7);
}

export function buildEveningPaper(ctx: Ctx): NewsItem[] {
  const out: NewsItem[] = [];
  const base = pick(EVENING_H);
  out.push(item(ctx.day, "economy", base.headline, base.body));

  if (ctx.pendingFuel !== 0) {
    out.push(
      item(
        ctx.day,
        "economy",
        "Akşam: yarın pompa netleşir",
        `Beklenen hareket: ${ctx.pendingFuel > 0 ? "+" : ""}${ctx.pendingFuel} ₺.`,
      )
    );
  }

  if (ctx.lastEventType === "accident" || ctx.lastEventType === "jandarma") {
    out.push(
      item(
        ctx.day,
        "crash",
        ctx.lastEventType === "jandarma"
          ? `SON DAKİKA: ${ctx.companyName} bagaj dosyası`
          : "Akşam: gündüz kazası dosyası",
        ctx.lastEventType === "jandarma"
          ? "Tutanak ve itibar konuşuluyor."
          : "Mağdur yakınları açıklama bekliyor.",
        true
      )
    );
  }

  if (Math.random() > 0.5) {
    const r = pick(RIVAL_H);
    out.push(item(ctx.day, "rival", `Akşam: ${r.headline}`, r.body));
  }

  if (Math.random() > 0.6) {
    const c = pick(COLOR_H);
    out.push(item(ctx.day, "economy", c.headline, c.body));
  }

  return out.slice(0, 6);
}

/** Sabah baskısı için rastgele mazot delta (−2..+4) */
export function rollPendingFuelDelta(): number {
  const r = Math.random();
  if (r < 0.2) return 0;
  if (r < 0.45) return 1 + Math.floor(Math.random() * 3);
  if (r < 0.6) return -(1 + Math.floor(Math.random() * 2));
  return Math.random() > 0.5 ? 2 : -1;
}