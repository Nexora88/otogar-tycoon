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
  type: "eds" | "police" | "accident" | "fight" | "weather" | "funny";
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

  startAsGuest: () => void;
  setCompanyName: (name: string) => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  paintBus: (busId: string, color: BusColor) => void;
  addExpedition: (exp: Expedition) => void;
  updateExpedition: (id: string, data: Partial<Expedition>) => void;
  addComplaint: (text: string) => void;
  openComplaint: (text: string) => void;
  closeComplaint: () => void;
  triggerRoadEvent: (expId: string) => void;
  clearLastEvent: () => void;
  setHasPlayedOnce: () => void;
  resetGame: () => void;
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
  "Caner Ak", "Selin Kurt", "Burak Özkan", "Deniz Acar", "Emre Doğan",
];

export function generatePassengers(count: number): Passenger[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p-${Date.now()}-${i}`,
    name: randomNames[Math.floor(Math.random() * randomNames.length)],
    mood: Math.random() > 0.8 ? "angry" : Math.random() > 0.4 ? "normal" : "happy",
  }));
}

const ROAD_EVENTS: Omit<RoadEvent, "id">[] = [
  {
    type: "eds",
    title: "EDS Flaş!",
    description: "Hız limitini biraz aştın. EDS seni net gördü. Ceza yedin.",
    moneyChange: -1850,
    reputationChange: -1,
    emoji: "📸",
  },
  {
    type: "police",
    title: "Trafik Polisi Çevirmesi",
    description: "Polisler yol kenarında arabaları çeviriyor. Otobüse dokunmadılar.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "🚓",
  },
  {
    type: "accident",
    title: "Yolda Kaza",
    description: "İki araç birbirine girmiş. Biraz yavaşladın ama geçtin.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "💥",
  },
  {
    type: "fight",
    title: "Işıklarda Sopalı Kavga",
    description: "Trafik ışığında iki sürücü sopalarla birbirine girmiş. Yolcular izliyor.",
    moneyChange: 0,
    reputationChange: 1,
    emoji: "🥊",
  },
  {
    type: "weather",
    title: "Ani Kar Yağışı",
    description: "Birden kar yağmaya başladı. Yolcular 'iyi ki otobüsteyiz' diyor.",
    moneyChange: 0,
    reputationChange: 0,
    emoji: "❄️",
  },
  {
    type: "funny",
    title: "Muavin Anonsu",
    description: "Muavin mikrofonu açık unuttu: 'Abi şu son koltuktakiler yine ayak kokutuyor'.",
    moneyChange: 0,
    reputationChange: -2,
    emoji: "🎙️",
  },
  {
    type: "funny",
    title: "Yolcu İsyanı",
    description: "Arkadaki yolcular: 'Klima çok acıyor!' 'Klima yok ki zaten!'",
    moneyChange: 0,
    reputationChange: -1,
    emoji: "😤",
  },
  {
    type: "eds",
    title: "EDS Yine Yakaladı",
    description: "Bu sefer biraz fazla gazladın. Flaş + ceza.",
    moneyChange: -2400,
    reputationChange: -2,
    emoji: "🚨",
  },
];

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

      startAsGuest: () => {
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
        });
      },

      setCompanyName: (name) => set({ companyName: name }),

      addMoney: (amount) =>
        set((state) => ({ balance: state.balance + amount })),

      spendMoney: (amount) => {
        const { balance } = get();
        if (balance >= amount) {
          set({ balance: balance - amount });
          return true;
        }
        return false;
      },

      paintBus: (busId, color) =>
        set((state) => ({
          buses: state.buses.map((bus) =>
            bus.id === busId ? { ...bus, color } : bus
          ),
        })),

      addExpedition: (exp) =>
        set((state) => ({
          expeditions: [exp, ...state.expeditions],
        })),

      updateExpedition: (id, data) =>
        set((state) => ({
          expeditions: state.expeditions.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),

      addComplaint: (text) =>
        set((state) => ({
          complaints: [text, ...state.complaints].slice(0, 12),
          reputation: Math.max(0, state.reputation - 2),
        })),

      openComplaint: (text) =>
        set({
          currentComplaint: text,
          showComplaintModal: true,
          complaints: [text, ...get().complaints].slice(0, 12),
          reputation: Math.max(0, get().reputation - 2),
        }),

      closeComplaint: () =>
        set({
          showComplaintModal: false,
          currentComplaint: null,
        }),

      triggerRoadEvent: (expId) => {
        const eventTemplate = ROAD_EVENTS[Math.floor(Math.random() * ROAD_EVENTS.length)];
        const event: RoadEvent = {
          ...eventTemplate,
          id: `evt-${Date.now()}`,
        };

        set((state) => {
          const newBalance = state.balance + event.moneyChange;
          const newRep = Math.max(0, Math.min(100, state.reputation + event.reputationChange));

          return {
            balance: newBalance,
            reputation: newRep,
            lastEvent: event,
            expeditions: state.expeditions.map((e) =>
              e.id === expId ? { ...e, currentEvent: event } : e
            ),
          };
        });
      },

      clearLastEvent: () => set({ lastEvent: null }),

      setHasPlayedOnce: () => set({ hasPlayedOnce: true }),

      resetGame: () =>
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
        }),
    }),
    {
      name: "otogar-tycoon-save",
    }
  )
);