// Baut die Nabendeckel-Geometrie aus den Parametern.
// Höhe liegt entlang der Y-Achse (Three.js-nativ). Export dreht später auf Z-up.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Brush, Evaluator, ADDITION, SUBTRACTION } from 'three-bvh-csg';

const evaluator = new Evaluator();
evaluator.attributes = ['position', 'normal'];

// Abgeleitete Maße aus den Rohparametern.
export function derive(p) {
  const topR = p.outerDiameter / 2;
  const skirtR = p.mountDiameter / 2 - p.tolerance;
  const innerR = Math.max(1, skirtR - p.clipThickness);
  const barbR = p.mountDiameter / 2 + p.barbDepth;
  const skirtH = Math.max(1, p.totalHeight - p.faceThickness);
  const ledgeZ = Math.max(p.barbRamp + 0.2, skirtH - p.gripThickness);
  const rampZ = Math.max(0.1, ledgeZ - p.barbRamp);
  const pitch = 360 / p.clipCount;
  const clipW = Math.min(p.clipWidthDeg, pitch - 2);
  const gapW = Math.max(1, pitch - clipW);
  const chamfer = Math.min(p.topChamfer, topR - 0.5, p.faceThickness - 0.1);
  return { topR, skirtR, innerR, barbR, skirtH, ledgeZ, rampZ, pitch, clipW, gapW, chamfer, H: p.totalHeight };
}

// Nur der Schürzenring (mit Rastnase) – ohne Deckplatte. Geschlossener Querschnitt -> Rotationskörper.
function buildSkirt(d) {
  const loop = [
    [d.innerR, 0],
    [d.skirtR, 0],
    [d.skirtR, d.rampZ],
    [d.barbR, d.ledgeZ],
    [d.skirtR, d.ledgeZ],
    [d.skirtR, d.skirtH],
    [d.innerR, d.skirtH],
    [d.innerR, 0], // Schleife schließen
  ].map(([r, z]) => new THREE.Vector2(Math.max(0, r), z));
  return new THREE.LatheGeometry(loop, 160);
}

// Deckplatte als eigener Rotationskörper (mit oberer Fase), überlappt die Schürze leicht nach unten.
function buildPlate(d) {
  const c = Math.max(0, d.chamfer);
  const z0 = d.skirtH - 0.3;
  const prof = [
    [0, z0],
    [d.topR, z0],
    [d.topR, d.H - c],
    [d.topR - c, d.H],
    [0, d.H],
  ].map(([r, z]) => new THREE.Vector2(Math.max(0, r), z));
  return new THREE.LatheGeometry(prof, 160);
}

// Ein Keil-Zwischenraum zwischen zwei Clips (Kreissektor, entlang Y extrudiert).
function buildGap(d, centerDeg) {
  const a0 = THREE.MathUtils.degToRad(centerDeg - d.gapW / 2);
  const a1 = THREE.MathUtils.degToRad(centerDeg + d.gapW / 2);
  const rIn = 0.1;
  const rOut = d.barbR + 3;

  const shape = new THREE.Shape();
  shape.absarc(0, 0, rOut, a0, a1, false);
  shape.absarc(0, 0, rIn, a1, a0, true);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, { depth: d.skirtH + 0.6, bevelEnabled: false, curveSegments: 24 });
  geo.rotateX(-Math.PI / 2);            // Extrusion (Z) -> Höhe (Y): y in [0, skirtH+0.6]
  geo.translate(0, -0.3, 0);            // -> y in [-0.3, skirtH+0.3]: schneidet die ganze Schürze
  return geo;
}

// Erzeugt die finale BufferGeometry. logo = { geometry (entlang +Z extrudiert, zentriert) } | null
export function buildCap(p, logo) {
  const d = derive(p);

  // 1) Schürze bauen und Zwischenräume herausschneiden -> Clips
  let skirt = new Brush(buildSkirt(d));
  skirt.updateMatrixWorld();
  const gaps = [];
  for (let i = 0; i < p.clipCount; i++) gaps.push(buildGap(d, i * d.pitch + d.pitch / 2));
  const gapsBrush = new Brush(mergeGeometries(gaps, false));
  gapsBrush.updateMatrixWorld();
  let result = evaluator.evaluate(skirt, gapsBrush, SUBTRACTION);

  // 2) Deckplatte oben aufsetzen
  const plate = new Brush(buildPlate(d));
  plate.updateMatrixWorld();
  result = evaluator.evaluate(result, plate, ADDITION);

  // 3) Vertiefung für das Logo
  if (p.logoMode !== 'none' && p.logoRecessDepth > 0) {
    const rec = new THREE.CylinderGeometry(p.logoRecessDiameter / 2, p.logoRecessDiameter / 2, p.logoRecessDepth + 0.2, 96);
    rec.translate(0, d.H - p.logoRecessDepth / 2 + 0.1, 0);
    const recBrush = new Brush(rec); recBrush.updateMatrixWorld();
    result = evaluator.evaluate(result, recBrush, SUBTRACTION);
  }

  // 4) Logo einbauen. logo.geometry ist zentriert, aufrecht, entlang +Z extrudiert.
  if (logo && logo.geometry) {
    const surfaceY = d.H - (p.logoRecessDepth > 0 ? p.logoRecessDepth : 0);
    const g = logo.geometry.clone();
    g.rotateX(-Math.PI / 2);                 // flach legen: Extrusion (Z) -> Höhe (Y)
    g.rotateY(THREE.MathUtils.degToRad(p.logoRotation));
    g.translate(p.logoOffsetX, 0, -p.logoOffsetY);

    if (p.logoStyle === 'engraved') {
      g.translate(0, surfaceY + 0.1, 0);
      const b = new Brush(g); b.updateMatrixWorld();
      result = evaluator.evaluate(result, b, SUBTRACTION);
    } else {
      g.translate(0, surfaceY - 0.1, 0);
      const b = new Brush(g); b.updateMatrixWorld();
      result = evaluator.evaluate(result, b, ADDITION);
    }
  }

  const finalGeo = result.geometry.clone();
  finalGeo.computeVertexNormals();
  finalGeo.computeBoundingBox();
  finalGeo.computeBoundingSphere();
  return finalGeo;
}
