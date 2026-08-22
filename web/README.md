# Nabendeckel-Generator · Web-App

Browser-basierter Konfigurator (wie BumpMesh, aber eigenes Design): Maße per Regler
einstellen, Logo hochladen, live in 3D drehen und als **STL herunterladen**.
**Kein Build-Tooling nötig** – reine HTML/JS-Datei, Three.js kommt als ES-Module vom CDN.

## Lokal starten

Im Ordner `web/`:

```bash
python -m http.server 8099
```

Dann [http://localhost:8099](http://localhost:8099) öffnen. (Ein einfacher Server ist nötig,
weil ES-Module nicht über `file://` laden – Doppelklick auf die HTML reicht nicht.)

## Veröffentlichen / Hosten

Es ist eine statische Seite – einfach den Inhalt von `web/` hochladen:

- **GitHub Pages**: Ordner ins Repo, Pages aktivieren.
- **Netlify / Vercel / Cloudflare Pages**: Ordner per Drag-and-drop, fertig.
- Jeder Webspace tut es.

> Hinweis: Die 3D-Bibliothek wird vom CDN (`esm.sh`) geladen → die Seite braucht online
> beim ersten Laden Internet. Für volle Offline-/Ausfallsicherheit kann man Three.js und
> `three-bvh-csg` lokal ablegen und die Import-Map in `index.html` auf lokale Pfade zeigen.

## Aufbau

```
web/
├─ index.html         Grundgerüst + Import-Map (CDN-Abhängigkeiten)
├─ css/style.css      Design (dunkles, technisches Theme)
├─ js/
│  ├─ config.js       Standardwerte, Regler-Definitionen (+ expert-Flag)  ← Regler anpassen
│  ├─ brands.js       Maß-Bibliothek nach Herstellern (Auto + Felgen)     ← Marken/Größen
│  ├─ userPresets.js  Eigene Vorlagen (localStorage) + Vorschlags-Export
│  ├─ geometry.js     3D-Erzeugung (Schürze, Clips, Rastnasen, Platte, Logo per CSG)
│  ├─ logo.js         SVG-Upload & Text -> extrudierte Geometrie
│  └─ app.js          Szene, UI-Aufbau, Modi, Vorlagen, Live-Rebuild, STL-Export
└─ logos/             Beispiel-SVGs (Stern, Blitz) für die Formen-Bibliothek
```

## Zwei Modi

Umschalter oben rechts:
- **Standard** – nur die wichtigsten Regler (Außen-Ø, Montage-Ø, Höhe, Clip-Anzahl, Logo).
- **Experte** – alle Feineinstellungen (Wandstärken, Rastnasen-Geometrie, Toleranz,
  Logo-Versatz/Drehung/Vertiefung …).

Welcher Regler wo erscheint, steuert das `expert: true`-Flag in `js/config.js`.
Die Modus-Wahl wird lokal gemerkt.

## Marken-Bibliothek & eigene Vorlagen

- **Hersteller → Größe/Modell** in der Sektion „Vorlagen" laden gängige Maße
  (Richtwerte aus dem Aftermarket – siehe Hinweis, bitte nachmessen). Pflege in `js/brands.js`.
- **Eigene Maße speichern** legt eine Vorlage lokal im Browser ab (localStorage,
  `js/userPresets.js`) – mit Anwenden/Löschen.
- **Als Vorlage vorschlagen** kopiert die Maße als JSON und öffnet eine E-Mail an
  `SUBMIT_EMAIL` (in `js/app.js` anpassen).

> Für eine **echte gemeinsame Bibliothek** („Maße für alle") braucht es ein kleines
> Backend (z. B. eine Serverless-Funktion + Datenbank/Repo), das die Vorschläge
> entgegennimmt, moderiert und zurückspielt. Der Client ist dafür schon vorbereitet
> (JSON-Payload in `proposalJSON`).

## Technik

- **three.js** – 3D-Vorschau & STL-Export (`STLExporter`, binär, Z-up fürs Druckbett).
- **three-bvh-csg** – boolesche Operationen (Lücken schneiden, Logo ein-/ausprägen).
- **SVGLoader** – wandelt hochgeladene SVGs in extrudierbare Flächen.
- Kein Framework, kein Bundler – wächst bei Bedarf problemlos zu Vite/React.

## Anpassen

**Marke/Größe ergänzen** – in `js/brands.js` unter `BRAND_LIBRARY` bei der Marke einen
Eintrag hinzufügen:
```js
{ label: '65 / 56 mm (Standard)', values: CAP(65, 56) },   // CAP(außen, klemm, höhe?, clips?)
```

**Neuen Regler** – in `js/config.js` unter `DEFAULTS` einen Wert und in `GROUPS` einen
Eintrag ergänzen (`expert: true` = nur im Experten-Modus); die UI baut sich automatisch daraus.

**Logo-Bibliothek statt/zusätzlich zum Upload** – SVGs in `logos/` legen und eine
Auswahl-Dropdown ergänzen (analog zu `logoMode`), die per `fetch` die Datei lädt und an
`svgToGeometry` gibt.

## Bekannte Grenzen / Ideen

- Nur Clip-Befestigung (Press-/Schraubsitz ließe sich als weitere Option ergänzen).
- Sehr komplexe SVGs mit vielen Pfaden können die CSG-Berechnung verlangsamen.
- Erhabene Logos in Weiß auf Weiß wirken in der Vorschau subtil – für Kontrast
  „graviert" wählen oder Höhe/Tiefe erhöhen.
- Marken-/Auto-Logos: Upload durch den Nutzer ist rechtlich sauber; eine öffentliche
  Sammlung fremder Markenlogos ist es nicht (siehe README im übergeordneten Ordner).
