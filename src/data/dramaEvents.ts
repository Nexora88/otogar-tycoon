export type DramaKind =
  | "fight"
  | "mafia"
  | "passenger"
  | "crier"
  | "inspection"
  | "good";

export interface DramaEvent {
  id: string;
  kind: DramaKind;
  title: string;
  body: string;
  choices: {
    id: string;
    label: string;
    trustDelta: number;
    moneyDelta: number;
    fameDelta: number;
    fatigueDelta: number;
    result: string;
  }[];
}

function uid() {
  return `dr-${Date.now()}-${Math.floor(Math.random() * 1e5)}`;
}

const FIGHTS: Omit<DramaEvent, "id">[] = [
  {
    kind: "fight",
    title: "Peronda bağırış",
    body: "İki yolcu koltuk yüzünden itişiyor. Muavin bakıyor, sen oradasın.",
    choices: [
      {
        id: "f1",
        label: "Araya gir, sakinleştir",
        trustDelta: 2,
        moneyDelta: 0,
        fameDelta: 1,
        fatigueDelta: 8,
        result: "Ortalık dindi. Patron: “İyi ki vardı.”",
      },
      {
        id: "f2",
        label: "Görmezden gel",
        trustDelta: -1,
        moneyDelta: 0,
        fameDelta: -1,
        fatigueDelta: 0,
        result: "Olay büyüdü. Şikâyet defterine yazıldı.",
      },
      {
        id: "f3",
        label: "Abiye haber ver",
        trustDelta: 1,
        moneyDelta: 0,
        fameDelta: 0,
        fatigueDelta: 2,
        result: "Abi geldi, dağıttı. Sen kenarda kaldın — akıllıca.",
      },
    ],
  },
  {
    kind: "fight",
    title: "Çığırtkan kapışması",
    body: "Rakip firmanın çığırtkanı bizim perona girdi. Bağırış başladı.",
    choices: [
      {
        id: "c1",
        label: "Seslen, bizim hattı savun",
        trustDelta: 2,
        moneyDelta: 0,
        fameDelta: 2,
        fatigueDelta: 5,
        result: "Sesin duyuldu. Yolcu bizde kaldı.",
      },
      {
        id: "c2",
        label: "Sessiz kal",
        trustDelta: -2,
        moneyDelta: 0,
        fameDelta: -1,
        fatigueDelta: 0,
        result: "Patron: “Dilin mi yoktu?”",
      },
    ],
  },
];

const MAFIA: Omit<DramaEvent, "id">[] = [
  {
    kind: "mafia",
    title: "Kapıya iki adam",
    body: "“Yazıhane aidatı konuşulacak” diyorlar. Sesleri düşük, bakışları ağır.",
    choices: [
      {
        id: "m1",
        label: "Patrona koş, haber ver",
        trustDelta: 3,
        moneyDelta: 0,
        fameDelta: 1,
        fatigueDelta: 4,
        result: "Patron teşekkür etti. “Gözün açık kalsın.”",
      },
      {
        id: "m2",
        label: "“Ben çırakım, bilmem” de",
        trustDelta: 0,
        moneyDelta: 0,
        fameDelta: 0,
        fatigueDelta: 2,
        result: "Adamlar gülümsedi. “Büyüyünce konuşuruz.”",
      },
      {
        id: "m3",
        label: "Cebinden ufak tut",
        trustDelta: -2,
        moneyDelta: -200,
        fameDelta: -1,
        fatigueDelta: 3,
        result: "Parayı aldılar. İçin rahat değil — ve yetmez.",
      },
    ],
  },
];

const PASSENGER: Omit<DramaEvent, "id">[] = [
  {
    kind: "passenger",
    title: "Yolcu el kaldırdı",
    body: "“Su yok mu kaptan?” Sen muavin değilsin ama bakıyorlar.",
    choices: [
      {
        id: "p1",
        label: "Su / kek uzat (yardım)",
        trustDelta: 1,
        moneyDelta: 0,
        fameDelta: 1,
        fatigueDelta: 3,
        result: "Yolcu teşekkür etti. Küçük bir artı.",
      },
      {
        id: "p2",
        label: "“Muavin gelir” de geç",
        trustDelta: -1,
        moneyDelta: 0,
        fameDelta: 0,
        fatigueDelta: 0,
        result: "Yüzler asıldı. Şikâyet fısıltısı.",
      },
    ],
  },
];

const GOOD: Omit<DramaEvent, "id">[] = [
  {
    kind: "good",
    title: "Bahşiş",
    body: "Yaşlı amca cebinden 50 ₺ uzattı. “Aferin evlat.”",
    choices: [
      {
        id: "g1",
        label: "Al, teşekkür et",
        trustDelta: 0,
        moneyDelta: 50,
        fameDelta: 1,
        fatigueDelta: 0,
        result: "Cebine girdi. İçin ısındı.",
      },
      {
        id: "g2",
        label: "Reddet, “işimiz” de",
        trustDelta: 2,
        moneyDelta: 0,
        fameDelta: 2,
        fatigueDelta: 0,
        result: "Amca şaşırdı. Patron duysa sevini.",
      },
    ],
  },
];

const INSP: Omit<DramaEvent, "id">[] = [
  {
    kind: "inspection",
    title: "Zabıta sordu",
    body: "“Bu peronun sorumlusu kim?” Defter eli boş.",
    choices: [
      {
        id: "i1",
        label: "Doğruyu söyle, patronu göster",
        trustDelta: 2,
        moneyDelta: 0,
        fameDelta: 0,
        fatigueDelta: 2,
        result: "Zabıta yazıhaneye gitti. Sen temiz kaldın.",
      },
      {
        id: "i2",
        label: "“Bilmiyorum” de",
        trustDelta: -2,
        moneyDelta: 0,
        fameDelta: -1,
        fatigueDelta: 0,
        result: "Yalan kısa sürdü. Güven düştü.",
      },
    ],
  },
];

export function rollDramaEvent(): DramaEvent {
  const pools = [...FIGHTS, ...MAFIA, ...PASSENGER, ...GOOD, ...INSP];
  const base = pools[Math.floor(Math.random() * pools.length)]!;
  return { ...base, id: uid() };
}