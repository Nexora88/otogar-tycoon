import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type ChatMsg = {
  id: string;
  from: string;
  text: string;
  at: number;
};

export type PricePulse = {
  company: string;
  route: string;
  price: number;
  at: number;
};

export type AuctionBid = {
  peron: string;
  bidder: string;
  amount: number;
  at: number;
};

export type SabotagePing = {
  from: string;
  target: string;
  kind: "ariza" | "yakit" | "crier";
  at: number;
};

export type LeaderPing = {
  name: string;
  company: string;
  score: number;
  rep: number;
  title: string;
  at: number;
};

export type PeronLot = {
  id: string;
  from: string;
  to: string;
  capacity: number;
  minBid: number;
  highBid: number;
  highBidder: string | null;
  endsAt: number;
};

export type RoomHandlers = {
  onChat?: (m: ChatMsg) => void;
  onPrice?: (p: PricePulse) => void;
  onPresence?: (count: number) => void;
  onAuction?: (a: AuctionBid) => void;
  onSabotage?: (s: SabotagePing) => void;
  onLeader?: (l: LeaderPing) => void;
  onLot?: (lot: PeronLot) => void;
};

let channel: RealtimeChannel | null = null;

export function leaveRoomChannel() {
  if (channel) {
    const sb = getSupabase();
    sb?.removeChannel(channel);
    channel = null;
  }
}

export function getActiveRoomChannel() {
  return channel;
}

export async function joinRoomChannel(
  roomCode: string,
  playerName: string,
  handlers: RoomHandlers
): Promise<{ ok: boolean; reason?: string }> {
  leaveRoomChannel();

  if (!isSupabaseConfigured()) {
    return { ok: false, reason: "supabase_off" };
  }

  const sb = getSupabase()!;
  const code = roomCode.trim().toUpperCase();
  if (code.length < 4) return { ok: false, reason: "bad_code" };

  channel = sb.channel(`otogar-room:${code}`, {
    config: { presence: { key: playerName || "esnaf" } },
  });

  channel
    .on("broadcast", { event: "chat" }, ({ payload }) => {
      handlers.onChat?.(payload as ChatMsg);
    })
    .on("broadcast", { event: "price" }, ({ payload }) => {
      handlers.onPrice?.(payload as PricePulse);
    })
    .on("broadcast", { event: "auction" }, ({ payload }) => {
      handlers.onAuction?.(payload as AuctionBid);
    })
    .on("broadcast", { event: "sabotage" }, ({ payload }) => {
      handlers.onSabotage?.(payload as SabotagePing);
    })
    .on("broadcast", { event: "leader" }, ({ payload }) => {
      handlers.onLeader?.(payload as LeaderPing);
    })
    .on("broadcast", { event: "lot" }, ({ payload }) => {
      handlers.onLot?.(payload as PeronLot);
    })
    .on("presence", { event: "sync" }, () => {
      const state = channel?.presenceState() || {};
      handlers.onPresence?.(Object.keys(state).length);
    });

  const status = await new Promise<string>((resolve) => {
    const t = setTimeout(() => resolve("TIMED_OUT"), 12000);
    channel!.subscribe(async (s) => {
      if (s === "SUBSCRIBED") {
        clearTimeout(t);
        try {
          await channel!.track({
            name: playerName,
            at: Date.now(),
          });
        } catch {
          /* */
        }
        resolve("SUBSCRIBED");
      }
      if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") {
        clearTimeout(t);
        resolve(s);
      }
    });
  });

  if (status !== "SUBSCRIBED") {
    leaveRoomChannel();
    return { ok: false, reason: status };
  }

  return { ok: true };
}

export async function sendChat(from: string, text: string) {
  if (!channel) return false;
  const msg: ChatMsg = {
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    from,
    text: text.slice(0, 200),
    at: Date.now(),
  };
  await channel.send({ type: "broadcast", event: "chat", payload: msg });
  return true;
}

export async function sendPrice(
  company: string,
  route: string,
  price: number
) {
  if (!channel) return false;
  const p: PricePulse = {
    company,
    route,
    price,
    at: Date.now(),
  };
  await channel.send({ type: "broadcast", event: "price", payload: p });
  return true;
}

export async function sendAuctionBid(
  peron: string,
  bidder: string,
  amount: number
) {
  if (!channel) return false;
  const payload: AuctionBid = {
    peron,
    bidder,
    amount,
    at: Date.now(),
  };
  await channel.send({ type: "broadcast", event: "auction", payload });
  return true;
}

export async function sendSabotage(
  from: string,
  target: string,
  kind: "ariza" | "yakit" | "crier"
) {
  if (!channel) return false;
  const payload: SabotagePing = {
    from,
    target,
    kind,
    at: Date.now(),
  };
  await channel.send({ type: "broadcast", event: "sabotage", payload });
  return true;
}

export async function sendLeader(payload: LeaderPing) {
  if (!channel) return false;
  await channel.send({ type: "broadcast", event: "leader", payload });
  return true;
}

export async function sendLot(lot: PeronLot) {
  if (!channel) return false;
  await channel.send({ type: "broadcast", event: "lot", payload: lot });
  return true;
    }
