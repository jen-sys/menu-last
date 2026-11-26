-- Jalankan sekali di Supabase: SQL Editor -> New query -> Run
create table if not exists public.orders (
  id text primary key, number text not null, status text not null,
  data jsonb not null, created_at timestamptz not null default now());
create table if not exists public.logs (
  id text primary key, at bigint not null, data jsonb not null);

alter table public.orders enable row level security;
alter table public.logs enable row level security;
-- MODE DEMO: anon boleh baca/tulis. Untuk produksi, perketat (Supabase Auth untuk admin).
create policy "anon all orders" on public.orders for all to anon using (true) with check (true);
create policy "anon all logs" on public.logs for all to anon using (true) with check (true);

alter publication supabase_realtime add table public.orders, public.logs;
