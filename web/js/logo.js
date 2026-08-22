// Erzeugt aus einem SVG oder Text eine zentrierte, aufrechte, entlang +Z extrudierte Geometrie.

import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let fontPromise = null;
function loadFont() {
  if (!fontPromise) {
    const url = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';
    fontPromise = new Promise((res, rej) => new FontLoader().load(url, res, undefined, rej));
  }
  return fontPromise;
}

// Vorzeichen-Volumen: negativ = Flächen zeigen nach innen (nach Spiegelung/CSG problematisch).
function signedVolume(geo) {
  const p = geo.attributes.position, idx = geo.index;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(); let v = 0;
  const tri = (i, j, k) => { a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, j); c.fromBufferAttribute(p, k); v += a.dot(b.clone().cross(c)) / 6; };
  if (idx) for (let i = 0; i < idx.count; i += 3) tri(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
  else for (let i = 0; i < p.count; i += 3) tri(i, i + 1, i + 2);
  return v;
}
// Sorgt für nach außen zeigende Flächen (damit boolesche Operationen korrekt funktionieren).
function ensureOutward(geo) {
  let g = geo.index ? geo.toNonIndexed() : geo;
  if (signedVolume(g) < 0) {
    const pos = g.attributes.position.array;
    for (let i = 0; i < pos.length; i += 9) {
      for (let k = 0; k < 3; k++) { const t = pos[i + 3 + k]; pos[i + 3 + k] = pos[i + 6 + k]; pos[i + 6 + k] = t; }
    }
    g.attributes.position.needsUpdate = true;
  }
  g.computeVertexNormals();
  return g;
}

// Zentriert eine XY-Geometrie und skaliert sie proportional auf Zielbreite/-höhe.
function fitAndCenter(geo, targetSize) {
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const w = bb.max.x - bb.min.x;
  const h = bb.max.y - bb.min.y;
  const cx = (bb.max.x + bb.min.x) / 2;
  const cy = (bb.max.y + bb.min.y) / 2;
  geo.translate(-cx, -cy, 0);
  const s = targetSize / Math.max(w, h);
  geo.scale(s, s, 1);
  return geo;
}

// SVG-Text -> extrudierte Geometrie (entlang +Z, Höhe = depth).
export function svgToGeometry(svgText, depth, targetSize) {
  const data = new SVGLoader().parse(svgText);
  const geos = [];
  for (const path of data.paths) {
    const shapes = SVGLoader.createShapes(path);
    for (const shape of shapes) {
      const g = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.1, depth), bevelEnabled: false, curveSegments: 96, steps: 1 });
      geos.push(g);
    }
  }
  if (!geos.length) throw new Error('Keine Flächen im SVG gefunden (nur Konturen/Strokes? -> in Pfade umwandeln).');
  let geo = geos.length === 1 ? geos[0] : mergeGeometries(geos, false);
  // SVG hat Y nach unten -> spiegeln, damit das Logo aufrecht steht.
  geo.scale(1, -1, 1);
  return ensureOutward(fitAndCenter(geo, targetSize));
}

// Text -> extrudierte Geometrie.
export async function textToGeometry(text, depth, targetSize) {
  const font = await loadFont();
  const geo = new TextGeometry(text || ' ', {
    font, size: 10, height: Math.max(0.1, depth), curveSegments: 16,
    bevelEnabled: false,
  });
  return ensureOutward(fitAndCenter(geo, targetSize));
}
