import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makePlate } from "@/lib/plates";
import {
  getGlobalGameClock,
  REAL_MS_PER_GAME_DAY,
} from "@/lib/gameTime";

export type BusColor = "blue" | "red" | "green" | "black" | "white" | "orange";
export type Catering = "water" | "snack" | "vip";
export type ExpeditionStatus =
  | "filling"
  | "departed"
  | "completed"
  | "cancelled"
  | "impounded";
export type OfficeTheme = "classic" | "school" | "modern";
export type NewsKind = "crash" | "rival" | "player" | "bayram" | "economy";

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
  impoundedUntil?: number | null;
  repairingUntil?: number | null;
}

export interface Passenger {
  id: string;
  name: string;
  mood: "happy" | "normal" | "angry";
}

export interface RoadEvent {
  id: string;
  type:
    | "eds"
    | "police"
    | "accident"
    | "fight"
    | "weather"
    | "funny"
    | "lawsuit"
    | "jandarma";
  title: string;
  description: string;
  moneyChange: number;
  reputationChange: number;
  emoji: string;
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
  currentEvent?: RoadEvent | null;
  driverId?: string | null;
  muavinId?: string | null;
  driveMode?: "driver";
  progress: number;
  log: string[];
  smuggle: boolean;
  smugglePaid: number;
}

export interface CustomerCase {
  id: string;
  name: string;
  issue: string;
  mood: "angry" | "polite" | "ironic";
  type: "lost_item" | "delay" | "rude" | "accident_claim";
}

export type TerminalSlot =
  | "empty"
  | "toilet"
  | "bufe"
  | "emanet"
  | "cayci"
  | "bilet"
  | "mescit"
  | "otopark";

export interface LedgerRow {
  id: string;
  label: string;
  amount: number;
  at: number;
}

export interface Driver {
  id: string;
  name: string;
  role: "driver" | "muavin";
  skill: number;
  fatigue: number;
  wage: number;
  suspicious: boolean;
  reliability: number;
  criminalNote: string;
  hiredAt: number;
  onExpedition: boolean;
}

export interface PhoneMessage {
  id: string;
  from: string;
  body: string;
  at: number;
  read: boolean;
  type: "sms" | "call";
}

export interface InterviewCandidate {
  id: string;
  name: string;
  role: "driver" | "muavin";
  skill: number;
  wage: number;
  suspicious: boolean;
  reliability: number;
  criminalNote: string;
  answers: string[];
  backgroundChecked: boolean;
}

export interface LastTicket {
  expId: string;
  origin: string;
  destination: string;
  sold: number;
  price: number;
  revenue: number;
  cost: number;
  profit: number;
  driverName: string;
  at: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  body: string;
  kind: NewsKind;
  aboutPlayer: boolean;
  day: number;
}

export interface InspectorCase {
  id: string;
  title: string;
  body: string;
  fine: number;
  bribe: number;
}

export const CITIES = [
  { id: "edirne", name: "Edirne", region: "Marmara", plotCost: 35000, licenseCost: 12000, x: 12, y: 22 },
  { id: "istanbul", name: "İstanbul", region: "Marmara", plotCost: 90000, licenseCost: 28000, x: 22, y: 28 },
  { id: "ankara", name: "Ankara", region: "İç Anadolu", plotCost: 55000, licenseCost: 18000, x: 48, y: 42 },
  { id: "izmir", name: "İzmir", region: "Ege", plotCost: 60000, licenseCost: 20000, x: 18, y: 55 },
  { id: "antalya", name: "Antalya", region: "Akdeniz", plotCost: 50000, licenseCost: 16000, x: 42, y: 78 },
  { id: "samsun", name: "Samsun", region: "Karadeniz", plotCost: 40000, licenseCost: 14000, x: 58, y: 28 },
  { id: "adana", name: "Adana", region: "Akdeniz", plotCost: 45000, licenseCost: 15000, x: 62, y: 72 },
  { id: "erzurum", name: "Erzurum", region: "Doğu", plotCost: 32000, licenseCost: 11000, x: 82, y: 38 },
] as const;

export const CATERING_INFO: Record<
  Catering,
  { label: string; perSeat: number; repMod: number; desc: string }
> = {
  water: { label: "Ucuz İkram", perSeat: 3, repMod: -2, desc: "Musluk + bisküvi" },
  snack: { label: "Standart", perSeat: 18, repMod: 0, desc: "Kek + kola" },
  vip: { label: "Lüks", perSeat: 55, repMod: 3, desc: "Çay + pişmaniye" },
};

export const STICKERS = [
  { id: "sulh", label: "Yurtta sulh, cihanda sulh", cost: 2000, rep: 3 },
  { id: "thy", label: "Tek rakibim THY", cost: 5000, rep: 5 },
  { id: "kesan", label: "Keşanlı", cost: 2500, rep: 2 },
];

export const SLOT_INFO: Record<
  Exclude<TerminalSlot, "empty">,
  { label: string; cost: number; cps: number; repMod: number; risk: number; desc: string }
> = {
  toilet: { label: "Otogar Tuvaleti", cost: 12000, cps: 0.85, repMod: 0, risk: 0, desc: "Turnike" },
  bufe: { label: "Peron Büfesi", cost: 28000, cps: 2.6, repMod: -1, risk: 6, desc: "Tost" },
  emanet: { label: "Emanetçi", cost: 45000, cps: 4.4, repMod: 1, risk: 20, desc: "Risk" },
  cayci: { label: "Çay Ocağı", cost: 22000, cps: 1.7, repMod: 1, risk: 2, desc: "Çay" },
  bilet: { label: "Bilet Gişesi", cost: 32000, cps: 2.1, repMod: 2, risk: 0, desc: "Gişe" },
  mescit: { label: "Mescit", cost: 15000, cps: 0.35, repMod: 4, risk: 0, desc: "İtibar" },
  otopark: { label: "Otopark", cost: 40000, cps: 1.9, repMod: 0, risk: 5, desc: "Park" },
};

export interface BusListing {
  model: string;
  name: string;
  seatCount: number;
  price: number;
  fuelUse: number;
  muavinCost: number;
  engineHealth: number;
  color: BusColor;
}

export const MARKET_BUSES: BusListing[] = [
  { model: "O302", name: "Hurda O302", seatCount: 46, price: 45000, fuelUse: 32, muavinCost: 400, engineHealth: 55, color: "blue" },
  { model: "O302", name: "Bakımlı O302", seatCount: 48, price: 75000, fuelUse: 30, muavinCost: 450, engineHealth: 78, color: "red" },
  { model: "Travego", name: "Travego 15", seatCount: 52, price: 180000, fuelUse: 24, muavinCost: 700, engineHealth: 90, color: "white" },
  { model: "Tourismo", name: "Tourismo", seatCount: 50, price: 220000, fuelUse: 22, muavinCost: 800, engineHealth: 92, color: "black" },
  { model: "Setra", name: "Setra S416", seatCount: 54, price: 320000, fuelUse: 20, muavinCost: 950, engineHealth: 95, color: "orange" },
  { model: "Neoplan", name: "Neoplan Cityliner", seatCount: 56, price: 410000, fuelUse: 18, muavinCost: 1100, engineHealth: 96, color: "green" },
];

export { REAL_MS_PER_GAME_DAY };

// ——— Yol diyalog havuzları ———
const EDS_POOL = [
  {
    title: "EDS flaş — Bolu",
    description:
      "Tabela 90. Kadran 118. Muavin: “Flaş yedi kaptan!” Posta yarın yazıhanede.",
    moneyChange: -1450,
    reputationChange: -1,
    emoji: "📸",
  },
  {
    title: "EDS — Keşan çıkışı",
    description:
      "Sabah sis, ayak gazda. “Bir saniye ya…” — çok geç. Ceza kesin.",
    moneyChange: -980,
    reputationChange: 0,
    emoji: "📸",
  },
  {
    title: "EDS zinciri — TEM",
    description:
      "Üç kamera art arda. Şoför küfür ediyor (içinden), yolcular gülüyor.",
    moneyChange: -2100,
    reputationChange: -1,
    emoji: "📸",
  },
  {
    title: "EDS — gece kör noktası",
    description:
      "“Burada kamera yok” efsanesi çöktü. Flaş, sonra sessizlik.",
    moneyChange: -1600,
    reputationChange: -1,
    emoji: "📸",
  },
];

const POLICE_POOL = [
  {
    title: "Çevirme — belgeler",
    description:
      "Polis: “SRC, ruhsat, takograf.” Muavin çantayı karıştırıyor… geçtiniz.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "🚓",
  },
  {
    title: "Çevirme — tartı",
    description:
      "“Bagaj fazla gibi.” Tartı sınırda. Uyarı + 200 ₺ “katkı”.",
    moneyChange: -200,
    reputationChange: 0,
    emoji: "🚓",
  },
  {
    title: "Çevirme — gece feneri",
    description:
      "Fener yüze. “Nereye kaptan?” — “Ankara.” Kimlik, yol açık.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "🚓",
  },
  {
    title: "Çevirme — emniyet kemeri tiyatrosu",
    description:
      "Arka sırada kemer yok. Muavin uyduruyor: “Hepsi uyuyor amirim.” 350 ₺.",
    moneyChange: -350,
    reputationChange: 0,
    emoji: "🚓",
  },
];

const ACCIDENT_POOL = [
  {
    title: "Virajda savrulma",
    description:
      "Muavin: “Abartma!” Yolcu çığlığı. Ayna kırıldı, sinirler gerildi.",
    moneyChange: -6500,
    reputationChange: -4,
    emoji: "💥",
  },
  {
    title: "Lastik patladı",
    description:
      "Sağ arka patlak. Duble yolda 40 dk. “Bilet paramız yanmasın” korosu.",
    moneyChange: -2400,
    reputationChange: -1,
    emoji: "🛞",
  },
  {
    title: "Öndeki Tofaş ani fren",
    description:
      "Çarpışmadınız ama çaylar uçtu. Bir yolcu “dava açarım” dedi (açmadı).",
    moneyChange: -800,
    reputationChange: -1,
    emoji: "🚗",
  },
];

const FUNNY_POOL = [
  {
    title: "Mikrofon açık",
    description:
      "Şoför türkü sandı… bütün otobüs duydu. Utanç + kahkaha.",
    moneyChange: 0,
    reputationChange: -1,
    emoji: "🎙️",
  },
  {
    title: "Pişmaniye kavgası",
    description:
      "İki yolcu son pakete göz dikti. Muavin: “Başka sefer var kardeşim!”",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "🍬",
  },
  {
    title: "Yanlış peron efsanesi",
    description:
      "Yolcu Ankara sandığı otobüste Bursa’ya uyanmış. İade tartışması.",
    moneyChange: -400,
    reputationChange: -1,
    emoji: "🎫",
  },
  {
    title: "Çaycı otobüse binmiş",
    description:
      "Terminal çaycısı “bir durak” demiş, Bolu’da inmek istemiş. Efsane.",
    moneyChange: 0,
    reputationChange: 1,
    emoji: "🍵",
  },
];

const JANDARMA_POOL = [
  {
    title: "Jandarma — bagaj kontrolü",
    description:
      "“Açın şunu.” Kara koli. Yüzün asıldı. Tutanak, bağlama, manşet yolda.",
    moneyChange: -12000,
    reputationChange: -12,
    emoji: "🚨",
  },
  {
    title: "Jandarma — “tesadüf” araması",
    description:
      "Köpek bağırdı. Koltuk altı paket. “Kaptan haberin var mıydı?” Suskunluk pahalı.",
    moneyChange: -15000,
    reputationChange: -14,
    emoji: "🚨",
  },
  {
    title: "Jandarma — otogar çıkış baskını",
    description:
      "Perondan henüz çıkmıştınız. Yol kenarı kontrol. Kaçak yük tutanağa geçti.",
    moneyChange: -11000,
    reputationChange: -11,
    emoji: "🚨",
  },
];

const WEATHER_POOL = [
  {
    title: "Bolu sis duvarı",
    description:
      "Görüş 10 metre. Konvoy yürüyor. 1 saat rötar, yolcu homurdanması.",
    moneyChange: -300,
    reputationChange: 0,
    emoji: "🌫️",
  },
  {
    title: "Ani sağanak",
    description:
      "Silecekler yetişmedi. Muavin “gemiye bindik” dedi. Kimse gülmedi.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "🌧️",
  },
];

export interface GameState {
  isGuest: boolean;
  companyName: string;
  playerName: string;
  balance: number;
  reputation: number;
  buses: GameBus[];
  expeditions: Expedition[];
  hasPlayedOnce: boolean;
  complaints: string[];
  lastEvent: RoadEvent | null;
  showComplaintModal: boolean;
  currentComplaint: string | null;
  accountingLevel: number;
  customerServiceLevel: number;
  deskRented: boolean;
  pendingCustomer: CustomerCase | null;
  bankDebt: number;
  taxDue: number;
  kdvDue: number;
  incomeTaxDue: number;
  ledger: LedgerRow[];
  terminalName: string;
  terminalSlots: TerminalSlot[];
  terminalBuilt: boolean;
  gameYear: number;
  gameDay: number;
  gameHour: number;
  lastTimeTick: number;
  lastPassiveTick: number;
  securityRisk: number;
  homeCityId: string | null;
  setupDone: boolean;
  drivers: Driver[];
  phoneMessages: PhoneMessage[];
  phoneOpen: boolean;
  officeTheme: OfficeTheme;
  pendingInterview: InterviewCandidate | null;
  lastTicket: LastTicket | null;
  drivingUnlocked: boolean;
  newspaper: NewsItem[];
  newspaperOpen: boolean;
  newspaperSeenDay: number;
  morningPaper: NewsItem[];
  eveningPaper: NewsItem[];
  paperEdition: "morning" | "evening" | null;
  officeNotes: string;
  mafiaDebtDue: boolean;
  mafiaLastPayDay: number;
  crierLevel: number;
  ağaEnergy: number;
  teaStock: number;
  inspector: InspectorCase | null;
  meetingOpen: boolean;
  meetingTopic: string;
  bayramActive: boolean;
  rivalWeak: boolean;
  guestDayLimit: number;
  forceRegister: boolean;
  paperNotify: "morning" | "evening" | null;
  fuelPrice: number;
  inflationRate: number;
  pendingFuelChange: number;
  roomCode: string | null;
  roomName: string | null;

  // 1. seferde tanımlananlar (+ 2. seferde tamamlanacak imzalar aşağıda tekrar)
  startAsGuest: () => void;
  setCompanyName: (n: string) => void;
  setPlayerName: (n: string) => void;
  addMoney: (a: number) => void;
  spendMoney: (a: number) => boolean;
  addLedger: (l: string, a: number) => void;
  pushPhone: (from: string, body: string, type?: "sms" | "call") => void;
  tickGameTime: () => void;
  generateDailyNews: () => void;
  openNewspaper: () => void;
  closeNewspaper: () => void;
  openPaperEdition: (ed: "morning" | "evening") => void;
  clearPaperNotify: () => void;
  rollRoadEvent: (exp: Expedition) => RoadEvent | null;
  // 2. seferde doldurulacak diğer action'lar — şimdilik optional değil; 2. parçada eklenecek
  [key: string]: unknown;
}

const startingBus: GameBus = {
  id: "bus-1",
  model: "O302",
  seatCount: 46,
  engineHealth: 68,
  color: "blue",
  name: "Emektar",
  fuelUse: 32,
  muavinCost: 400,
  plate: "34 OTB 01",
  sticker: null,
  impoundedUntil: null,
  repairingUntil: null,
};

const NAMES = [
  "Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Fatma Çelik", "Mustafa Şahin",
  "Elif Arslan", "Hüseyin Koç", "Zeynep Aydın", "İbrahim Öz", "Merve Yıldız",
];

export function generatePassengers(count: number): Passenger[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p-${Date.now()}-${i}`,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    mood: Math.random() > 0.8 ? "angry" : Math.random() > 0.4 ? "normal" : "happy",
  }));
}

const emptySlots = (): TerminalSlot[] =>
  Array.from({ length: 6 }).map(() => "empty");

function createInitialState() {
  const clock = getGlobalGameClock();
  return {
    isGuest: true,
    companyName: "Misafir Şirket",
    playerName: "Ağa",
    balance: 75000,
    reputation: 45,
    buses: [{ ...startingBus }] as GameBus[],
    expeditions: [] as Expedition[],
    hasPlayedOnce: false,
    complaints: [] as string[],
    lastEvent: null as RoadEvent | null,
    showComplaintModal: false,
    currentComplaint: null as string | null,
    accountingLevel: 1,
    customerServiceLevel: 1,
    deskRented: false,
    pendingCustomer: null as CustomerCase | null,
    bankDebt: 0,
    taxDue: 0,
    kdvDue: 0,
    incomeTaxDue: 0,
    ledger: [] as LedgerRow[],
    terminalName: "",
    terminalSlots: emptySlots(),
    terminalBuilt: false,
    gameYear: 1987,
    gameDay: clock.gameDay,
    gameHour: clock.gameHour,
    lastTimeTick: Date.now(),
    lastPassiveTick: Date.now(),
    securityRisk: 0,
    homeCityId: null as string | null,
    setupDone: false,
    drivers: [] as Driver[],
    phoneMessages: [] as PhoneMessage[],
    phoneOpen: false,
    officeTheme: "classic" as OfficeTheme,
    pendingInterview: null as InterviewCandidate | null,
    lastTicket: null as LastTicket | null,
    drivingUnlocked: false,
    newspaper: [] as NewsItem[],
    newspaperOpen: false,
    newspaperSeenDay: 0,
    morningPaper: [] as NewsItem[],
    eveningPaper: [] as NewsItem[],
    paperEdition: null as "morning" | "evening" | null,
    officeNotes: "— Not —\nŞoförleri kontrol et.\n",
    mafiaDebtDue: false,
    mafiaLastPayDay: 0,
    crierLevel: 0,
    ağaEnergy: 80,
    teaStock: 5,
    inspector: null as InspectorCase | null,
    meetingOpen: false,
    meetingTopic: "",
    bayramActive: false,
    rivalWeak: false,
    guestDayLimit: 5,
    forceRegister: false,
    paperNotify: null as "morning" | "evening" | null,
    fuelPrice: 42,
    inflationRate: 0.012,
    pendingFuelChange: 0,
    roomCode: null as string | null,
    roomName: null as string | null,
  };
}

// ——— 1. SEFER SONU: create + temel action'lar ———
// 2. seferde buyBus, sefer, mafya resolve vb. eklenecek.

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      startAsGuest: () =>
        set({ ...createInitialState(), buses: [{ ...startingBus }] }),

      setCompanyName: (n) => set({ companyName: n, isGuest: false }),
      setPlayerName: (n) => {
        const clean = n.trim().slice(0, 24);
        if (clean) set({ playerName: clean });
      },

      addMoney: (a) => set((s) => ({ balance: s.balance + a })),
      spendMoney: (a) => {
        if (get().balance < a) return false;
        set((s) => ({ balance: s.balance - a }));
        return true;
      },

      addLedger: (label, amount) =>
        set((s) => ({
          ledger: [
            {
              id: `L-${Date.now()}-${Math.random()}`,
              label,
              amount,
              at: Date.now(),
            },
            ...s.ledger,
          ].slice(0, 50),
        })),

      pushPhone: (from, body, type = "sms") =>
        set((s) => ({
          phoneMessages: [
            {
              id: `m-${Date.now()}`,
              from,
              body,
              at: Date.now(),
              read: false,
              type,
            },
            ...s.phoneMessages,
          ].slice(0, 40),
        })),

      clearPaperNotify: () => set({ paperNotify: null }),

      openNewspaper: () =>
        set({
          newspaperOpen: true,
          paperEdition: "morning",
          newspaper: get().morningPaper,
          newspaperSeenDay: get().gameDay,
          paperNotify: null,
        }),

      closeNewspaper: () => set({ newspaperOpen: false, paperEdition: null }),

      openPaperEdition: (ed) =>
        set({
          paperEdition: ed,
          newspaperOpen: true,
          newspaper:
            ed === "morning" ? get().morningPaper : get().eveningPaper,
          newspaperSeenDay: get().gameDay,
          paperNotify: null,
        }),

      generateDailyNews: () => {
        const day = get().gameDay;
        const fuel = get().fuelPrice;
        const morning: NewsItem[] = [];

        // Dünkü pending yakıt bugün geçerli
        const pending = get().pendingFuelChange;
        if (pending !== 0) {
          set((s) => ({
            fuelPrice: Math.max(15, Math.round((s.fuelPrice + pending) * 10) / 10),
            pendingFuelChange: 0,
          }));
        }

        const roll = Math.random();
        let tomorrow = 0;
        if (roll > 0.5) {
          const zam = Math.round((1 + Math.random() * 4) * 10) / 10;
          morning.push({
            id: `fuel-${day}`,
            headline: `MAZOTA ZAM: +${zam} ₺ (pompa ~${get().fuelPrice} ₺)`,
            body: "Esnaf çarşıda. Sefer maliyeti yakıtla dans ediyor.",
            kind: "economy",
            aboutPlayer: false,
            day,
          });
          tomorrow = Math.round((0.5 + Math.random() * 2.5) * 10) / 10;
          set((s) => ({
            inflationRate: Math.min(0.08, s.inflationRate + 0.002),
          }));
        } else if (roll < 0.2) {
          const indirim = -Math.round((0.5 + Math.random() * 2) * 10) / 10;
          morning.push({
            id: `fuel-down-${day}`,
            headline: `Pompalarda indirim sinyali: ${indirim} ₺`,
            body: "Kısa soluk. Akşam spekülasyonu başka türkü.",
            kind: "economy",
            aboutPlayer: false,
            day,
          });
          tomorrow = Math.round((Math.random() * 2 - 0.5) * 10) / 10;
        } else {
          morning.push({
            id: `fuel-flat-${day}`,
            headline: `Pompalar sabit: ${fuel} ₺/lt`,
            body: "Sakin gün. Yazıhaneler yine de homurdanıyor.",
            kind: "economy",
            aboutPlayer: false,
            day,
          });
          tomorrow = Math.round((Math.random() * 2 - 0.3) * 10) / 10;
        }
        set({ pendingFuelChange: tomorrow });

        morning.push({
          id: `m-eds-${day}`,
          headline: "SABAHTAN: EDS noktaları çoğaldı",
          body: "Bolu ve Keşan çıkışında flaş. Kaptanlar dikkat.",
          kind: "economy",
          aboutPlayer: false,
          day,
        });

        if (Math.random() > 0.45) {
          morning.push({
            id: `m-rival-${day}`,
            headline: "Ali Otobüs sarsılıyor",
            body: "Rakip zayıf — fiyat manevrası mümkün.",
            kind: "rival",
            aboutPlayer: false,
            day,
          });
          set({ rivalWeak: true });
        }

        if (get().hasPlayedOnce) {
          morning.push({
            id: `m-player-${day}`,
            headline: `${get().companyName} konuşuluyor`,
            body: `${get().terminalName || "Terminal"} peronunda hareket var.`,
            kind: "player",
            aboutPlayer: true,
            day,
          });
        }

        set({ morningPaper: morning });
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

        // Yeni gün → sabah baskısı
        if (clock.gameDay !== prevD) {
          get().generateDailyNews();
          set({ paperNotify: "morning" });
          set({ bayramActive: clock.gameDay % 7 === 0 });
          if (clock.gameDay % 7 === 0) {
            get().pushPhone(
              "Hakiki Peron",
              "Bayram trafiği! Fiyat tavanı gevşedi, yolcu kuyruğu uzadı."
            );
          }
        }

        // Akşam baskısı
        if (prevH < 18 && clock.gameHour >= 18) {
          const evening: NewsItem[] = [
            {
              id: `e1-${clock.gameDay}`,
              headline: "AKŞAM: Peronlar yavaşlıyor, hesaplar konuşuluyor",
              body: "Gündüz seferleri kapanırken yazıhaneler dolu.",
              kind: "economy",
              aboutPlayer: false,
              day: clock.gameDay,
            },
          ];
          const pf = get().pendingFuelChange;
          if (pf !== 0) {
            evening.unshift({
              id: `e-fuel-${clock.gameDay}`,
              headline:
                pf > 0
                  ? `YARIN ZAM BEKLENTİSİ: +${pf} ₺ mazot`
                  : `Yarın pompa spekülasyonu: ${pf} ₺`,
              body: "Akşam baskısı piyasayı ısıttı. Sabah yeni fiyat konuşulur.",
              kind: "economy",
              aboutPlayer: false,
              day: clock.gameDay,
            });
          }
          if (get().lastEvent?.type === "jandarma") {
            evening.unshift({
              id: `e-jand-${clock.gameDay}`,
              headline: `SKANDAL: ${get().companyName} bagajında kaçak yük!`,
              body: "Jandarma operasyonu tutanağa geçti. Firma itibarı sarsıldı. Yolcular peronda konuşuyor.",
              kind: "crash",
              aboutPlayer: true,
              day: clock.gameDay,
            });
          } else if (get().lastEvent?.type === "accident") {
            evening.push({
              id: `e-acc-${clock.gameDay}`,
              headline: "Akşam: Gündüz kazası dosyası büyüyor",
              body: "Mağdur yakınları açıklama bekliyor.",
              kind: "crash",
              aboutPlayer: true,
              day: clock.gameDay,
            });
          }
          set({ eveningPaper: evening, paperNotify: "evening" });
        }
      },

      rollRoadEvent: (exp) => {
        const drv = get().drivers.find((d) => d.id === exp.driverId);
        const fatigue = drv?.fatigue ?? 30;
        const skill = drv?.skill ?? 50;

        let pEds = 0.12;
        let pPolice = 0.13;
        let pAccident = 0.05 + fatigue / 400 - skill / 900;
        const pJandarma = exp.smuggle ? 0.16 : 0.025;
        const pFunny = 0.07;
        const pWeather = 0.06;

        if ((drv?.reliability ?? 50) < 40) pAccident += 0.04;
        if (get().bayramActive) pEds += 0.04;

        const r = Math.random();
        let pick: Omit<RoadEvent, "id"> | null = null;
        let acc = 0;

        const take = <T extends { title: string }>(
          pool: T[],
          p: number,
          type: RoadEvent["type"]
        ) => {
          acc += p;
          if (!pick && r < acc) {
            const x = pool[Math.floor(Math.random() * pool.length)];
            pick = { type, ...x } as Omit<RoadEvent, "id">;
          }
        };

        if (exp.smuggle) take(JANDARMA_POOL, pJandarma, "jandarma");
        else acc += pJandarma;

        take(EDS_POOL, pEds, "eds");
        take(POLICE_POOL, pPolice, "police");
        take(ACCIDENT_POOL, pAccident, "accident");
        take(FUNNY_POOL, pFunny, "funny");
        take(WEATHER_POOL, pWeather, "weather");

        if (!pick) return null;

        const event: RoadEvent = {
          ...(pick as Omit<RoadEvent, "id">),
          id: `evt-${Date.now()}`,
        };

        set((s) => ({
          balance: Math.max(0, s.balance + event.moneyChange),
          reputation: Math.max(
            0,
            Math.min(100, s.reputation + event.reputationChange)
          ),
          lastEvent: event,
          ağaEnergy: Math.max(0, s.ağaEnergy - 3),
        }));

        if (event.moneyChange) get().addLedger(event.title, event.moneyChange);

        // Jandarma kaçak → haber + araç bağlama + telefon
        if (event.type === "jandarma") {
          set((s) => ({
            buses: s.buses.map((b) =>
              b.id === exp.busId
                ? {
                    ...b,
                    impoundedUntil: Date.now() + 3 * REAL_MS_PER_GAME_DAY,
                  }
                : b
            ),
            eveningPaper: [
              {
                id: `flash-j-${Date.now()}`,
                headline: `SON DAKİKA: ${s.companyName} seferinde kaçak yük!`,
                body: `${event.description} İtibar yerle bir. Peron dedikodusu geceye sardı.`,
                kind: "crash" as const,
                aboutPlayer: true,
                day: s.gameDay,
              },
              ...s.eveningPaper,
            ].slice(0, 8),
            paperNotify: "evening",
          }));
          get().pushPhone(
            "Hakiki Peron Gazetesi",
            `MANŞET: ${get().companyName} bagaj skandalı. İtibar ${get().reputation}.`
          );
          get().pushPhone(
            "Jandarma",
            "Tutanak tutuldu. Araç işlem görülene kadar bağlandı."
          );
        }

        if (event.type === "eds") {
          get().pushPhone("Trafik", `${event.title} — ceza yazıldı.`);
        }
        if (event.type === "accident") {
          get().pushPhone(
            "Muavin",
            `${event.title}: ${event.description.slice(0, 80)}…`
          );
        }

        return event;
      },
      
      paintBus: (id: string, c: BusColor) =>
        set((s) => ({
          buses: s.buses.map((b) => (b.id === id ? { ...b, color: c } : b)),
        })),

      setBusPlate: (id: string, p: string) =>
        set((s) => ({
          buses: s.buses.map((b) =>
            b.id === id ? { ...b, plate: p.toUpperCase().slice(0, 14) } : b
          ),
        })),

      buyBus: (l: BusListing) => {
        if (get().balance < l.price) return false;
        const bus: GameBus = {
          id: `bus-${Date.now()}`,
          model: l.model,
          name: l.name,
          seatCount: l.seatCount,
          engineHealth: l.engineHealth,
          color: l.color,
          fuelUse: l.fuelUse,
          muavinCost: l.muavinCost,
          plate: makePlate(get().homeCityId, l.model),
          sticker: null,
          impoundedUntil: null,
          repairingUntil: null,
        };
        set((s) => ({
          balance: s.balance - l.price,
          buses: [...s.buses, bus],
        }));
        get().addLedger(`Otobüs: ${l.name}`, -l.price);
        return true;
      },

      applySticker: (busId: string, stickerId: string) => {
        const st = STICKERS.find((x) => x.id === stickerId);
        if (!st || get().balance < st.cost) return false;
        set((s) => ({
          balance: s.balance - st.cost,
          reputation: Math.min(100, s.reputation + st.rep),
          buses: s.buses.map((b) =>
            b.id === busId ? { ...b, sticker: st.label } : b
          ),
        }));
        get().addLedger(`Yazı: ${st.label}`, -st.cost);
        return true;
      },

      addExpedition: (e: Expedition) =>
        set((s) => ({ expeditions: [e, ...s.expeditions] })),

      updateExpedition: (id: string, d: Partial<Expedition>) =>
        set((s) => ({
          expeditions: s.expeditions.map((e) =>
            e.id === id ? { ...e, ...d } : e
          ),
        })),

      openComplaint: (t: string) =>
        set((s) => ({
          currentComplaint: t,
          showComplaintModal: true,
          complaints: [t, ...s.complaints].slice(0, 12),
          reputation: Math.max(0, s.reputation - 2),
          ağaEnergy: Math.max(0, s.ağaEnergy - 5),
        })),

      closeComplaint: () =>
        set({ showComplaintModal: false, currentComplaint: null }),

      clearLastEvent: () => set({ lastEvent: null }),
      setHasPlayedOnce: () => set({ hasPlayedOnce: true }),
      resetGame: () => get().startAsGuest(),
      resetGameFull: () => get().startAsGuest(),

      upgradeAccounting: () => {
        const { balance, accountingLevel } = get();
        const cost = 15000 * accountingLevel;
        if (balance < cost || accountingLevel >= 5) return false;
        set({ balance: balance - cost, accountingLevel: accountingLevel + 1 });
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
        return true;
      },

      rentDesk: () => {
        if (get().deskRented || get().balance < 25000) return false;
        set((s) => ({
          balance: s.balance - 25000,
          deskRented: true,
          reputation: Math.min(100, s.reputation + 3),
        }));
        return true;
      },

      spawnCustomer: () =>
        set({
          pendingCustomer: {
            id: `c-${Date.now()}`,
            name: "Ayşe Teyze",
            issue: "Valiz kayıp, kaptan umursamadı!",
            mood: "angry",
            type: "lost_item",
          },
        }),

      resolveCustomer: (choice: "dismiss" | "help" | "compensate") => {
        if (!get().pendingCustomer) return;
        if (choice === "dismiss") {
          set((s) => ({
            pendingCustomer: null,
            reputation: Math.max(0, s.reputation - 5),
          }));
        } else if (choice === "help") {
          set((s) => ({
            pendingCustomer: null,
            reputation: Math.min(
              100,
              s.reputation + 2 + s.customerServiceLevel
            ),
          }));
        } else {
          const pay = 1500 + get().customerServiceLevel * 200;
          set((s) => ({
            pendingCustomer: null,
            balance: s.balance - pay,
            reputation: Math.min(100, s.reputation + 6),
          }));
          get().addLedger("Tazminat", -pay);
        }
      },

      takeBankLoan: (amount: number) => {
        const MAX_LOAN = 50000;
        const a = Math.min(MAX_LOAN, Math.max(0, Math.floor(amount)));
        if (a < 1000) return false;
        const debt = Math.round(a * 1.12);
        if (get().bankDebt + debt > MAX_LOAN * 1.2) return false;
        set((s) => ({ balance: s.balance + a, bankDebt: s.bankDebt + debt }));
        get().addLedger("Kredi", a);
        return true;
      },

      payBankDebt: (amount: number) => {
        const pay = Math.min(amount, get().bankDebt, get().balance);
        if (pay <= 0) return false;
        set((s) => ({ balance: s.balance - pay, bankDebt: s.bankDebt - pay }));
        get().addLedger("Banka ödeme", -pay);
        return true;
      },

      payTax: () => {
        const { taxDue, balance, reputation } = get();
        if (taxDue <= 0 || balance < taxDue) return false;
        set({
          balance: balance - taxDue,
          taxDue: 0,
          kdvDue: 0,
          incomeTaxDue: 0,
          reputation: Math.min(100, reputation + 3),
        });
        get().addLedger("Vergi", -taxDue);
        return true;
      },

      accrueTax: (profit: number) => {
        if (profit <= 0) return;
        const kdv = Math.round(profit * 0.08);
        const gel = Math.round(profit * 0.05);
        set((s) => ({
          kdvDue: s.kdvDue + kdv,
          incomeTaxDue: s.incomeTaxDue + gel,
          taxDue: s.taxDue + kdv + gel,
        }));
      },

      setTerminalName: (n: string) => set({ terminalName: n }),

      startTerminalConstruction: () => {
        if (get().terminalBuilt || get().balance < 100000) return false;
        set((s) => ({
          balance: s.balance - 100000,
          terminalBuilt: true,
          terminalName: s.terminalName || "Yeni Terminal",
          reputation: Math.min(100, s.reputation + 8),
        }));
        get().addLedger("Terminal inşaat", -100000);
        return true;
      },

      buildSlot: (index: number, type: TerminalSlot) => {
        if (!get().terminalBuilt || type === "empty") return false;
        if (get().terminalSlots[index] !== "empty") return false;
        const info = SLOT_INFO[type];
        if (get().balance < info.cost) return false;
        const next = [...get().terminalSlots];
        next[index] = type;
        set((s) => ({
          balance: s.balance - info.cost,
          terminalSlots: next,
          reputation: Math.min(
            100,
            Math.max(0, s.reputation + info.repMod)
          ),
          securityRisk: Math.min(
            100,
            next.reduce(
              (a, sl) => a + (sl === "empty" ? 0 : SLOT_INFO[sl].risk),
              0
            )
          ),
        }));
        return true;
      },

      collectPassiveIncome: () => {
        const now = Date.now();
        const { lastPassiveTick, terminalSlots, terminalBuilt } = get();
        if (!terminalBuilt) {
          set({ lastPassiveTick: now });
          return;
        }
        const sec = Math.min(90, (now - lastPassiveTick) / 1000);
        if (sec < 1) return;
        let cps = 0;
        terminalSlots.forEach((slot) => {
          if (slot !== "empty") cps += SLOT_INFO[slot].cps;
        });
        const gain = Math.round(cps * sec * 10) / 10;
        if (gain > 0) {
          set((st) => ({ balance: st.balance + gain, lastPassiveTick: now }));
        } else {
          set({ lastPassiveTick: now });
        }
      },

      triggerSecurityRaid: () => {
        const { securityRisk, balance, reputation } = get();
        if (securityRisk < 22 || Math.random() > securityRisk / 130) return;
        const fine = 2500 + Math.floor(securityRisk * 90);
        set({
          balance: balance - fine,
          reputation: Math.max(0, reputation - 3),
        });
        get().pushPhone("Zabıta", `Baskın! Ceza ${fine} ₺. Evraklar nerede ağa?`);
        get().addLedger("Zabıta", -fine);
      },

      settleExpeditionProfit: (base: number) => {
        const bonus = 1 + get().accountingLevel * 0.05;
        const final = Math.round(base * bonus);
        get().addMoney(final);
        get().addLedger(`Sefer net x${bonus.toFixed(2)}`, final);
        get().accrueTax(Math.max(0, final));
        return final;
      },

      completeCitySetup: (cityId: string) => {
        const city = CITIES.find((c) => c.id === cityId);
        if (!city) return false;
        const total = city.plotCost + city.licenseCost;
        if (get().balance < total) return false;
        set((s) => ({
          balance: s.balance - total,
          homeCityId: cityId,
          setupDone: true,
          terminalName: `${city.name} Terminali`,
          buses: s.buses.map((b, i) =>
            i === 0 ? { ...b, plate: makePlate(cityId, b.model) } : b
          ),
        }));
        get().addLedger(`${city.name} arsa+ruhsat`, -total);
        get().pushPhone(
          `${city.name} Belediyesi`,
          "Ruhsat onaylandı. Hayırlı olsun kaptan."
        );
        get().generateDailyNews();
        return true;
      },

      hireDriver: (
        d: Omit<Driver, "id" | "hiredAt" | "fatigue" | "onExpedition">
      ) => {
        if (get().balance < d.wage) return false;
        const driver: Driver = {
          ...d,
          id: `drv-${Date.now()}`,
          hiredAt: Date.now(),
          fatigue: 0,
          onExpedition: false,
        };
        set((s) => ({
          balance: s.balance - d.wage,
          drivers: [...s.drivers, driver],
        }));
        get().addLedger(`İşe alım: ${d.name}`, -d.wage);
        return true;
      },

      restDriver: (id: string) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id ? { ...d, fatigue: Math.max(0, d.fatigue - 40) } : d
          ),
        })),

      addFatigue: (id: string, a: number) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id
              ? { ...d, fatigue: Math.min(100, d.fatigue + a) }
              : d
          ),
        })),

      setDriverBusy: (id: string, busy: boolean) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id ? { ...d, onExpedition: busy } : d
          ),
        })),

      markPhoneRead: () =>
        set((s) => ({
          phoneMessages: s.phoneMessages.map((m) => ({ ...m, read: true })),
        })),

      setPhoneOpen: (v: boolean) => set({ phoneOpen: v }),
      setOfficeTheme: (t: OfficeTheme) => set({ officeTheme: t }),
      setOfficeNotes: (t: string) => set({ officeNotes: t.slice(0, 2000) }),
      setLastTicket: (t: LastTicket | null) => set({ lastTicket: t }),

      spawnInterview: (role: "driver" | "muavin") => {
        const names = [
          "Hasan Kaptan",
          "Mehmet Usta",
          "Ali Yolcu",
          "Kemal",
          "Osman",
          "Veli",
        ];
        const suspicious = Math.random() > 0.62;
        const skill = suspicious
          ? 20 + Math.floor(Math.random() * 25)
          : 55 + Math.floor(Math.random() * 40);
        const reliability = suspicious
          ? 15 + Math.floor(Math.random() * 30)
          : 60 + Math.floor(Math.random() * 35);
        const wage =
          role === "driver" ? 800 + skill * 8 : 500 + skill * 5;
        const good = [
          "10 yıldır sürüyorum.",
          "Takograf tamam.",
          "Gece olur.",
          "SRC var.",
          "Referansım var.",
        ];
        const bad = [
          "Ehliyet evde.",
          "Ufak kazalar.",
          "Maaş peşin.",
          "Takograf nedir?",
          "Gece uyurum.",
        ];
        const pool = suspicious ? bad : good;
        const notes = [
          "Temiz kayıt.",
          "İzmit virajında yan yatırdı.",
          "Takograf oynamış.",
          "Üç firma değiştirmiş.",
          "Dürüst, SRC tamam.",
        ];
        set({
          pendingInterview: {
            id: `int-${Date.now()}`,
            name: names[Math.floor(Math.random() * names.length)],
            role,
            skill,
            wage,
            suspicious,
            reliability,
            criminalNote: notes[Math.floor(Math.random() * notes.length)],
            answers: [...pool].sort(() => Math.random() - 0.5).slice(0, 5),
            backgroundChecked: false,
          },
        });
      },

      checkBackground: () => {
        const c = get().pendingInterview;
        if (!c || c.backgroundChecked || get().balance < 500) return false;
        set((s) => ({
          balance: s.balance - 500,
          pendingInterview: s.pendingInterview
            ? { ...s.pendingInterview, backgroundChecked: true }
            : null,
        }));
        get().addLedger("İstihbarat", -500);
        get().pushPhone("Eski firma", c.criminalNote);
        return true;
      },

      finishInterview: (hire: boolean) => {
        const c = get().pendingInterview;
        if (!c) return;
        if (hire) {
          get().hireDriver({
            name: c.name,
            role: c.role,
            skill: c.skill,
            wage: c.wage,
            suspicious: c.suspicious,
            reliability: c.reliability,
            criminalNote: c.criminalNote,
          });
        }
        set({ pendingInterview: null });
      },

      mafiaVisit: () => {
        set({ mafiaDebtDue: true });
        get().pushPhone(
          "İsimsiz",
          `${get().playerName}, haftalık yazıhane aidatı konuşulacak. Kapıyı çalacağız.`
        );
      },

      payMafia: () => {
        const fee = 8000;
        if (get().balance < fee) return false;
        set((s) => ({
          balance: s.balance - fee,
          mafiaDebtDue: false,
          mafiaLastPayDay: s.gameDay,
        }));
        get().addLedger("Yazıhane aidatı", -fee);
        get().pushPhone("İsimsiz", "Akıllı esnaf. Bu hafta sakin.");
        return true;
      },

      refuseMafia: () => {
        set({ mafiaDebtDue: false });
        const list = get().buses.filter(
          (b) => !b.repairingUntil || b.repairingUntil < Date.now()
        );
        if (list.length === 0) {
          get().pushPhone("İsimsiz", "Yanacak araba kalmamış…");
          return;
        }
        const target = list[Math.floor(Math.random() * list.length)];
        const bill = 12000;
        const fireNews: NewsItem = {
          id: `fire-${Date.now()}`,
          headline: `KUNDAK: ${target.plate} alev aldı!`,
          body: "Gece otopark yangını. Araç tamire çekildi. Emniyet soruşturma açtı.",
          kind: "crash",
          aboutPlayer: true,
          day: get().gameDay,
        };
        set((s) => ({
          balance: Math.max(500, s.balance - bill),
          reputation: Math.max(0, s.reputation - 7),
          buses: s.buses.map((b) =>
            b.id === target.id
              ? {
                  ...b,
                  engineHealth: Math.max(5, b.engineHealth - 55),
                  repairingUntil: Date.now() + 2 * REAL_MS_PER_GAME_DAY,
                }
              : b
          ),
          eveningPaper: [fireNews, ...s.eveningPaper].slice(0, 8),
          paperNotify: "evening",
        }));
        get().addLedger(`Kundak: ${target.name}`, -bill);
        get().pushPhone("Nöbet", `${target.plate} kundaklandı. Tamirde.`);
      },

      upgradeCrier: () => {
        const lv = get().crierLevel;
        if (lv >= 5) return false;
        const cost = 3000 + lv * 4000;
        if (get().balance < cost) return false;
        set((s) => ({ balance: s.balance - cost, crierLevel: lv + 1 }));
        get().addLedger(`Çığırtkan sv.${lv + 1}`, -cost);
        return true;
      },

      drinkTea: () => {
        if (get().teaStock <= 0) return;
        set((s) => ({
          teaStock: s.teaStock - 1,
          ağaEnergy: Math.min(100, s.ağaEnergy + 18),
        }));
      },

      buyTeaStock: () => {
        if (get().balance < 800) return false;
        set((s) => ({
          balance: s.balance - 800,
          teaStock: s.teaStock + 8,
        }));
        get().addLedger("Çay seti", -800);
        return true;
      },

      spawnInspector: () => {
        if (get().inspector) return;
        set({
          inspector: {
            id: `ins-${Date.now()}`,
            title: "Müfettiş kapıda",
            body: "Evrak, sigorta, korsan yolcu… Konuşalım ağa.",
            fine: 15000,
            bribe: 2000,
          },
          ağaEnergy: Math.max(0, get().ağaEnergy - 10),
        });
      },

      resolveInspector: (choice: "pay" | "bribe") => {
        const ins = get().inspector;
        if (!ins) return;
        if (choice === "pay") {
          set((s) => ({
            balance: s.balance - ins.fine,
            reputation: Math.min(100, s.reputation + 2),
            inspector: null,
          }));
          get().addLedger("Müfettiş cezası", -ins.fine);
        } else {
          if (get().balance < ins.bribe) return;
          set((s) => ({
            balance: s.balance - ins.bribe,
            reputation: Math.max(0, s.reputation - 4),
            inspector: null,
          }));
          get().addLedger("Çorba parası", -ins.bribe);
        }
      },

      openMeeting: (topic?: string) =>
        set({
          meetingOpen: true,
          meetingTopic: topic || "Genel değerlendirme",
        }),

      closeMeeting: () => set({ meetingOpen: false, meetingTopic: "" }),

      resolveMeeting: (
        choice: "warn" | "fine" | "bonus" | "fire"
      ) => {
        const drivers = get().drivers.filter((d) => d.role === "driver");
        if (choice === "warn") {
          set((s) => ({
            reputation: Math.min(100, s.reputation + 1),
            meetingOpen: false,
          }));
        } else if (choice === "fine") {
          set((s) => ({ balance: s.balance + 500, meetingOpen: false }));
        } else if (choice === "bonus") {
          if (get().balance < 2000) return;
          set((s) => ({
            balance: s.balance - 2000,
            reputation: Math.min(100, s.reputation + 3),
            meetingOpen: false,
          }));
          get().addLedger("İkramiye", -2000);
        } else {
          const bad = drivers.find(
            (d) => d.suspicious || d.reliability < 40
          );
          if (bad) {
            set((s) => ({
              drivers: s.drivers.filter((d) => d.id !== bad.id),
              meetingOpen: false,
            }));
            get().pushPhone("İK", `${bad.name} çıkarıldı.`);
          } else {
            set({ meetingOpen: false });
          }
        }
      },

      crierBonus: () => 1 + get().crierLevel * 0.08,

      priceCapMultiplier: () =>
        get().bayramActive ? 2.2 : get().rivalWeak ? 1.15 : 1,

      canUseBus: (busId: string) => {
        const b = get().buses.find((x) => x.id === busId);
        if (!b) return false;
        const now = Date.now();
        if (b.repairingUntil && b.repairingUntil > now) return false;
        if (b.impoundedUntil && b.impoundedUntil > now) return false;
        return true;
      },

      startBusRepair: (busId: string) => {
        const b = get().buses.find((x) => x.id === busId);
        if (!b || get().balance < 8000) return false;
        set((s) => ({
          balance: s.balance - 8000,
          buses: s.buses.map((x) =>
            x.id === busId
              ? {
                  ...x,
                  repairingUntil: Date.now() + 2 * REAL_MS_PER_GAME_DAY,
                  engineHealth: Math.min(100, x.engineHealth + 40),
                }
              : x
          ),
        }));
        get().addLedger(`Tamir: ${b.name}`, -8000);
        return true;
      },

      createRoom: (name: string) => {
        const code = Math.random().toString(36).slice(2, 6).toUpperCase();
        set({
          roomCode: code,
          roomName: name.trim() || "Trakya Ligi",
        });
        get().pushPhone(
          "Lobi",
          `Oda: ${name || "Trakya Ligi"} · Kod ${code}`
        );
        return code;
      },

      joinRoom: (code: string) => {
        const c = code.trim().toUpperCase();
        if (c.length < 4) return false;
        set({ roomCode: c, roomName: `Oda ${c}` });
        get().pushPhone("Lobi", `${c} odasına katıldın.`);
        return true;
      },

      leaveRoom: () => set({ roomCode: null, roomName: null }),

      shareRoomText: () => {
        const code = get().roomCode || "????";
        return `Otogar Tycoon'da yazıhanemi kurdum, peron savaşlarında arkadaşlarıma meydan okuyorum! Oda Kodum: ${code}, gel esnaf gör!`;
      },
      
    }),
    { name: "otogar-tycoon-save-v8" }
  )
);
