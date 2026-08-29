"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useGameStore } from "@/store/gameStore";

const FORBIDDEN =
  /\b(amk|aq|orospu|piç|sik|yarrak|ibne|gerici|solcu|sağcı)\b/i;

export default function RegisterPage() {
  const router = useRouter();
  const setCompanyName = useGameStore((s) => s.setCompanyName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setInfo("");

    const name = displayName.trim();
    if (name.length < 3) {
      setErr("Görünen ad en az 3 karakter.");
      return;
    }
    if (FORBIDDEN.test(name)) {
      setErr("Bu ad kurallara uygun değil.");
      return;
    }
    if (password.length < 6) {
      setErr("Şifre en az 6 karakter.");
      return;
    }
    if (!email.includes("@")) {
      setErr("Geçerli bir e-posta gir.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const sb = getSupabase()!;
        const { data, error } = await sb.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name },
          },
        });
        if (error) {
          setErr(error.message);
          setLoading(false);
          return;
        }
        if (data.user && !data.session) {
          setInfo(
            "E-posta onayı açık olabilir. Gelen kutunu kontrol et veya giriş dene."
          );
        }
      }

      setCompanyName(name);
      setPlayerName(name);
      setLoading(false);
      router.push("/play");
    } catch {
      setErr("Kayıt sırasında hata. Yerel kayıtla devam ediliyor.");
      setCompanyName(name);
      setPlayerName(name);
      setLoading(false);
      router.push("/play");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-zinc-800 rounded-2xl p-6 bg-zinc-950"
      >
        <h1 className="text-xl font-bold text-white mb-1">Hesap oluştur</h1>
        <p className="text-xs text-zinc-500 mb-6">
          {isSupabaseConfigured()
            ? "Supabase ile kayıt"
            : "Supabase yok — yerel kayıt (misafir limiti kalkar)"}
        </p>

        <label className="block text-xs text-zinc-500 mb-1">
          Görünen ad / şirket
        </label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Örn: Keşan Yıldız Tur"
          required
        />

        <label className="block text-xs text-zinc-500 mb-1">E-posta</label>
        <input
          type="email"
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-xs text-zinc-500 mb-1">Şifre</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {err && <p className="text-xs text-red-400 mb-3">{err}</p>}
        {info && <p className="text-xs text-amber-400 mb-3">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-[#0D0D1A] disabled:opacity-50"
          style={{ background: "linear-gradient(90deg,#00F0FF,#007BFF)" }}
        >
          {loading ? "Kaydediliyor…" : "Kayıt ol"}
        </button>

        <p className="text-[11px] text-zinc-600 mt-4 text-center">
          <Link href="/legal" className="underline">
            Yasal metin
          </Link>
          {" · "}
          <Link href="/login" className="text-cyan-500">
            Giriş
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
