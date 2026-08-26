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
  | "bakkal"
  | "cayci"
  | "bilet"
  | "mescit"
  | "otopark";

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

  startAsGuest: () => void;
  setCompanyName: (name: string) => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  paintBus: (busId: string, color: BusColor) => void;
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

  takeBankLoan: (amount: number) => void;
  payBankDebt: (amount: number) => boolean;
  payTax: () => boolean;
  accrueTax: (profit: number) => void;

  setTerminalName: (name: string) => void;
  startTerminalConstruction: () => boolean;
  buildSlot: (index: number, type: TerminalSlot) => boolean;
  settleExpeditionProfit: (baseProfit: number) => number;
}

const startingBus: GameBus = {
  id: "bus-1",
  model: "O302",
  seatCount: 46,
  engineHealth: 68,
  color: "blue",
  name: "Emektar",
};

const randomNames = [
  "Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya", "Fatma Çelik", "Mustafa Şahin",
  "Elif Arslan", "Hüseyin Koç", "Zeynep Aydın", "İbrahim Öz", "Merve Yıldız",
];

export function generatePassengers(count: number): Passenger[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p-${Date.now()}-${i}`,
    name: randomNames[Math.floor(Math.random() * randomNames.length)],
    mood: Math.random() > 0.8 ? "angry" : Math.random() > 0.4 ? "normal" : "happy",
  }));
}

const ROAD_EVENTS: Omit<RoadEvent, "id">[] = [
  { type: "eds", title: "EDS Flaş!", description: "Hız limitini aştın. Ceza yedin.", moneyChange: -1850, reputationChange: -1, emoji: "📸" },
  { type: "police", title: "Trafik Çevirmesi", description: "Polis arabaları çeviriyor.", moneyChange: 0, reputationChange: 0, emoji: "🚓" },
  { type: "accident", title: "Küçük Kaza", description: "Hafif temas. Hasar masrafı.", moneyChange: -8500, reputationChange: -3, emoji: "💥" },
  { type: "lawsuit", title: "Dava Tehdidi!", description: "Yolcu avukat tuttu. Tazminat dosyası.", moneyChange: -15000, reputationChange: -5, emoji: "⚖️" },
  { type: "fight", title: "Işıklarda Kavga", description: "İki sürücü tartışıyor.", moneyChange: 0, reputationChange: 1, emoji: "🥊" },
  { type: "funny", title: "Muavin Anonsu", description: "Mikrofon açık unutuldu.", moneyChange: 0, reputationChange: -2, emoji: "🎙️" },
  { type: "weather", title: "Ani Sağanak", description: "Yol kaydı.", moneyChange: 0, reputationChange: 0, emoji: "🌧️" },
];

const CUSTOMERS: Omit<CustomerCase, "id">[] = [
  { name: "Ayşe Teyze", issue: "Valizim kayboldu. İçinde torununun sünnet takımı vardı!", mood: "angry", type: "lost_item" },
  { name: "Murat Bey", issue: "Ceketimi unuttum. Cebinde nüfus cüzdanı vardı.", mood: "polite", type: "lost_item" },
  { name: "Cemal Amca", issue: "Şoför 'eşya bizden sorulmaz' dedi. Peki kimin sorulur?", mood: "ironic", type: "rude" },
  { name: "Elif Hanım", issue: "Çocuğumun tableti kayıp. Eşya nerede?", mood: "polite", type: "lost_item" },
  { name: "Serkan", issue: "3 saat rötar. İş görüşmem uçtu.", mood: "angry", type: "delay" },
  { name: "Avukat Dündar", issue: "Müvekkilim kaza sonrası şikayetçi. Tazminat konuşalım.", mood: "angry", type: "accident_claim" },
];

const emptySlots = (): TerminalSlot[] => Array.from({ length: 6 }).map(() => "empty");

const SLOT_COST: Record<Exclude<TerminalSlot, "empty">, number> = {
  toilet: 18000,
  bakkal: 35000,
  cayci: 22000,
  bilet: 28000,
  mescit: 15000,
  otopark: 40000,
};

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

      startAsGuest: () =>
        set({
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
        }),

      setCompanyName: (name) => set({ companyName: name }),
      addMoney: (amount) => set((s) => ({ balance: s.balance + amount })),
      spendMoney: (amount) => {
        if (get().balance < amount) return false;
        set((s) => ({ balance: s.balance - amount }));
        return true;
      },
      paintBus: (busId, color) =>
        set((s) => ({
          buses: s.buses.map((b) => (b.id === busId ? { ...b, color } : b)),
        })),
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
        const template = pool[Math.floor(Math.random() * pool.length)];
        const event: RoadEvent = { ...template, id: `evt-${Date.now()}` };
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
        set({ balance: balance - 25000, deskRented: true, reputation: Math.min(100, reputation + 3) });
        return true;
      },
      spawnCustomer: () => {
        const c = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        set({ pendingCustomer: { ...c, id: `cust-${Date.now()}` } });
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

      takeBankLoan: (amount) =>
        set((s) => ({
          balance: s.balance + amount,
          bankDebt: s.bankDebt + Math.round(amount * 1.15),
        })),
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
        set({ balance: balance - taxDue, taxDue: 0, reputation: Math.min(100, reputation + 2) });
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
        });
        return true;
      },
      buildSlot: (index, type) => {
        const { terminalBuilt, terminalSlots, balance } = get();
        if (!terminalBuilt || type === "empty") return false;
        if (index < 0 || index >= terminalSlots.length) return false;
        if (terminalSlots[index] !== "empty") return false;
        const cost = SLOT_COST[type];
        if (balance < cost) return false;
        const next = [...terminalSlots];
        next[index] = type;
        set({
          balance: balance - cost,
          terminalSlots: next,
          reputation: Math.min(100, get().reputation + 1),
        });
        return true;
      },

      settleExpeditionProfit: (baseProfit) => {
        const bonus = 1 + get().accountingLevel * 0.05;
        const final = Math.round(baseProfit * bonus);
        get().addMoney(final);
        get().accrueTax(Math.max(0, final));
        return final;
      },
    }),
    { name: "otogar-tycoon-save" }
  )
);