/** Çırak / peron kariyeri — kombinasyonel diyalog motoru */

export type ShiftBand = "morning" | "noon" | "evening" | "night";
export type CareerRank =
  | "cirak"
  | "yamak"
  | "muavin"
  | "kaptan_yamagi"
  | "bagimsiz";

export type TaskKind =
  | "cay"
  | "tost"
  | "gazete"
  | "temizlik"
  | "bagaj"
  | "ikram"
  | "yolcu"
  | "kasa"
  | "pis"
  | "rusvet"
  | "patron_cagri";

export interface DialogueOption {
  id: string;
  label: string;
  /** -2..+2 iç güven */
  trustDelta: number;
  moneyDelta: number;
  /** 0..1 yakalanma / olay şansı ek */
  risk: number;
  tone: "obedient" | "lazy" | "sassy" | "honest" | "crooked";
}

export interface WorkTask {
  id: string;
  kind: TaskKind;
  band: ShiftBand;
  from: "patron" | "abi" | "yolcu" | "sistem";
  speakerName: string;
  prompt: string;
  options: DialogueOption[];
}

export interface OutcomeLine {
  tone: DialogueOption["tone"] | "caught" | "clean";
  lines: string[];
}

// ——— Havuzlar ———
export const COMPANY_NAMES = [
  "Yıldız Tur",
  "Boncuk Seyahat",
  "Anadolu Koç",
  "Peron Express",
  "Sahil Yolu",
  "Emektaş",
  "Ufuk Otobüs",
  "Trakya Birlik",
  "Karadeniz Can",
  "İç Anadolu Hız",
  "Akdeniz Yıldız",
  "Doğu Kapı",
  "Güneydoğu Hat",
  "Marmara Line",
  "Keşan Ovası Tur",
  "AŞTİ Bağlantı",
  "Esenler Dost",
  "Topkapı Sefer",
  "Çevre Yol",
  "Kaptanlar Birliği",
];

export const PATRON_FIRST = [
  "Hasan",
  "Kemal",
  "Rıza",
  "Cemil",
  "Nuri",
  "Salih",
  "Orhan",
  "Turgut",
  "Şükrü",
  "Fahri",
  "Muzaffer",
  "Ekrem",
  "Yavuz",
  "Selahattin",
  "Behçet",
];

export const PATRON_TITLE = [
  "Usta",
  "Amca",
  "Ağa",
  "Patron",
  "Reis",
  "Bey",
];

export const ABI_FIRST = [
  "Metin",
  "Selim",
  "Ramo",
  "Cengiz",
  "Taner",
  "İsmail",
  "Doğan",
  "Kadir",
  "Neşet",
  "Haydar",
  "Zeki",
  "Adem",
  "Birol",
  "Celal",
  "Fikret",
];

export const MEMLEKET_HITAP = [
  "Keşanlı",
  "Samsunlu",
  "Ankaralı",
  "İzmirli",
  "Bursalı",
  "Adanalı",
  "Trabzonlu",
  "Edirneli",
  "Konyalı",
  "Vanlı",
  "Gaziantepli",
  "Erzurumlu",
  "Antalyalı",
  "Diyarbakırlı",
  "Mersinli",
];

const CAY_PROMPT = [
  "Çaylar soğudu. İki bardak, şekerli — çabuk.",
  "Ocağa uğra. Bana ve {abi}'ye çay.",
  "Çaycıya söyle, demlik taze olsun. Getir.",
  "Sabah çayı olmadan peron açılmaz. Haydi.",
  "Şu bardakları doldur da gel, soğuk istemem.",
  "Çay ocağı kuyruk. Senin elin hızlı, çöz.",
];

const TOST_PROMPT = [
  "Tostçu Usta’ya üç tost, acele. Üstü peşin değil, yazdır.",
  "Gişeye tost kokusu gelecek kadar hızlı ol.",
  "Bir ayvalık, bir kaşar. Karıştırma.",
  "Tost bitti demesinler, peron isyan eder.",
];

const GAZETE_PROMPT = [
  "Sabah baskısını getir. Manşete bakmadan gelme.",
  "Hakiki Peron’u al, köşedeki satıcıdan.",
  "Gazete + bir paket sigara defteri — unutma.",
  "Akşam baskısı çıkmış olabilir, kontrol et.",
];

const TEMIZLIK_PROMPT = [
  "1 nolu peronu süpür, yolcu basmadan.",
  "Yazıhane önü çamur. Bez + kova.",
  "Koltuk arkası çöp. Kimse bakmıyor, sen bak.",
  "Tuvalet sırası koku yapmış. Maske tak, hallet.",
];

const BAGAJ_PROMPT = [
  "Şu valizleri bagaja diz, etiketleri karıştırma.",
  "Yaşlı teyzenin sandığı ağır. Yardım et, şikâyet istemem.",
  "Bagaj taştı. Alttakileri sıkı bağla.",
];

const IKRAM_PROMPT = [
  "Ankara seferine kek-su dağıt. Eksik kutu yok.",
  "Çocuk ağlıyor, pişmaniye kalmışsa ver.",
  "Arka sıra susuz kalmış. Tepsiyle gez.",
  "İkram bitmiş gibi yapma, sayım tutuyoruz.",
];

const YOLCU_PROMPT = [
  "El kaldıran var: ‘Su yok mu?’ İlglen.",
  "Yolcu koltuk ıslak diyor. Bez veya çözüm.",
  "Kayıp çanta. Emanetçiye yaz, adı al.",
  "İki yolcu bağırışıyor. Ayır, olay çıkmasın.",
];

const KASA_PROMPT = [
  "Gişe kasasını say. Deftere yaz, imza at.",
  "Akşam sayımı. Eksik olursa senin boynuna.",
  "Kasa 200 görünüyor. Deftere net yaz.",
  "Gece kapanışı: say, yaz, anahtarı bırak.",
];

const PIS_PROMPT = [
  "Koltuk kusmuk. Temizle, kimse gönüllü değil.",
  "Otoparkta yağ leke. Kum at, sil.",
  "Tuvalet taşmış. Uğraş, sonra yıkan.",
  "Fare öldü köşede. Torba, çabuk.",
];

const RUSVET_PROMPT = [
  "Bu bagajı görmedin. 500 sende. Konuşma.",
  "Gişede şu bileti kesme, aramızda. Payın hazır.",
  "Polis sormadan önce bu koliyi sakla. Parası peşin.",
];

const PATRON_CAGRI_PROMPT = [
  "Yazıhaneye gel. Bekletme.",
  "Kapıyı çaldım say. İçeri.",
  "Sadece sen. Defter açık, konuşacağız.",
  "Çayın yanında değil, masamın önünde ol.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function hitap(memleket: string, name: string) {
  return `${memleket} ${name}`.trim();
}

export function randomCompany() {
  return pick(COMPANY_NAMES);
}

export function randomPatronName() {
  return `${pick(PATRON_FIRST)} ${pick(PATRON_TITLE)}`;
}

export function randomAbiName() {
  return `${pick(ABI_FIRST)} Abi`;
}

export function getShiftBand(hour: number): ShiftBand {
  if (hour >= 6 && hour < 11) return "morning";
  if (hour >= 11 && hour < 16) return "noon";
  if (hour >= 16 && hour < 22) return "evening";
  return "night";
}

export function shiftLabel(b: ShiftBand): string {
  switch (b) {
    case "morning":
      return "Sabah vardiyası";
    case "noon":
      return "Öğle yoğunluğu";
    case "evening":
      return "Akşam vardiyası";
    case "night":
      return "Gece nöbeti";
  }
}

const OPTIONS_OBEY: DialogueOption[] = [
  { id: "obey1", label: "Hemen gideyim.", trustDelta: 1, moneyDelta: 0, risk: 0, tone: "obedient" },
  { id: "obey2", label: "Başüstüne, şimdi.", trustDelta: 2, moneyDelta: 0, risk: 0, tone: "obedient" },
  { id: "obey3", label: "Tamam patron, hallederim.", trustDelta: 1, moneyDelta: 0, risk: 0, tone: "obedient" },
];

const OPTIONS_DELAY: DialogueOption[] = [
  { id: "del1", label: "Birazdan, yorgunum.", trustDelta: -2, moneyDelta: 0, risk: 0.05, tone: "lazy" },
  { id: "del2", label: "Abiden izin alıp geleyim.", trustDelta: -1, moneyDelta: 0, risk: 0, tone: "sassy" },
  { id: "del3", label: "Sefer bitince bakarım.", trustDelta: -1, moneyDelta: 0, risk: 0.05, tone: "lazy" },
];

const OPTIONS_SASSY: DialogueOption[] = [
  { id: "sas1", label: "Bugün de mi ben?", trustDelta: -2, moneyDelta: 0, risk: 0.1, tone: "sassy" },
  { id: "sas2", label: "Başka kimse yok mu?", trustDelta: -1, moneyDelta: 0, risk: 0.05, tone: "sassy" },
];

const OPTIONS_KASA: DialogueOption[] = [
  { id: "kasa_honest", label: "Olduğu gibi yaz (dürüst).", trustDelta: 2, moneyDelta: 0, risk: 0, tone: "honest" },
  { id: "kasa_skim10", label: "Biraz eksik yaz, 10–20 ₺ cebime.", trustDelta: -1, moneyDelta: 20, risk: 0.28, tone: "crooked" },
  { id: "kasa_skim40", label: "Cömertçe kes, 40–50 ₺.", trustDelta: -2, moneyDelta: 45, risk: 0.48, tone: "crooked" },
];

const OPTIONS_RUSVET: DialogueOption[] = [
  { id: "r_accept", label: "Görmedim. Parayı al.", trustDelta: -1, moneyDelta: 500, risk: 0.35, tone: "crooked" },
  { id: "r_refuse", label: "Yok. İşime bakıyorum.", trustDelta: 1, moneyDelta: 0, risk: 0.05, tone: "honest" },
  { id: "r_snitch", label: "Patrona söyleyeceğim.", trustDelta: 0, moneyDelta: 0, risk: 0.55, tone: "sassy" },
];

const OUTCOMES: OutcomeLine[] = [
  {
    tone: "obedient",
    lines: [
      "Aferin oğlum. Böyle çalışılır bu peronda.",
      "Tamam, gözüm senden yana.",
      "Helal. Deftere artı yazdım say.",
      "Böyle devam, yerin sağlamlaşır.",
      "İyi. Çayın yanında senin adın da anılır.",
      "Doğru cevap. Dağılma, iş bitmedi.",
    ],
  },
  {
    tone: "lazy",
    lines: [
      "Seni ne diye aldık? Fırla.",
      "Yorgunluk peronda değil, evde. Haydi.",
      "Birazdan diye iş yürümüyor. Şimdi.",
      "Ağzını açma, ayaklarını konuştur.",
      "Yarın yerin dolu olabilir. Düşün.",
    ],
  },
  {
    tone: "sassy",
    lines: [
      "Dilini tut. Burada patron benim.",
      "Başka kimse yok, sen varsın. Bitir.",
      "Lafı uzatma. Kapı orada, iş burada.",
      "Abiden izin mi? İzin benden. Git.",
    ],
  },
  {
    tone: "honest",
    lines: [
      "Temiz iş. Peron böyle ayakta kalır.",
      "Dürüstlük unutulmaz. Not ettim.",
      "İyi. Bu seferlik gönlüm rahat.",
      "Keşke hepsi senin gibi yazsa defteri.",
    ],
  },
  {
    tone: "crooked",
    lines: [
      "Sessiz kal. Kimse duymadı… şimdilik.",
      "Payın cebinde. Ağzın kilitli kalsın.",
      "Bu işler konuşulmaz. Kaybol.",
      "Parayı gördüm say. Göz göze gelme.",
    ],
  },
  {
    tone: "caught",
    lines: [
      "200 yazılacak yere eksik mi? Elin cebinde, aklın nerede? Bu peronda hırsızın adı çıkar. Defol gözümün önünden — yarın konuşuruz.",
      "Sayımı ben de yaptım. Fark sende. Utanmadan bakıyorsun. Güven zedelenir, bir daha kolay düzelmez.",
      "Cebini boşalt. Deftere doğru yaz. Bir daha yakalarsam kapı yüzüne kapanır.",
      "Abiler duymasın diye mi? Duydular. Peron dedikodusu senden hızlı yürür.",
    ],
  },
  {
    tone: "clean",
    lines: [
      "Sayım tuttu. Anahtarı bırak, git.",
      "Defter temiz. Bu gece sorun yok.",
      "İmza tamam. Yarın aynı disiplin.",
    ],
  },
];

export function outcomeFor(
  tone: DialogueOption["tone"],
  caught: boolean
): string {
  if (caught) return pick(OUTCOMES.find((o) => o.tone === "caught")!.lines);
  if (tone === "honest" && !caught)
    return pick(OUTCOMES.find((o) => o.tone === "clean")!.lines);
  const block = OUTCOMES.find((o) => o.tone === tone) || OUTCOMES[0]!;
  return pick(block.lines);
}

function optionsForKind(kind: TaskKind): DialogueOption[] {
  if (kind === "kasa") return OPTIONS_KASA.map((o) => ({ ...o, id: uid(o.id) }));
  if (kind === "rusvet")
    return OPTIONS_RUSVET.map((o) => ({ ...o, id: uid(o.id) }));
  // 2–3 seçenek: itaat + gecikme + bazen sassy
  const pool = [...OPTIONS_OBEY, ...OPTIONS_DELAY];
  if (Math.random() > 0.55) pool.push(pick(OPTIONS_SASSY));
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((o) => ({ ...o, id: uid(o.id) }));
}

function promptsFor(kind: TaskKind, abiName: string): string[] {
  const fill = (arr: string[]) =>
    arr.map((s) => s.replace(/\{abi\}/g, abiName));
  switch (kind) {
    case "cay":
      return fill(CAY_PROMPT);
    case "tost":
      return fill(TOST_PROMPT);
    case "gazete":
      return fill(GAZETE_PROMPT);
    case "temizlik":
      return fill(TEMIZLIK_PROMPT);
    case "bagaj":
      return fill(BAGAJ_PROMPT);
    case "ikram":
      return fill(IKRAM_PROMPT);
    case "yolcu":
      return fill(YOLCU_PROMPT);
    case "kasa":
      return fill(KASA_PROMPT);
    case "pis":
      return fill(PIS_PROMPT);
    case "rusvet":
      return fill(RUSVET_PROMPT);
    case "patron_cagri":
      return fill(PATRON_CAGRI_PROMPT);
  }
}

const BAND_KINDS: Record<ShiftBand, TaskKind[]> = {
  morning: ["cay", "tost", "gazete", "temizlik", "patron_cagri"],
  noon: ["ikram", "yolcu", "bagaj", "cay", "patron_cagri"],
  evening: ["kasa", "ikram", "bagaj", "temizlik", "pis", "patron_cagri"],
  night: ["kasa", "pis", "rusvet", "yolcu", "patron_cagri"],
};

export function generateTask(opts: {
  band: ShiftBand;
  patronName: string;
  abiName: string;
  forceKind?: TaskKind;
}): WorkTask {
  const kinds = BAND_KINDS[opts.band];
  const kind = opts.forceKind || pick(kinds);
  const from: WorkTask["from"] =
    kind === "yolcu"
      ? "yolcu"
      : kind === "rusvet"
        ? "abi"
        : kind === "patron_cagri"
          ? "patron"
          : Math.random() > 0.35
            ? "patron"
            : "abi";
  const speakerName =
    from === "patron"
      ? opts.patronName
      : from === "abi"
        ? opts.abiName
        : from === "yolcu"
          ? "Yolcu"
          : "Sistem";
  const prompt = pick(promptsFor(kind, opts.abiName));
  return {
    id: uid("task"),
    kind,
    band: opts.band,
    from,
    speakerName,
    prompt,
    options: optionsForKind(kind),
  };
}

/** Bir oturumda 2–4 görev üret (tekrar kind azalt) */
export function generateShiftTasks(opts: {
  band: ShiftBand;
  patronName: string;
  abiName: string;
  count?: number;
}): WorkTask[] {
  const n = opts.count ?? 2 + Math.floor(Math.random() * 3);
  const used = new Set<TaskKind>();
  const list: WorkTask[] = [];
  for (let i = 0; i < n; i++) {
    let kind = pick(BAND_KINDS[opts.band]);
    let guard = 0;
    while (used.has(kind) && guard++ < 8) {
      kind = pick(BAND_KINDS[opts.band]);
    }
    used.add(kind);
    list.push(
      generateTask({
        band: opts.band,
        patronName: opts.patronName,
        abiName: opts.abiName,
        forceKind: kind,
      })
    );
  }
  return list;
}

export const MAFIA_HEADLINES = [
  "KEŞAN HATTI: Kel Niyazi çay ocağında görüldü — esnaf konuşmuyor",
  "Peron yazıhanesine gece ziyareti — ‘aidat’ dedikodusu",
  "Otopark yangını: kundak şüphesi, firma sessiz",
  "Trakya’da ‘koruma parası’ iddiası — savcılık soruşturma açtı",
  "Ankara çemberinde isimler fısıldanıyor: Cemil Amca sahnesi",
  "Bagajda koli, yolda kontrol: peronlar gerildi",
  "Gece farları sönük yazıhane — sabah manşeti hazır",
];

export const JOB_OFFERS = [
  {
    company: "Boncuk Turizm",
    body: "Muavin arıyoruz. Yevmiye + ikram payı. Görüşelim.",
  },
  {
    company: "Anadolu Koç",
    body: "Gişe yamağı. Temiz iş, düzenli ödeme.",
  },
  {
    company: "Sahil Express",
    body: "Gece seferi muavin. Cesaretin varsa konuş.",
  },
  {
    company: "Emektaş",
    body: "Bagaj sorumlusu. Ağır iş, iyi pay.",
  },
];

export const RANK_LABEL: Record<CareerRank, string> = {
  cirak: "Çırak",
  yamak: "Yamak",
  muavin: "Muavin",
  kaptan_yamagi: "Kaptan yamağı",
  bagimsiz: "Bağımsız esnaf",
};

export function nextRank(r: CareerRank): CareerRank | null {
  const order: CareerRank[] = [
    "cirak",
    "yamak",
    "muavin",
    "kaptan_yamagi",
    "bagimsiz",
  ];
  const i = order.indexOf(r);
  if (i < 0 || i >= order.length - 1) return null;
  return order[i + 1]!;
}

export function rankThreshold(r: CareerRank): { trust: number; fame: number; savings: number } {
  switch (r) {
    case "cirak":
      return { trust: 0, fame: 0, savings: 0 };
    case "yamak":
      return { trust: 12, fame: 5, savings: 2000 };
    case "muavin":
      return { trust: 28, fame: 15, savings: 8000 };
    case "kaptan_yamagi":
      return { trust: 45, fame: 30, savings: 20000 };
    case "bagimsiz":
      return { trust: 60, fame: 45, savings: 45000 };
  }
}