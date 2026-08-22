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

// Ring (Annulus) als Outline um das Logo – entlang +Z extrudiert, zentriert.
function buildRing(inner, outer, depth) {
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, Math.max(0.1, inner), 0, Math.PI * 2, true);
  s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 96 });
}

function finalize(brushOrGeo) {
  const g = (brushOrGeo.geometry ? brushOrGeo.geometry : brushOrGeo).clone();
  g.computeVertexNormals(); g.computeBoundingBox(); g.computeBoundingSphere();
  return g;
}

// Logo (+ optionale Outline) im lokalen Raum aufbauen: zentriert, entlang +Z extrudiert.
function buildLogoLocal(p, logo) {
  let lg = logo.geometry.clone();
  const depth = Math.max(0.1, p.logoDepth);
  if (p.outlineWidth > 0) {
    lg.computeBoundingBox();
    const bb = lg.boundingBox;
    const r = 0.5 * Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y);
    const ring = buildRing(r + p.outlineGap, r + p.outlineGap + p.outlineWidth, depth);
    lg = mergeGeometries([lg, ring], false);
  }
  return lg;
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

  // 3) Logo-Vertiefung (Teller)
  if (p.logoMode !== 'none' && p.logoRecessDepth > 0) {
    const rec = new THREE.CylinderGeometry(p.logoRecessDiameter / 2, p.logoRecessDiameter / 2, p.logoRecessDepth + 0.2, 96);
    rec.translate(0, d.H - p.logoRecessDepth / 2 + 0.1, 0);
    const rb = new Brush(rec); rb.updateMatrixWorld();
    result = evaluator.evaluate(result, rb, SUBTRACTION);
  }

  // 4) Logo
  let logoGeo = null;
  if (logo && logo.geometry) {
    const surfaceY = d.H - (p.logoRecessDepth > 0 ? p.logoRecessDepth : 0);
    const g = buildLogoLocal(p, logo);
    g.rotateX(-Math.PI / 2);
    g.rotateY(THREE.MathUtils.degToRad(p.logoRotation));
    g.translate(p.logoOffsetX, 0, -p.logoOffsetY);

    if (p.logoStyle === 'engraved') {
      // in den Deckel gravieren (kein separates Mesh)
      g.translate(0, surfaceY + 0.1, 0);
      const b = new Brush(g); b.updateMatrixWorld();
      result = evaluator.evaluate(result, b, SUBTRACTION);
    } else {
      // erhaben: eigenes Mesh, leicht in die Oberfläche eintauchen für Verbund
      g.translate(0, surfaceY - 0.1, 0);
      logoGeo = g;
    }
  }

  return { body: finalize(result), logo: logoGeo ? finalize(logoGeo) : null };
}
