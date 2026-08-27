import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BusColor = "blue" | "red" | "green" | "black" | "white" | "orange";
export type Catering = "water" | "snack" | "vip";
export type ExpeditionStatus = "filling" | "departed" | "completed" | "cancelled";

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
  driveMode?: "self" | "driver";
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

export const SLOT_INFO: Record<
  Exclude<TerminalSlot, "empty">,
  { label: string; cost: number; cps: number; repMod: number; risk: number; desc: string }
> = {
  toilet: {
    label: "Otogar Tuvaleti",
    cost: 12000,
    cps: 0.85,
    repMod: 0,
    risk: 0,
    desc: "Bozuk paran yoksa turnikeden geçemezsin.",
  },
  bufe: {
    label: "Peron Büfesi",
    cost: 28000,
    cps: 2.6,
    repMod: -1,
    risk: 6,
    desc: "Bayat tost & sıcak ayran.",
  },
  emanet: {
    label: "Emanetçi",
    cost: 45000,
    cps: 4.4,
    repMod: 1,
    risk: 20,
    desc: "Yüksek kâr, zabıta riski.",
  },
  cayci: {
    label: "Çay Ocağı",
    cost: 22000,
    cps: 1.7,
    repMod: 1,
    risk: 2,
    desc: "İnce belli bardak.",
  },
  bilet: {
    label: "Bilet Gişesi",
    cost: 32000,
    cps: 2.1,
    repMod: 2,
    risk: 0,
    desc: "Resmî gişe.",
  },
  mescit: {
    label: "Mescit",
    cost: 15000,
    cps: 0.35,
    repMod: 4,
    risk: 0,
    desc: "Huzur + itibar.",
  },
  otopark: {
    label: "Otopark",
    cost: 40000,
    cps: 1.9,
    repMod: 0,
    risk: 5,
    desc: "Araç parkı.",
  },
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
  terminalName: string;
  terminalSlots: TerminalSlot[];
  terminalBuilt: boolean;
  gameYear: number;
  lastPassiveTick: number;
  securityRisk: number;

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
  setTerminalName: (name: string) => void;
  startTerminalConstruction: () => boolean;
  buildSlot: (index: number, type: TerminalSlot) => boolean;
  collectPassiveIncome: () => void;
  triggerSecurityRaid: () => void;
  settleExpeditionProfit: (baseProfit: number) => number;
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
  { type: "fight", title: "Kavga", description: "Yol kenarı.", moneyChange: 0, reputationChange: 1, emoji: "🥊" },
  { type: "funny", title: "Anons", description: "Mikrofon açık.", moneyChange: 0, reputationChange: -2, emoji: "🎙️" },
  { type: "weather", title: "Sağanak", description: "Tempo düştü.", moneyChange: 0, reputationChange: 0, emoji: "🌧️" },
];

const CUSTOMERS: Omit<CustomerCase, "id">[] = [
  { name: "Ayşe Teyze", issue: "Valizim kayboldu!", mood: "angry", type: "lost_item" },
  { name: "Murat Bey", issue: "Ceketimi unuttum.", mood: "polite", type: "lost_item" },
  { name: "Cemal Amca", issue: "Eşya bizden sorulmaz mı?", mood: "ironic", type: "rude" },
  { name: "Serkan", issue: "3 saat rötar.", mood: "angry", type: "delay" },
  { name: "Avukat Dündar", issue: "Tazminat konuşalım.", mood: "angry", type: "accident_claim" },
];

const emptySlots = (): TerminalSlot[] => Array.from({ length: 6 }).map(() => "empty");

const MAX_LOAN = 50000;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      isGuest: true,
      companyName: "Misafir Şirket",
      balance: 75000,
      reputation: 45,
      buses: [startingBus],
      expeditions: [],
      hasPlayedOnce: false,
      complaints: [],
      lastEvent: null,
      showComplaintModal: false,
      currentComplaint: null,
      officeMode: "drive",
      accountingLevel: 1,
      customerServiceLevel: 1,
      deskRented: false,
      pendingCustomer: null,
      bankDebt: 0,
      taxDue: 0,
      terminalName: "",
      terminalSlots: emptySlots(),
      terminalBuilt: false,
      gameYear: 1987,
      lastPassiveTick: Date.now(),
      securityRisk: 0,

      startAsGuest: () =>
        set({
          isGuest: true,
          companyName: "Misafir Şirket",
          balance: 75000,
          reputation: 45,
          buses: [{ ...startingBus }],
          expeditions: [],
          hasPlayedOnce: false,
          complaints: [],
          lastEvent: null,
          showComplaintModal: false,
          currentComplaint: null,
          officeMode: "drive",
          accountingLevel: 1,
          customerServiceLevel: 1,
          deskRented: false,
          pendingCustomer: null,
          bankDebt: 0,
          taxDue: 0,
          terminalName: "",
          terminalSlots: emptySlots(),
          terminalBuilt: false,
          gameYear: 1987,
          lastPassiveTick: Date.now(),
          securityRisk: 0,
        }),

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
        return true;
      },

      addExpedition: (exp) => set((s) => ({ expeditions: [exp, ...s.expeditions] })),
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
        const pool =
          Math.random() > 0.86
            ? ROAD_EVENTS.filter((e) => e.type === "accident" || e.type === "lawsuit")
            : ROAD_EVENTS;
        const t = pool[Math.floor(Math.random() * pool.length)];
        const event: RoadEvent = { ...t, id: `evt-${Date.now()}` };
        set((s) => ({
          balance: s.balance + event.moneyChange,
          reputation: Math.max(0, Math.min(100, s.reputation + event.reputationChange)),
          lastEvent: event,
          taxDue: event.type === "lawsuit" ? s.taxDue + 2000 : s.taxDue,
          expeditions: s.expeditions.map((e) =>
            e.id === expId ? { ...e, currentEvent: event } : e
          ),
        }));
      },
      clearLastEvent: () => set({ lastEvent: null }),
      setHasPlayedOnce: () => set({ hasPlayedOnce: true }),
      resetGame: () => get().startAsGuest(),
      setOfficeMode: (mode) => set({ officeMode: mode }),

      upgradeAccounting: () => {
        const { balance, accountingLevel } = get();
        const cost = 15000 * accountingLevel;
        if (balance < cost || accountingLevel >= 5) return false;
        set({ balance: balance - cost, accountingLevel: accountingLevel + 1 });
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
        }
      },

      takeBankLoan: (amount) => {
        const a = Math.min(MAX_LOAN, Math.max(0, Math.floor(amount)));
        if (a < 1000) return false;
        if (get().bankDebt + a > MAX_LOAN * 1.15) return false;
        set((s) => ({
          balance: s.balance + a,
          bankDebt: s.bankDebt + Math.round(a * 1.12),
        }));
        return true;
      },
      payBankDebt: (amount) => {
        const { balance, bankDebt } = get();
        const pay = Math.min(amount, bankDebt, balance);
        if (pay <= 0) return false;
        set({ balance: balance - pay, bankDebt: bankDebt - pay });
        return true;
      },
      payTax: () => {
        const { balance, taxDue, reputation } = get();
        if (taxDue <= 0 || balance < taxDue) return false;
        set({
          balance: balance - taxDue,
          taxDue: 0,
          reputation: Math.min(100, reputation + 2),
        });
        return true;
      },
      accrueTax: (profit) => {
        if (profit <= 0) return;
        set((s) => ({ taxDue: s.taxDue + Math.round(profit * 0.08) }));
      },

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
        set((st) => ({ balance: st.balance + gain, lastPassiveTick: now }));
      },

      triggerSecurityRaid: () => {
        const { securityRisk, balance, reputation } = get();
        if (securityRisk < 22 || Math.random() > securityRisk / 130) return;
        const fine = 2500 + Math.floor(securityRisk * 90);
        set({
          balance: balance - fine,
          reputation: Math.max(0, reputation - 3),
          lastEvent: {
            id: `raid-${Date.now()}`,
            type: "police",
            title: "Zabıta Baskını",
            description: "Emanet / büfe denetimi.",
            moneyChange: -fine,
            reputationChange: -3,
            emoji: "🚨",
          },
        });
      },

      settleExpeditionProfit: (baseProfit) => {
        const bonus = 1 + get().accountingLevel * 0.05;
        const final = Math.round(baseProfit * bonus);
        get().addMoney(final);
        get().accrueTax(Math.max(0, final));
        return final;
      },
    }),
    { name: "otogar-tycoon-save-v2" }
  )
);