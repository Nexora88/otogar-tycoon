export type MafiaKind = "hakiki" | "sahte";

export interface MafiaBoss {
  id: string;
  kind: MafiaKind;
  bossName: string;
  region: string;
  cityIds: string[];
  cost: number;
  messageTemplate: string;
}

export const MAFIA_BOSSES: MafiaBoss[] = [
  {
    id: "kel_niyazi",
    kind: "hakiki",
    bossName: "Trakya Mafyası — Kel Niyazi",
    region: "Trakya",
    cityIds: ["edirne", "istanbul"],
    cost: 5000,
    messageTemplate:
      "{name}… Trakya toprağında izinsiz teker dönmez. Kel Niyazi’nin sözü net: her hafta {cost} ₺. Yoksa gece otoparkta alev görürsün. Bu son nazik konuşmamız.",
  },
  {
    id: "cemil_amca",
    kind: "hakiki",
    bossName: "Ankara Çemberi — Cemil Amca",
    region: "İç Anadolu",
    cityIds: ["ankara"],
    cost: 5500,
    messageTemplate:
      "{name}, başkentte kimse amcasız oturmaz. Cemil Amca selam gönderdi: {cost} ₺ yazıhane payı. Gecikme, manşet ve yangın aynı zarfta gelir.",
  },
  {
    id: "kartal_riza",
    kind: "hakiki",
    bossName: "Ege Hattı — Kartal Rıza",
    region: "Ege",
    cityIds: ["izmir"],
    cost: 4800,
    messageTemplate:
      "İzmir rüzgârı yüzünü keser {name}. Kartal Rıza’nın hesabı: {cost} ₺. Ödemezsen peron senin olmaz, enkaz senin olur.",
  },
  {
    id: "yilmaz_usta",
    kind: "hakiki",
    bossName: "Akdeniz Kolu — Yılmaz",
    region: "Akdeniz",
    cityIds: ["antalya", "adana"],
    cost: 5200,
    messageTemplate:
      "{name}, sahil sıcak ama hesap soğuk. Yılmaz’ın teklifi tek: {cost} ₺. Reddet, sabah küllerini süpürürsün.",
  },
  {
    id: "ramo",
    kind: "hakiki",
    bossName: "Karadeniz Bağı — Ramo",
    region: "Karadeniz",
    cityIds: ["samsun"],
    cost: 4500,
    messageTemplate:
      "Samsun çıkışı dar {name}. Ramo konuşuyor: {cost} ₺ koruma. Yoksa lastik değil, filon yanar.",
  },
  {
    id: "hasan_aga",
    kind: "hakiki",
    bossName: "Doğu Kapısı — Hasan Ağa",
    region: "Doğu",
    cityIds: ["erzurum"],
    cost: 4200,
    messageTemplate:
      "{name}, dağ uzun, sabır kısa. Hasan Ağa’nın şartı: {cost} ₺. Söz dinlemeyenin yolu kışta biter.",
  },
  {
    id: "peron_selim",
    kind: "sahte",
    bossName: "Peron Faresi Selim ve Çetesi",
    region: "Her yer",
    cityIds: [],
    cost: 1500,
    messageTemplate:
      "Dinle {name}! Bu otogarın haracı bize akar. {cost} ₺ yoksa yazıhaneyi basarız, bittin sen, her şeyi yakarız!",
  },
  {
    id: "caki_metin",
    kind: "sahte",
    bossName: "Çakı Metin’in Yedileri",
    region: "Her yer",
    cityIds: [],
    cost: 1200,
    messageTemplate:
      "{name}, adım Çakı Metin. {cost} ₺ kapıya. Yoksa peronda kanlı burun, kırık cam — seç beğen!",
  },
  {
    id: "kupon_ali",
    kind: "sahte",
    bossName: "Kupon Ali",
    region: "Her yer",
    cityIds: [],
    cost: 900,
    messageTemplate:
      "Ağa {name}, ben bu terminalin belasıyım! {cost} ₺ çabuk. Vermezsen… gömersin işini, haberin olsun!",
  },
];

export const HARASS_LINES = [
  "{name}, saat işliyor. Cevap yok, sabır da yok.",
  "Çayın soğudu. Borcun ısındı.",
  "Plakanı ezberledik {name}. Gece otopark ıssız olur.",
  "Yarın gazete senin adınla açılır. Bugün kurtulursun.",
  "Kapıyı çaldık, açmadın. Sonraki ziyaret camdan olur.",
  "Kaptanların uykusu kaçmasın diye hatırlatıyoruz.",
  "Üç gündür sessizlik {name}. Sessizlik pahalıdır.",
  "Küçük balık büyük balığa yol verir. Sen hangisisin?",
  "Yazıhane ışığı yanıyor. Biz de uyanığız.",
  "Bu son nazik mesaj olabilir.",
  "Aidat yoksa alev var. Basit matematik.",
  "Peronda adın dönüyor — iyi anlamda değil.",
  "Çorba parası kavramını severiz. İnkarı sevmek zor.",
  "Racon kitaptan okunmaz. Peronda yazılır.",
  "Bugün kapıdan geldik. Yarın başka yerden geliriz.",
];

export const RACON_DELIKANLI =
  "Biz bu peronlara tırnaklarımızla kazıyarak geldik. Çakalların sözüyle ağalık masası devrilmez. Hadi naş!";

export const RACON_ESNAF =
  "Kaptan, biz de bu toprağın esnafıyız. Düzen istiyorsanız buyurun çorba paranız — hesabı kapatalım.";

export function fillTemplate(t: string, name: string, cost: number): string {
  return t.replace(/\{name\}/g, name).replace(/\{cost\}/g, String(cost));
}

export function pickBossForCity(cityId: string | null): MafiaBoss {
  const regional = MAFIA_BOSSES.filter(
    (b) => b.kind === "hakiki" && cityId && b.cityIds.includes(cityId)
  );
  const fake = MAFIA_BOSSES.filter((b) => b.kind === "sahte");
  if (Math.random() < 0.55 || regional.length === 0) {
    return fake[Math.floor(Math.random() * fake.length)];
  }
  return regional[Math.floor(Math.random() * regional.length)];
  }
