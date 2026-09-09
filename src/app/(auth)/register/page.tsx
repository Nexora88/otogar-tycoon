"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useGameStore } from "@/store/gameStore";

export default function RegisterPage() {
  const router = useRouter();
  const setCompanyName = useGameStore((s) => s.setCompanyName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");
    setLoading(true);

    const name = displayName.trim().slice(0, 30) || "Kaptan";
    const firm = company.trim().slice(0, 40) || `${name} Turizm`;

    try {
      if (!isSupabaseConfigured()) {
        setPlayerName(name);
        setCompanyName(firm);
        useGameStore.setState({ isGuest: false, forceRegister: false });
        setOkMsg("Supabase yok — yerel profil kaydedildi.");
        setLoading(false);
        router.push("/play");
        return;
      }

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

      setPlayerName(name);
      setCompanyName(firm);
      useGameStore.setState({ isGuest: false, forceRegister: false });

      if (data.session) {
        router.push("/play");
      } else {
        setOkMsg("Kayıt alındı. E-posta onayı gerekebilir; ardından giriş yap.");
      }
      setLoading(false);
    } catch {
      setErr("Bağlantı hatası.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 flex items-center justify-center px-4 antialiased">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#0f0d0b] to-[#070605]" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_70%_10%,#22d3ee22,transparent_45%)]" />
      </div>

      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl border border-amber-900/40 bg-zinc-950/90 p-6 shadow-2xl"
      >
        <div className="text-[10px] tracking-[0.35em] text-amber-600 font-bold">
          NEXORA
        </div>
        <h1 className="mt-1 text-2xl font-black">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
            Hesap oluştur
          </span>
        </h1>
        <p className="text-xs text-stone-500 mt-1 mb-5">
          Firma adın peronlarda görünsün · 16+ önerilir
        </p>

        <Field label="Görünen ad">
          <input
            className="field"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Örn. Ahmet"
            maxLength={30}
          />
        </Field>
        <Field label="Firma / turizm adı">
          <input
            className="field"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Örn. Keşan Tur"
            maxLength={40}
          />
        </Field>
        <Field label="E-posta">
          <input
            type="email"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </Field>
        <Field label="Şifre (en az 6)">
          <input
            type="password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </Field>

        {err && (
          <p className="text-xs text-red-400 mb-3 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
            {err}
          </p>
        )}
        {okMsg && (
          <p className="text-xs text-emerald-400/90 mb-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg px-3 py-2">
            {okMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-300 via-orange-400 to-orange-500 disabled:opacity-50"
        >
          {loading ? "…" : "Kayıt ol"}
        </button>

        <p className="text-[11px] text-stone-600 mt-4 text-center leading-relaxed">
          Kayıt ile{" "}
          <Link href="/legal" className="text-amber-500/90 hover:underline">
            yasal metinleri
          </Link>{" "}
          kabul etmiş sayılırsın. Gerçek para yok.
        </p>
        <p className="text-[11px] text-zinc-600 mt-2 text-center">
          <Link href="/login" className="text-cyan-400 hover:underline">
            Giriş
          </Link>
          {" · "}
          <Link href="/play" className="hover:text-zinc-400">
            Misafir
          </Link>
          {" · "}
          <Link href="/" className="hover:text-zinc-400">
            Açılış
          </Link>
        </p>
      </form>

      <style jsx>{`
        :global(.field) {
          width: 100%;
          margin-bottom: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.75rem;
          background: rgb(24 24 27);
          border: 1px solid rgb(63 63 70);
          font-size: 0.875rem;
          color: rgb(250 250 249);
        }
        :global(.field:focus) {
          outline: none;
          border-color: rgba(217, 119, 6, 0.55);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] text-stone-500 mb-1">{label}</label>
      {children}
    </div>
  );
}