"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useGameStore } from "@/store/gameStore";

export default function LoginPage() {
  const router = useRouter();
  const setCompanyName = useGameStore((s) => s.setCompanyName);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!isSupabaseConfigured()) {
      setErr("Supabase yapılandırılmadı. Misafir oyna veya .env.local ekle.");
      return;
    }
    setLoading(true);
    const sb = getSupabase()!;
    const { data, error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    const name =
      (data.user?.user_metadata?.display_name as string) ||
      data.user?.email?.split("@")[0] ||
      "Şirket";
    setCompanyName(name);
    router.push("/play");
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-zinc-800 rounded-2xl p-6 bg-zinc-950"
      >
        <h1 className="text-xl font-bold text-white mb-6">Giriş</h1>
        <input
          type="email"
          placeholder="E-posta"
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {err && <p className="text-xs text-red-400 mb-3">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-[#0D0D1A]"
          style={{ background: "linear-gradient(90deg,#00F0FF,#007BFF)" }}
        >
          {loading ? "…" : "Giriş yap"}
        </button>
        <p className="text-[11px] text-zinc-600 mt-4 text-center">
          <Link href="/auth/register" className="text-cyan-500">
            Hesap oluştur
          </Link>
          {" · "}
          <Link href="/play" className="text-zinc-500">
            Misafir
          </Link>
        </p>
      </form>
    </div>
  );
}