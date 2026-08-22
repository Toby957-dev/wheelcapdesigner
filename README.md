# Nabendeckel-Generator (Hub-Cap Generator)

Parametrischer Nabendeckel mit **Schnappnasen (Clip-Fit)** und optionalem **Logo**
(eigenes SVG oder Text). Gebaut für den **MakerWorld-Customizer** und **OpenSCAD Desktop**.

Alle Maße in **Millimeter (mm)**.

---

## Dateien

```
nabendeckel-generator/
├─ nabendeckel_generator.scad   ← der Generator
├─ logos/
│  └─ star.svg                  ← Beispiel-Logo
└─ README.md
```

---

## Schnellstart (OpenSCAD Desktop)

1. [OpenSCAD](https://openscad.org/downloads.html) installieren (kostenlos).
2. `nabendeckel_generator.scad` öffnen.
3. Menü **Window → Customizer** einblenden → alle Parameter erscheinen als Slider/Felder.
4. Maße einstellen, mit **F5** Vorschau, mit **F6** final rendern, dann **STL exportieren**.

---

## Die wichtigsten Maße

| Parameter | Bedeutung |
|---|---|
| `outer_diameter` | Außendurchmesser der sichtbaren Blende (liegt auf dem Rad auf). **Muss größer sein als `mount_diameter`**, sonst fällt der Deckel durch. |
| `mount_diameter` | Durchmesser der Radöffnung, in die der Deckel greift. Hier sitzen die Clips. |
| `total_height` | Gesamthöhe / Einstecktiefe. |
| `face_thickness` | Dicke der Deckplatte oben. |

### So misst du richtig
- **`mount_diameter`** = Innendurchmesser des Lochs in der Felge/Nabe, gemessen mit Messschieber.
- **`outer_diameter`** = etwas größer wählen (z. B. +3–6 mm), damit ein sichtbarer Rand aufliegt.
- **`grip_thickness`** = Materialstärke der Felge am Loch (dort, wo die Rastnase dahinter greift).

---

## Schnappnasen (Clips) — wie sie funktionieren

Die Clips sind flexible Finger, die beim Eindrücken kurz nach innen federn und dann
hinter der Kante der Radöffnung einrasten.

| Parameter | Wirkung |
|---|---|
| `clip_count` | Anzahl Clips (6 ist ein guter Start). |
| `clip_thickness` | Dicke/Steifigkeit eines Fingers. Dünner = federt leichter. |
| `clip_width_deg` | Winkelbreite eines Clips. Automatisch begrenzt, damit Lücken bleiben. |
| `barb_depth` | Wie weit die Rastnase greift (Haltekraft). |
| `barb_ramp` | Länge der Einführschräge — größer = leichter einzudrücken. |
| `grip_thickness` | Klemmdicke = Materialstärke des Rades zwischen Auflage und Rastkante. |
| `tolerance` | Druckertoleranz. Bei zu strammem Sitz erhöhen (0.3–0.5). |

**Tuning-Tipps**
- Deckel geht **zu schwer** rein → `barb_depth` kleiner **oder** `tolerance` größer **oder** `clip_thickness` kleiner.
- Deckel **hält nicht** / fällt raus → `barb_depth` größer, `grip_thickness` genauer messen.
- Clips **brechen** ab → `clip_thickness` etwas erhöhen, mit mehr Wandlinien / zäherem Filament (PETG) drucken.

---

## Logo

`logo_mode` wählt die Quelle:

- **`none`** — kein Logo.
- **`text`** — eigener Text (`logo_text`, `logo_font`). Funktioniert überall, auch auf MakerWorld.
- **`svg`** — eigenes SVG aus dem `logos/`-Ordner (`logo_file`).

Steuerung:
- `logo_size` — Zieldurchmesser/-breite (proportional skaliert).
- `logo_height` — **positiv = erhaben**, **negativ = graviert**.
- `logo_recess_depth` / `logo_recess_diameter` — vertiefte Kreisfläche als "Teller" unter dem Logo.
- `logo_offset_x/y`, `logo_rotation` — Feinjustierung, falls das SVG nicht ganz zentriert ist.

### Eigenes SVG vorbereiten
- Motiv **mittig** auf der Zeichenfläche platzieren (z. B. viewBox um 0,0 zentriert).
- **Nur gefüllte Flächen**, keine reinen Linien/Strokes (Strokes in Pfade umwandeln).
- Möglichst **eine zusammenhängende Fläche**, schwarz gefüllt.
- In Inkscape: *Pfad → Objekt in Pfad umwandeln*, dann als **Plain SVG** speichern.

---

## Auf MakerWorld veröffentlichen — bitte lesen

MakerWorlds Customizer führt OpenSCAD **serverseitig** aus und erlaubt Endnutzern
**keinen freien Datei-Upload**. Das heißt für dein "Logo hochladen"-Feature:

- ✅ **Text-Logos** funktionieren für Endnutzer voll.
- ✅ **Vorgefertigte Logo-Bibliothek**: Du legst mehrere SVGs bei und machst `logo_file`
  zu einem **Dropdown**. Dazu die Zeile so ändern (Kommentar = Auswahlliste):

  ```openscad
  logo_file = "logos/star.svg"; // [logos/star.svg, logos/kreis.svg, logos/blitz.svg]
  ```

  Endnutzer wählen dann aus deiner mitgelieferten Liste.
- ⚠️ **Echter Upload eigener Logos durch Endnutzer** geht auf MakerWorld nicht direkt.
  Dafür braucht es die **eigene Web-App-Variante** (kann ich als nächsten Schritt bauen) —
  dort lädt der Nutzer sein SVG/PNG im Browser hoch und bekommt sofort ein STL.

---

## ⚠️ Marken-/Logo-Bibliothek: rechtlicher Hinweis

Autologos (VW, BMW, Audi, Mercedes …) sind **eingetragene Marken**. Eine öffentliche
Bibliothek mit Markenlogos ist rechtlich heikel:

- MakerWorld/Bambu **entfernt markengeschützte Modelle** regelmäßig und kann Accounts sperren.
- Das Verbreiten/Verkaufen kann Abmahnungen nach sich ziehen.

**Sicherere Alternativen für die Bibliothek:**
- **Eigener Upload** durch den Nutzer (Verantwortung liegt beim Nutzer, nichts wird von dir verbreitet).
- **Generische Motive**: Sterne, Blitze, Speichenmuster, Initialen/Text.
- **Eigene / freie Logos** (CC0 / gemeinfrei) oder mit ausdrücklicher Lizenz.

Für den **privaten Eigengebrauch** (du druckst dir selbst einen Deckel) ist das i. d. R.
unkritisch — problematisch wird v. a. das **öffentliche Verbreiten** der Logos.

---

## Ideen für später
- Weitere Befestigungen (Press-/Schraubsitz) als Option.
- Speichen-/Rillenmuster-Generator auf der Oberseite.
- Web-App mit echtem Datei-Upload + 3D-Vorschau im Browser.
