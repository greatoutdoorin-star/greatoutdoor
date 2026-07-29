-- Great Outdoor — database schema
--
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
--
-- Access model: the public site reads with the anon key, so every table is
-- world-readable but writable only by an authenticated admin. There is no cart,
-- no customer accounts and no orders — the only writer is the admin panel.

-- ---------------------------------------------------------------- collections
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  image       text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------------- products
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  collection_id uuid references public.collections(id) on delete set null,
  slug          text not null unique,
  name          text not null,
  description   text,
  -- Rupees. numeric(10,2) rather than float so money never drifts.
  price         numeric(10,2) not null default 0,
  material      text,
  -- Spec bullet lines, in display order.
  specs         jsonb not null default '[]'::jsonb,
  -- Option label (e.g. "Choice of Cane") plus its values; shown as text since
  -- there is no cart to select a variant into.
  variant_label text,
  variants      jsonb not null default '[]'::jsonb,
  -- Local /products/*.webp paths, first image is the card thumbnail.
  images        jsonb not null default '[]'::jsonb,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_collection_idx on public.products(collection_id);
create index if not exists products_active_idx on public.products(is_active);

-- --------------------------------------------------------------- hero_slides
create table if not exists public.hero_slides (
  id         uuid primary key default gen_random_uuid(),
  image      text not null,
  headline   text,
  subtext    text,
  link       text,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------- posts
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  cover        text,
  body         text,
  published_at timestamptz,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------- pages
-- Editable copy for About / FAQs / Materials / Why GO.in / B2B and policies.
create table if not exists public.pages (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  body       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------- settings
-- Single-row key/value store: WhatsApp number and message templates, editable
-- without a redeploy.
create table if not exists public.settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------- enquiry_clicks (opt)
-- wa.me links leave no server-side trace of which products draw interest.
-- This records a click before redirecting. No personal data is stored.
create table if not exists public.enquiry_clicks (
  id         bigserial primary key,
  product_id uuid references public.products(id) on delete set null,
  source     text,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_clicks_product_idx on public.enquiry_clicks(product_id);

-- --------------------------------------------------------------------- RLS
alter table public.collections    enable row level security;
alter table public.products       enable row level security;
alter table public.hero_slides    enable row level security;
alter table public.posts          enable row level security;
alter table public.pages          enable row level security;
alter table public.settings       enable row level security;
alter table public.enquiry_clicks enable row level security;

-- Public read. Content is meant to be seen by anonymous visitors.
drop policy if exists "public read collections" on public.collections;
create policy "public read collections" on public.collections
  for select using (true);

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select using (true);

drop policy if exists "public read hero_slides" on public.hero_slides;
create policy "public read hero_slides" on public.hero_slides
  for select using (true);

drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts
  for select using (true);

drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages
  for select using (true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings
  for select using (true);

-- Writes require a signed-in admin. The service_role key bypasses RLS entirely
-- and is used only by server-side import scripts.
drop policy if exists "admin write collections" on public.collections;
create policy "admin write collections" on public.collections
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write products" on public.products;
create policy "admin write products" on public.products
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write hero_slides" on public.hero_slides;
create policy "admin write hero_slides" on public.hero_slides
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write pages" on public.pages;
create policy "admin write pages" on public.pages
  for all to authenticated using (true) with check (true);

drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings
  for all to authenticated using (true) with check (true);

-- Anyone may log an enquiry click; only admins may read the log back.
drop policy if exists "public insert enquiry_clicks" on public.enquiry_clicks;
create policy "public insert enquiry_clicks" on public.enquiry_clicks
  for insert with check (true);

drop policy if exists "admin read enquiry_clicks" on public.enquiry_clicks;
create policy "admin read enquiry_clicks" on public.enquiry_clicks
  for select to authenticated using (true);

-- ----------------------------------------------------------- updated_at hooks
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists pages_touch on public.pages;
create trigger pages_touch before update on public.pages
  for each row execute function public.touch_updated_at();
