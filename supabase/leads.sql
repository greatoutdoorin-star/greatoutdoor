-- Great Outdoor — lead capture
--
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query),
-- after schema.sql. Safe to re-run.
--
-- Every enquiry form writes here before handing off to WhatsApp, so a lead
-- survives even when the visitor never sends the drafted message — which is
-- most of them. Previously the only trace of an enquiry was the WhatsApp
-- conversation itself.

create table if not exists public.leads (
  id         bigserial primary key,
  -- Which form it came from, so B2B can be triaged ahead of general enquiries.
  source     text not null check (source in ('contact', 'b2b', 'product')),
  name       text not null,
  phone      text not null,
  email      text,
  company    text,
  city       text,
  message    text,
  -- Set when source = 'product': which item they were looking at.
  product    text,
  -- Who they are and what they want. Both are free text rather than an enum:
  -- the options can change without a migration, and "Other" is one of them.
  role       text,
  looking_for text,
  -- Simple workflow so the list does not become an undifferentiated pile.
  status     text not null default 'new'
             check (status in ('new', 'contacted', 'closed')),
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx  on public.leads (status);

-- ---------------------------------------------------------------------- RLS
alter table public.leads enable row level security;

-- Anyone may submit a lead — the forms are public and unauthenticated.
drop policy if exists "public insert leads" on public.leads;
create policy "public insert leads" on public.leads
  for insert with check (true);

-- Only a signed-in admin may read them back. Deliberately NOT world-readable:
-- these rows hold names and phone numbers, so a leaked anon key must not
-- expose the customer list.
drop policy if exists "admin read leads" on public.leads;
create policy "admin read leads" on public.leads
  for select to authenticated using (true);

drop policy if exists "admin update leads" on public.leads;
create policy "admin update leads" on public.leads
  for update to authenticated using (true) with check (true);

drop policy if exists "admin delete leads" on public.leads;
create policy "admin delete leads" on public.leads
  for delete to authenticated using (true);
