-- Great Outdoor — image storage
--
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query),
-- after schema.sql. Safe to re-run.
--
-- Access model mirrors the tables: anyone may read an image (the public site
-- fetches them anonymously), but only a signed-in admin may upload, replace or
-- delete one. Uploads go through /api/admin/upload, which checks the session
-- before touching storage — these policies are the second line of defence, so a
-- leaked anon key still cannot write.

-- ------------------------------------------------------------------- bucket
-- `public = true` makes objects readable over the CDN URL without a signed
-- token. That is what we want for a product catalogue; nothing here is private.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- ---------------------------------------------------------------------- RLS
-- storage.objects already has RLS enabled by Supabase; we only add policies.

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
