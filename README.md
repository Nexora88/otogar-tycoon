# Otogar Tycoon · Peron Savaşları

1987 Türkiye esnaf / otogar yönetim simülasyonu.  
Çıraklıktan terminal ağalığına: vardiya, gazete, yazıhane, sefer, lobi kapışması.

**Geliştirici:** Ahmet Eymen Bakraç · Nexora Labs  

Canlı: [otogar-tycoon.vercel.app](https://otogar-tycoon.vercel.app)  
Repo: [github.com/Nexora88/otogar-tycoon](https://github.com/Nexora88/otogar-tycoon)

> Gerçek para, kumar veya yatırım yoktur. Oyun içi ₺ tamamen sanaldir.

---

## Oyun döngüsü (kısa)

1. **Çırak (Vardiya)** — Çay, tost, kasa, patron; sefer yok.  
2. **Bağımsız** — Birikim / rütbe → terminal ruhsatı (`/setup`).  
3. **Ağa** — Sefer, garaj, ofis, mafya aidatı, vergi, lobi.  
4. **Lobi** — Oda kodu, sohbet, fiyat nabzı (Supabase Realtime).

Zaman: gerçek ~**4 dakika = 1 oyun günü** (1987 sabit).

---

## Teknoloji

| Katman | Stack |
|--------|--------|
| UI | Next.js 16 (App Router), React 19, Tailwind 4 |
| State | Zustand (persist) |
| Canlı | Supabase Realtime (presence + broadcast) |
| Deploy | Vercel |

---

## Kurulum (lokal)

```bash
git clone https://github.com/Nexora88/otogar-tycoon.git
cd otogar-tycoon
npm install
cp .env.example .env.local
