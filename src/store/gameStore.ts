"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getGlobalGameClock } from "@/lib/gameTime";
import {
  getCalendarBeat,
  calendarHeadlineForPaper,
  type CalendarBeat,
} from "@/lib/nationalCalendar";

// ═══════════════════════════════════════════
// TİPLER
// ═══════════════════════════════════════════

export type BusColor = "blue" | "red" | "white" | "green" | "black" | "cream";
export type Catering = "water" | "snack" | "vip";
export type ExpeditionStatus = "filling" | "departed" | "completed";
export type DayMoodLite = "normal" | "national" | "mourning";
export type TerminalSlot =
  | "empty"
  | "toilet"
  | "bufe"
  | "emanet"
  | "office"
  | "peron";

export interface GameBus {
  id: string;
  model: string;
  seatCount: number;
  engineHealth: number;
  color: BusColor;
  name: string;
  fuelUse: number;
  muavinCost: number;
  plate: string;
  sticker?: string | null;
  repairingUntil?: number | null;
  impoundedUntil?: number | null;
}

export interface Passenger {
  id: string;
  name: string;
  mood: "happy" | "normal" | "angry";
}

export interface Expedition {
  id: string;
  busId: string;
  origin: string;
  destination: string;
  departureTime: number;
  ticketPrice: number;
  catering: Catering;
  status: ExpeditionStatus;
  soldTickets: number;
  maxSeats: number;
  passengers: Passenger[];
  createdAt: number;
  driverId?: string | null;
  muavinId?: string | null;
  driveMode?: string;
  progress: number;
  log: string[];
  smuggle?: boolean;
  smugglePaid?: number;
  currentEvent?: string | null;
}

export interface Driver {
  id: string;
  name: string;
  role: "driver" | "muavin";
  skill: number;
  wage: number;
  fatigue: number;
  onExpedition: boolean;
  hiredAt: number;
}

export interface LedgerRow {
  label: string;
  amount: number;
  at: number;
}

export interface PhoneMsg {
  id: string;
  from: string;
  body: string;
  type: "sms" | "call";
  at: number;
  read: boolean;
}

/** İmzalı kredi — vade + kefil + dava */
export interface LoanContract {
  principal: number;
  totalDue: number;
  paid: number;
  guarantor: string;
  signedAtDay: number;
  dueDay: number;
  dueLabel: string;
  active: boolean;
  lawsuit: boolean;
}

export interface RoadEvent {
  type: string;
  title: string;
  description: string;
  moneyChange: number;
  reputationChange: number;
  emoji: string;
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  tag?: string;
}

/** Mafya / kapı — çalışır alanlar */
export interface RegionalBoss {
  id: string;
  bossName: string;
  message: string;
  cost: number;
  type: "hakiki" | "sahte";
  region: string;
}

export interface BusListing {
  id: string;
  model: string;
  seatCount: number;
  price: number;
  fuelUse: number;
  color: BusColor;
}

export interface GameState {
  isGuest: boolean;
  companyName: string;
  playerName: string;
  balance: number;
  reputation: number;
  buses: GameBus[];
  expeditions: Expedition[];
  drivers: Driver[];
  hasPlayedOnce: boolean;
  lastEvent: RoadEvent | null;
  showComplaintModal: boolean;
  currentComplaint: string | null;
  complaints: string[];
  accountingLevel: number;
  customerServiceLevel: number;
  bankDebt: number;
  taxDue: number;
  ledger: LedgerRow[];
  terminalName: string;
  terminalSlots: TerminalSlot[];
  terminalBuilt: boolean;
  setupDone: boolean;
  homeCityId: string;
  gameYear: number;
  gameDay: number;
  gameHour: number;
  lastTimeTick: number;
  morningPaper: NewsItem[];
  eveningPaper: NewsItem[];
  newspaper: NewsItem[];
  paperNotify: "morning" | "evening" | null;
  phoneOpen: boolean;
  phoneMessages: PhoneMsg[];
  officeNotes: string;
  officeTitle: string;
  loanContract: LoanContract | null;
  lastDebtInterestDay: number;
  activeBoss: RegionalBoss | null;
  mafiaDebtDue: boolean;
  lastMafiaDay: number;
  crierLevel: number;
  ağaEnergy: number;
  teaStock: number;
  bayramActive: boolean;
  rivalWeak: boolean;
  guestDayLimit: number;
  forceRegister: boolean;
  fuelPrice: number;
  roomCode: string | null;
  roomName: string | null;
  calendarMood: DayMoodLite;
  calendarTitle: string;
  lastCalendarCode: string;
  lastTicket: null | Record<string, unknown>;
  deskRented: boolean;

  startAsGuest: () => void;
  setCompanyName: (n: string) => void;
  setPlayerName: (n: string) => void;
  addMoney: (a: number) => void;
  spendMoney: (a: number) => boolean;
  addLedger: (l: string, a: number) => void;
  pushPhone: (from: string, body: string, type?: "sms" | "call") => void;
  tickGameTime: () => void;
  applyCalendarBeat: (b: CalendarBeat) => void;
  generateDailyNews: () => void;
  openNewspaper: () => void;
  closeNewspaper: () => void;
  openPaperEdition: (ed: "morning" | "evening") => void;
  clearPaperNotify: () => void;
  setPhoneOpen: (v: boolean) => void;
  rollRoadEvent: (exp: Expedition) => RoadEvent | null;
  addExpedition: (e: Expedition) => void;
  updateExpedition: (id: string, p: Partial<Expedition>) => void;
  settleExpeditionProfit: (p: number) => number;
  canUseBus: (busId: string) => boolean;
  setDriverBusy: (id: string, busy: boolean) => void;
  addFatigue: (id: string, n: number) => void;
  hireDriver: (
    d: Omit<Driver, "id" | "hiredAt" | "fatigue" | "onExpedition">
  ) => boolean;
  takeBankLoan: (a: number) => boolean;
  signLoanContract: (principal: number, guarantor: string) => boolean;
  payBankDebt: (a: number) => boolean;
  payTax: () => boolean;
  accrueTax: (p: number) => void;
  setOfficeNotes: (n: string) => void;
  setOfficeTitle: (t: string) => void;
  mafiaVisit: () => void;
  payMafia: () => void;
  refuseMafia: () => void;
  drinkTea: () => void;
  priceCapMultiplier: () => number;
  crierBonus: () => number;
  setHasPlayedOnce: () => void;
  setLastTicket: (t: Record<string, unknown> | null) => void;
  clearLastEvent: () => void;
  completeCitySetup: (cityId: string) => boolean;
  createRoom: (name: string) => string;
  joinRoom: (code: string) => boolean;
  leaveRoom: () => void;
  shareRoomText: () => string;
  resetGame: () => void;
  resetGameFull: () => void;
  collectPassiveIncome: () => void;
  upgradeAccounting: () => boolean;
  upgradeCustomerService: () => boolean;
  buyBus: (l: BusListing) => boolean;
  paintBus: (id: string, c: BusColor) => void;
  setBusPlate: (id: string, p: string) => void;
  applySticker: (busId: string, stickerId: string) => boolean;
  openComplaint: (t: string) => void;
  closeComplaint: () => void;
  rentDesk: () => boolean;
}

// ═══════════════════════════════════════════
// İKRAM / STICKER / PAZAR
// ═══════════════════════════════════════════

export const CATERING_INFO: Record<
  Catering,
  { label: string; perSeat: number; repMod: number; desc: string }
> = {
  water: {
    label: "Ucuz İkram",
    perSeat: 3,
    repMod: -2,
    desc: "Musluk + bisküvi — şikayet riski",
  },
  snack: {
    label: "Standart",
    perSeat: 18,
    repMod: 0,
    desc: "Kek + kola",
  },
  vip: {
    label: "Lüks",
    perSeat: 55,
    repMod: 3,
    desc: "Çay + pişmaniye — itibar+",
  },
};

export const STICKERS = [
  { id: "sulh", label: "Yurtta sulh, cihanda sulh", cost: 2000, rep: 4 },
  { id: "egemen", label: "Egemenlik kayıtsız şartsız milletindir", cost: 2500, rep: 3 },
  { id: "thy", label: "Tek rakibim THY", cost: 5000, rep: 5 },
  { id: "kesan", label: "Keşanlı", cost: 2500, rep: 2 },
  { id: "nexora", label: "Nexora Elektronik 1987", cost: 4000, rep: 3 },
  { id: "bakrac", label: "Bakraç Ticaret", cost: 3500, rep: 2 },
  { id: "otogar", label: "Otogar Tycoon", cost: 1500, rep: 1 },
];

export const BUS_MARKET: BusListing[] = [
  {
    id: "o302",
    model: "Mercedes O302",
    seatCount: 42,
    price: 45000,
    fuelUse: 28,
    color: "blue",
  },
  {
    id: "o303",
    model: "Mercedes O303",
    seatCount: 46,
    price: 78000,
    fuelUse: 26,
    color: "cream",
  },
  {
    id: "travego",
    model: "Travego (saha)",
    seatCount: 48,
    price: 180000,
    fuelUse: 24,
    color: "white",
  },
];

// ═══════════════════════════════════════════
// ATATÜRK / ULUSAL DİYALOGLAR
// ═══════════════════════════════════════════

export const ATATURK_QUOTES = [
  "Yurtta sulh, cihanda sulh.",
  "Egemenlik kayıtsız şartsız milletindir.",
  "Öğretmenler, yeni nesil sizin eseriniz olacaktır.",
  "Hayatta en hakiki mürşit ilimdir.",
  "Ne mutlu Türküm diyene.",
  "Türk, öğün, çalış, güven.",
  "Gelecek göklerdedir.",
  "Benim naçiz vücudum elbet bir gün toprak olacaktır; fakat Türkiye Cumhuriyeti ilelebet payidar kalacaktır.",
];

export const ATATURK_PHONE_LINES = [
  "Yazıhanedeki portreye bir bak. Hesabı temiz tut; millet embesil değildir.",
  "Peronda gürültü olur, racon olur — ama Cumhuriyet’in hukuku üstündür.",
  "Çocukların bayramında fiyatı insan gibi tut. 23 Nisan coşkusu parayla ölçülmez.",
  "10 Kasım’da korna susturulur. Bugün satış değil, saygı günü.",
  "Gençlik bayramında yazıhane kapısı açık olsun; umut bulaşıcıdır.",
];

// ═══════════════════════════════════════════
// MAFYA — BÖLGE BÖLGE (apo yok; kurgusal isimler)
// ═══════════════════════════════════════════

export const BOSS_POOL: RegionalBoss[] = [
  {
    id: "kel_niyazi",
    bossName: "Kel Niyazi",
    region: "Trakya",
    type: "hakiki",
    cost: 5000,
    message:
      "Ağa… Trakya toprağında teker jilet gibi dönsün istiyorsan Kel Niyazi’nin selamı haftalık 5.000. Büyük balığa yem olmak istemezsin. Kapı çalındı; karar senin.",
  },
  {
    id: "kartal_riza",
    bossName: "Kartal Rıza",
    region: "Marmara",
    type: "hakiki",
    cost: 4500,
    message:
      "Peronun sahibi kim, levhada yazsın. Kartal Rıza kapıyı tutar; tutmazsa gece lastik sesi artar. 4.500 — bu haftanın raconu.",
  },
  {
    id: "gece_cemil",
    bossName: "Gececi Cemil",
    region: "İç Anadolu",
    type: "hakiki",
    cost: 4000,
    message:
      "Gece seferin netsin diye kapıyı biz tutarız Cemil abiyle. İstemezsen yolun açık… ama karanlık uzun. 4.000.",
  },
  {
    id: "sisli_orhan",
    bossName: "Sisli Orhan",
    region: "Karadeniz",
    type: "hakiki",
    cost: 3800,
    message:
      "Sisli yolda far yetmez ağa. Orhan’ın adamları levha bilir. Haftalık 3.800 — yoksa bagaj kapakları konuşur.",
  },
  {
    id: "peron_selim",
    bossName: "Peron Faresi Selim",
    region: "Her yer",
    type: "sahte",
    cost: 1500,
    message:
      "Bak ağa! Biz bu otogarın haracını yeriz. Vermezsen yazıhaneyi basarız, kundaklarız, bittin sen!",
  },
  {
    id: "kupon_metin",
    bossName: "Kuponçu Metin",
    region: "Her yer",
    type: "sahte",
    cost: 1200,
    message:
      "Abim var, dayım var, sen yoksun. 1.200 ver yoksa yarın adın gazetede yanar — he he.",
  },
];

/** Red sonrası gazete / telefon */
export const MAFIA_REFUSE_LINES = [
  "Söylenti: Reddeden firmanın otobüsünde gece ‘arıza’ çıktı.",
  "Kulis: Kapı sert cevap alınca peronda lastik izi görüldü.",
  "İddia: Sahte kabadayı boş çıktı; esnaf kapıyı kapatmadı.",
  "Duyum: Hakiki kapı küsünce sabaha motor çalışmadı.",
];

export const MAFIA_PAY_LINES = [
  "Bu hafta tamam. Yolun açık, teker dönsün.",
  "Selam ulaştı. Büyük balıklar uzak dursun — şimdilik.",
  "Hesap görüldü. Peronda gürültü istemeyiz, sen de isteme.",
];

// ═══════════════════════════════════════════
// BORÇ / BANKA DİYALOGLARI
// ═══════════════════════════════════════════

export const BANK_LINES = {
  signed: (total: number, due: string, g: string) =>
    `Sözleşme mühürlendi. Geri ödeme ${total} ₺. Son gün ${due}. Kefil: ${g}. Vadesi geçen dosya icraya düşer.`,
  interest: (n: number) =>
    `Faiz işledi: +${n} ₺. Ofisten peşin veya taksit kapatabilirsiniz.`,
  paid: "Borç kapandı. Sicil temiz. Hayırlı işler.",
  lawsuit: (due: string, g: string) =>
    `İCRA: Vade (${due}) geçti. Kefil ${g} kayıtta. Dava dosyası açıldı; itibar sarsıldı.`,
  refuseLoan: "Limit 1.000–50.000. Kefil adı zorunlu. İmza olmadan para çıkmaz.",
};

// ═══════════════════════════════════════════
// DİĞER DİYALOG HAVUZLARI
// ═══════════════════════════════════════════

const PASSENGER_NAMES = [
  "Ayşe Teyze",
  "Mehmet Amca",
  "Fatma Hanım",
  "Ali Usta",
  "Zeynep",
  "Hasan",
  "Elif Öğretmen",
  "Rıza Efendi",
  "Hatice Nine",
  "Kemal Bey",
  "Selim",
  "Nurcan",
  "Cemil",
  "Şükran",
  "Bekir",
];

export function generatePassengers(n: number): Passenger[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: `p-${Date.now()}-${i}`,
    name: PASSENGER_NAMES[i % PASSENGER_NAMES.length]!,
    mood:
      Math.random() > 0.75 ? "angry" : Math.random() > 0.4 ? "normal" : "happy",
  }));
}

export const COMPLAINT_LINES = [
  "Muavin yüzüme bakmadan bileti aldı!",
  "Koltukta yay var, sırtım bitti.",
  "İkram diye ılık su… Ayıp.",
  "Klima yok, çocuk sıcaktan uyuyamadı.",
  "Bagaj ezilmiş, kim ödeyecek?",
  "Şoför sigara içti, boğulduk.",
  "Peronda 40 dk açıklamasız bekledik.",
  "Bilette pencere, koridordayım!",
  "Çay elime döküldü.",
  "Radyo deli gibi; sabaha kadar damar.",
];

export const ROAD_LOG_LINES = [
  "İzmit sapağı — ikram geçti.",
  "Bolu etekleri — takograf yeşil.",
  "Sis ince, farlar açık.",
  "Ankara tabelası — yolcu heyecanlı.",
  "Dinlenme: çay-tost, komisyon yazıldı.",
  "EDS — hız düştü, ceza yok.",
  "Jandarma — belgeler tamam.",
  "Yağmur — silecek tıkırdıyor.",
  "Telsiz: ‘Sürati düşün kaptan.’",
  "Varış anonsu hazır.",
];

export const PHONE_AMBIENT = [
  {
    from: "Çığırtkan Remzi",
    body: "3 nolu peronda rakip 50 kırdı ağa, ne yapalım?",
  },
  {
    from: "Muavin Salih",
    body: "Kaptan uykusuz; bir çay daha?",
  },
  {
    from: "Yazıhane",
    body: "Zabıta büfeye indi, fiş istedi.",
  },
  {
    from: "Şoför Hasan",
    body: "Lastik dişi azaldı, bakıma sokayım mı?",
  },
  {
    from: "Ahmet Eymen Bakraç",
    body: "Sabır, hesap, racon. Portreye dil uzanmaz; hesaba dil uzanır.",
  },
  {
    from: "Hakiki Peron",
    body: "Sabah baskısı çıktı. Manşetlere bak.",
  },
];

export const ROAD_EVENT_POOL: RoadEvent[] = [
  {
    type: "eds",
    title: "EDS flaş!",
    description: "Tabela yakaladı. Ceza yazıldı; kaptan homurdanıyor.",
    moneyChange: -1500,
    reputationChange: -2,
    emoji: "📷",
  },
  {
    type: "police",
    title: "Çevirme",
    description: "Belgeler tamam. On dakika; yolcu pencereden bakıyor.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "🚓",
  },
  {
    type: "jandarma",
    title: "Jandarma",
    description: "Bagaj açıldı, temiz. Kaptan sigarasını söndürdü.",
    moneyChange: 0,
    reputationChange: 1,
    emoji: "🪖",
  },
  {
    type: "tea",
    title: "Dinlenme",
    description: "Çay-tost. Komisyon çıktı; yolcu ferahladı.",
    moneyChange: -120,
    reputationChange: 1,
    emoji: "🍵",
  },
  {
    type: "engine",
    title: "Hararet",
    description: "Su eklendi, on beş dakika beklediniz.",
    moneyChange: -800,
    reputationChange: 0,
    emoji: "🔧",
  },
  {
    type: "flat",
    title: "Lastik",
    description: "Sağ arka patladı. Stepne + lastikçi hesabı.",
    moneyChange: -2200,
    reputationChange: -1,
    emoji: "🛞",
  },
  {
    type: "bonus",
    title: "Bahşiş",
    description: "‘Kaptan sağ olsun’ — bahşiş bırakıldı.",
    moneyChange: 400,
    reputationChange: 2,
    emoji: "💵",
  },
  {
    type: "radio",
    title: "Telsiz",
    description: "‘Bolu çıkışı yoğun, sürati düşün.’ Uyuldu.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "📡",
  },
];

export const PAPER_MAFIA_LINES = [
  "Söylenti: Yazıhaneye ‘selam’ geldi, tutar konuşuldu.",
  "Kulis: Red sonrası bir otobüste gece arıza.",
  "İddia: Sahte kabadayı tehdit yağdırdı, esnaf kapamadı.",
  "Duyum: Kel Niyazi’nin adamları Trakya hattında görülmüş.",
];

// ═══════════════════════════════════════════
// YARDIMCI
// ═══════════════════════════════════════════

const startingBus: GameBus = {
  id: "bus-start",
  model: "Mercedes O302",
  seatCount: 42,
  engineHealth: 78,
  color: "blue",
  name: "Emektar",
  fuelUse: 28,
  muavinCost: 400,
  plate: "22 AE 1987",
  sticker: null,
};

function emptySlots(): TerminalSlot[] {
  return Array.from({ length: 6 }).map(() => "empty" as const);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function buildMorningPaperLocal(
  day: number,
  fuel: number,
  bayram: boolean,
  mood: DayMoodLite
): NewsItem[] {
  const items: NewsItem[] = [
    {
      id: `m-${day}-1`,
      title: "Sabah baskısı",
      body: `Gün ${day}: Peronlar erken kalktı. Mazot kuyruğu var mı, yok mu — esnaf konuşuyor.`,
      tag: "gundem",
    },
    {
      id: `m-${day}-2`,
      title: "Mazot",
      body: `Pompa civarı ${fuel} ₺. Zam söylentisi akşam baskısında.`,
      tag: "ekonomi",
    },
  ];
  if (mood === "mourning") {
    items.unshift({
      id: `m-${day}-yas`,
      title: "10 Kasım",
      body: "Saat 09:05 — Gazi Mustafa Kemal Atatürk’ü saygıyla anıyoruz. Peronlar sessiz.",
      tag: "yas",
    });
  }
  if (mood === "national" || bayram) {
    items.unshift({
      id: `m-${day}-bayram`,
      title: "Ulusal gün",
      body: "Bayraklar asılı. Fiyatı insan gibi tut; coşku parayla ölçülmez.",
      tag: "bayram",
    });
  }
  if (Math.random() > 0.5) {
    items.push({
      id: `m-${day}-maf`,
      title: "Kulis",
      body: pick(PAPER_MAFIA_LINES),
      tag: "kulis",
    });
  }
  if (Math.random() > 0.7) {
    items.push({
      id: `m-${day}-at`,
      title: "Köşe",
      body: `“${pick(ATATURK_QUOTES)}” — yazıhane duvarından.`,
      tag: "portre",
    });
  }
  return items;
}

function buildEveningPaperLocal(day: number): NewsItem[] {
  return [
    {
      id: `e-${day}-1`,
      title: "Akşam baskısı",
      body: `Gün ${day} akşamı: Yarın zam mı indirim mi — kaynak yok, dil bol.`,
      tag: "gundem",
    },
    {
      id: `e-${day}-2`,
      title: "Peron",
      body:
        Math.random() > 0.5
          ? "Bir firmada bagaj kaybı; aileler yazıhaneye yürüdü."
          : "Çığırtkanlar arasında söz dalaşı — itibar konuşuluyor.",
      tag: "asayis",
    },
  ];
}

function createInitialState() {
  const clock = getGlobalGameClock();
  return {
    isGuest: true,
    companyName: "Misafir Şirket",
    playerName: "Ağa",
    balance: 75000,
    reputation: 48,
    buses: [{ ...startingBus }] as GameBus[],
    expeditions: [] as Expedition[],
    drivers: [
      {
        id: "drv-1",
        name: "Şoför Hasan",
        role: "driver" as const,
        skill: 58,
        wage: 850,
        fatigue: 12,
        onExpedition: false,
        hiredAt: Date.now(),
      },
      {
        id: "muv-1",
        name: "Muavin Salih",
        role: "muavin" as const,
        skill: 50,
        wage: 500,
        fatigue: 5,
        onExpedition: false,
        hiredAt: Date.now(),
      },
    ],
    hasPlayedOnce: false,
    lastEvent: null as RoadEvent | null,
    showComplaintModal: false,
    currentComplaint: null as string | null,
    complaints: [] as string[],
    accountingLevel: 1,
    customerServiceLevel: 1,
    bankDebt: 0,
    taxDue: 0,
    ledger: [] as LedgerRow[],
    terminalName: "",
    terminalSlots: emptySlots(),
    terminalBuilt: false,
    setupDone: false,
    homeCityId: "",
    gameYear: 1987,
    gameDay: clock.gameDay,
    gameHour: clock.gameHour,
    lastTimeTick: Date.now(),
    morningPaper: [] as NewsItem[],
    eveningPaper: [] as NewsItem[],
    newspaper: [] as NewsItem[],
    paperNotify: null as "morning" | "evening" | null,
    phoneOpen: false,
    phoneMessages: [
      {
        id: "welcome",
        from: "Ahmet Eymen Bakraç",
        body: "Hoş geldin. Portre duvarda, hesap defterde. Çıraklıktan ağalığa yol uzun. Gerçek para yok — peron gerçek. Yurtta sulh.",
        type: "sms" as const,
        at: Date.now(),
        read: false,
      },
    ] as PhoneMsg[],
    officeNotes: "",
    officeTitle: "Yazıhane",
    loanContract: null as LoanContract | null,
    lastDebtInterestDay: 0,
    activeBoss: null as RegionalBoss | null,
    mafiaDebtDue: false,
    lastMafiaDay: 0,
    crierLevel: 0,
    ağaEnergy: 80,
    teaStock: 5,
    bayramActive: false,
    rivalWeak: false,
    guestDayLimit: 5,
    forceRegister: false,
    fuelPrice: 42,
    roomCode: null as string | null,
    roomName: null as string | null,
    calendarMood: "normal" as DayMoodLite,
    calendarTitle: "",
    lastCalendarCode: "",
    lastTicket: null as null | Record<string, unknown>,
    deskRented: false,
  };
}

// ═══════════════════════════════════════════
// STORE — action’lar 2. kısımda tamamlanır
// ═══════════════════════════════════════════

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      startAsGuest: () => set({ ...createInitialState(), isGuest: true }),
      setCompanyName: (n: string) => set({ companyName: n.slice(0, 40) }),
      setPlayerName: (n: string) => set({ playerName: n.slice(0, 30) }),

      addMoney: (a: number) => set((s) => ({ balance: s.balance + a })),
      spendMoney: (a: number) => {
        if (get().balance < a) return false;
        set((s) => ({ balance: s.balance - a }));
        return true;
      },

      addLedger: (label: string, amount: number) =>
        set((s) => ({
          ledger: [{ label, amount, at: Date.now() }, ...s.ledger].slice(0, 50),
        })),

      pushPhone: (from: string, body: string, type: "sms" | "call" = "sms") =>
        set((s) => ({
          phoneMessages: [
            {
              id: `ph-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              from,
              body,
              type,
              at: Date.now(),
              read: false,
            } satisfies PhoneMsg,
            ...s.phoneMessages,
          ].slice(0, 50),
        })),

      applyCalendarBeat: (beat: CalendarBeat) => {
        if (!beat || beat.mood === "normal") {
          set({ calendarMood: "normal", calendarTitle: "" });
          return;
        }
        if (get().lastCalendarCode === beat.code) {
          set({ calendarMood: beat.mood, calendarTitle: beat.title });
          return;
        }
        set({
          calendarMood: beat.mood,
          calendarTitle: beat.title,
          lastCalendarCode: beat.code,
          bayramActive: beat.mood === "national",
        });
        get().pushPhone(beat.phoneFrom, beat.phoneBody);
        get().pushPhone("Ahmet Eymen Bakraç", beat.bakracLine);
        if (beat.mood === "national" || beat.mood === "mourning") {
          get().pushPhone("Yazıhane Portresi", pick(ATATURK_PHONE_LINES));
        }
        const line = calendarHeadlineForPaper(beat);
        if (line) {
          const item: NewsItem = {
            id: `cal-${beat.code}-${Date.now()}`,
            title: beat.title,
            body: line,
            tag: beat.mood === "mourning" ? "yas" : "bayram",
          };
          set((s) => ({
            morningPaper: [item, ...s.morningPaper].slice(0, 14),
            newspaper: [item, ...s.newspaper].slice(0, 14),
            paperNotify: "morning",
          }));
        }
      },

      // ▼▼▼ 2. KISIM: tickGameTime, mafiaVisit, payMafia, refuseMafia,
      // signLoanContract, payBankDebt, sefer, oda, buyBus, partialize ▼▼▼
      tickGameTime: () => {
        const prevH = get().gameHour;
        const prevD = get().gameDay;
        const clock = getGlobalGameClock();
        set({
          gameDay: clock.gameDay,
          gameHour: clock.gameHour,
          gameYear: 1987,
          lastTimeTick: Date.now(),
        });

        get().applyCalendarBeat(getCalendarBeat());

        // Saat başı hafif ambient telefon
        if (clock.gameHour !== prevH && Math.random() > 0.72) {
          const amb = pick(PHONE_AMBIENT);
          get().pushPhone(amb.from, amb.body);
        }

        // Yeni oyun günü
        if (clock.gameDay !== prevD) {
          const beat = getCalendarBeat();
          const morning = buildMorningPaperLocal(
            clock.gameDay,
            get().fuelPrice,
            get().bayramActive || beat.mood === "national",
            beat.mood === "mourning"
              ? "mourning"
              : beat.mood === "national"
                ? "national"
                : get().calendarMood
          );
          set({
            morningPaper: morning,
            newspaper: morning,
            paperNotify: "morning",
            bayramActive:
              clock.gameDay % 7 === 0 || beat.mood === "national",
            rivalWeak: Math.random() > 0.75,
            ağaEnergy: Math.min(100, get().ağaEnergy + 10),
          });
          get().pushPhone(
            "Hakiki Peron",
            "Sabah baskısı çıktı. Gazete masada."
          );

          if (get().isGuest && clock.gameDay > get().guestDayLimit) {
            set({ forceRegister: true });
            get().pushPhone(
              "Otogar Tycoon",
              "Misafir süren doldu. İlerlemeyi saklamak için hesap oluştur."
            );
          }

          if (
            get().setupDone &&
            clock.gameDay - (get().lastMafiaDay || 0) >= 5 &&
            !get().mafiaDebtDue
          ) {
            get().mafiaVisit();
          }

          get().collectPassiveIncome();

          const debt = get().bankDebt;
          const lastI = get().lastDebtInterestDay || 0;
          if (debt > 0 && clock.gameDay - lastI >= 30) {
            const interest = Math.max(80, Math.round(debt * 0.04));
            set((s) => ({
              bankDebt: s.bankDebt + interest,
              lastDebtInterestDay: clock.gameDay,
            }));
            get().addLedger("Banka faiz", -interest);
            get().pushPhone("Ahmet Bankacılık", BANK_LINES.interest(interest));
          }

          const lc = get().loanContract;
          if (lc?.active && !lc.lawsuit && clock.gameDay > lc.dueDay) {
            set({
              loanContract: { ...lc, lawsuit: true },
              reputation: Math.max(0, get().reputation - 12),
            });
            get().pushPhone(
              "İcra Müdürlüğü",
              BANK_LINES.lawsuit(lc.dueLabel, lc.guarantor)
            );
            get().addLedger("Kredi temerrüt / dava", 0);
            set((s) => ({
              morningPaper: [
                {
                  id: `icra-${clock.gameDay}`,
                  title: "İcra haberi",
                  body: `${get().companyName} kredi vadesini aştı. Kefil: ${lc.guarantor}.`,
                  tag: "icra",
                },
                ...s.morningPaper,
              ].slice(0, 14),
            }));
          }

          if (Math.random() > 0.6) {
            const delta = Math.round((Math.random() - 0.4) * 6);
            set((s) => ({
              fuelPrice: Math.max(28, Math.min(75, s.fuelPrice + delta)),
            }));
          }
        }

        if (prevH < 18 && clock.gameHour >= 18) {
          const evening = buildEveningPaperLocal(clock.gameDay);
          set({
            eveningPaper: evening,
            newspaper: evening,
            paperNotify: "evening",
          });
          get().pushPhone(
            "Hakiki Peron",
            "Akşam baskısı çıktı. Yarın konuşulacak."
          );
        }
      },

      generateDailyNews: () => {
        const day = get().gameDay;
        const morning = buildMorningPaperLocal(
          day,
          get().fuelPrice,
          get().bayramActive,
          get().calendarMood
        );
        set({ morningPaper: morning, newspaper: morning });
      },

      openNewspaper: () => set({ paperNotify: null }),
      closeNewspaper: () => set({ paperNotify: null }),
      openPaperEdition: (ed: string) =>
        set({
          newspaper:
            ed === "morning" ? get().morningPaper : get().eveningPaper,
          paperNotify: null,
        }),
      clearPaperNotify: () => set({ paperNotify: null }),
      setPhoneOpen: (v: boolean) => set({ phoneOpen: v }),

      rollRoadEvent: (exp: Expedition) => {
        if (Math.random() > 0.32) return null;
        const ev = pick(ROAD_EVENT_POOL);
        if (ev.moneyChange) {
          set((s) => ({ balance: s.balance + ev.moneyChange }));
          get().addLedger(ev.title, ev.moneyChange);
        }
        if (ev.reputationChange) {
          set((s) => ({
            reputation: Math.max(
              0,
              Math.min(100, s.reputation + ev.reputationChange)
            ),
          }));
        }
        const logLine = pick(ROAD_LOG_LINES);
        get().updateExpedition(exp.id, {
          log: [...(exp.log || []), logLine, ev.title].slice(-8),
        });
        set({ lastEvent: ev });
        if (Math.abs(ev.moneyChange) > 500 || ev.reputationChange < 0) {
          get().pushPhone("Kaptan", `${ev.title}: ${ev.description}`);
        }
        return ev;
      },

      addExpedition: (e: Expedition) =>
        set((s) => ({ expeditions: [e, ...s.expeditions].slice(0, 40) })),

      updateExpedition: (id: string, p: Partial<Expedition>) =>
        set((s) => ({
          expeditions: s.expeditions.map((x) =>
            x.id === id ? { ...x, ...p } : x
          ),
        })),

      settleExpeditionProfit: (p: number) => {
        set((s) => ({ balance: s.balance + p }));
        get().addLedger("Sefer kâr/zarar", p);
        if (p > 0) get().accrueTax(Math.round(p * 0.05));
        if (p < -2000) {
          get().pushPhone(
            "Muhasebe",
            "Bu sefer zarar yazdı. İkram ve mazotu gözden geçir."
          );
        }
        return p;
      },

      canUseBus: (busId: string) => {
        const b = get().buses.find((x) => x.id === busId);
        if (!b) return false;
        if (b.repairingUntil && b.repairingUntil > Date.now()) return false;
        if (b.impoundedUntil && b.impoundedUntil > Date.now()) return false;
        return !get().expeditions.some(
          (e) =>
            e.busId === busId &&
            (e.status === "filling" || e.status === "departed")
        );
      },

      setDriverBusy: (id: string, busy: boolean) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id ? { ...d, onExpedition: busy } : d
          ),
        })),

      addFatigue: (id: string, n: number) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id
              ? { ...d, fatigue: Math.min(100, d.fatigue + n) }
              : d
          ),
        })),

      hireDriver: (d: Driver) => {
        const cost = d.wage * 2;
        if (!get().spendMoney(cost)) return false;
        set((s) => ({
          drivers: [
            ...s.drivers,
            {
              ...d,
              id: `drv-${Date.now()}`,
              hiredAt: Date.now(),
              fatigue: 0,
              onExpedition: false,
            },
          ],
        }));
        get().addLedger(`İşe alım ${d.name}`, -cost);
        get().pushPhone("Personel", `${d.name} kadroya girdi. Hayırlı olsun.`);
        return true;
      },

      takeBankLoan: (amount: number) =>
        get().signLoanContract(amount, "Kefilsiz (riskli)"),

      signLoanContract: (principal: number, guarantor: string) => {
        const p = Math.min(50000, Math.max(1000, Math.floor(principal)));
        if (p < 1000) {
          get().pushPhone("Ahmet Bankacılık", BANK_LINES.refuseLoan);
          return false;
        }
        const g = guarantor.trim().slice(0, 28) || "Kefil belirsiz";
        const totalDue = Math.round(p * 1.15);
        const day = get().gameDay;
        const dueDay = day + 12;
        const month = ((dueDay % 12) + 1).toString().padStart(2, "0");
        const dom = ((dueDay % 27) + 1).toString().padStart(2, "0");
        const dueLabel = `${dom}.${month}.1987`;
        set((s) => ({
          balance: s.balance + p,
          bankDebt: s.bankDebt + totalDue,
          loanContract: {
            principal: p,
            totalDue,
            paid: 0,
            guarantor: g,
            signedAtDay: day,
            dueDay,
            dueLabel,
            active: true,
            lawsuit: false,
          },
          lastDebtInterestDay: day,
        }));
        get().addLedger(`Kredi imzalı (${g})`, p);
        get().pushPhone(
          "Ahmet Bankacılık",
          BANK_LINES.signed(totalDue, dueLabel, g)
        );
        return true;
      },

      payBankDebt: (amount: number) => {
        const pay = Math.min(amount, get().bankDebt, get().balance);
        if (pay <= 0) return false;
        set((s) => ({
          balance: s.balance - pay,
          bankDebt: Math.max(0, s.bankDebt - pay),
        }));
        get().addLedger("Banka ödeme", -pay);
        const lc = get().loanContract;
        if (lc?.active) {
          const paid = lc.paid + pay;
          const done = paid >= lc.totalDue || get().bankDebt <= 0;
          set({
            loanContract: done
              ? { ...lc, paid, active: false, lawsuit: false }
              : { ...lc, paid },
          });
          if (done) get().pushPhone("Ahmet Bankacılık", BANK_LINES.paid);
        }
        return true;
      },

      payTax: () => {
        const { taxDue, balance } = get();
        if (taxDue <= 0 || balance < taxDue) return false;
        set({ balance: balance - taxDue, taxDue: 0 });
        get().addLedger("Vergi ödemesi", -taxDue);
        get().pushPhone("Vergi Dairesi", "Borç kapatıldı. Teşekkürler.");
        return true;
      },

      accrueTax: (p: number) => set((s) => ({ taxDue: s.taxDue + Math.max(0, p) })),

      setOfficeNotes: (n: string) => set({ officeNotes: n.slice(0, 2000) }),
      setOfficeTitle: (t: string) =>
        set({ officeTitle: t.slice(0, 40) || "Yazıhane" }),

      mafiaVisit: () => {
        const boss = pick(BOSS_POOL);
        set({
          activeBoss: boss,
          mafiaDebtDue: true,
          lastMafiaDay: get().gameDay,
        });
        get().pushPhone(boss.bossName, boss.message, "call");
        set((s) => ({
          morningPaper: [
            {
              id: `maf-visit-${Date.now()}`,
              title: "Kapı haberi",
              body: `${boss.region}: “${boss.bossName}” ismi kulislerde. Tutar konuşuluyor.`,
              tag: "kulis",
            },
            ...s.morningPaper,
          ].slice(0, 14),
        }));
      },

      payMafia: () => {
        const b = get().activeBoss;
        if (!b) return;
        if (!get().spendMoney(b.cost)) {
          get().pushPhone(
            b.bossName,
            "Para yoksa kapı yumuşamaz. Ya bul ya da sonuçlarına katlan."
          );
          return;
        }
        get().addLedger(`Aidat · ${b.bossName}`, -b.cost);
        set({ mafiaDebtDue: false, activeBoss: null });
        get().pushPhone(b.bossName, pick(MAFIA_PAY_LINES));
        if (b.type === "sahte") {
          get().pushPhone(
            "İstihbarat",
            "Bu adam boş çıkabilir. Yine de bu hafta sustu."
          );
        }
      },

      refuseMafia: () => {
        const b = get().activeBoss;
        set({ mafiaDebtDue: false, activeBoss: null });
        if (!b) return;

        if (b.type === "sahte") {
          get().pushPhone(
            "İstihbarat",
            `${b.bossName} boş çıktı. Bir süre mesaj atar, işi yok.`
          );
          get().pushPhone(b.bossName, "Görürüz ağa… görürüz!");
          set((s) => ({
            morningPaper: [
              {
                id: `sahte-${Date.now()}`,
                title: "Kulis",
                body: pick(MAFIA_REFUSE_LINES),
                tag: "kulis",
              },
              ...s.morningPaper,
            ].slice(0, 14),
          }));
          return;
        }

        set((s) => ({
          reputation: Math.max(0, s.reputation - 10),
          buses: s.buses.map((bus, i) =>
            i === 0
              ? {
                  ...bus,
                  engineHealth: Math.max(8, bus.engineHealth - 30),
                  repairingUntil: Date.now() + 180_000,
                }
              : bus
          ),
        }));
        get().addLedger(`Red · ${b.bossName} hasar`, 0);
        get().pushPhone(
          "Hakiki Peron",
          `Söylenti: ${b.bossName} sonrası bir araçta yangın / arıza. Tamir şart.`
        );
        get().pushPhone(b.bossName, "Kapı küsünce gece uzun olur.");
        set((s) => ({
          morningPaper: [
            {
              id: `kundak-${Date.now()}`,
              title: "Yangın / arıza",
              body: `${get().companyName} filosunda gece hasar iddiası. ${b.bossName} ismi kulislerde.`,
              tag: "asayis",
            },
            ...s.morningPaper,
          ].slice(0, 14),
        }));
      },

      drinkTea: () => {
        if (get().teaStock <= 0) {
          get().pushPhone("Yazıhane", "Termos boş. Marketten çay seti lazım.");
          return;
        }
        set((s) => ({
          teaStock: s.teaStock - 1,
          ağaEnergy: Math.min(100, s.ağaEnergy + 18),
        }));
      },

      priceCapMultiplier: () => {
        let m = 1;
        if (get().bayramActive) m *= 1.35;
        if (get().calendarMood === "national") m *= 1.15;
        if (get().calendarMood === "mourning") m *= 0.8;
        if (get().rivalWeak) m *= 1.1;
        return m;
      },

      crierBonus: () => 1 + get().crierLevel * 0.06,

      setHasPlayedOnce: () => set({ hasPlayedOnce: true }),
      setLastTicket: (t: Record<string, unknown> | null) => set({ lastTicket: t }),
      clearLastEvent: () => set({ lastEvent: null }),

      completeCitySetup: (cityId: string) => {
        const cost = 20000;
        if (get().balance >= cost) {
          get().spendMoney(cost);
          get().addLedger("Ruhsat / arsa", -cost);
        }
        set({
          setupDone: true,
          homeCityId: cityId,
          terminalName: "Belediye Onaylı Yazıhane",
          officeTitle: "Yazıhane",
          terminalBuilt: true,
        });
        get().pushPhone(
          "Belediye",
          "Ruhsat onaylandı. Mühür basıldı. Hayırlı olsun."
        );
        get().pushPhone(
          "Ahmet Eymen Bakraç",
          "Artık kapı sende. Portre duvarda, defter açık. Yurtta sulh."
        );
        return true;
      },

      createRoom: (name: string) => {
        const code = Math.random().toString(36).slice(2, 6).toUpperCase();
        set({ roomCode: code, roomName: name.slice(0, 32) || "Lig" });
        get().pushPhone("Lobi", `Oda kuruldu: ${code}`);
        return code;
      },
      joinRoom: (code: string) => {
        const c = code.trim().toUpperCase();
        if (c.length < 4) return false;
        set({ roomCode: c, roomName: `Oda ${c}` });
        return true;
      },
      leaveRoom: () => set({ roomCode: null, roomName: null }),
      shareRoomText: () => {
        const { roomCode, companyName } = get();
        return `Otogar Tycoon · ${companyName} · Oda ${roomCode} · Peron savaşında kapışalım! #OtogarTycoon`;
      },

      resetGame: () => get().startAsGuest(),
      resetGameFull: () => get().startAsGuest(),

      collectPassiveIncome: () => {
        let gain = 0;
        (get().terminalSlots || []).forEach((s) => {
          if (s === "toilet") gain += 45;
          if (s === "bufe") gain += 130;
          if (s === "emanet") gain += 95;
          if (s === "peron") gain += 60;
        });
        if (gain > 0) {
          set((s) => ({ balance: s.balance + gain }));
          get().addLedger("Terminal pasif", gain);
        }
      },

      upgradeAccounting: () => {
        const { balance, accountingLevel } = get();
        const cost = 15000 * accountingLevel;
        if (balance < cost || accountingLevel >= 5) return false;
        set({
          balance: balance - cost,
          accountingLevel: accountingLevel + 1,
        });
        get().addLedger(`Muhasebe sv.${accountingLevel + 1}`, -cost);
        return true;
      },

      upgradeCustomerService: () => {
        const { balance, customerServiceLevel } = get();
        const cost = 12000 * customerServiceLevel;
        if (balance < cost || customerServiceLevel >= 5) return false;
        set({
          balance: balance - cost,
          customerServiceLevel: customerServiceLevel + 1,
        });
        get().addLedger(`Müşteri hiz. sv.${customerServiceLevel + 1}`, -cost);
        return true;
      },

      buyBus: (l: BusListing) => {
        if (!get().spendMoney(l.price)) return false;
        const bus: GameBus = {
          id: `bus-${Date.now()}`,
          model: l.model,
          seatCount: l.seatCount,
          engineHealth: 90,
          color: l.color,
          name: l.model.split(" ")[0] || "Otobüs",
          fuelUse: l.fuelUse,
          muavinCost: 450,
          plate: `${22 + Math.floor(Math.random() * 20)} AE ${Math.floor(
            Math.random() * 90 + 10
          )}`,
          sticker: null,
        };
        set((s) => ({ buses: [...s.buses, bus] }));
        get().addLedger(`Otobüs ${l.model}`, -l.price);
        get().pushPhone("Garaj", `${l.model} filoya katıldı.`);
        return true;
      },

      paintBus: (id: string, c: BusColor) => {
        if (!get().spendMoney(2500)) return;
        set((s) => ({
          buses: s.buses.map((b) => (b.id === id ? { ...b, color: c } : b)),
        }));
        get().addLedger("Boya", -2500);
      },

      setBusPlate: (id: string, p: string) =>
        set((s) => ({
          buses: s.buses.map((b) =>
            b.id === id ? { ...b, plate: p.slice(0, 12) } : b
          ),
        })),

      applySticker: (busId: string, stickerId: string) => {
        const st = STICKERS.find((x) => x.id === stickerId);
        if (!st || !get().spendMoney(st.cost)) return false;
        set((s) => ({
          buses: s.buses.map((b) =>
            b.id === busId ? { ...b, sticker: st.label } : b
          ),
          reputation: Math.min(100, s.reputation + st.rep),
        }));
        get().addLedger(`Yazı: ${st.label}`, -st.cost);
        return true;
      },

      openComplaint: (t: string) =>
        set((s) => ({
          currentComplaint: t,
          showComplaintModal: true,
          complaints: [t, ...s.complaints].slice(0, 12),
          reputation: Math.max(0, s.reputation - 2),
        })),

      closeComplaint: () =>
        set({ showComplaintModal: false, currentComplaint: null }),

      rentDesk: () => {
        if (get().deskRented) return true;
        if (!get().spendMoney(5000)) return false;
        set({ deskRented: true });
        get().addLedger("Yazıhane kirası peşin", -5000);
        return true;
      },
    } as unknown as GameState),
    {
      name: "otogar-tycoon-v12",
      partialize: (s) => ({
        isGuest: s.isGuest,
        companyName: s.companyName,
        playerName: s.playerName,
        balance: s.balance,
        reputation: s.reputation,
        buses: s.buses,
        expeditions: s.expeditions,
        drivers: s.drivers,
        bankDebt: s.bankDebt,
        taxDue: s.taxDue,
        ledger: s.ledger.slice(0, 30),
        setupDone: s.setupDone,
        homeCityId: s.homeCityId,
        terminalName: s.terminalName,
        terminalSlots: s.terminalSlots,
        terminalBuilt: s.terminalBuilt,
        officeTitle: s.officeTitle,
        officeNotes: s.officeNotes,
        loanContract: s.loanContract,
        lastDebtInterestDay: s.lastDebtInterestDay,
        lastMafiaDay: s.lastMafiaDay,
        accountingLevel: s.accountingLevel,
        customerServiceLevel: s.customerServiceLevel,
        fuelPrice: s.fuelPrice,
        guestDayLimit: s.guestDayLimit,
        forceRegister: s.forceRegister,
        roomCode: s.roomCode,
        roomName: s.roomName,
        lastCalendarCode: s.lastCalendarCode,
        deskRented: s.deskRented,
        crierLevel: s.crierLevel,
        phoneMessages: s.phoneMessages.slice(0, 20),
      }),
    }
  )
);