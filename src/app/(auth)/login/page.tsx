"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useGameStore } from "@/store/gameStore";

export default function LoginPage() {
  const router = useRouter();
  const setCompanyName = useGameStore((s) => s.setCompanyName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setErr("Supabase yapılandırılmamış. Misafir veya kayıt dene.");
        setLoading(false);
        return;
      }

      const sb = getSupabase()!;
      const { data, error } = await sb.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }

      const meta = data.user?.user_metadata || {};
      const name =
        (meta.display_name as string) ||
        data.user?.email?.split("@")[0] ||
        "Kaptan";
      const firm = (meta.company_name as string) || name;

      setPlayerName(name);
      setCompanyName(firm);
      useGameStore.setState({ isGuest: false, forceRegister: false });
      setLoading(false);
      router.push("/play");
    } catch {
      setErr("Bağlantı hatası.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 flex items-center justify-center px-4 antialiased">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#0f0d0b] to-[#070605]" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_20%,#f59e0b33,transparent_50%)]" />
      </div>

      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl border border-amber-900/40 bg-zinc-950/90 backdrop-blur p-6 shadow-2xl shadow-orange-950/20"
      >
        <div className="text-[10px] tracking-[0.35em] text-amber-600 font-bold">
          NEXORA
        </div>
        <h1 className="mt-1 text-2xl font-black">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
            Giriş
          </span>
        </h1>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Hesabınla devam · misafir limiti kalkar
        </p>

        <label className="block text-[11px] text-stone-500 mb-1">E-posta</label>
        <input
          type="email"
          className="w-full mb-3 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-stone-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-600/60"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="block text-[11px] text-stone-500 mb-1">Şifre</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-stone-100 focus:outline-none focus:border-amber-600/60"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {err && (
          <p className="text-xs text-red-400 mb-3 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-300 via-orange-400 to-orange-500 disabled:opacity-50 hover:brightness-105 transition"
        >
          {loading ? "…" : "Giriş yap"}
        </button>

        <p className="text-[11px] text-stone-600 mt-5 text-center space-x-2">
          <Link href="/register" className="text-cyan-400 hover:underline">
            Hesap oluştur
          </Link>
          <span>·</span>
          <Link href="/play" className="text-stone-500 hover:text-stone-400">
            Misafir
          </Link>
          <span>·</span>
          <Link href="/" className="text-stone-500 hover:text-stone-400">
            Açılış
          </Link>
        </p>
      </form>
    </div>
  );
}