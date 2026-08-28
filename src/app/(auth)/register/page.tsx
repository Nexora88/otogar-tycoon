"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

const FORBIDDEN =
  /\b(allah|siyaset|parti|küfür|amk|aq|orospu|piç|gerici|solcu|sağcı)\b/i;

export default function RegisterPage() {
  const router = useRouter();
  const setCompanyName = useGameStore((s) => s.setCompanyName);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (displayName.trim().length < 3) {
      setErr("Görünen ad en az 3 karakter.");
      return;
    }
    if (FORBIDDEN.test(displayName)) {
      setErr("Bu ad kurallara uygun değil (küfür / siyaset yasak).");
      return;
    }
    if (password.length < 6) {
      setErr("Şifre en az 6 karakter.");
      return;
    }

    setCompanyName(displayName.trim());
    router.push("/play");
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-zinc-800 rounded-2xl p-6 bg-zinc-950"
      >
        <h1 className="text-xl font-bold text-white mb-1">Hesap oluştur</h1>
        <p className="text-xs text-zinc-500 mb-6">
          "Adın yerel kayda yazılır"
        </p>
        <label className="block text-xs text-zinc-500 mb-1">Görünen ad / şirket</label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Örn: Keşan Yıldız Tur"
          required
        />
        <label className="block text-xs text-zinc-500 mb-1">E-posta</label>
        <input
          type="email"
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={false}
        />
        <label className="block text-xs text-zinc-500 mb-1">Şifre</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={false}
        />
        {err && <p className="text-xs text-red-400 mb-3">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl font-semibold text-sm text-[#0D0D1A]"
          style={{ background: "linear-gradient(90deg,#00F0FF,#007BFF)" }}
        >
          {loading ? "…" : "Kayıt ol"}
        </button>
        <p className="text-[11px] text-zinc-600 mt-4 text-center">
          <Link href="/legal" className="underline">
            Yasal metni
          </Link>{" "}
          kabul etmiş sayılırsınız.{" "}
          <Link href="/auth/login" className="text-cyan-500">
            Giriş
          </Link>
        </p>
      </form>
    </div>
  );
}