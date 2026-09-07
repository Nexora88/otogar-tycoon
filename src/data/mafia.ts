export type MafiaTier = "hakiki" | "sahte";

/** gameStore + MafiaModal ortak tip */
export interface RegionalBoss {
  id: string;
  region: string;
  cities: string[];
  bossName: string;
  tier: MafiaTier;
  weeklyFee: number;
  message: string;
  refuseLine: string;
  payLine: string;
}

/** MafiaModal eski isimler için alias */
export type MafiaBoss = RegionalBoss & {
  kind: MafiaTier;
  cost: number;
  messageTemplate: string;
};

export const BOSSES: RegionalBoss[] = [
  {
    id: "trakya",
    region: "Trakya",
    cities: ["Edirne", "Tekirdağ", "Keşan", "İstanbul"],
    bossName: "Kel Niyazi",
    tier: "hakiki",
    weeklyFee: 5000,
    message:
      "Trakya toprağında teker dönsün istiyorsan, {name}, Kel Niyazi’nin selamıyla haftalık koruma konuşulur. Büyük balığa yem olma.",
    refuseLine: "Kapı çalınır… otopark sessiz kalmaz.",
    payLine: "Bu hafta sakin. Yolun açık.",
  },
  {
    id: "marmara",
    region: "Marmara",
    cities: ["İstanbul", "Bursa", "Balıkesir", "Çanakkale"],
    bossName: "Kartal Rıza",
    tier: "hakiki",
    weeklyFee: 7000,
    message:
      "Kartal Rıza abimiz peronları sever, {name}. Aidat düzenliyse farların yanar.",
    refuseLine: "Gece lastik sesi duyarsın.",
    payLine: "Defter temiz. Dokunulmazsın… şimdilik.",
  },
  {
    id: "ic",
    region: "İç Anadolu",
    cities: ["Ankara", "Eskişehir", "Konya", "Kayseri", "Sivas"],
    bossName: "Cemil Amca",
    tier: "hakiki",
    weeklyFee: 5500,
    message:
      "Cemil Amca’nın kapısı ağır açılır, {name}. Yazıhane aidatı peşin sevilir.",
    refuseLine: "Sabah gazetede ismin yanabilir.",
    payLine: "Amca memnun. Çayın soğumasın.",
  },
  {
    id: "ege",
    region: "Ege",
    cities: ["İzmir", "Manisa", "Aydın", "Muğla", "Denizli"],
    bossName: "Kordon Yılmaz",
    tier: "hakiki",
    weeklyFee: 6000,
    message:
      "Kordon tarafı kargaşa sevmez, {name}. Haftalık düzen, sefer düzen.",
    refuseLine: "Garaj kapısı boyanır… kötü anlamda.",
    payLine: "Deniz gibi sakin bu hafta.",
  },
  {
    id: "akdeniz",
    region: "Akdeniz",
    cities: ["Antalya", "Adana", "Mersin", "Hatay"],
    bossName: "Liman Salih",
    tier: "hakiki",
    weeklyFee: 5800,
    message:
      "Liman Salih bagajı da sever, aidatı da, {name}. Konuşalım mı?",
    refuseLine: "Tır parkı alev alabilir.",
    payLine: "Liman net. Geç.",
  },
  {
    id: "karadeniz",
    region: "Karadeniz",
    cities: ["Samsun", "Trabzon", "Zonguldak"],
    bossName: "Sisli Orhan",
    tier: "hakiki",
    weeklyFee: 4800,
    message:
      "Sisli Orhan’ın sesi kısık çıkar, {name}. Anlayan anlar.",
    refuseLine: "Yağmurda lastik patlar… tesadüf denir.",
    payLine: "Sis dağıldı. Devam.",
  },
  {
    id: "dogu",
    region: "Doğu",
    cities: ["Erzurum", "Van", "Malatya"],
    bossName: "Dağlı Behçet",
    tier: "hakiki",
    weeklyFee: 4500,
    message:
      "Dağlı Behçet uzun yolu bilir, {name}. Koruma parası da bilir.",
    refuseLine: "Kış erken gelir senin için.",
    payLine: "Yol açık, kar kapalı değil.",
  },
  {
    id: "guneydogu",
    region: "Güneydoğu",
    cities: ["Diyarbakır", "Gaziantep", "Şanlıurfa"],
    bossName: "Sıfır Nuri",
    tier: "hakiki",
    weeklyFee: 5200,
    message:
      "Sıfır Nuri rakamı net sever, {name}. Haftalık net olsun.",
    refuseLine: "Otoparkta sıfır kalır araç.",
    payLine: "Hesap kapandı. Selam söyleme.",
  },
  {
    id: "sahte_selim",
    region: "Peron",
    cities: [],
    bossName: "Peron Faresi Selim",
    tier: "sahte",
    weeklyFee: 1500,
    message:
      "Bak buraya {name}! Biz bu otogarın haracını yeriz. Vermezsen yazıhaneni basarız!",
    refuseLine: "…bir daha mesaj atamaz. Boş çıktı.",
    payLine: "Parayı kaptı, kayboldu. Sahteymiş.",
  },
  {
    id: "sahte_ramo",
    region: "Peron",
    cities: [],
    bossName: "Bagaj Ramo ve Çetesi",
    tier: "sahte",
    weeklyFee: 2000,
    message:
      "Bittin sen {name}! Kundaklarız! Hemen yatır!",
    refuseLine: "Blöf. Ertesi gün çay ocağında yoklar.",
    payLine: "Aldılar kaçtılar. Gerçek mafya değilmiş.",
  },
];

export function toMafiaBoss(b: RegionalBoss): MafiaBoss {
  return {
    ...b,
    kind: b.tier,
    cost: b.weeklyFee,
    messageTemplate: b.message,
  };
}

export function pickBossForCity(
  cityName: string | null | undefined
): RegionalBoss {
  const name = (cityName || "İstanbul").toString();
  const hit = BOSSES.filter(
    (b) =>
      b.tier === "hakiki" &&
      b.cities.some((c) =>
        name.toLowerCase().includes(c.toLowerCase().slice(0, 4))
      )
  );
  if (hit.length && Math.random() > 0.25) {
    return hit[Math.floor(Math.random() * hit.length)]!;
  }
  if (Math.random() > 0.65) {
    const fake = BOSSES.filter((b) => b.tier === "sahte");
    return fake[Math.floor(Math.random() * fake.length)]!;
  }
  const real = BOSSES.filter((b) => b.tier === "hakiki");
  return real[Math.floor(Math.random() * real.length)]!;
}

/** Modal için MafiaBoss döner */
export function pickMafiaBoss(
  cityName: string | null | undefined
): MafiaBoss {
  return toMafiaBoss(pickBossForCity(cityName));
}

export function fillTemplate(
  template: string,
  playerName: string,
  cost?: number
): string {
  return template
    .replace(/\{name\}/g, playerName || "Kaptan")
    .replace(/\{cost\}/g, String(cost ?? ""));
}

export function fillPlayer(msg: string, playerName: string) {
  return fillTemplate(msg, playerName);
}

export const HARASS_LINES = [
  "Hâlâ ödeme yok {name}. Kapı yine çalınır.",
  "Yazıhanen sakin sanma {name}. Biz unutmayız.",
  "Çay ocağında adın dönüyor {name}. Düşün.",
  "Bu peronda kulağımız var {name}. Hızlı ol.",
  "Lastiklerin sağlam mı {name}? Merak ettik.",
  "Hafta bitmeden haber bekleriz {name}.",
];

export const RACON_DELIKANLI =
  "Biz bu peronlara tırnaklarımızla kazıyarak geldik. Çakalların sözüyle ağalık masası devrilmez. Hadi naş!";

export const RACON_ESNAF =
  "Kaptan, biz de bu devletin, bu toprağın esnafıyız. Büyük balıklardan koruyacaksanız, buyurun çorba paranızı.";

export const MAFIA_NEWS_PAY = [
  (boss: string, city: string) =>
    ({
      headline: `${city}: “koruma” dedikodusu`,
      body: `${boss} adı fısıldanıyor. Resmi açıklama yok.`,
    }) as const,
];

export const MAFIA_NEWS_FIRE = [
  (plate: string, company: string) =>
    ({
      headline: `KUNDAK ŞÜPHESİ: ${plate}`,
      body: `${company} otoparkında gece yangını. Esnaf “mesaj” diyor, polis “soruşturma”.`,
    }) as const,
  (plate: string, company: string) =>
    ({
      headline: `Alev alan otobüs: ${plate}`,
      body: `${company} filosunda hasar. Tanık yok, kamera bulanık.`,
    }) as const,
];

export const MAFIA_NEWS_VISIT = [
  (boss: string) =>
    ({
      headline: `Çay ocağında ağır isim: ${boss}`,
      body: "Yazıhane kapıları erken kapandı. Esnaf dilini yuttu.",
    }) as const,
  (boss: string) =>
    ({
      headline: `${boss} selamı peronda`,
      body: "Kimse net konuşmuyor. Aidat kelimesi havada.",
    }) as const,
];