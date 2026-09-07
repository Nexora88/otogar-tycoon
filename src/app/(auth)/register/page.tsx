"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useGameStore } from "@/store/gameStore";

const FORBIDDEN =
  /\b(amk|aq|orospu|piç|sik|yarrak|ibne)\b/i;

export default function RegisterPage() {
  const router = useRouter();
  const setCompanyName = useGameStore((s) => s.setCompanyName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const finishLocal = (name: string, firm: string) => {
    setPlayerName(name);
    setCompanyName(firm || name);
    useGameStore.setState({
      isGuest: false,
      forceRegister: false,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setInfo("");

    const name = displayName.trim();
    const firm = company.trim() || name;
    if (name.length < 2) {
      setErr("Ad en az 2 karakter.");
      return;
    }
    if (FORBIDDEN.test(name) || FORBIDDEN.test(firm)) {
      setErr("Bu ad / şirket kurallara uygun değil.");
      return;
    }
    if (password.length < 6) {
      setErr("Şifre en az 6 karakter.");
      return;
    }
    if (!email.includes("@")) {
      setErr("Geçerli e-posta gir.");
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
            data: {
              display_name: name,
              company_name: firm,
            },
          },
        });
        if (error) {
          setErr(error.message);
          setLoading(false);
          return;
        }
        if (data.user && !data.session) {
          setInfo(
            "E-posta onayı gerekebilir. Gelen kutunu kontrol et; sonra giriş yap."
          );
          setLoading(false);
          finishLocal(name, firm);
          return;
        }
      }

      finishLocal(name, firm);
      setLoading(false);
      router.push("/play");
    } catch {
      finishLocal(name, firm);
      setLoading(false);
      router.push("/play");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-zinc-800 rounded-2xl p-6 bg-zinc-950"
      >
        <h1 className="text-xl font-bold text-white mb-1">Hesap oluştur</h1>
        <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
          {isSupabaseConfigured()
            ? "Supabase ile kayıt. Misafir 5 gün limiti kalkar."
            : "Supabase yok — yerel hesap (cihazda kalır)."}
        </p>

        <label className="block text-xs text-zinc-500 mb-1">Adın</label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Ahmet"
          required
        />

        <label className="block text-xs text-zinc-500 mb-1">
          Şirket adı (opsiyonel)
        </label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Keşan Yıldız Tur"
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
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor…" : "Kayıt ol ve oyna"}
        </button>

        <p className="text-[11px] text-zinc-600 mt-4 text-center leading-relaxed">
          <Link href="/legal" className="underline">
            Yasal
          </Link>
          {" · "}
          <Link href="/login" className="text-cyan-500">
            Giriş
          </Link>
          {" · "}
          <Link href="/play?guest=1" className="text-zinc-500">
            Misafir (5 gün)
          </Link>
        </p>
      </form>
    </div>
  );
      }
