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
