# MakerWorld-Upload – WheelCapDesigner

Dieser Ordner ist das fertige Bundle für **MakerWorld → Parametric Model Maker**.

## Dateien (alle zusammen hochladen!)
```
wheelcapdesigner.scad   ← das Skript
star.svg  bolt.svg  rings.svg   ← Logo-Bibliothek (vom Skript genutzt)
LISTING.md              ← Titel/Beschreibung/Tags zum Kopieren (nicht hochladen)
```

## So lädst du es hoch
1. Auf [makerworld.com](https://makerworld.com) einloggen → **Create → Design** (oder MakerLab → **Parametric Model Maker**).
2. Statt einer `.3mf` die **`wheelcapdesigner.scad`** hochladen — dadurch erscheint automatisch der **„Customize"**-Button.
3. **Wichtig:** die **drei SVG-Dateien mit hochladen** (star.svg, bolt.svg, rings.svg), damit die SVG-Logos funktionieren.
4. Titel, Beschreibung und Tags aus [`LISTING.md`](LISTING.md) übernehmen (inkl. Link zur Web-App).
5. Ein paar Vorschaubilder rendern (verschiedene Größen/Logos/Farben) und veröffentlichen.

## Kompatibilität / Grenzen
- Gebaut für **OpenSCAD 2021** (MakerWorld-Standard).
- **Mehrfarbig:** Deckel- und Logo-Farbe werden über `color()` ausgegeben → im Slicer/AMS als getrennte Farben.
- **SVG-Upload durch Endnutzer** geht auf MakerWorld nicht — dort nur die mitgelieferte SVG-Bibliothek + Text. Freien Logo-Upload bietet die **Web-App**.
- Nur eigene / frei lizenzierte Logos einbinden (Markenrecht!).

## Testen vor dem Upload (optional)
Mit installiertem OpenSCAD 2021: Datei öffnen → **Window → Customizer** → Parameter testen → **F6** rendern.
MakerWorld selbst rendert das Skript beim Upload ebenfalls und zeigt Fehler an.
