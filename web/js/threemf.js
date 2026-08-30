// Minimaler 3MF-Export: eine Datei, mehrere Objekte + Farben (basematerials).
// Ideal für Bambu Studio – beide Teile bleiben zueinander positioniert und farbig.

import * as THREE from 'three';
import { zipSync, strToU8 } from 'https://esm.sh/fflate@0.8.2';

const CT = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`;

const f = (n) => (Math.round(n * 1000) / 1000);

function meshXML(geo) {
  const g0 = geo.clone();
  g0.rotateX(-Math.PI / 2); // Y-up -> Z-up (Druckbett)
  const pos = g0.attributes.position, idx = g0.index;
  const v = [], t = [];
  for (let i = 0; i < pos.count; i++) v.push(`<vertex x="${f(pos.getX(i))}" y="${f(pos.getY(i))}" z="${f(pos.getZ(i))}"/>`);
  if (idx) for (let i = 0; i < idx.count; i += 3) t.push(`<triangle v1="${idx.getX(i)}" v2="${idx.getX(i + 1)}" v3="${idx.getX(i + 2)}"/>`);
  else for (let i = 0; i < pos.count; i += 3) t.push(`<triangle v1="${i}" v2="${i + 1}" v3="${i + 2}"/>`);
  return `<mesh><vertices>${v.join('')}</vertices><triangles>${t.join('')}</triangles></mesh>`;
}

// parts: [{ geometry, color: '#rrggbb', name }]
export function export3MF(parts) {
  const bases = parts.map(p => `<base name="${p.name}" displaycolor="${p.color.toUpperCase()}FF"/>`).join('');
  let objects = '', items = '';
  parts.forEach((p, i) => {
    const id = i + 2; // 1 = basematerials
    objects += `<object id="${id}" type="model" pid="1" pindex="${i}">${meshXML(p.geometry)}</object>`;
    items += `<item objectid="${id}"/>`;
  });
  const model = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
 <resources>
  <basematerials id="1">${bases}</basematerials>
  ${objects}
 </resources>
 <build>${items}</build>
</model>`;

  const zipped = zipSync({
    '[Content_Types].xml': strToU8(CT),
    '_rels/.rels': strToU8(RELS),
    '3D/3dmodel.model': strToU8(model),
  }, { level: 6 });
  return new Blob([zipped], { type: 'model/3mf' });
}
