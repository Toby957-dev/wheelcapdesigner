// Baut die Nabendeckel-Geometrie aus den Parametern.
// Rückgabe: { body, logo } – zwei getrennte Geometrien (für getrennte Farben/Bauteile).
// Höhe liegt entlang der Y-Achse (Three.js-nativ). Export dreht später auf Z-up.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Brush, Evaluator, ADDITION, SUBTRACTION } from 'three-bvh-csg';

const evaluator = new Evaluator();
evaluator.attributes = ['position', 'normal'];

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

function buildSkirt(d) {
  const loop = [
    [d.innerR, 0], [d.skirtR, 0], [d.skirtR, d.rampZ], [d.barbR, d.ledgeZ],
    [d.skirtR, d.ledgeZ], [d.skirtR, d.skirtH], [d.innerR, d.skirtH], [d.innerR, 0],
  ].map(([r, z]) => new THREE.Vector2(Math.max(0, r), z));
  return new THREE.LatheGeometry(loop, 160);
}

function buildPlate(d) {
  const c = Math.max(0, d.chamfer);
  const z0 = d.skirtH - 0.3;
  const prof = [
    [0, z0], [d.topR, z0], [d.topR, d.H - c], [d.topR - c, d.H], [0, d.H],
  ].map(([r, z]) => new THREE.Vector2(Math.max(0, r), z));
  return new THREE.LatheGeometry(prof, 160);
}

function buildGap(d, centerDeg) {
  const a0 = THREE.MathUtils.degToRad(centerDeg - d.gapW / 2);
  const a1 = THREE.MathUtils.degToRad(centerDeg + d.gapW / 2);
  const shape = new THREE.Shape();
  shape.absarc(0, 0, d.barbR + 3, a0, a1, false);
  shape.absarc(0, 0, 0.1, a1, a0, true);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d.skirtH + 0.3, bevelEnabled: false, curveSegments: 24 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -0.3, 0);
  return geo;
}

// Ring (Annulus) entlang +Z extrudiert, zentriert.
function buildRing(inner, outer, depth) {
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, Math.max(0.1, inner), 0, Math.PI * 2, true);
  s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 128 });
}

// CenterLock: erhöhter, angeschrägter Dom (Frustum) auf der Deckplatte.
function buildDome(d, p) {
  const domeH = Math.max(0.5, p.domeHeight);
  const platR = Math.min(Math.max(2, p.platformDiameter / 2), d.topR - 1);
  const baseR = Math.max(platR + 0.5, Math.min(d.topR - p.flangeWidth, d.topR - 0.5));
  const topZ = d.H + domeH;
  const prof = [
    [0, topZ], [platR, topZ], [baseR, d.H - 0.3], [0, d.H - 0.3],
  ].map(([r, z]) => new THREE.Vector2(Math.max(0, r), z));
  return new THREE.LatheGeometry(prof, 160);
}

function finalize(brushOrGeo) {
  const g = (brushOrGeo.geometry ? brushOrGeo.geometry : brushOrGeo).clone();
  g.computeVertexNormals(); g.computeBoundingBox(); g.computeBoundingSphere();
  return g;
}

// Zweitfarb-Element (Logo + optionale Rand-Outline) im lokalen Raum: liegend, y in [0, depth].
function buildElement(p, d, logo, outlineBaseR) {
  const depth = Math.max(0.4, p.logoDepth);
  const parts = [];

  if (logo && logo.geometry) {
    const lg = logo.geometry.clone();
    lg.rotateX(-Math.PI / 2);                                   // -> liegend, y in [0, depth]
    lg.rotateY(THREE.MathUtils.degToRad(p.logoRotation));
    lg.translate(p.logoOffsetX, 0, -p.logoOffsetY);
    parts.push(lg);
  }

  if (p.outlineWidth > 0) {
    const outer = Math.min(outlineBaseR - p.outlineGap, outlineBaseR - 0.5);
    const inner = Math.max(1, outer - p.outlineWidth);
    if (outer > inner) {
      const rg = buildRing(inner, outer, depth);
      rg.rotateX(-Math.PI / 2);                                  // liegend, zentriert am Deckel
      parts.push(rg);
    }
  }

  if (!parts.length) return null;
  return { geo: parts.length > 1 ? mergeGeometries(parts, false) : parts[0], depth };
}

export function buildCap(p, logo) {
  const d = derive(p);

  // 1) Schürze -> Clips
  let skirt = new Brush(buildSkirt(d)); skirt.updateMatrixWorld();
  const gaps = [];
  for (let i = 0; i < p.clipCount; i++) gaps.push(buildGap(d, i * d.pitch + d.pitch / 2));
  const gapsBrush = new Brush(mergeGeometries(gaps, false)); gapsBrush.updateMatrixWorld();
  let result = evaluator.evaluate(skirt, gapsBrush, SUBTRACTION);

  // 2) Deckplatte
  const plate = new Brush(buildPlate(d)); plate.updateMatrixWorld();
  result = evaluator.evaluate(result, plate, ADDITION);

  // 2b) CenterLock: Dom aufsetzen
  const isDome = p.capProfile === 'dome';
  const topZ = isDome ? d.H + Math.max(0.5, p.domeHeight) : d.H;
  const platR = Math.min(Math.max(2, p.platformDiameter / 2), d.topR - 1);
  const outlineBaseR = isDome ? platR : d.topR;
  if (isDome) {
    const dome = new Brush(buildDome(d, p)); dome.updateMatrixWorld();
    result = evaluator.evaluate(result, dome, ADDITION);
  }

  // 3) Logo-Vertiefung (Teller)
  if (p.logoMode !== 'none' && p.logoRecessDepth > 0) {
    const rec = new THREE.CylinderGeometry(p.logoRecessDiameter / 2, p.logoRecessDiameter / 2, p.logoRecessDepth + 0.2, 96);
    rec.translate(0, topZ - p.logoRecessDepth / 2 + 0.1, 0);
    const rb = new Brush(rec); rb.updateMatrixWorld();
    result = evaluator.evaluate(result, rb, SUBTRACTION);
  }

  // 4) Logo + Outline je nach Stil
  let logoGeo = null;
  if (p.logoMode !== 'none') {
    const el = buildElement(p, d, logo, outlineBaseR);
    if (el) {
      const surfaceY = topZ - (p.logoRecessDepth > 0 ? p.logoRecessDepth : 0);
      const depth = el.depth;

      if (p.logoStyle === 'raised') {
        const g = el.geo; g.translate(0, surfaceY - 0.1, 0);   // leicht eintauchen für Verbund
        logoGeo = g;

      } else if (p.logoStyle === 'engraved') {
        const g = el.geo; g.translate(0, surfaceY - depth + 0.15, 0);
        const b = new Brush(g); b.updateMatrixWorld();
        result = evaluator.evaluate(result, b, SUBTRACTION);

      } else { // flush / "Plan": bündige Einlage, geht `depth` mm ins Material
        const inlay = el.geo; inlay.translate(0, surfaceY - depth, 0);   // Oberkante = Deckelfläche
        // Tasche schneiden: Kopie, die oben über die Fläche hinausragt (sauberes Öffnen)
        const cut = inlay.clone();
        cut.translate(0, -(surfaceY - depth), 0);              // -> y in [0, depth]
        cut.scale(1, (depth + 0.3) / depth, 1);               // -> y in [0, depth+0.3]
        cut.translate(0, surfaceY - depth, 0);                // -> y in [surfaceY-depth, surfaceY+0.3]
        const b = new Brush(cut); b.updateMatrixWorld();
        result = evaluator.evaluate(result, b, SUBTRACTION);
        logoGeo = inlay;
      }
    }
  }

  return { body: finalize(result), logo: logoGeo ? finalize(logoGeo) : null };
}
