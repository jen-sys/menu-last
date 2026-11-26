# Restoku
npm install && npm run dev  -> http://localhost:5173  (admin: /admin, PIN default 1234, ubah lewat .env: VITE_ADMIN_PIN)

## Audio notifikasi
Ganti file `public/sounds/payment-success.mp3` (atau ubah PAYMENT_SOUND di src/hooks/useAudioNotification.ts).
Dipicu: customer klik "Saya sudah bayar" dan admin saat pesanan baru masuk. Jika file kosong/diblokir browser -> bunyi bell sintetis.

## Catatan
Data (pesanan, logs, keranjang) disimpan di localStorage dan tersinkron antar-tab lewat polling. Untuk multi-perangkat, ganti src/store/useOrders.ts & useLogs.ts dengan Supabase (tabel: menus, orders, order_items, logs + Realtime).

## Supabase (agar pesanan & logs masuk dari perangkat/jaringan mana pun)
1. Buat project di supabase.com -> SQL Editor -> jalankan isi `supabase/schema.sql`.
2. Settings -> API: salin Project URL dan anon key.
3. Lokal: buat `.env` dari `.env.example`, isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.
4. Vercel: Settings -> Environment Variables, isi dua variabel yang sama, lalu Redeploy.
Policy di schema.sql bersifat DEMO (anon bisa baca/tulis). Untuk produksi, pakai Supabase Auth untuk admin.
