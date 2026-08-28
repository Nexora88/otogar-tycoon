"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";

export default function ForceRegisterModal() {
  const force = useGameStore((s) => s.forceRegister);
  const isGuest = useGameStore((s) => s.isGuest);
  const limit = useGameStore((s) => s.guestDayLimit);

  if (!force || !isGuest) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4">
      <div className="bg-zinc-900 border border-cyan-800 rounded-2xl max-w-sm w-full p-6 text-center">
        <div className="text-xs text-cyan-400 tracking-widest mb-2">
          MİSAFİR SÜRESİ DOLDU
        </div>
        <h2 className="text-lg font-bold text-white">
          {limit} oyun günü tamamlandı
        </h2>
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
          Daha fazla oynamak ve kaydını saklamak için hesap oluştur. Misafir
          kayıtları tarayıcıda sınırlıdır.
        </p>
        <Link
          href="/register"
          className="mt-6 block w-full py-3 rounded-xl font-bold text-sm text-[#0D0D1A]"
          style={{ background: "linear-gradient(90deg,#00F0FF,#007BFF)" }}
        >
          Hesap oluştur
        </Link>
        <Link
          href="/login"
          className="mt-2 block text-xs text-zinc-500 hover:text-white"
        >
          Zaten hesabım var — Giriş
        </Link>
      </div>
    </div>
  );
}