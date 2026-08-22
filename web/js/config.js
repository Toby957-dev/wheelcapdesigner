// Standardwerte, Parameter-Metadaten (steuern die UI) und Modus-Zuordnung.
// Parameter mit expert:true erscheinen nur im Experten-Modus.

export const DEFAULTS = {
  // Grundmaße
  outerDiameter: 60,
  mountDiameter: 56,
  totalHeight: 12,
  faceThickness: 2.0,
  // Rand
  topChamfer: 1.0,
  // Clips
  clipCount: 6,
  clipThickness: 1.6,
  clipWidthDeg: 30,
  barbDepth: 1.0,
  barbRamp: 2.0,
  gripThickness: 2.5,
  tolerance: 0.3,
  // Farben (nur Vorschau / getrennte Bauteile – STL ist farblos)
  capColor: '#d7dbe1',
  logoColor: '#ff7a45',
  // Logo
  logoMode: 'none',        // none | svg | text
  logoStyle: 'raised',     // raised | engraved
  logoSize: 30,
  logoDepth: 1.0,          // bei „Plan" = Tiefe der bündigen Einlage (1 mm empfohlen)
  outlineWidth: 0,         // 0 = keine Outline (Ring am Deckelrand)
  outlineGap: 4,           // Abstand von der Außenkontur des Deckels
  logoRecessDepth: 0,
  logoRecessDiameter: 36,
  logoOffsetX: 0,
  logoOffsetY: 0,
  logoRotation: 0,
  logoText: 'LOGO',
};

// Reihenfolge + Gruppierung + Regler-Grenzen für die automatisch aufgebaute UI.
export const GROUPS = [
  {
    id: 'base', label: 'Grundmaße', icon: 'ruler',
    params: [
      { key: 'outerDiameter', label: 'Außen-Ø', min: 20, max: 220, step: 0.5, unit: 'mm', hint: 'Sichtbarer Rand, liegt auf dem Rad auf' },
      { key: 'mountDiameter', label: 'Montage-Ø', min: 15, max: 210, step: 0.5, unit: 'mm', hint: 'Durchmesser der Radöffnung (Klemm-Ø)' },
      { key: 'totalHeight', label: 'Höhe / Tiefe', min: 5, max: 60, step: 0.5, unit: 'mm' },
      { key: 'faceThickness', label: 'Deckplatte', min: 0.8, max: 6, step: 0.2, unit: 'mm', expert: true },
    ],
  },
  {
    id: 'edge', label: 'Rand', icon: 'circle',
    params: [
      { key: 'topChamfer', label: 'Fase oben', min: 0, max: 8, step: 0.2, unit: 'mm', expert: true },
    ],
  },
  {
    id: 'color', label: 'Farbe', icon: 'palette',
    params: [
      { key: 'capColor', label: 'Deckel-Farbe', type: 'color' },
    ],
  },
  {
    id: 'clips', label: 'Schnappnasen', icon: 'clip',
    params: [
      { key: 'clipCount', label: 'Anzahl Clips', min: 2, max: 16, step: 1, unit: '' },
      { key: 'clipThickness', label: 'Clip-Dicke', min: 0.8, max: 4, step: 0.1, unit: 'mm', expert: true },
      { key: 'clipWidthDeg', label: 'Clip-Breite', min: 4, max: 60, step: 1, unit: '°', expert: true },
      { key: 'barbDepth', label: 'Rastnase', min: 0.2, max: 4, step: 0.1, unit: 'mm', hint: 'Haltekraft', expert: true },
      { key: 'barbRamp', label: 'Einführschräge', min: 0.5, max: 8, step: 0.1, unit: 'mm', expert: true },
      { key: 'gripThickness', label: 'Klemmdicke', min: 0.5, max: 12, step: 0.1, unit: 'mm', hint: 'Materialstärke des Rades', expert: true },
      { key: 'tolerance', label: 'Toleranz', min: 0, max: 1.5, step: 0.05, unit: 'mm', hint: 'Bei zu strammem Sitz erhöhen', expert: true },
    ],
  },
  {
    id: 'logo', label: 'Logo', icon: 'star',
    params: [
      { key: 'logoMode', label: 'Quelle', type: 'select', options: [
          { value: 'none', label: 'Kein Logo' },
          { value: 'svg', label: 'Eigenes SVG' },
          { value: 'text', label: 'Text' },
        ] },
      { key: 'logoText', label: 'Text', type: 'text', showIf: p => p.logoMode === 'text' },
      { key: 'logoStyle', label: 'Stil', type: 'select', showIf: p => p.logoMode !== 'none', options: [
          { value: 'raised', label: 'Erhaben' },
          { value: 'engraved', label: 'Graviert' },
          { value: 'flush', label: 'Plan (bündig, 2-teilig)' },
        ] },
      { key: 'logoColor', label: 'Logo-Farbe', type: 'color', showIf: p => p.logoMode !== 'none' && p.logoStyle !== 'engraved' },
      { key: 'logoSize', label: 'Größe', min: 5, max: 200, step: 0.5, unit: 'mm', showIf: p => p.logoMode !== 'none' },
      { key: 'logoDepth', label: 'Höhe / Tiefe', min: 0.4, max: 4, step: 0.1, unit: 'mm', showIf: p => p.logoMode !== 'none', hint: 'Plan: Einlage-Tiefe (1 mm empfohlen)' },
      { key: 'outlineWidth', label: 'Outline-Breite', min: 0, max: 15, step: 0.2, unit: 'mm', showIf: p => p.logoMode !== 'none', hint: 'Ring am Deckelrand · 0 = aus' },
      { key: 'outlineGap', label: 'Abstand vom Rand', min: 0, max: 40, step: 0.5, unit: 'mm', showIf: p => p.logoMode !== 'none' && p.outlineWidth > 0 },
      { key: 'logoOffsetX', label: 'Position X', min: -40, max: 40, step: 0.1, unit: 'mm', showIf: p => p.logoMode !== 'none' },
      { key: 'logoOffsetY', label: 'Position Y', min: -40, max: 40, step: 0.1, unit: 'mm', showIf: p => p.logoMode !== 'none' },
      { key: 'logoRotation', label: 'Drehung', min: 0, max: 360, step: 1, unit: '°', showIf: p => p.logoMode !== 'none' },
      { key: 'logoRecessDepth', label: 'Vertiefung', min: 0, max: 3, step: 0.1, unit: 'mm', showIf: p => p.logoMode !== 'none', hint: 'Eingelassener „Teller" unter dem Logo', expert: true },
      { key: 'logoRecessDiameter', label: 'Vertiefung-Ø', min: 5, max: 200, step: 0.5, unit: 'mm', showIf: p => p.logoMode !== 'none' && p.logoRecessDepth > 0, expert: true },
    ],
  },
];
