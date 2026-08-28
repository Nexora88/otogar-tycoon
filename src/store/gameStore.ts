import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makePlate } from "@/lib/plates";

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
  water: {
    label: "Ucuz İkram (musluk + bisküvi)",
    perSeat: 3,
    repMod: -2,
    desc: "Ucuz, şikâyet",
  },
  snack: {
    label: "Standart (kek + kola)",
    perSeat: 18,
    repMod: 0,
    desc: "Denge",
  },
  vip: {
    label: "Lüks (çay + pişmaniye)",
    perSeat: 55,
    repMod: 3,
    desc: "Pahalı, itibar+",
  },
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

export const REAL_MS_PER_GAME_DAY = 90_000;

export interface GameState {
  isGuest: boolean;
  companyName: string;
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

  startAsGuest: () => void;
  setCompanyName: (n: string) => void;
  addMoney: (a: number) => void;
  spendMoney: (a: number) => boolean;
  paintBus: (id: string, c: BusColor) => void;
  setBusPlate: (id: string, p: string) => void;
  buyBus: (l: BusListing) => boolean;
  applySticker: (busId: string, stickerId: string) => boolean;
  addExpedition: (e: Expedition) => void;
  updateExpedition: (id: string, d: Partial<Expedition>) => void;
  openComplaint: (t: string) => void;
  closeComplaint: () => void;
  clearLastEvent: () => void;
  setHasPlayedOnce: () => void;
  resetGame: () => void;
  upgradeAccounting: () => boolean;
  upgradeCustomerService: () => boolean;
  rentDesk: () => boolean;
  spawnCustomer: () => void;
  resolveCustomer: (c: "dismiss" | "help" | "compensate") => void;
  takeBankLoan: (a: number) => boolean;
  payBankDebt: (a: number) => boolean;
  payTax: () => boolean;
  accrueTax: (p: number) => void;
  addLedger: (l: string, a: number) => void;
  setTerminalName: (n: string) => void;
  startTerminalConstruction: () => boolean;
  buildSlot: (i: number, t: TerminalSlot) => boolean;
  collectPassiveIncome: () => void;
  triggerSecurityRaid: () => void;
  settleExpeditionProfit: (p: number) => number;
  completeCitySetup: (id: string) => boolean;
  hireDriver: (
    d: Omit<Driver, "id" | "hiredAt" | "fatigue" | "onExpedition">
  ) => boolean;
  restDriver: (id: string) => void;
  addFatigue: (id: string, a: number) => void;
  setDriverBusy: (id: string, busy: boolean) => void;
  pushPhone: (from: string, body: string, type?: "sms" | "call") => void;
  markPhoneRead: () => void;
  setPhoneOpen: (v: boolean) => void;
  setOfficeTheme: (t: OfficeTheme) => void;
  spawnInterview: (role: "driver" | "muavin") => void;
  checkBackground: () => boolean;
  finishInterview: (hire: boolean) => void;
  setLastTicket: (t: LastTicket | null) => void;
  tickGameTime: () => void;
  openNewspaper: () => void;
  closeNewspaper: () => void;
  openPaperEdition: (ed: "morning" | "evening") => void;
  generateDailyNews: () => void;
  setOfficeNotes: (t: string) => void;
  mafiaVisit: () => void;
  payMafia: () => boolean;
  refuseMafia: () => void;
  upgradeCrier: () => boolean;
  drinkTea: () => void;
  buyTeaStock: () => boolean;
  spawnInspector: () => void;
  resolveInspector: (choice: "pay" | "bribe") => void;
  openMeeting: (topic?: string) => void;
  closeMeeting: () => void;
  resolveMeeting: (choice: "warn" | "fine" | "bonus" | "fire") => void;
  rollRoadEvent: (exp: Expedition) => RoadEvent | null;
  crierBonus: () => number;
  priceCapMultiplier: () => number;
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
};

const NAMES = [
  "Ahmet Yılmaz",
  "Ayşe Demir",
  "Mehmet Kaya",
  "Fatma Çelik",
  "Mustafa Şahin",
  "Elif Arslan",
  "Hüseyin Koç",
  "Zeynep Aydın",
  "İbrahim Öz",
  "Merve Yıldız",
];

export function generatePassengers(count: number): Passenger[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p-${Date.now()}-${i}`,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    mood:
      Math.random() > 0.8 ? "angry" : Math.random() > 0.4 ? "normal" : "happy",
  }));
}

const CRIMINAL_NOTES = [
  "Temiz kayıt.",
  "İzmit virajında yan yatırdı; pişmaniye iddiası.",
  "Takograf oynamış.",
  "Üç firma değiştirmiş.",
  "Dürüst, SRC tamam.",
];

const emptySlots = (): TerminalSlot[] =>
  Array.from({ length: 6 }).map(() => "empty");

const MAX_LOAN = 50000;

function createInitialState() {
  return {
    isGuest: true,
    companyName: "Misafir Şirket",
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
    gameDay: 1,
    gameHour: 6,
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
    officeNotes: "— Not defteri —\nSabah: şoför kontrol.\n",
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
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      startAsGuest: () =>
        set({ ...createInitialState(), buses: [{ ...startingBus }] }),

      setCompanyName: (n) => set({ companyName: n }),

      addMoney: (a) => set((s) => ({ balance: s.balance + a })),

      spendMoney: (a) => {
        if (get().balance < a) return false;
        set((s) => ({ balance: s.balance - a }));
        return true;
      },

      paintBus: (id, c) =>
        set((s) => ({
          buses: s.buses.map((b) => (b.id === id ? { ...b, color: c } : b)),
        })),

      setBusPlate: (id, p) =>
        set((s) => ({
          buses: s.buses.map((b) =>
            b.id === id ? { ...b, plate: p.toUpperCase().slice(0, 14) } : b
          ),
        })),

      buyBus: (l) => {
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
        };
        set((s) => ({
          balance: s.balance - l.price,
          buses: [...s.buses, bus],
        }));
        get().addLedger(`Otobüs: ${l.name}`, -l.price);
        return true;
      },

      applySticker: (busId, stickerId) => {
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

      addExpedition: (e) =>
        set((s) => ({ expeditions: [e, ...s.expeditions] })),

      updateExpedition: (id, d) =>
        set((s) => ({
          expeditions: s.expeditions.map((e) =>
            e.id === id ? { ...e, ...d } : e
          ),
        })),

      openComplaint: (t) =>
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

      spawnCustomer: () => {
        set({
          pendingCustomer: {
            id: `c-${Date.now()}`,
            name: "Ayşe Teyze",
            issue: "Valiz kayıp!",
            mood: "angry",
            type: "lost_item",
          },
        });
      },

      resolveCustomer: (choice) => {
        const {
          pendingCustomer,
          reputation,
          balance,
          customerServiceLevel,
        } = get();
        if (!pendingCustomer) return;
        if (choice === "dismiss") {
          set({
            pendingCustomer: null,
            reputation: Math.max(0, reputation - 5),
          });
        } else if (choice === "help") {
          set({
            pendingCustomer: null,
            reputation: Math.min(
              100,
              reputation + 2 + customerServiceLevel
            ),
          });
        } else {
          const pay = 1500 + customerServiceLevel * 200;
          set({
            pendingCustomer: null,
            balance: balance - pay,
            reputation: Math.min(100, reputation + 6),
          });
          get().addLedger("Tazminat", -pay);
        }
      },

      takeBankLoan: (amount) => {
        const a = Math.min(MAX_LOAN, Math.max(0, Math.floor(amount)));
        if (a < 1000) return false;
        const debt = Math.round(a * 1.12);
        if (get().bankDebt + debt > MAX_LOAN * 1.2) return false;
        set((s) => ({ balance: s.balance + a, bankDebt: s.bankDebt + debt }));
        get().addLedger("Kredi", a);
        return true;
      },

      payBankDebt: (amount) => {
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

      accrueTax: (profit) => {
        if (profit <= 0) return;
        const kdv = Math.round(profit * 0.08);
        const gel = Math.round(profit * 0.05);
        set((s) => ({
          kdvDue: s.kdvDue + kdv,
          incomeTaxDue: s.incomeTaxDue + gel,
          taxDue: s.taxDue + kdv + gel,
        }));
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

      setTerminalName: (n) => set({ terminalName: n }),

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

      buildSlot: (index, type) => {
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
        get().pushPhone("Zabıta", `Baskın. Ceza ${fine} ₺.`);
        get().addLedger("Zabıta baskını", -fine);
      },

      settleExpeditionProfit: (base) => {
        const bonus = 1 + get().accountingLevel * 0.05;
        const final = Math.round(base * bonus);
        get().addMoney(final);
        get().addLedger(`Sefer net x${bonus.toFixed(2)}`, final);
        get().accrueTax(Math.max(0, final));
        return final;
      },

      completeCitySetup: (cityId) => {
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
        get().pushPhone(`${city.name} Belediyesi`, "Ruhsat onaylandı.");
        get().generateDailyNews();
        return true;
      },

      hireDriver: (d) => {
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

      restDriver: (id) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id ? { ...d, fatigue: Math.max(0, d.fatigue - 40) } : d
          ),
        })),

      addFatigue: (id, a) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id
              ? { ...d, fatigue: Math.min(100, d.fatigue + a) }
              : d
          ),
        })),

      setDriverBusy: (id, busy) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id ? { ...d, onExpedition: busy } : d
          ),
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

      markPhoneRead: () =>
        set((s) => ({
          phoneMessages: s.phoneMessages.map((m) => ({ ...m, read: true })),
        })),

      setPhoneOpen: (v) => set({ phoneOpen: v }),

      setOfficeTheme: (t) => set({ officeTheme: t }),

      spawnInterview: (role) => {
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
        set({
          pendingInterview: {
            id: `int-${Date.now()}`,
            name: names[Math.floor(Math.random() * names.length)],
            role,
            skill,
            wage,
            suspicious,
            reliability,
            criminalNote:
              CRIMINAL_NOTES[
                Math.floor(Math.random() * CRIMINAL_NOTES.length)
              ],
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

      finishInterview: (hire) => {
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

      setLastTicket: (t) => set({ lastTicket: t }),

      tickGameTime: () => {
        const now = Date.now();
        const { lastTimeTick, gameHour, gameDay, gameYear } = get();
        const hoursPass = Math.floor((now - lastTimeTick) / 3750);
        if (hoursPass < 1) return;

        let h = gameHour + hoursPass;
        let d = gameDay;
        let y = gameYear;
        const crossedEvening = gameHour < 18 && h >= 18;

        while (h >= 24) {
          h -= 24;
          d += 1;
          const bayram = d % 7 === 0;
          set({ bayramActive: bayram });
          if (bayram) {
            get().pushPhone("Hakiki Peron", "BAYRAM TRAFİĞİ başladı!");
          }
          get().generateDailyNews();
          if (d % 7 === 1) get().mafiaVisit();
          if (Math.random() > 0.85) get().spawnInspector();
        }

        if (crossedEvening) {
          const evening: NewsItem[] = [
            {
              id: `e1-${d}`,
              headline: "AKŞAM: Peronlar sakin, hesaplar konuşuluyor",
              body: "Gündüz seferlerinin bilançosu yazıhanelerde.",
              kind: "economy",
              aboutPlayer: false,
              day: d,
            },
          ];
          if (get().lastEvent?.type === "accident") {
            evening.push({
              id: `e-acc-${d}`,
              headline: "Akşam: Gündüz kazası dosyası büyüyor",
              body: "Mağdur yakınları açıklama bekliyor.",
              kind: "crash",
              aboutPlayer: true,
              day: d,
            });
          }
          set({ eveningPaper: evening });
        }

        if (d > 360) {
          d = 1;
          y += 1;
        }

        set({
          gameHour: h % 24,
          gameDay: d,
          gameYear: y,
          lastTimeTick: now,
          ağaEnergy: Math.max(0, get().ağaEnergy - hoursPass * 0.4),
        });
      },

      generateDailyNews: () => {
        const day = get().gameDay;
        const morning: NewsItem[] = [
          {
            id: `m1-${day}`,
            headline: "SABAHTAN: Yollarda denetim sıklaştı",
            body: "EDS ve jandarma artabilir.",
            kind: "economy",
            aboutPlayer: false,
            day,
          },
        ];
        if (Math.random() > 0.4) {
          morning.push({
            id: `m2-${day}`,
            headline: "Ali Otobüs zor durumda",
            body: "Rakip zayıf; fiyat manevrası mümkün.",
            kind: "rival",
            aboutPlayer: false,
            day,
          });
          set({ rivalWeak: true });
        }
        if (get().hasPlayedOnce) {
          morning.push({
            id: `m3-${day}`,
            headline: `${get().companyName}: ${get().terminalName || "Terminal"} konuşuluyor`,
            body: "Yerel esnaf Nexora bilet dedikodusunda.",
            kind: "player",
            aboutPlayer: true,
            day,
          });
        }
        set({ morningPaper: morning, newspaperSeenDay: day - 1 });
      },

      openNewspaper: () =>
        set({
          newspaperOpen: true,
          paperEdition: "morning",
          newspaper: get().morningPaper,
          newspaperSeenDay: get().gameDay,
        }),

      closeNewspaper: () =>
        set({ newspaperOpen: false, paperEdition: null }),

      openPaperEdition: (ed) =>
        set({
          paperEdition: ed,
          newspaperOpen: true,
          newspaper:
            ed === "morning" ? get().morningPaper : get().eveningPaper,
          newspaperSeenDay: get().gameDay,
        }),

      setOfficeNotes: (t) => set({ officeNotes: t.slice(0, 2000) }),

      mafiaVisit: () => {
        set({ mafiaDebtDue: true });
        get().pushPhone(
          "İsimsiz",
          "Haftalık haraç ₺8.000 — yoksa gece otobüsler üşür."
        );
      },

      payMafia: () => {
        if (get().balance < 8000) return false;
        set((s) => ({
          balance: s.balance - 8000,
          mafiaDebtDue: false,
          mafiaLastPayDay: s.gameDay,
        }));
        get().addLedger("Haftalık koruma", -8000);
        get().pushPhone("İsimsiz", "Akıllı adamsın ağa.");
        return true;
      },

      refuseMafia: () => {
        set({ mafiaDebtDue: false });
        const list = get().buses;
        if (list.length === 0) return;
        const target = list[Math.floor(Math.random() * list.length)];
        const fireNews: NewsItem = {
          id: `fire-${Date.now()}`,
          headline: `KUNDAK: ${get().terminalName || "Firma"} filosunda yangın!`,
          body: "Gece otoparkta alev. Emniyet bilinçli kundak diyor.",
          kind: "crash",
          aboutPlayer: true,
          day: get().gameDay,
        };
        set((s) => ({
          balance: Math.max(0, s.balance - 25000),
          reputation: Math.max(0, s.reputation - 6),
          buses: s.buses.map((b) =>
            b.id === target.id
              ? { ...b, engineHealth: Math.max(15, b.engineHealth - 35) }
              : b
          ),
          eveningPaper: [fireNews, ...s.eveningPaper].slice(0, 8),
        }));
        get().addLedger(`Kundak: ${target.name}`, -25000);
        get().pushPhone("Gece nöbeti", `${target.plate} kundaklandı.`);
      },

      upgradeCrier: () => {
        const lv = get().crierLevel;
        if (lv >= 5) return false;
        const cost = 3000 + lv * 4000;
        if (get().balance < cost) return false;
        set((s) => ({
          balance: s.balance - cost,
          crierLevel: s.crierLevel + 1,
        }));
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
            title: "Maliye / Çalışma Denetmeni",
            body: "Sigorta ve vergi dosyası açıldı.",
            fine: 15000,
            bribe: 2000,
          },
          ağaEnergy: Math.max(0, get().ağaEnergy - 10),
        });
      },

      resolveInspector: (choice) => {
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

      openMeeting: (topic) =>
        set({
          meetingOpen: true,
          meetingTopic: topic || "Genel değerlendirme",
        }),

      closeMeeting: () => set({ meetingOpen: false, meetingTopic: "" }),

      resolveMeeting: (choice) => {
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

      rollRoadEvent: (exp) => {
        const drv = get().drivers.find((d) => d.id === exp.driverId);
        const fatigue = drv?.fatigue ?? 30;
        const skill = drv?.skill ?? 50;
        let pAccident = 0.04 + fatigue / 500 - skill / 800;
        const pEds = 0.03;
        const pPolice = 0.05;
        const pJandarma = exp.smuggle ? 0.12 : 0.02;
        if ((drv?.reliability ?? 50) < 40) pAccident += 0.03;

        const r = Math.random();
        let ev: Omit<RoadEvent, "id"> | null = null;

        if (r < pJandarma && exp.smuggle) {
          ev = {
            type: "jandarma",
            title: "Jandarma!",
            description: "Kaçak yük. Araç bağlanabilir.",
            moneyChange: -12000,
            reputationChange: -8,
            emoji: "🚨",
          };
        } else if (r < pJandarma + pAccident) {
          ev = {
            type: "accident",
            title: "Virajda savrulma",
            description: "Muavin bağırıyor. Hasar ve panik.",
            moneyChange: -7000,
            reputationChange: -4,
            emoji: "💥",
          };
        } else if (r < pJandarma + pAccident + pEds) {
          ev = {
            type: "eds",
            title: "EDS — Bolu",
            description: "Tabela 90, kadran 118.",
            moneyChange: -1450,
            reputationChange: -1,
            emoji: "📸",
          };
        } else if (r < pJandarma + pAccident + pEds + pPolice) {
          ev = {
            type: "police",
            title: "Çevirme",
            description: "Rutin kontrol, sorun yok.",
            moneyChange: 0,
            reputationChange: 0,
            emoji: "🚓",
          };
        }

        if (!ev) return null;

        const event: RoadEvent = { ...ev, id: `evt-${Date.now()}` };
        set((s) => ({
          balance: s.balance + event.moneyChange,
          reputation: Math.max(
            0,
            Math.min(100, s.reputation + event.reputationChange)
          ),
          lastEvent: event,
        }));
        if (event.moneyChange) get().addLedger(event.title, event.moneyChange);

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
          }));
        }
        if (event.type === "accident") {
          get().openMeeting("Kaza — bir daha olmasın");
        }
        return event;
      },

      crierBonus: () => 1 + get().crierLevel * 0.08,

      priceCapMultiplier: () =>
        get().bayramActive ? 2.2 : get().rivalWeak ? 1.15 : 1,
    }),
    { name: "otogar-tycoon-save-v6" }
  )
);