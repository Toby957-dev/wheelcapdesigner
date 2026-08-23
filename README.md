# Nabendeckel-Generator

Parametrischer **Nabendeckel-/Hub-Cap-Generator** mit Schnappnasen (Clip-Fit) und Logo
(eigenes SVG oder Text). Zwei Wege:

- **Web-App** (empfohlen) – Konfigurator im Browser mit Live-3D-Vorschau und STL-Download.
- **OpenSCAD-Skript** – für den MakerWorld-Customizer / OpenSCAD Desktop.

Alle Maße in **Millimeter (mm)**.

---

## Web-App

Browser-Generator (wie BumpMesh, eigenes Design): Maße per Regler/Zahleneingabe einstellen,
Logo hochladen, Farben wählen, live in 3D drehen und als **STL herunterladen**.
Kein Build-Tooling – Three.js kommt als ES-Modul vom CDN.

**Features:** Standard-/Experten-Modus · Marken-Bibliothek (Auto- & Felgenhersteller) ·
eigene Vorlagen speichern & vorschlagen · Logo als SVG/Text · Stile *Erhaben / Graviert /
Plan (bündig, 2-teilig)* · Outline am Rand · getrennte Farben für Deckel & Logo ·
Mehrfarb-Export (2 STL).

**Lokal starten** (im Ordner `web/`):
```bash
python -m http.server 8099
```
Dann [http://localhost:8099](http://localhost:8099) öffnen. Details: [web/README.md](web/README.md).

**Online stellen:** GitHub → Vercel → (optional) Supabase — Schritt für Schritt in
[DEPLOY.md](DEPLOY.md).

---

## OpenSCAD-Variante

[`nabendeckel_generator.scad`](nabendeckel_generator.scad) in OpenSCAD öffnen
(**Window → Customizer**), Maße einstellen, mit **F6** rendern, **STL exportieren**.

Die wichtigsten Maße: `outer_diameter` (Außen-Ø, muss > `mount_diameter` sein),
`mount_diameter` (Radöffnung/Klemm-Ø), `total_height`, `grip_thickness` (Materialstärke
des Rades). Clip-Sitz zu stramm → `tolerance` erhöhen; hält nicht → `barb_depth` erhöhen.

---

## Struktur

```
nabendeckel-generator/
├─ web/                     Web-App (Vercel: Root Directory = web)
│  ├─ index.html
│  ├─ css/style.css
│  ├─ js/                   config, brands, geometry, logo, app, supabase, userPresets
│  └─ logos/                Beispiel-SVGs
├─ nabendeckel_generator.scad   OpenSCAD-Variante
├─ supabase-schema.sql      DB-Schema für die gemeinsame Vorlagen-Bibliothek
├─ DEPLOY.md                Deployment-Anleitung
└─ README.md
```

## ⚠️ Marken-Logos

Auto-/Felgen-Logos sind eingetragene Marken. Eine öffentliche Bibliothek fremder
Markenlogos ist rechtlich riskant (Abmahnungen/Takedowns). Sauber: Nutzer laden ihr
eigenes Logo hoch, oder es werden nur Logos mit klarer Lizenz eingebunden. Für privaten
Eigenbedarf meist unkritisch – kritisch ist die öffentliche Verbreitung.

---

## Lizenz / Kosten

Statisch hostbar auf GitHub Pages / Vercel / Netlify. GitHub, Vercel (Hobby) und Supabase
(Free-Tier) sind für dieses Projekt kostenlos.
