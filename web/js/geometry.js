// Nabendeckel-Geometrie mit manifold-3d (garantiert wasserdicht/manifold).
// Aufbau in Z-up (Manifold-nativ); Ausgabe wird für die App auf Y-up gedreht.

import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

let wasm = null;
async function MF() {
  if (!wasm) {
    const mod = await import('https://cdn.jsdelivr.net/npm/manifold-3d@3.0.1/manifold.js');
    wasm = await mod.default();
    wasm.setup();
  }
  return wasm;
}
export function initGeometry() { return MF(); }

// Abgeleitete Maße (auch für Warnungen in app.js genutzt).
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

// ---- Hilfen ----
function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; a += x1 * y2 - x2 * y1; }
  return a / 2;
}
// CrossSection aus (x,y)-Punkten, immer CCW (gefüllt).
function cs(pts) {
  const p = signedArea(pts) < 0 ? pts.slice().reverse() : pts;
  return new wasm.CrossSection([p], 'Positive');
}
function ngon(radius, n, rot) {
  const out = [];
  for (let i = 0; i < n; i++) { const a = rot + i * 2 * Math.PI / n; out.push([radius * Math.cos(a), radius * Math.sin(a)]); }
  return out;
}
// Manifold -> THREE (Z-up -> Y-up)
function toThree(man) {
  const m = man.getMesh();
  const np = m.numProp, nv = m.numVert;
  const pos = new Float32Array(nv * 3);
  for (let i = 0; i < nv; i++) { pos[3 * i] = m.vertProperties[np * i]; pos[3 * i + 1] = m.vertProperties[np * i + 1]; pos[3 * i + 2] = m.vertProperties[np * i + 2]; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(new THREE.BufferAttribute(new Uint32Array(m.triVerts), 1));
  geo.rotateX(-Math.PI / 2);            // Z-up -> Y-up
  geo.computeVertexNormals();
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  return geo;
}
// Winzige, lose Fragmente (Boolean-Debris) entfernen -> sauberes, wasserdichtes Netz.
function cleanup(man, trash) {
  const parts = man.decompose();
  if (parts.length <= 1) { parts.forEach(x => trash.push(x)); return man; }
  const kept = [];
  for (const pp of parts) { if (pp.volume() > 0.3) kept.push(pp); trash.push(pp); }
  if (!kept.length) return man;
  const res = wasm.Manifold.compose(kept);
  trash.push(res);
  return res;
}

// THREE-Extrudier-Geometrie (Logo, +Z, z in [0,depth]) -> Manifold
function threeToManifold(geo) {
  let g = geo.clone();
  g.deleteAttribute('normal'); g.deleteAttribute('uv');
  g = mergeVertices(g, 1e-4);
  const mesh = new wasm.Mesh({ numProp: 3, vertProperties: new Float32Array(g.attributes.position.array), triVerts: new Uint32Array(g.index.array) });
  return wasm.Manifold.ofMesh(mesh);
}

export async function buildCap(p, logo) {
  const w = await MF();
  const { Manifold } = w;
  const d = derive(p);
  const seg = Math.max(64, Math.min(240, Math.round(p.resolution || 120)));
  const trash = [];
  const T = (m) => { trash.push(m); return m; };

  try {
    // 1) Körper (ein Rotationskörper: Platte + Schürze mit Kavität)
    const c = Math.max(0, d.chamfer);
    const prof = [
      [0, d.H], [d.topR - c, d.H], [d.topR, d.H - c], [d.topR, d.skirtH], [d.skirtR, d.skirtH],
      [d.skirtR, d.ledgeZ], [d.barbR, d.ledgeZ], [d.skirtR, d.rampZ], [d.skirtR, 0],
      [d.innerR, 0], [d.innerR, d.skirtH], [0, d.skirtH],
    ];
    const bodyCS = T(cs(prof));
    let body = T(Manifold.revolve(bodyCS, seg));

    // 2) Lücken (Clips)
    for (let i = 0; i < p.clipCount; i++) {
      const center = i * d.pitch + d.pitch / 2;
      const pts = [[0, 0]];
      const steps = Math.max(4, Math.round(d.gapW / 5));
      for (let k = 0; k <= steps; k++) {
        const a = (-d.gapW / 2 + d.gapW * k / steps + center) * Math.PI / 180;
        pts.push([(d.barbR + 3) * Math.cos(a), (d.barbR + 3) * Math.sin(a)]);
      }
      const gapCS = T(cs(pts));
      const gap = T(Manifold.extrude(gapCS, d.skirtH + 0.5).translate([0, 0, -0.5]));
      body = T(body.subtract(gap));
    }

    // 3) CenterLock: polygonale „Mutter" + runde Plattform
    const isNut = p.capProfile === 'dome';
    let topZ = d.H;
    let outlineBaseR = d.topR;
    if (isNut) {
      const N = Math.max(3, Math.round(p.nutSides));
      const nutR = Math.max(3, Math.min(p.polygonSize / 2, d.topR - 0.5));
      const domeH = Math.max(0.5, p.domeHeight);
      const platR = Math.min(Math.max(2, p.platformDiameter / 2), nutR);
      const round = Math.max(0, Math.min(0.6, p.rounding || 0));
      const platH = 1.2;
      const nutCS = T(cs(ngon(nutR, N, Math.PI / N)));
      // Fase nur an der oberen Kante -> Seiten bleiben senkrecht (klares Polygon).
      const ch = round * Math.min(domeH * 0.8, nutR * 0.5);
      const bodyH = Math.max(0.2, domeH - ch);
      let nut = T(Manifold.extrude(nutCS, bodyH).translate([0, 0, d.H]));
      if (ch > 0.05) {
        const topScale = Math.max(0.25, (nutR - ch) / nutR);
        const cap = T(Manifold.extrude(nutCS, ch, 1, 0, [topScale, topScale]).translate([0, 0, d.H + bodyH]));
        nut = T(nut.add(cap));
      }
      body = T(body.add(nut));
      const plat = T(Manifold.cylinder(platH, platR, platR, seg).translate([0, 0, d.H + domeH]));
      body = T(body.add(plat));
      topZ = d.H + domeH + platH;
      outlineBaseR = platR;
    }

    // 4) Logo-Vertiefung (Teller)
    if (logo && logo.geometry && p.logoRecessDepth > 0) {
      const rr = p.logoRecessDiameter / 2;
      const rec = T(Manifold.cylinder(p.logoRecessDepth + 0.4, rr, rr, seg).translate([0, 0, topZ - p.logoRecessDepth]));
      body = T(body.subtract(rec));
    }

    // 5) Logo + Outline
    let logoGeo = null;
    if (logo && logo.geometry) {
      const depth = Math.max(0.4, p.logoDepth);
      const surfaceZ = topZ - (p.logoRecessDepth > 0 ? p.logoRecessDepth : 0);
      let elem = null;
      try {
        let lg = T(threeToManifold(logo.geometry));
        lg = T(lg.rotate([0, 0, p.logoRotation]).translate([p.logoOffsetX, p.logoOffsetY, 0]));
        elem = lg;
      } catch (e) { /* Logo nicht manifold -> ignorieren */ }

      if (p.outlineWidth > 0) {
        const outer = Math.min(outlineBaseR - p.outlineGap, outlineBaseR - 0.5);
        const inner = Math.max(1, outer - p.outlineWidth);
        if (outer > inner) {
          const ring = T(Manifold.cylinder(depth, outer, outer, seg).subtract(Manifold.cylinder(depth + 0.4, inner, inner, seg).translate([0, 0, -0.2])));
          elem = elem ? T(elem.add(ring)) : ring;
        }
      }

      if (elem) {
        if (p.logoStyle === 'engraved') {
          const cut = T(elem.translate([0, 0, surfaceZ - depth + 0.15]));
          body = T(body.subtract(cut));
        } else if (p.logoStyle === 'flush') {
          const inlay = T(elem.translate([0, 0, surfaceZ - depth]));
          const cut = T(elem.scale([1, 1, (depth + 0.4) / depth]).translate([0, 0, surfaceZ - depth]));
          body = T(body.subtract(cut));
          logoGeo = toThree(inlay);
        } else { // raised
          logoGeo = toThree(T(elem.translate([0, 0, surfaceZ - 0.1])));
        }
      }
    }

    const bodyGeo = toThree(cleanup(body, trash));
    return { body: bodyGeo, logo: logoGeo };
  } finally {
    for (const m of trash) { try { m.delete(); } catch (e) {} }
  }
}
