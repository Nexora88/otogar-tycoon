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

export type RoomHandlers = {
  onChat?: (m: ChatMsg) => void;
  onPrice?: (p: PricePulse) => void;
  onPresence?: (count: number) => void;
  onAuction?: (a: AuctionBid) => void;
  onSabotage?: (s: SabotagePing) => void;
};

let channel: RealtimeChannel | null = null;

export function leaveRoomChannel() {
  if (channel) {
    const sb = getSupabase();
    sb?.removeChannel(channel);
    channel = null;
  }
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
  const code = roomCode.toUpperCase();

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
    .on("presence", { event: "sync" }, () => {
      const state = channel?.presenceState() || {};
      const n = Object.keys(state).length;
      handlers.onPresence?.(n);
    });

  const status = await new Promise<string>((resolve) => {
    channel!.subscribe(async (s) => {
      if (s === "SUBSCRIBED") {
        await channel!.track({
          name: playerName,
          at: Date.now(),
        });
        resolve("SUBSCRIBED");
      }
      if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") resolve(s);
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
  await channel.send({
    type: "broadcast",
    event: "chat",
    payload: msg,
  });
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
  await channel.send({
    type: "broadcast",
    event: "price",
    payload: p,
  });
  return true;
}
export type AuctionBid = {
  peron: string;
  bidder: string;
  amount: number;
  at: number;
};

export type SabotagePing = {
  from: string;
  target: string;
  kind: "ariza" | "yakit";
  at: number;
};

export async function sendAuctionBid(
  peron: string,
  bidder: string,
  amount: number
) {
  if (!channel) return false;
  await channel.send({
    type: "broadcast",
    event: "auction",
    payload: { peron, bidder, amount, at: Date.now() } satisfies AuctionBid,
  });
  return true;
}

export async function sendSabotage(
  from: string,
  target: string,
  kind: "ariza" | "yakit"
) {
  if (!channel) return false;
  await channel.send({
    type: "broadcast",
    event: "sabotage",
    payload: { from, target, kind, at: Date.now() } satisfies SabotagePing,
  });
  return true;
}