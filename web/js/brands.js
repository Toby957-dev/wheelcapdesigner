// Maß-Bibliothek nach Herstellern.
// WICHTIG: Richtwerte aus gängigen Nabendeckel-Sortimenten – KEINE Garantie.
// Der Klemm-Ø (~56 mm) ist bei VW/Audi/Seat/Škoda/Opel weitgehend Standard.
// Immer nachmessen; die Werte sind ein guter Startpunkt.
//
// values: outerDiameter = Außen-Ø, mountDiameter = Klemm-/Montage-Ø.
// Weitere Felder (Höhe, Clips) werden mit sinnvollen Standards ergänzt.

const CAP = (outer, mount, height = 12, clips = 6) => ({
  outerDiameter: outer, mountDiameter: mount, totalHeight: height, clipCount: clips,
});

export const BRAND_LIBRARY = [
  {
    group: 'Autohersteller',
    brands: [
      { name: 'Volkswagen', entries: [
        { label: '65 / 56 mm (Standard)', values: CAP(65, 56) },
        { label: '60 / 56 mm', values: CAP(60, 56) },
        { label: '69 / 56 mm (neuer)', values: CAP(69, 56) },
        { label: '55 / 51 mm (klein)', values: CAP(55, 51, 11, 5) },
      ]},
      { name: 'Audi', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
        { label: '61 / 57 mm', values: CAP(61, 57) },
        { label: '69 / 56 mm', values: CAP(69, 56) },
        { label: '68 / 64 mm', values: CAP(68, 64, 13, 6) },
      ]},
      { name: 'BMW', entries: [
        { label: '68 / 64 mm (E-/F-Reihe)', values: CAP(68, 64, 13, 6) },
        { label: '56 / 52 mm (G-Reihe)', values: CAP(56, 52, 11, 5) },
      ]},
      { name: 'Mercedes-Benz', entries: [
        { label: '75 / 70 mm', values: CAP(75, 70, 14, 8) },
        { label: '66,8 / 62 mm (älter)', values: CAP(66.8, 62, 13, 6) },
      ]},
      { name: 'Opel', entries: [
        { label: '65 / 56 mm', values: CAP(65, 56) },
        { label: '64 / 60 mm', values: CAP(64, 60) },
      ]},
      { name: 'Ford', entries: [
        { label: '54 / 50 mm', values: CAP(54, 50, 11, 5) },
        { label: '58 / 54 mm', values: CAP(58, 54) },
      ]},
      { name: 'Škoda', entries: [
        { label: '56 / 52 mm', values: CAP(56, 52, 11, 5) },
        { label: '65 / 56 mm', values: CAP(65, 56) },
      ]},
      { name: 'Seat', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
        { label: '65 / 56 mm', values: CAP(65, 56) },
      ]},
      { name: 'Toyota', entries: [
        { label: '62 / 57 mm', values: CAP(62, 57) },
      ]},
      { name: 'Honda', entries: [
        { label: '58 / 54 mm', values: CAP(58, 54) },
        { label: '69 / 64 mm', values: CAP(69, 64, 13, 6) },
      ]},
      { name: 'Renault / Dacia', entries: [
        { label: '57 / 52 mm', values: CAP(57, 52, 11, 5) },
      ]},
      { name: 'Peugeot / Citroën', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
    ],
  },
  {
    group: 'Felgenhersteller',
    brands: [
      { name: 'BBS', entries: [
        { label: '56 mm', values: CAP(56, 52, 11, 5) },
        { label: '70,6 mm', values: CAP(70.6, 66, 13, 8) },
      ]},
      { name: 'OZ Racing', entries: [
        { label: '57 / 52 mm', values: CAP(57, 52, 11, 5) },
        { label: '55 / 51 mm', values: CAP(55, 51, 11, 5) },
      ]},
      { name: 'Borbet', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'ATS', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Ronal', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Rial', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Dezent', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Alutec', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
    ],
  },
];

// Neutrale Startgrößen (immer verfügbar, herstellerunabhängig).
export const GENERIC = [
  { label: 'Klein · 54 mm', values: CAP(54, 50, 11, 5) },
  { label: 'Standard · 60 mm', values: CAP(60, 56) },
  { label: 'Mittel · 65 mm', values: CAP(65, 60) },
  { label: 'Groß · 68 mm', values: CAP(68, 63, 14, 8) },
  { label: 'XL · 75 mm', values: CAP(75, 70, 15, 8) },
];
