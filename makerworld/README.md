# MakerWorld-Upload – WheelCapDesigner

Fertiges Bundle für **MakerWorld → Parametric Model Maker** (OpenSCAD 2021).

## Dateien
```
wheelcapdesigner.scad   ← nur diese eine Datei hochladen
LISTING.md              ← Titel/Beschreibung/Tags zum Kopieren (NICHT hochladen)
```
> Die Logo-Formen (Stern, Blitz, Ringe, Sechseck, Kreis-Ring) sind direkt im Skript
> gezeichnet – **keine Zusatzdateien nötig**, immer sauber zentriert.

## So lädst du hoch
1. Auf [makerworld.com](https://makerworld.com) einloggen → **Create → Design** (bzw. MakerLab → **Parametric Model Maker**).
2. Statt einer `.3mf` die **`wheelcapdesigner.scad`** hochladen → der **„Customize"**-Button erscheint automatisch.
3. Titel, Beschreibung und Tags aus [`LISTING.md`](LISTING.md) übernehmen (inkl. Link zur Web-App + Ko-fi).
4. Ein paar Vorschau-Renders erzeugen (verschiedene Größen/Formen/Farben) und veröffentlichen.

## Getestet ✅
Lokal mit OpenSCAD gerendert: Geometrie manifold (CGAL „Simple: yes"), Formen/Text zentriert,
Plan-Modus 2-farbig, Outline und Multicolor (`color()`) funktionieren.

## Kompatibilität / Grenzen
- Gebaut & getestet für **OpenSCAD 2021** (MakerWorld-Standard).
- **Mehrfarbig:** Deckel- und Logo-/Einlage-Farbe werden über `color()` ausgegeben → im Slicer/AMS als getrennte Farben.
- **Eigenes Bild-Logo** (freier Upload) geht auf MakerWorld nicht — dafür ist die **Web-App** da
  (https://wheelcapdesigner-u4aa.vercel.app). Auf MakerWorld: Text + die eingebauten Formen.
- Bitte nur eigene / frei lizenzierte Logos verwenden (Markenrecht).

## Selbst testen (optional)
OpenSCAD öffnen → **Window → Customizer** → Parameter testen → **F6** rendern → STL/3MF exportieren.
