-- Supabase-Schema für die gemeinsame Nabendeckel-Vorlagen-Bibliothek.
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und ausführen.

-- 1) Freigegebene Vorlagen (öffentlich lesbar)
create table if not exists cap_templates (
  id            uuid primary key default gen_random_uuid(),
  brand_group   text not null default 'Community',   -- z. B. Autohersteller / Felgenhersteller / Community
  brand         text not null,                        -- z. B. "VW"
  label         text not null,                        -- z. B. "65 / 56 mm"
  outer_diameter numeric not null,
  mount_diameter numeric not null,
  total_height  numeric not null default 12,
  clip_count    int     not null default 6,
  approved      boolean not null default false,       -- erst nach Prüfung sichtbar
  created_at    timestamptz not null default now()
);

-- 2) Eingereichte Vorschläge (nur einfügen, Moderation über 'status')
create table if not exists cap_proposals (
  id            uuid primary key default gen_random_uuid(),
  brand         text,
  label         text not null,
  outer_diameter numeric not null,
  mount_diameter numeric not null,
  total_height  numeric,
  clip_count    int,
  submitted_by  text,
  note          text,
  status        text not null default 'new',          -- new | approved | rejected
  created_at    timestamptz not null default now()
);

-- 3) Row-Level-Security aktivieren
alter table cap_templates enable row level security;
alter table cap_proposals enable row level security;

-- 4) Policies
--   Öffentlich lesbar: nur freigegebene Vorlagen
create policy "public read approved templates"
  on cap_templates for select
  using (approved = true);

--   Jeder darf Vorschläge einreichen (nur INSERT, kein Lesen/Ändern)
create policy "anon insert proposals"
  on cap_proposals for insert
  with check (true);

-- Moderation: In cap_proposals prüfen, gute Einträge nach cap_templates kopieren
-- und dort approved = true setzen. Beispiel:
--   insert into cap_templates (brand, label, outer_diameter, mount_diameter, total_height, clip_count, approved)
--   select brand, label, outer_diameter, mount_diameter, coalesce(total_height,12), coalesce(clip_count,6), true
--   from cap_proposals where id = '...';


-- ============================================================
-- 5) Bewertungen für Vorlagen + Feedback zum Designer
--    (nachträglich – einfach zusätzlich im SQL-Editor ausführen)
-- ============================================================

-- 5a) Bewertungen einzelner Vorlagen (1–5). Eine Stimme pro Browser (voter).
create table if not exists cap_ratings (
  id          uuid primary key default gen_random_uuid(),
  template_id uuid not null references cap_templates(id) on delete cascade,
  rating      int  not null check (rating between 1 and 5),
  voter       text not null,                       -- anonyme Browser-Kennung
  created_at  timestamptz not null default now(),
  unique (template_id, voter)                       -- Upsert-Ziel (eine Stimme je Browser)
);
create index if not exists cap_ratings_template_idx on cap_ratings(template_id);

-- 5b) Allgemeines Feedback zum Designer
create table if not exists cap_feedback (
  id         uuid primary key default gen_random_uuid(),
  rating     int check (rating between 1 and 5),
  message    text,
  email      text,
  created_at timestamptz not null default now()
);

-- 5c) Öffentliche Zusammenfassung: Schnitt + Stimmenzahl je Vorlage
create or replace view cap_rating_summary as
  select template_id,
         round(avg(rating)::numeric, 2) as avg_rating,
         count(*)::int                  as votes
  from cap_ratings
  group by template_id;

-- 5d) Row-Level-Security
alter table cap_ratings  enable row level security;
alter table cap_feedback enable row level security;

-- Jeder darf abstimmen (Upsert = insert + update der eigenen Stimme)
create policy "anon insert ratings" on cap_ratings
  for insert with check (true);
create policy "anon update ratings" on cap_ratings
  for update using (true) with check (true);

-- Feedback nur einreichen (nicht öffentlich lesbar; Auswertung im Dashboard)
create policy "anon insert feedback" on cap_feedback
  for insert with check (true);

-- Zusammenfassung öffentlich lesbar machen (Einzelstimmen bleiben ungelesen).
grant select on cap_rating_summary to anon, authenticated;
