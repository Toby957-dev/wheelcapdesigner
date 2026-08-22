# Deployment: GitHub + Vercel + Supabase (alles kostenlos)

Reihenfolge: **1) GitHub** (Code) → **2) Vercel** (Website live) → **3) Supabase** (gemeinsame Bibliothek).
Die App läuft nach Schritt 1–2 schon voll; Supabase ist optional für die geteilten Vorlagen.

---

## 1) Auf GitHub hochladen

Das Repo ist lokal schon vorbereitet (git init + erster Commit). Jetzt bei GitHub ein
leeres Repository anlegen (ohne README/‎.gitignore) und dann:

```bash
git remote add origin https://github.com/<DEIN-NAME>/nabendeckel-generator.git
git branch -M main
git push -u origin main
```

(Alternativ mit GitHub CLI: `gh repo create nabendeckel-generator --public --source . --push`.)

---

## 2) Auf Vercel launchen

1. [vercel.com](https://vercel.com) → mit GitHub anmelden → **Add New… → Project**.
2. Das Repo `nabendeckel-generator` importieren.
3. Wichtig bei den Build-Einstellungen:
   - **Framework Preset:** Other
   - **Root Directory:** `web`   ← die eigentliche Website liegt im Unterordner
   - **Build Command:** leer lassen · **Output Directory:** leer lassen
4. **Deploy** klicken. Nach ~1 Min ist die Seite unter `https://<projekt>.vercel.app` live.

Jeder `git push` deployt danach automatisch neu.

---

## 3) Supabase anbinden (gemeinsame Vorlagen-Bibliothek)

1. [supabase.com](https://supabase.com) → **New project** (Region EU wählen, DB-Passwort merken).
2. Links **SQL Editor** → Inhalt von [`supabase-schema.sql`](supabase-schema.sql) einfügen → **Run**.
3. **Project Settings → API** öffnen und kopieren:
   - **Project URL** (z. B. `https://xxxx.supabase.co`)
   - **anon public** Key
4. In [`web/js/supabase.js`](web/js/supabase.js) eintragen:
   ```js
   export const SUPABASE_URL = 'https://xxxx.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJ...';
   ```
5. Commit + push → Vercel deployt automatisch. Ab jetzt:
   - „Als Vorlage vorschlagen" schreibt in `cap_proposals` (status = `new`).
   - Freigegebene Einträge (`cap_templates.approved = true`) erscheinen als Gruppe **Community**.

### Moderation
Neue Vorschläge im Supabase-Table-Editor unter `cap_proposals` ansehen. Gute Einträge
freigeben, indem du sie nach `cap_templates` mit `approved = true` überträgst
(SQL-Beispiel steht unten in `supabase-schema.sql`).

> Der `anon`-Key darf öffentlich im Code stehen – Zugriff ist durch Row-Level-Security
> beschränkt (nur freigegebene Vorlagen lesen, nur Vorschläge einfügen).

---

## Kosten
GitHub (öffentliches Repo), Vercel (Hobby) und Supabase (Free-Tier) sind für dieses
Projekt kostenlos. Three.js kommt weiterhin vom CDN – keine Server-Kosten.
