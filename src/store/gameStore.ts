import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BusColor = "blue" | "red" | "green" | "black" | "white" | "orange";
export type Catering = "water" | "snack" | "vip";
export type ExpeditionStatus = "filling" | "departed" | "completed" | "cancelled";
export type OfficeTheme = "classic" | "school" | "modern";

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
}

export interface Passenger {
  id: string;
  name: string;
  mood: "happy" | "normal" | "angry";
}

export interface RoadEvent {
  id: string;
  type: "eds" | "police" | "accident" | "fight" | "weather" | "funny" | "lawsuit";
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
  /** Sürüş kilitli — hep otomatik şoför */
  driveMode?: "driver";
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
  hiredAt: number;
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
  answers: string[];
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

export const SLOT_INFO: Record<
  Exclude<TerminalSlot, "empty">,
  { label: string; cost: number; cps: number; repMod: number; risk: number; desc: string }
> = {
  toilet: { label: "Otogar Tuvaleti", cost: 12000, cps: 0.85, repMod: 0, risk: 0, desc: "Turnike." },
  bufe: { label: "Peron Büfesi", cost: 28000, cps: 2.6, repMod: -1, risk: 6, desc: "Tost & ayran." },
  emanet: { label: "Emanetçi", cost: 45000, cps: 4.4, repMod: 1, risk: 20, desc: "Yüksek kâr." },
  cayci: { label: "Çay Ocağı", cost: 22000, cps: 1.7, repMod: 1, risk: 2, desc: "İnce belli." },
  bilet: { label: "Bilet Gişesi", cost: 32000, cps: 2.1, repMod: 2, risk: 0, desc: "Resmî gişe." },
  mescit: { label: "Mescit", cost: 15000, cps: 0.35, repMod: 4, risk: 0, desc: "İtibar." },
  otopark: { label: "Otopark", cost: 40000, cps: 1.9, repMod: 0, risk: 5, desc: "Park." },
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
  officeMode: "drive" | "office";
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
  /** Sürüş modu kilitli */
  drivingUnlocked: boolean;

  startAsGuest: () => void;
  setCompanyName: (name: string) => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  paintBus: (busId: string, color: BusColor) => void;
  setBusPlate: (busId: string, plate: string) => void;
  buyBus: (listing: BusListing) => boolean;
  addExpedition: (exp: Expedition) => void;
  updateExpedition: (id: string, data: Partial<Expedition>) => void;
  openComplaint: (text: string) => void;
  closeComplaint: () => void;
  triggerRoadEvent: (expId: string) => void;
  clearLastEvent: () => void;
  setHasPlayedOnce: () => void;
  resetGame: () => void;
  setOfficeMode: (mode: "drive" | "office") => void;
  upgradeAccounting: () => boolean;
  upgradeCustomerService: () => boolean;
  rentDesk: () => boolean;
  spawnCustomer: () => void;
  resolveCustomer: (choice: "dismiss" | "help" | "compensate") => void;
  takeBankLoan: (amount: number) => boolean;
  payBankDebt: (amount: number) => boolean;
  payTax: () => boolean;
  accrueTax: (profit: number) => void;
  addLedger: (label: string, amount: number) => void;
  setTerminalName: (name: string) => void;
  startTerminalConstruction: () => boolean;
  buildSlot: (index: number, type: TerminalSlot) => boolean;
  collectPassiveIncome: () => void;
  triggerSecurityRaid: () => void;
  settleExpeditionProfit: (baseProfit: number) => number;
  completeCitySetup: (cityId: string) => boolean;
  hireDriver: (d: Omit<Driver, "id" | "hiredAt" | "fatigue">) => boolean;
  restDriver: (id: string) => void;
  addFatigue: (id: string, amount: number) => void;
  pushPhone: (from: string, body: string, type?: "sms" | "call") => void;
  markPhoneRead: () => void;
  setPhoneOpen: (v: boolean) => void;
  setOfficeTheme: (t: OfficeTheme) => void;
  spawnInterview: (role: "driver" | "muavin") => void;
  finishInterview: (hire: boolean) => void;
  setLastTicket: (t: LastTicket | null) => void;
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
  plate: "34 TYC 01",
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

const ROAD_EVENTS: Omit<RoadEvent, "id">[] = [
  { type: "eds", title: "EDS Flaş!", description: "Hız cezası.", moneyChange: -1850, reputationChange: -1, emoji: "📸" },
  { type: "police", title: "Çevirme", description: "Kontrol.", moneyChange: 0, reputationChange: 0, emoji: "🚓" },
  { type: "accident", title: "Kaza", description: "Hasar.", moneyChange: -9000, reputationChange: -3, emoji: "💥" },
  { type: "lawsuit", title: "Dava", description: "Tazminat.", moneyChange: -15000, reputationChange: -5, emoji: "⚖️" },
  { type: "funny", title: "Anons", description: "Mikrofon açık.", moneyChange: 0, reputationChange: -2, emoji: "🎙️" },
  { type: "weather", title: "Sağanak", description: "Rötar.", moneyChange: 0, reputationChange: 0, emoji: "🌧️" },
];

const CUSTOMERS: Omit<CustomerCase, "id">[] = [
  { name: "Ayşe Teyze", issue: "Valizim kayboldu!", mood: "angry", type: "lost_item" },
  { name: "Murat Bey", issue: "Ceketimi unuttum.", mood: "polite", type: "lost_item" },
  { name: "Serkan", issue: "3 saat rötar.", mood: "angry", type: "delay" },
  { name: "Avukat Dündar", issue: "Tazminat konuşalım.", mood: "angry", type: "accident_claim" },
];

const emptySlots = (): TerminalSlot[] => Array.from({ length: 6 }).map(() => "empty");
const MAX_LOAN = 50000;

const initialSlice = () => ({
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
  officeMode: "office" as const,
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
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialSlice(),

      startAsGuest: () => set({ ...initialSlice(), buses: [{ ...startingBus }] }),

      setCompanyName: (name) => set({ companyName: name }),
      addMoney: (a) => set((s) => ({ balance: s.balance + a })),
      spendMoney: (a) => {
        if (get().balance < a) return false;
        set((s) => ({ balance: s.balance - a }));
        return true;
      },

      paintBus: (id, color) =>
        set((s) => ({
          buses: s.buses.map((b) => (b.id === id ? { ...b, color } : b)),
        })),

      setBusPlate: (busId, plate) =>
        set((s) => ({
          buses: s.buses.map((b) =>
            b.id === busId ? { ...b, plate: plate.toUpperCase().slice(0, 14) } : b
          ),
        })),

      buyBus: (listing) => {
        if (get().balance < listing.price) return false;
        const bus: GameBus = {
          id: `bus-${Date.now()}`,
          model: listing.model,
          name: listing.name,
          seatCount: listing.seatCount,
          engineHealth: listing.engineHealth,
          color: listing.color,
          fuelUse: listing.fuelUse,
          muavinCost: listing.muavinCost,
          plate: `34 ${listing.model.slice(0, 3).toUpperCase()} ${10 + Math.floor(Math.random() * 89)}`,
        };
        set((s) => ({
          balance: s.balance - listing.price,
          buses: [...s.buses, bus],
        }));
        get().addLedger(`Otobüs: ${listing.name}`, -listing.price);
        return true;
      },

      addExpedition: (exp) =>
        set((s) => ({
          expeditions: [{ ...exp, driveMode: "driver" }, ...s.expeditions],
        })),

      updateExpedition: (id, data) =>
        set((s) => ({
          expeditions: s.expeditions.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      openComplaint: (text) =>
        set((s) => ({
          currentComplaint: text,
          showComplaintModal: true,
          complaints: [text, ...s.complaints].slice(0, 12),
          reputation: Math.max(0, s.reputation - 2),
        })),
      closeComplaint: () => set({ showComplaintModal: false, currentComplaint: null }),

      triggerRoadEvent: (expId) => {
        const t = ROAD_EVENTS[Math.floor(Math.random() * ROAD_EVENTS.length)];
        const event: RoadEvent = { ...t, id: `evt-${Date.now()}` };
        set((s) => ({
          balance: s.balance + event.moneyChange,
          reputation: Math.max(0, Math.min(100, s.reputation + event.reputationChange)),
          lastEvent: event,
          expeditions: s.expeditions.map((e) =>
            e.id === expId ? { ...e, currentEvent: event } : e
          ),
        }));
        if (event.moneyChange !== 0) get().addLedger(event.title, event.moneyChange);
      },
      clearLastEvent: () => set({ lastEvent: null }),
      setHasPlayedOnce: () => set({ hasPlayedOnce: true }),
      resetGame: () => get().startAsGuest(),
      setOfficeMode: () => set({ officeMode: "office" }),

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
        set({ balance: balance - cost, customerServiceLevel: customerServiceLevel + 1 });
        return true;
      },
      rentDesk: () => {
        const { balance, deskRented, reputation } = get();
        if (deskRented || balance < 25000) return false;
        set({
          balance: balance - 25000,
          deskRented: true,
          reputation: Math.min(100, reputation + 3),
        });
        return true;
      },

      spawnCustomer: () => {
        const c = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        set({ pendingCustomer: { ...c, id: `c-${Date.now()}` } });
      },
      resolveCustomer: (choice) => {
        const { pendingCustomer, customerServiceLevel, reputation, balance } = get();
        if (!pendingCustomer) return;
        if (choice === "dismiss") {
          set({ pendingCustomer: null, reputation: Math.max(0, reputation - 5) });
        } else if (choice === "help") {
          set({
            pendingCustomer: null,
            reputation: Math.min(100, reputation + 2 + customerServiceLevel),
          });
        } else {
          const pay =
            pendingCustomer.type === "accident_claim"
              ? 12000
              : 800 + customerServiceLevel * 300;
          set({
            pendingCustomer: null,
            balance: balance - pay,
            reputation: Math.min(100, reputation + 6),
          });
          get().addLedger(`Tazminat: ${pendingCustomer.name}`, -pay);
        }
      },

      takeBankLoan: (amount) => {
        const a = Math.min(MAX_LOAN, Math.max(0, Math.floor(amount)));
        if (a < 1000) return false;
        if (get().bankDebt + Math.round(a * 1.12) > MAX_LOAN * 1.2) return false;
        const debt = Math.round(a * 1.12);
        set((s) => ({ balance: s.balance + a, bankDebt: s.bankDebt + debt }));
        get().addLedger(`Kredi (${debt} borç)`, a);
        return true;
      },
      payBankDebt: (amount) => {
        const { balance, bankDebt } = get();
        const pay = Math.min(amount, bankDebt, balance);
        if (pay <= 0) return false;
        set({ balance: balance - pay, bankDebt: bankDebt - pay });
        get().addLedger("Banka ödemesi", -pay);
        return true;
      },

      payTax: () => {
        const { balance, taxDue, reputation } = get();
        if (taxDue <= 0 || balance < taxDue) return false;
        const paid = taxDue;
        set({
          balance: balance - paid,
          taxDue: 0,
          kdvDue: 0,
          incomeTaxDue: 0,
          reputation: Math.min(100, reputation + 3),
        });
        get().addLedger("Vergi ödemesi", -paid);
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
        get().addLedger(`Vergi tahakkuk KDV+GV`, -(kdv + gel));
      },

      addLedger: (label, amount) =>
        set((s) => ({
          ledger: [
            { id: `L-${Date.now()}-${Math.random()}`, label, amount, at: Date.now() },
            ...s.ledger,
          ].slice(0, 40),
        })),

      setTerminalName: (name) => set({ terminalName: name }),
      startTerminalConstruction: () => {
        const { balance, terminalBuilt } = get();
        if (terminalBuilt || balance < 100000) return false;
        set({
          balance: balance - 100000,
          terminalBuilt: true,
          terminalName: get().terminalName || "Yeni Terminal",
          reputation: Math.min(100, get().reputation + 8),
          lastPassiveTick: Date.now(),
        });
        get().addLedger("Terminal inşaatı", -100000);
        return true;
      },
      buildSlot: (index, type) => {
        const { terminalBuilt, terminalSlots, balance, reputation } = get();
        if (!terminalBuilt || type === "empty") return false;
        if (terminalSlots[index] !== "empty") return false;
        const info = SLOT_INFO[type];
        if (balance < info.cost) return false;
        const next = [...terminalSlots];
        next[index] = type;
        set({
          balance: balance - info.cost,
          terminalSlots: next,
          reputation: Math.min(100, Math.max(0, reputation + info.repMod)),
          securityRisk: Math.min(
            100,
            next.reduce((a, s) => a + (s === "empty" ? 0 : SLOT_INFO[s].risk), 0)
          ),
        });
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
        terminalSlots.forEach((s) => {
          if (s !== "empty") cps += SLOT_INFO[s].cps;
        });
        const gain = Math.round(cps * sec * 10) / 10;
        if (gain > 0) set((st) => ({ balance: st.balance + gain, lastPassiveTick: now }));
        else set({ lastPassiveTick: now });
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
      },

      settleExpeditionProfit: (baseProfit) => {
        const bonus = 1 + get().accountingLevel * 0.05;
        const final = Math.round(baseProfit * bonus);
        get().addMoney(final);
        get().addLedger(`Sefer geliri x${bonus.toFixed(2)}`, final);
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
        }));
        get().addLedger(`${city.name} arsa+ruhsat`, -total);
        get().pushPhone(
          `${city.name} Belediyesi`,
          "Ruhsat onaylandı. Arsa tahsisi tamam. Hayırlı olsun."
        );
        return true;
      },

      hireDriver: (d) => {
        if (get().balance < d.wage) return false;
        const driver: Driver = {
          ...d,
          id: `drv-${Date.now()}`,
          hiredAt: Date.now(),
          fatigue: 0,
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

      addFatigue: (id, amount) =>
        set((s) => ({
          drivers: s.drivers.map((d) =>
            d.id === id ? { ...d, fatigue: Math.min(100, d.fatigue + amount) } : d
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
          ].slice(0, 30),
        })),

      markPhoneRead: () =>
        set((s) => ({
          phoneMessages: s.phoneMessages.map((m) => ({ ...m, read: true })),
        })),

      setPhoneOpen: (v) => set({ phoneOpen: v }),
      setOfficeTheme: (t) => set({ officeTheme: t }),

      spawnInterview: (role) => {
        const names = [
          "Hasan Kaptan", "Mehmet Usta", "Ali Yolcu",
          "Kemal Direksiyon", "Osman Gece", "Veli Şüpheli",
        ];
        const suspicious = Math.random() > 0.65;
        const skill = suspicious
          ? 20 + Math.floor(Math.random() * 25)
          : 55 + Math.floor(Math.random() * 40);
        const wage = role === "driver" ? 800 + skill * 8 : 500 + skill * 5;
        const good = [
          "10 yıldır şehirler arası sürdüm.",
          "Takografı eksiksiz tutarım.",
          "Gece seferi sorun değil.",
          "Muavinlik de yaptım.",
          "Ehliyet ve SRC tamam.",
        ];
        const bad = [
          "Ehliyet... evde kaldı herhalde.",
          "Birkaç kaza oldu ama ufak.",
          "Maaş peşin olsun.",
          "Takograf nedir ki?",
          "Sabah uyuyamam gece uyurum.",
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
            answers: [...pool].sort(() => Math.random() - 0.5).slice(0, 5),
          },
        });
      },

      finishInterview: (hire) => {
        const c = get().pendingInterview;
        if (!c) return;
        if (hire) {
          const ok = get().hireDriver({
            name: c.name,
            role: c.role,
            skill: c.skill,
            wage: c.wage,
            suspicious: c.suspicious,
          });
          if (!ok) get().pushPhone("İK", "Kasa yetersiz.");
          else if (c.suspicious)
            get().pushPhone("İhbar", `${c.name} şüpheli referans.`);
          else get().pushPhone("İK", `${c.name} kadroya alındı.`);
        }
        set({ pendingInterview: null });
      },

      setLastTicket: (t) => set({ lastTicket: t }),
    }),
    { name: "otogar-tycoon-save-v4" }
  )
);