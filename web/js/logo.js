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
      const g = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.1, depth), bevelEnabled: false, curveSegments: 24 });
      geos.push(g);
    }
  }
  if (!geos.length) throw new Error('Keine Flächen im SVG gefunden (nur Konturen/Strokes? -> in Pfade umwandeln).');
  let geo = geos.length === 1 ? geos[0] : mergeGeometries(geos, false);
  // SVG hat Y nach unten -> spiegeln, damit das Logo aufrecht steht.
  geo.scale(1, -1, 1);
  return fitAndCenter(geo, targetSize);
}

// Text -> extrudierte Geometrie.
export async function textToGeometry(text, depth, targetSize) {
  const font = await loadFont();
  const geo = new TextGeometry(text || ' ', {
    font, size: 10, height: Math.max(0.1, depth), curveSegments: 8,
    bevelEnabled: false,
  });
  return fitAndCenter(geo, targetSize);
}
