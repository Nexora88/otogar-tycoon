"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getGlobalGameClock } from "@/lib/gameTime";
import { CITIES_1987 } from "@/data/cities1987";
import {
  getCalendarBeat,
  calendarHeadlineForPaper,
  type CalendarBeat,
} from "@/lib/nationalCalendar";

// ═══════════════════════════════════════════
// TİPLER
// ═══════════════════════════════════════════

export type BusColor =
  | "blue"
  | "red"
  | "white"
  | "green"
  | "black"
  | "cream"
  | "orange";

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

export type NewsKind =
  | "economy"
  | "rival"
  | "crash"
  | "bayram"
  | "player"
  | "kulis"
  | "gundem"
  | "yas"
  | "portre"
  | "icra"
  | "asayis";

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

/** Gazete — title zorunlu; headline/aboutPlayer UI uyumu */
export interface NewsItem {
  id: string;
  title: string;
  body: string;
  tag?: string;
  headline?: string;
  kind?: string;
  aboutPlayer?: boolean;
  day?: number;
}

/** MafiaModal + store ortak */
export interface RegionalBoss {
  id: string;
  bossName: string;
  message: string;
  cost: number;
  type: "hakiki" | "sahte";
  region: string;
  tier?: "hakiki" | "sahte";
  kind?: "hakiki" | "sahte";
  weeklyFee?: number;
  cities?: string[];
  refuseLine?: string;
  payLine?: string;
  messageTemplate?: string;
}

export interface BusListing {
  id?: string;
  name?: string;
  model: string;
  seatCount: number;
  price: number;
  fuelUse: number;
  color: BusColor;
  engineHealth?: number;
  muavinCost?: number;
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
  newspaperOpen: boolean;
  paperEdition: "morning" | "evening";
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
  meetingOpen: boolean;
  meetingTopic: string;

  startAsGuest: () => void;
  setCompanyName: (n: string) => void;
  setPlayerName: (n: string) => void;
  addMoney: (a: number) => void;
  spendMoney: (a: number) => boolean;
  addLedger: (l: string, a: number) => void;
  pushPhone: (from: string, body: string, type?: "sms" | "call") => void;
  markPhoneRead: () => void;
  tickGameTime: () => void;
  applyCalendarBeat: (b: CalendarBeat) => void;
  generateDailyNews: () => void;
  openNewspaper: () => void;
  closeNewspaper: () => void;
  openPaperEdition: (ed: "morning" | "evening") => void;
  clearPaperNotify: () => void;
  setPhoneOpen: (v: boolean) => void;
  openMeeting: (topic?: string) => void;
  closeMeeting: () => void;
  resolveMeeting: (choice: "warn" | "fine" | "bonus" | "fire") => void;
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
  payMafia: () => boolean;
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
  startTerminalConstruction: () => boolean;
  buildSlot: (index: number, type: Exclude<TerminalSlot, "empty">) => boolean;
  setTerminalName: (n: string) => void;
  upgradeCrier: () => boolean;
  triggerSecurityRaid: () => void;
}

// ═══════════════════════════════════════════
// EXPORT — map / setup / market / terminal
// ═══════════════════════════════════════════

export const CITIES = CITIES_1987.map((c) => ({
  id: c.id,
  name: c.name,
  region: c.region,
  plotCost: c.plotCost,
  licenseCost: c.licenseCost,
  x: c.x,
  y: c.y,
}));

export const CATERING_INFO: Record<
  Catering,
  { label: string; perSeat: number; repMod: number; desc: string }
> = {
  water: {
    label: "Ucuz İkram",
    perSeat: 3,
    repMod: -2,
    desc: "Musluk + bisküvi",
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
    desc: "Çay + pişmaniye",
  },
};

export const STICKERS = [
  { id: "sulh", label: "Yurtta sulh, cihanda sulh", cost: 2000, rep: 4 },
  {
    id: "egemen",
    label: "Egemenlik kayıtsız şartsız milletindir",
    cost: 2500,
    rep: 3,
  },
  { id: "thy", label: "Tek rakibim THY", cost: 5000, rep: 5 },
  { id: "kesan", label: "Keşanlı", cost: 2500, rep: 2 },
  { id: "nexora", label: "Nexora Elektronik 1987", cost: 4000, rep: 3 },
  { id: "bakrac", label: "Bakraç Ticaret", cost: 3500, rep: 2 },
  { id: "otogar", label: "Otogar Tycoon", cost: 1500, rep: 1 },
];

export const MARKET_BUSES: BusListing[] = [
  {
    name: "Emektar O302",
    model: "Mercedes O302",
    seatCount: 42,
    engineHealth: 88,
    fuelUse: 28,
    price: 45000,
    color: "blue",
    muavinCost: 400,
  },
  {
    name: "O303 Klasik",
    model: "Mercedes O303",
    seatCount: 46,
    engineHealth: 92,
    fuelUse: 26,
    price: 78000,
    color: "cream",
    muavinCost: 450,
  },
  {
    name: "Travego Saha",
    model: "Travego",
    seatCount: 48,
    engineHealth: 95,
    fuelUse: 24,
    price: 180000,
    color: "white",
    muavinCost: 500,
  },
  {
    name: "Turkuaz 302",
    model: "Mercedes O302",
    seatCount: 40,
    engineHealth: 80,
    fuelUse: 30,
    price: 38000,
    color: "green",
    muavinCost: 380,
  },
];

export const SLOT_INFO: Record<
  TerminalSlot,
  { label: string; cost: number; cps: number; desc: string }
> = {
  empty: { label: "Boş", cost: 0, cps: 0, desc: "—" },
  toilet: {
    label: "Tuvalet",
    cost: 8000,
    cps: 2,
    desc: "Bozuk para / turnike",
  },
  bufe: { label: "Büfe", cost: 18000, cps: 6, desc: "Simit ayran" },
  emanet: { label: "Emanet", cost: 22000, cps: 8, desc: "Çanta emanet" },
  office: {
    label: "Ofis kabini",
    cost: 15000,
    cps: 3,
    desc: "Yazıhane uzantısı",
  },
  peron: { label: "Peron hakkı", cost: 35000, cps: 5, desc: "Ek kalkış" },
};

// ═══════════════════════════════════════════
// ATATÜRK / MAFYA / BANKA / DİYALOG
// ═══════════════════════════════════════════

export const ATATURK_QUOTES = [
  "Yurtta sulh, cihanda sulh.",
  "Egemenlik kayıtsız şartsız milletindir.",
  "Hayatta en hakiki mürşit ilimdir.",
  "Ne mutlu Türküm diyene.",
  "Türk, öğün, çalış, güven.",
  "Gelecek göklerdedir.",
  "Benim naçiz vücudum elbet bir gün toprak olacaktır; fakat Türkiye Cumhuriyeti ilelebet payidar kalacaktır.",
];

export const ATATURK_PHONE_LINES = [
  "Yazıhanedeki portreye bak. Hesabı temiz tut.",
  "Peronda gürültü olur — Cumhuriyet’in hukuku üstündür.",
  "23 Nisan’da fiyatı insan gibi tut.",
  "10 Kasım’da korna susturulur. Saygı günü.",
  "Gençlik bayramında kapı açık olsun; umut bulaşıcıdır.",
];

export const BOSS_POOL: RegionalBoss[] = [
  {
    id: "kel_niyazi",
    bossName: "Kel Niyazi",
    region: "Trakya",
    type: "hakiki",
    tier: "hakiki",
    kind: "hakiki",
    cost: 5000,
    weeklyFee: 5000,
    message:
      "Ağa… Trakya’da teker jilet gibi dönsün istiyorsan Kel Niyazi’nin selamı haftalık 5.000. Büyük balığa yem olma.",
    refuseLine: "Kapı çalınır… otopark sessiz kalmaz.",
    payLine: "Bu hafta sakin. Yolun açık.",
  },
  {
    id: "kartal_riza",
    bossName: "Kartal Rıza",
    region: "Marmara",
    type: "hakiki",
    tier: "hakiki",
    kind: "hakiki",
    cost: 4500,
    weeklyFee: 4500,
    message:
      "Peronun sahibi levhada yazsın. Kartal Rıza kapıyı tutar. 4.500.",
    refuseLine: "Gece lastik sesi duyarsın.",
    payLine: "Defter temiz. Şimdilik.",
  },
  {
    id: "gece_cemil",
    bossName: "Gececi Cemil",
    region: "İç Anadolu",
    type: "hakiki",
    tier: "hakiki",
    kind: "hakiki",
    cost: 4000,
    weeklyFee: 4000,
    message:
      "Gece seferin netsin diye kapıyı biz tutarız. 4.000 — yoksa karanlık uzun.",
    refuseLine: "Sabah gazetede ismin yanabilir.",
    payLine: "Amca memnun. Çayın soğumasın.",
  },
  {
    id: "sisli_orhan",
    bossName: "Sisli Orhan",
    region: "Karadeniz",
    type: "hakiki",
    tier: "hakiki",
    kind: "hakiki",
    cost: 3800,
    weeklyFee: 3800,
    message:
      "Sisli yolda far yetmez. Orhan’ın adamları levha bilir. 3.800.",
    refuseLine: "Yağmurda lastik patlar… tesadüf denir.",
    payLine: "Sis dağıldı. Devam.",
  },
  {
    id: "peron_selim",
    bossName: "Peron Faresi Selim",
    region: "Peron",
    type: "sahte",
    tier: "sahte",
    kind: "sahte",
    cost: 1500,
    weeklyFee: 1500,
    message:
      "Bak ağa! Biz bu otogarın haracını yeriz. Vermezsen basarız, bittin sen!",
    refuseLine: "Blöf. Bir daha mesaj atamaz.",
    payLine: "Parayı kaptı kaçtı. Sahteymiş.",
  },
  {
    id: "kupon_metin",
    bossName: "Kuponçu Metin",
    region: "Peron",
    type: "sahte",
    tier: "sahte",
    kind: "sahte",
    cost: 1200,
    weeklyFee: 1200,
    message:
      "Abim var dayım var. 1.200 ver yoksa adın gazetede yanar!",
    refuseLine: "Boş çıktı. Çay ocağında yok.",
    payLine: "Aldı kaçtı.",
  },
];

export const MAFIA_REFUSE_LINES = [
  "Söylenti: Reddeden firmanın aracında gece arıza.",
  "Kulis: Kapı sert cevap alınca peronda lastik izi.",
  "İddia: Sahte kabadayı boş çıktı.",
  "Duyum: Hakiki kapı küsünce sabaha motor çalışmadı.",
];

export const MAFIA_PAY_LINES = [
  "Bu hafta tamam. Yolun açık, teker dönsün.",
  "Selam ulaştı. Büyük balıklar uzak — şimdilik.",
  "Hesap görüldü. Peronda gürültü istemeyiz.",
];

export const BANK_LINES = {
  signed: (total: number, due: string, g: string) =>
    `Sözleşme mühürlendi. Geri ${total} ₺. Son gün ${due}. Kefil: ${g}.`,
  interest: (n: number) => `Faiz işledi: +${n} ₺. Ofisten kapat.`,
  paid: "Borç kapandı. Sicil temiz.",
  lawsuit: (due: string, g: string) =>
    `İCRA: Vade (${due}) geçti. Kefil ${g}. Dava açıldı.`,
  refuseLoan: "Limit 1.000–50.000. Kefil zorunlu.",
};

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
];

export const ROAD_LOG_LINES = [
  "İzmit sapağı — ikram geçti.",
  "Bolu etekleri — takograf yeşil.",
  "Sis ince, farlar açık.",
  "Ankara tabelası — yolcu heyecanlı.",
  "Dinlenme: çay-tost, komisyon.",
  "EDS — hız düştü.",
  "Jandarma — belgeler tamam.",
  "Telsiz: sürati düşün kaptan.",
];

export const PHONE_AMBIENT = [
  {
    from: "Çığırtkan Remzi",
    body: "3 nolu peronda rakip 50 kırdı ağa.",
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
    from: "Ahmet Eymen Bakraç",
    body: "Sabır, hesap, racon. Portre duvarda.",
  },
  {
    from: "Hakiki Peron",
    body: "Baskı çıktı. Manşetlere bak.",
  },
];

export const ROAD_EVENT_POOL: RoadEvent[] = [
  {
    type: "eds",
    title: "EDS flaş!",
    description: "Tabela yakaladı. Ceza yazıldı.",
    moneyChange: -1500,
    reputationChange: -2,
    emoji: "📷",
  },
  {
    type: "police",
    title: "Çevirme",
    description: "Belgeler tamam. On dakika.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "🚓",
  },
  {
    type: "jandarma",
    title: "Jandarma",
    description: "Bagaj açıldı, temiz.",
    moneyChange: 0,
    reputationChange: 1,
    emoji: "🪖",
  },
  {
    type: "tea",
    title: "Dinlenme",
    description: "Çay-tost. Komisyon çıktı.",
    moneyChange: -120,
    reputationChange: 1,
    emoji: "🍵",
  },
  {
    type: "engine",
    title: "Hararet",
    description: "Su eklendi.",
    moneyChange: -800,
    reputationChange: 0,
    emoji: "🔧",
  },
  {
    type: "flat",
    title: "Lastik",
    description: "Sağ arka patladı.",
    moneyChange: -2200,
    reputationChange: -1,
    emoji: "🛞",
  },
  {
    type: "bonus",
    title: "Bahşiş",
    description: "Kaptan sağ olsun.",
    moneyChange: 400,
    reputationChange: 2,
    emoji: "💵",
  },
  {
    type: "radio",
    title: "Telsiz",
    description: "Bolu çıkışı yoğun.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "📡",
  },
];

export const PAPER_MAFIA_LINES = [
  "Söylenti: Yazıhaneye selam geldi.",
  "Kulis: Red sonrası gece arıza.",
  "İddia: Sahte kabadayı tehdit yağdırdı.",
  "Duyum: Kel Niyazi adı Trakya hattında.",
];

// ═══════════════════════════════════════════
// YARDIMCILAR
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

function news(
  id: string,
  title: string,
  body: string,
  extra?: Partial<NewsItem>
): NewsItem {
  return {
    id,
    title,
    body,
    headline: title,
    ...extra,
  };
}

function buildMorningPaperLocal(
  day: number,
  fuel: number,
  bayram: boolean,
  mood: DayMoodLite
): NewsItem[] {
  const items: NewsItem[] = [
    news(
      `m-${day}-1`,
      "Sabah baskısı",
      `Gün ${day}: Peronlar erken kalktı. Esnaf mazot ve bilet konuşuyor.`,
      { tag: "gundem", day }
    ),
    news(
      `m-${day}-2`,
      "Mazot",
      `Pompa civarı ${fuel} ₺. Zam söylentisi akşam baskısında.`,
      { tag: "economy", day }
    ),
  ];
  if (mood === "mourning") {
    items.unshift(
      news(
        `m-${day}-yas`,
        "Anma",
        "Gazi Mustafa Kemal Atatürk’ü saygıyla anıyoruz. Peronlar sessiz.",
        { tag: "yas", day }
      )
    );
  }
  if (mood === "national" || bayram) {
    items.unshift(
      news(
        `m-${day}-bayram`,
        "Ulusal gün",
        "Bayraklar asılı. Coşku parayla ölçülmez.",
        { tag: "bayram", day }
      )
    );
  }
  if (Math.random() > 0.5) {
    items.push(
      news(`m-${day}-maf`, "Kulis", pick(PAPER_MAFIA_LINES), {
        tag: "kulis",
        day,
      })
    );
  }
  if (Math.random() > 0.65) {
    items.push(
      news(`m-${day}-at`, "Köşe", `“${pick(ATATURK_QUOTES)}”`, {
        tag: "portre",
        day,
      })
    );
  }
  return items;
}

function buildEveningPaperLocal(day: number): NewsItem[] {
  return [
    news(
      `e-${day}-1`,
      "Akşam baskısı",
      `Gün ${day} akşamı: Yarın zam mı sakin mi — dil bol, kaynak az.`,
      { tag: "gundem", day }
    ),
    news(
      `e-${day}-2`,
      "Peron",
      Math.random() > 0.5
        ? "Bagaj kaybı iddiası; aileler yazıhaneye yürüdü."
        : "Çığırtkanlar arasında söz dalaşı.",
      { tag: "asayis", day }
    ),
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
    newspaperOpen: false,
    paperEdition: "morning" as const,
    phoneOpen: false,
    phoneMessages: [
      {
        id: "welcome",
        from: "Ahmet Eymen Bakraç",
        body: "Hoş geldin. Portre duvarda, hesap defterde. Gerçek para yok — peron gerçek. Yurtta sulh.",
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
    meetingOpen: false,
    meetingTopic: "",
  };
}

// ═══════════════════════════════════════════
// STORE BAŞLANGIÇ
// ═══════════════════════════════════════════

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      startAsGuest: () => set({ ...createInitialState(), isGuest: true }),
      setCompanyName: (n) => set({ companyName: n.slice(0, 40) }),
      setPlayerName: (n) => set({ playerName: n.slice(0, 30) }),

      addMoney: (a) => set((s) => ({ balance: s.balance + a })),
      spendMoney: (a) => {
        if (get().balance < a) return false;
        set((s) => ({ balance: s.balance - a }));
        return true;
      },

      addLedger: (label, amount) =>
        set((s) => ({
          ledger: [{ label, amount, at: Date.now() }, ...s.ledger].slice(0, 50),
        })),

      pushPhone: (from, body, type = "sms") =>
        set((s) => ({
          phoneMessages: [
            {
              id: `ph-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              from,
              body,
              type,
              at: Date.now(),
              read: false,
            },
            ...s.phoneMessages,
          ].slice(0, 50),
        })),

      markPhoneRead: () =>
        set((s) => ({
          phoneMessages: s.phoneMessages.map((m) => ({ ...m, read: true })),
        })),

      applyCalendarBeat: (beat) => {
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
          const item = news(
            `cal-${beat.code}-${Date.now()}`,
            beat.title,
            line,
            { tag: beat.mood === "mourning" ? "yas" : "bayram" }
          );
          set((s) => ({
            morningPaper: [item, ...s.morningPaper].slice(0, 14),
            newspaper: [item, ...s.newspaper].slice(0, 14),
            paperNotify: "morning",
          }));
        }
      },

      openNewspaper: () =>
        set({
          newspaperOpen: true,
          paperNotify: null,
        }),

      closeNewspaper: () =>
        set({
          newspaperOpen: false,
          paperNotify: null,
        }),

      openPaperEdition: (ed) =>
        set({
          paperEdition: ed,
          newspaper:
            ed === "morning" ? get().morningPaper : get().eveningPaper,
          newspaperOpen: true,
          paperNotify: null,
        }),

      clearPaperNotify: () => set({ paperNotify: null }),

      setPhoneOpen: (v) => set({ phoneOpen: v }),

      openMeeting: (topic) =>
        set({
          meetingOpen: true,
          meetingTopic:
            topic ||
            "Personel disiplini, ikram şikâyeti ve peron düzeni konuşulacak.",
        }),

      closeMeeting: () => set({ meetingOpen: false, meetingTopic: "" }),

      // resolveMeeting + tickGameTime + mafya + kredi + terminal → 2. KISIM
            resolveMeeting: (choice) => {
        const topic = get().meetingTopic;
        if (choice === "warn") {
          set((s) => ({ reputation: Math.min(100, s.reputation + 1) }));
          get().pushPhone("Personel", "Uyarı verildi. “Bir daha olmasın.”");
          get().addLedger("Toplantı: uyarı", 0);
        } else if (choice === "fine") {
          const fine = 1500;
          if (get().spendMoney(fine)) {
            get().addLedger("Disiplin kesintisi", -fine);
            get().pushPhone("Muhasebe", `Kesinti ${fine} ₺.`);
          }
        } else if (choice === "bonus") {
          const b = 2000;
          if (get().spendMoney(b)) {
            set((s) => ({
              reputation: Math.min(100, s.reputation + 2),
            }));
            get().addLedger("Personel ikramiye", -b);
            get().pushPhone("Personel", "İkramiye dağıtıldı.");
          } else {
            get().pushPhone("Kasa", "İkramiye için para yok.");
          }
        } else if (choice === "fire") {
          const drivers = get().drivers;
          if (drivers.length > 1) {
            const victim = drivers[drivers.length - 1]!;
            set((s) => ({
              drivers: s.drivers.filter((d) => d.id !== victim.id),
              reputation: Math.max(0, s.reputation - 2),
            }));
            get().pushPhone(
              "Personel",
              `${victim.name} kapıya kondu. (${topic.slice(0, 36)})`
            );
            get().addLedger(`İşten çıkarma ${victim.name}`, 0);
          } else {
            get().pushPhone("Personel", "Son adamı kovamazsın.");
          }
        }
        set({ meetingOpen: false, meetingTopic: "" });
      },

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

        if (clock.gameHour !== prevH && Math.random() > 0.72) {
          const amb = pick(PHONE_AMBIENT);
          get().pushPhone(amb.from, amb.body);
        }

        if (clock.gameDay !== prevD) {
          const beat = getCalendarBeat();
          const mood: DayMoodLite =
            beat.mood === "mourning"
              ? "mourning"
              : beat.mood === "national"
                ? "national"
                : get().calendarMood;
          const morning = buildMorningPaperLocal(
            clock.gameDay,
            get().fuelPrice,
            get().bayramActive || beat.mood === "national",
            mood
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
                news(
                  `icra-${clock.gameDay}`,
                  "İcra haberi",
                  `${get().companyName} kredi vadesini aştı. Kefil: ${lc.guarantor}.`,
                  { tag: "icra", aboutPlayer: true, day: clock.gameDay }
                ),
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
        const morning = buildMorningPaperLocal(
          get().gameDay,
          get().fuelPrice,
          get().bayramActive,
          get().calendarMood
        );
        set({ morningPaper: morning, newspaper: morning });
      },

      rollRoadEvent: (exp) => {
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
        get().updateExpedition(exp.id, {
          log: [...(exp.log || []), pick(ROAD_LOG_LINES), ev.title].slice(-8),
        });
        set({ lastEvent: ev });
        if (Math.abs(ev.moneyChange) > 500 || ev.reputationChange < 0) {
          get().pushPhone("Kaptan", `${ev.title}: ${ev.description}`);
        }
        return ev;
      },

      addExpedition: (e) =>
        set((s) => ({ expeditions: [e, ...s.expeditions].slice(0, 40) })),

      updateExpedition: (id, p) =>
        set((s) => ({
          expeditions: s.expeditions.map((x) =>
            x.id === id ? { ...x, ...p } : x
          ),
        })),

      settleExpeditionProfit: (p) => {
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

      canUseBus: (busId) => {
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

      setDriverBusy: (id, busy) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id ? { ...d, onExpedition: busy } : d
          ),
        })),

      addFatigue: (id, n) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id
              ? { ...d, fatigue: Math.min(100, d.fatigue + n) }
              : d
          ),
        })),

      hireDriver: (d) => {
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
        get().pushPhone("Personel", `${d.name} kadroya girdi.`);
        return true;
      },

      takeBankLoan: (amount) =>
        get().signLoanContract(amount, "Kefilsiz (riskli)"),

      signLoanContract: (principal, guarantor) => {
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

      payBankDebt: (amount) => {
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
        get().pushPhone("Vergi Dairesi", "Borç kapatıldı.");
        return true;
      },

      accrueTax: (p) => set((s) => ({ taxDue: s.taxDue + Math.max(0, p) })),

      setOfficeNotes: (n) => set({ officeNotes: n.slice(0, 2000) }),
      setOfficeTitle: (t) =>
        set({ officeTitle: t.slice(0, 40) || "Yazıhane" }),

      mafiaVisit: () => {
        const boss = pick(BOSS_POOL);
        set({
          activeBoss: { ...boss },
          mafiaDebtDue: true,
          lastMafiaDay: get().gameDay,
        });
        get().pushPhone(boss.bossName, boss.message, "call");
        set((s) => ({
          morningPaper: [
            news(
              `maf-visit-${Date.now()}`,
              "Kapı haberi",
              `${boss.region}: “${boss.bossName}” kulislerde. Tutar konuşuluyor.`,
              { tag: "kulis" }
            ),
            ...s.morningPaper,
          ].slice(0, 14),
        }));
      },

      payMafia: () => {
        const b = get().activeBoss;
        if (!b) return false;
        const cost = b.cost ?? b.weeklyFee ?? 0;
        if (!get().spendMoney(cost)) {
          get().pushPhone(
            b.bossName,
            "Para yoksa kapı yumuşamaz. Ya bul ya sonuçlarına katlan."
          );
          return false;
        }
        get().addLedger(`Aidat · ${b.bossName}`, -cost);
        set({ mafiaDebtDue: false, activeBoss: null });
        get().pushPhone(b.bossName, pick(MAFIA_PAY_LINES));
        if (b.type === "sahte" || b.kind === "sahte" || b.tier === "sahte") {
          get().pushPhone(
            "İstihbarat",
            "Bu adam boş çıkabilir. Yine de bu hafta sustu."
          );
        }
        return true;
      },

      refuseMafia: () => {
        const b = get().activeBoss;
        set({ mafiaDebtDue: false, activeBoss: null });
        if (!b) return;

        const isFake =
          b.type === "sahte" || b.kind === "sahte" || b.tier === "sahte";

        if (isFake) {
          get().pushPhone(
            "İstihbarat",
            `${b.bossName} boş çıktı. Bir süre mesaj atar, işi yok.`
          );
          get().pushPhone(b.bossName, "Görürüz ağa… görürüz!");
          set((s) => ({
            morningPaper: [
              news(
                `sahte-${Date.now()}`,
                "Kulis",
                pick(MAFIA_REFUSE_LINES),
                { tag: "kulis" }
              ),
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
          `Söylenti: ${b.bossName} sonrası araçta arıza. Tamir şart.`
        );
        get().pushPhone(b.bossName, b.refuseLine || "Kapı küsünce gece uzun.");
        set((s) => ({
          morningPaper: [
            news(
              `kundak-${Date.now()}`,
              "Yangın / arıza",
              `${get().companyName} filosunda gece hasar. ${b.bossName} ismi kulislerde.`,
              { tag: "asayis", aboutPlayer: true }
            ),
            ...s.morningPaper,
          ].slice(0, 14),
        }));
      },

      drinkTea: () => {
        if (get().teaStock <= 0) {
          get().pushPhone("Yazıhane", "Termos boş.");
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
      setLastTicket: (t) => set({ lastTicket: t }),
      clearLastEvent: () => set({ lastEvent: null }),

      completeCitySetup: (cityId) => {
        const city = CITIES.find((c) => c.id === cityId);
        const cost = city
          ? city.licenseCost + Math.round(city.plotCost * 0.25)
          : 20000;
        if (get().balance >= cost) {
          get().spendMoney(cost);
          get().addLedger("Ruhsat / arsa", -cost);
        }
        set({
          setupDone: true,
          homeCityId: cityId,
          terminalName: city ? `${city.name} Yazıhane` : "Yazıhane",
          officeTitle: city ? `${city.name} Yazıhane` : "Yazıhane",
          terminalBuilt: true,
        });
        get().pushPhone(
          "Belediye",
          `${city?.name || "Şehir"} ruhsatı onaylandı. Mühür basıldı.`
        );
        get().pushPhone(
          "Ahmet Eymen Bakraç",
          "Kapı sende. Portre duvarda. Yurtta sulh."
        );
        return true;
      },

      createRoom: (name) => {
        const code = Math.random().toString(36).slice(2, 6).toUpperCase();
        set({ roomCode: code, roomName: name.slice(0, 32) || "Lig" });
        get().pushPhone("Lobi", `Oda kuruldu: ${code}`);
        return code;
      },
      joinRoom: (code) => {
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
          const info = SLOT_INFO[s];
          if (info) gain += info.cps * 20;
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

      buyBus: (l) => {
        if (!get().spendMoney(l.price)) return false;
        const bus: GameBus = {
          id: `bus-${Date.now()}`,
          model: l.model,
          seatCount: l.seatCount,
          engineHealth: l.engineHealth ?? 90,
          color: l.color || "blue",
          name: l.name || l.model,
          fuelUse: l.fuelUse,
          muavinCost: l.muavinCost ?? 400,
          plate: `${20 + Math.floor(Math.random() * 25)} AE ${Math.floor(
            Math.random() * 80 + 10
          )}`,
          sticker: null,
        };
        set((s) => ({ buses: [...s.buses, bus] }));
        get().addLedger(`Otobüs ${bus.name}`, -l.price);
        get().pushPhone("Garaj", `${bus.name} filoya girdi.`);
        return true;
      },

      paintBus: (id, c) => {
        if (!get().spendMoney(2500)) return;
        set((s) => ({
          buses: s.buses.map((b) => (b.id === id ? { ...b, color: c } : b)),
        }));
        get().addLedger("Boya", -2500);
      },

      setBusPlate: (id, p) =>
        set((s) => ({
          buses: s.buses.map((b) =>
            b.id === id ? { ...b, plate: p.slice(0, 12) } : b
          ),
        })),

      applySticker: (busId, stickerId) => {
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

      openComplaint: (t) =>
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
        get().addLedger("Yazıhane kirası", -5000);
        return true;
      },

      startTerminalConstruction: () => {
        if (get().terminalBuilt) return true;
        const cost = 25000;
        if (!get().spendMoney(cost)) return false;
        set({
          terminalBuilt: true,
          terminalSlots: emptySlots(),
        });
        get().addLedger("Terminal inşaat", -cost);
        get().pushPhone("Müteahhit", "Temel atıldı. Parseller açık.");
        return true;
      },

      buildSlot: (index, type) => {
        const info = SLOT_INFO[type];
        if (!info || !get().terminalBuilt) return false;
        const slots = [...get().terminalSlots];
        if (slots[index] !== "empty") return false;
        if (!get().spendMoney(info.cost)) return false;
        slots[index] = type;
        set({ terminalSlots: slots });
        get().addLedger(`İnşa ${info.label}`, -info.cost);
        return true;
      },

      setTerminalName: (n) =>
        set({ terminalName: n.slice(0, 40) || "Terminal" }),

      upgradeCrier: () => {
        const cost = 3000 * (get().crierLevel + 1);
        if (!get().spendMoney(cost)) return false;
        set((s) => ({ crierLevel: s.crierLevel + 1 }));
        get().addLedger("Çığırtkan", -cost);
        return true;
      },

      triggerSecurityRaid: () => {
        const fine = 2000 + Math.floor(Math.random() * 3000);
        set((s) => ({
          balance: Math.max(0, s.balance - fine),
          reputation: Math.max(0, s.reputation - 3),
        }));
        get().addLedger("Zabıta baskını", -fine);
        get().pushPhone("Zabıta", `Kontrol. Ceza ${fine} ₺.`);
      },
    }),
    {
      name: "otogar-tycoon-v13",
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