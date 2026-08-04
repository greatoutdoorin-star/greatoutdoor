-- Great Outdoor — add the two qualifying questions to `leads`.
--
-- Run this in the Supabase SQL Editor if you already created the leads table.
-- If you are setting up fresh, leads.sql already includes these columns and
-- you can skip this file. Safe to re-run either way.
--
--   role        — "Who are you?"          (Homeowner, Architect, …)
--   looking_for — "What are you looking for?" (Indoor, Outdoor, Both, …)
--
-- Free text rather than an enum, so the answer options can change without a
-- migration — and because "Other" is one of them.

alter table public.leads add column if not exists role text;
alter table public.leads add column if not exists looking_for text;
