// Maß-Bibliothek nach Herstellern.
// WICHTIG: Richtwerte aus gängigen Nabendeckel-Sortimenten / Aftermarket – KEINE Garantie.
// Der Klemm-Ø (~56/57 mm) ist bei VW/Audi/Seat/Škoda/Opel weitgehend Standard.
// Immer am Rad nachmessen; Klemm-Ø = entscheidend für den Sitz.
//
// values: outerDiameter = Außen-Ø, mountDiameter = Klemm-/Montage-Ø.

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
        { label: '76 / 71 mm (älter, groß)', values: CAP(76, 71, 15, 8) },
      ]},
      { name: 'Audi', entries: [
        { label: '60 / 57 mm', values: CAP(60, 57) },
        { label: '61 / 57 mm', values: CAP(61, 57) },
        { label: '69 / 56 mm', values: CAP(69, 56) },
        { label: '68 / 64 mm', values: CAP(68, 64, 13, 6) },
        { label: '74 / 70 mm (groß)', values: CAP(74, 70, 14, 8) },
      ]},
      { name: 'BMW', entries: [
        { label: '68 / 64 mm (E-/F-Reihe)', values: CAP(68, 64, 13, 6) },
        { label: '56 / 52 mm (G-Reihe)', values: CAP(56, 52, 11, 5) },
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Mercedes-Benz', entries: [
        { label: '75 / 70 mm', values: CAP(75, 70, 14, 8) },
        { label: '66,8 / 62 mm', values: CAP(66.8, 62, 13, 6) },
        { label: '72 / 67 mm', values: CAP(72, 67, 14, 8) },
      ]},
      { name: 'Opel', entries: [
        { label: '65 / 56 mm', values: CAP(65, 56) },
        { label: '64 / 60 mm', values: CAP(64, 60) },
        { label: '56 / 52 mm', values: CAP(56, 52, 11, 5) },
      ]},
      { name: 'Ford', entries: [
        { label: '54 / 50 mm', values: CAP(54, 50, 11, 5) },
        { label: '55 / 51 mm', values: CAP(55, 51, 11, 5) },
        { label: '58 / 54 mm', values: CAP(58, 54) },
        { label: '65 / 60 mm', values: CAP(65, 60) },
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
        { label: '57 / 54 mm', values: CAP(57, 54, 11, 5) },
        { label: '64 / 59 mm', values: CAP(64, 59) },
      ]},
      { name: 'Honda', entries: [
        { label: '58 / 54 mm', values: CAP(58, 54) },
        { label: '69 / 64 mm', values: CAP(69, 64, 13, 6) },
      ]},
      { name: 'Nissan', entries: [
        { label: '60 / 54 mm', values: CAP(60, 54) },
        { label: '54 / 50 mm', values: CAP(54, 50, 11, 5) },
      ]},
      { name: 'Mazda', entries: [
        { label: '56 / 52 mm', values: CAP(56, 52, 11, 5) },
        { label: '65 / 60 mm', values: CAP(65, 60) },
      ]},
      { name: 'Hyundai', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
        { label: '58 / 54 mm', values: CAP(58, 54) },
      ]},
      { name: 'Kia', entries: [
        { label: '58 / 54 mm', values: CAP(58, 54) },
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Renault / Dacia', entries: [
        { label: '57 / 52 mm', values: CAP(57, 52, 11, 5) },
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Peugeot / Citroën', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
        { label: '65 / 60 mm', values: CAP(65, 60) },
      ]},
      { name: 'Fiat', entries: [
        { label: '55 / 50 mm', values: CAP(55, 50, 11, 5) },
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Volvo', entries: [
        { label: '64 / 60 mm', values: CAP(64, 60) },
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Mini', entries: [
        { label: '55 / 51 mm', values: CAP(55, 51, 11, 5) },
      ]},
      { name: 'Porsche', entries: [
        { label: '76 / 71 mm', values: CAP(76, 71, 15, 8) },
        { label: '65 / 60 mm', values: CAP(65, 60) },
      ]},
      { name: 'Tesla', entries: [
        { label: '58 / 54 mm (Model 3/Y)', values: CAP(58, 54) },
      ]},
      { name: 'Subaru', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Mitsubishi', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
      ]},
      { name: 'Suzuki', entries: [
        { label: '54 / 50 mm', values: CAP(54, 50, 11, 5) },
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
      { name: 'Enkei', entries: [
        { label: '62 / 57 mm', values: CAP(62, 57) },
      ]},
      { name: 'Borbet', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'ATS', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
        { label: '70 / 65 mm', values: CAP(70, 65, 13, 8) },
      ]},
      { name: 'Ronal', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Rial', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Dezent', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Alutec', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'AEZ', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Dotz', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'MAM', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Autec', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Keskin', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Oxigin', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Wheelworld', entries: [{ label: '60 / 56 mm', values: CAP(60, 56) }] },
      { name: 'Brock / RC Design', entries: [
        { label: '60 / 56 mm', values: CAP(60, 56) },
        { label: '68 / 64 mm', values: CAP(68, 64, 13, 6) },
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
