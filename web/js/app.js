import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DEFAULTS, GROUPS } from './config.js';
import { BRAND_LIBRARY, GENERIC } from './brands.js';
import { loadUserPresets, saveUserPreset, deleteUserPreset, proposalJSON } from './userPresets.js';
import { supabaseEnabled, fetchCommunityGroup, submitProposal } from './supabase.js';
import { buildCap, derive } from './geometry.js';
import { svgToGeometry, textToGeometry } from './logo.js';

const SUBMIT_EMAIL = 'vorlagen@example.com';

// Mitgelieferte Beispiel-/Bibliotheks-SVGs (unter web/logos/).
// Eigene oder lizenzierte Marken-Logos hier ergänzen (Rechte beachten!).
const LOGO_LIBRARY = [
  { label: 'Beispiel: Stern', file: 'logos/star.svg' },
  { label: 'Beispiel: Blitz', file: 'logos/bolt.svg' },
];

const ICONS = {
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v3M10 7v5M14 7v3M18 7v5"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v6M12 21v-4M5 8l3 3M19 8l-3 3M4 15h4M16 15h4"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.9 6.9 20l1.5-6.3L3.5 9.5 9.9 9z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18 2 2 0 0 0 2-2 2 2 0 0 1 2-2h1a4 4 0 0 0 4-4 9 9 0 0 0-9-8z"/><circle cx="7.5" cy="12" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/></svg>',
};

const state = { ...DEFAULTS };
let mode = localStorage.getItem('nd_mode') || 'standard';
let logoSvgText = null, logoFileName = null;
const inputs = {}, controlEls = {};
let library = BRAND_LIBRARY.slice();
let refreshBrands = () => {};

// ============ 3D ============
const canvas = document.getElementById('viewport');
const stage = canvas.parentElement;
let renderer, scene, camera, controls, capMesh, logoMesh, capMaterial, logoMaterial;
const exporter = new STLExporter();

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  camera = new THREE.PerspectiveCamera(38, stage.clientWidth / stage.clientHeight, 0.5, 2000);
  camera.position.set(75, 60, 95);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.target.set(0, 5, 0); controls.minDistance = 20; controls.maxDistance = 600;

  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(50, 80, 60); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbcd0ff, 0.7); fill.position.set(-60, 30, -40); scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x20242c, 0.5));
  const grid = new THREE.GridHelper(400, 40, 0x2a2f38, 0x1c2027); grid.position.y = -0.01; scene.add(grid);

  capMaterial = new THREE.MeshStandardMaterial({ color: state.capColor, roughness: 0.52, metalness: 0.02 });
  logoMaterial = new THREE.MeshStandardMaterial({ color: state.logoColor, roughness: 0.45, metalness: 0.02, polygonOffset: true, polygonOffsetFactor: -1 });

  addEventListener('resize', onResize);
  new ResizeObserver(onResize).observe(stage);
  animate();
}

function onResize() {
  const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }
function applyColors() { capMaterial.color.set(state.capColor); logoMaterial.color.set(state.logoColor); }

// ============ Controls ============
function fmt(v, step) { const dec = (String(step).split('.')[1] || '').length; return Number(v).toFixed(dec); }

function makeControl(meta) {
  const wrap = document.createElement('div'); wrap.className = 'control'; controlEls[meta.key] = wrap;
  if (meta.type === 'select') {
    wrap.innerHTML = `<div class="row"><label>${meta.label}</label></div>`;
    const sel = document.createElement('select'); sel.className = 'ctl';
    for (const o of meta.options) sel.innerHTML += `<option value="${o.value}">${o.label}</option>`;
    sel.value = state[meta.key];
    sel.addEventListener('change', () => { state[meta.key] = sel.value; onParamChange(true); });
    wrap.appendChild(sel); inputs[meta.key] = sel;
  } else if (meta.type === 'text') {
    wrap.innerHTML = `<div class="row"><label>${meta.label}</label></div>`;
    const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'ctl'; inp.value = state[meta.key];
    inp.addEventListener('input', () => { state[meta.key] = inp.value; onParamChange(false); });
    wrap.appendChild(inp); inputs[meta.key] = inp;
  } else if (meta.type === 'color') {
    wrap.innerHTML = `<div class="row"><label>${meta.label}</label></div>`;
    const cr = document.createElement('div'); cr.className = 'color-row';
    const inp = document.createElement('input'); inp.type = 'color'; inp.className = 'ctl-color'; inp.value = state[meta.key];
    const hexInp = document.createElement('input'); hexInp.type = 'text'; hexInp.className = 'hex-input'; hexInp.value = state[meta.key]; hexInp.maxLength = 7; hexInp.spellcheck = false;
    inp.addEventListener('input', () => { state[meta.key] = inp.value; hexInp.value = inp.value; applyColors(); });
    hexInp.addEventListener('input', () => {
      let v = hexInp.value.trim(); if (v && !v.startsWith('#')) v = '#' + v;
      if (/^#[0-9a-fA-F]{6}$/.test(v)) { state[meta.key] = v; inp.value = v; applyColors(); }
    });
    hexInp.addEventListener('blur', () => { hexInp.value = state[meta.key]; });
    cr.append(inp, hexInp); wrap.appendChild(cr); inputs[meta.key] = inp;
  } else {
    wrap.innerHTML = `<div class="row"><label>${meta.label}</label><span class="valedit"><input type="number" class="num-input" min="${meta.min}" max="${meta.max}" step="${meta.step}"><span class="u">${meta.unit || ''}</span></span></div>`;
    const numInp = wrap.querySelector('.num-input'); numInp.value = fmt(state[meta.key], meta.step);
    const rw = document.createElement('div'); rw.className = 'range-wrap';
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = meta.min; inp.max = meta.max; inp.step = meta.step; inp.value = state[meta.key];
    rw.appendChild(inp);
    rw.insertAdjacentHTML('beforeend', `<span class="range-center" title="Mitte"></span>`);
    inp.addEventListener('input', () => { state[meta.key] = parseFloat(inp.value); numInp.value = fmt(state[meta.key], meta.step); onParamChange(false); });
    numInp.addEventListener('input', () => {
      let v = parseFloat(numInp.value); if (isNaN(v)) return;
      v = Math.min(meta.max, Math.max(meta.min, v));
      state[meta.key] = v; inp.value = v; onParamChange(false);
    });
    numInp.addEventListener('blur', () => { numInp.value = fmt(state[meta.key], meta.step); });
    wrap.appendChild(rw); inputs[meta.key] = inp;
  }
  if (meta.hint) wrap.insertAdjacentHTML('beforeend', `<div class="hint">${meta.hint}</div>`);
  return wrap;
}

function makeLogoSourceControls() {
  // Bibliothek-Auswahl + Datei-Upload (nur bei SVG)
  const frag = document.createDocumentFragment();

  const libWrap = document.createElement('div'); libWrap.className = 'control'; controlEls['logoLibrary'] = libWrap;
  libWrap.innerHTML = `<div class="row"><label>Bibliothek</label></div>`;
  const libSel = document.createElement('select'); libSel.className = 'ctl';
  libSel.innerHTML = `<option value="">— auswählen —</option>` + LOGO_LIBRARY.map((l, i) => `<option value="${i}">${l.label}</option>`).join('');
  libSel.addEventListener('change', async () => {
    if (libSel.value === '') return;
    const item = LOGO_LIBRARY[+libSel.value];
    try {
      logoSvgText = await (await fetch(item.file)).text();
      logoFileName = item.label; setFileName(item.label); onParamChange(true);
    } catch { showWarn('Bibliotheks-Logo konnte nicht geladen werden.'); }
  });
  libWrap.appendChild(libSel); frag.appendChild(libWrap);

  const fileWrap = document.createElement('div'); fileWrap.className = 'control'; controlEls['logoFile'] = fileWrap;
  fileWrap.innerHTML = `
    <label class="filebtn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14"/></svg>
      <span>Eigenes SVG hochladen</span>
      <input type="file" accept=".svg,image/svg+xml" style="display:none">
    </label>
    <div class="filename" style="display:none"></div>`;
  const fileInput = fileWrap.querySelector('input');
  fileInput.addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    logoSvgText = await f.text(); logoFileName = f.name; setFileName(f.name); onParamChange(true);
  });
  frag.appendChild(fileWrap);
  return frag;
}
function setFileName(name) {
  const el = controlEls['logoFile'] && controlEls['logoFile'].querySelector('.filename');
  if (el) { el.textContent = name; el.style.display = 'block'; }
}

function findMeta(key) { for (const g of GROUPS) for (const m of g.params) if (m.key === key) return m; return { step: 1 }; }

// ============ Vorlagen ============
function buildLibrarySection(root) {
  const sec = document.createElement('div'); sec.className = 'section';
  sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS.book}</span><h2>Vorlagen</h2><span class="chev"></span></div>`;
  const body = document.createElement('div'); body.className = 'section-body';

  const brandSel = document.createElement('select'); brandSel.className = 'ctl';
  const sizeSel = document.createElement('select'); sizeSel.className = 'ctl'; sizeSel.style.marginTop = '8px';

  function populateBrands() {
    const prev = brandSel.value;
    brandSel.innerHTML = `<option value="generic">Allgemeine Größen</option>`;
    for (const grp of library) {
      let og = `<optgroup label="${grp.group}">`;
      grp.brands.forEach((b, i) => { og += `<option value="${grp.group}::${i}">${b.name}</option>`; });
      brandSel.innerHTML += og + `</optgroup>`;
    }
    if (prev && [...brandSel.options].some(o => o.value === prev)) brandSel.value = prev;
  }
  refreshBrands = populateBrands;
  function entriesFor(val) {
    if (val === 'generic') return GENERIC;
    const [group, i] = val.split('::');
    const grp = library.find(g => g.group === group);
    return grp ? grp.brands[+i].entries : [];
  }
  function fillSizes() { sizeSel.innerHTML = entriesFor(brandSel.value).map((e, i) => `<option value="${i}">${e.label}</option>`).join(''); }
  brandSel.addEventListener('change', () => { fillSizes(); applyValues(entriesFor(brandSel.value)[0].values); });
  sizeSel.addEventListener('change', () => applyValues(entriesFor(brandSel.value)[+sizeSel.value].values));
  populateBrands(); fillSizes();

  const l1 = document.createElement('div'); l1.className = 'sub-label'; l1.textContent = 'Hersteller';
  const l2 = document.createElement('div'); l2.className = 'sub-label'; l2.textContent = 'Größe / Modell'; l2.style.marginTop = '10px';
  body.append(l1, brandSel, l2, sizeSel);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:8px">Richtwerte – bitte am Rad nachmessen.</div>`);

  body.insertAdjacentHTML('beforeend', `<div class="divider"></div><div class="sub-label">Eigene Maße speichern</div>`);
  const saveRow = document.createElement('div'); saveRow.className = 'save-row';
  const nameInp = document.createElement('input'); nameInp.type = 'text'; nameInp.className = 'ctl'; nameInp.placeholder = 'z. B. Meine Felge 18 Zoll';
  const saveBtn = document.createElement('button'); saveBtn.className = 'btn btn-ghost btn-sm'; saveBtn.textContent = 'Speichern';
  saveRow.append(nameInp, saveBtn); body.appendChild(saveRow);
  const myList = document.createElement('div'); myList.className = 'preset-list'; body.appendChild(myList);

  function renderMy() {
    const list = loadUserPresets(); myList.innerHTML = '';
    if (!list.length) { myList.innerHTML = `<div class="hint">Noch keine eigenen Vorlagen.</div>`; return; }
    for (const p of list) {
      const row = document.createElement('div'); row.className = 'preset-row';
      row.innerHTML = `<span class="pr-name"></span>`;
      row.querySelector('.pr-name').textContent = p.label;
      const apply = document.createElement('button'); apply.className = 'pr-btn'; apply.textContent = 'Anwenden';
      const del = document.createElement('button'); del.className = 'pr-btn pr-del'; del.innerHTML = '&times;';
      apply.addEventListener('click', () => applyValues(p.values));
      del.addEventListener('click', () => { deleteUserPreset(p.id); renderMy(); });
      row.append(apply, del); myList.appendChild(row);
    }
  }
  saveBtn.addEventListener('click', () => {
    const label = nameInp.value.trim() || `Vorlage ${new Date().toLocaleDateString('de-DE')}`;
    saveUserPreset(label, snapshot()); nameInp.value = ''; renderMy(); flash(saveBtn, 'Gespeichert ✓');
  });
  renderMy();

  const propBtn = document.createElement('button'); propBtn.className = 'btn btn-ghost btn-block';
  propBtn.style.marginTop = '10px'; propBtn.textContent = 'Als Vorlage vorschlagen';
  propBtn.addEventListener('click', proposeCurrent); body.appendChild(propBtn);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:6px">Hilft, die Bibliothek für alle zu füllen.</div>`);

  sec.appendChild(body);
  sec.querySelector('.section-head').addEventListener('click', () => sec.classList.toggle('collapsed'));
  root.appendChild(sec);
}

function snapshot() {
  return {
    outerDiameter: state.outerDiameter, mountDiameter: state.mountDiameter,
    totalHeight: state.totalHeight, clipCount: state.clipCount,
    faceThickness: state.faceThickness, tolerance: state.tolerance,
    gripThickness: state.gripThickness, barbDepth: state.barbDepth,
  };
}
async function proposeCurrent() {
  const s = snapshot(); const label = `${s.outerDiameter} / ${s.mountDiameter} mm`;
  if (supabaseEnabled()) {
    showWarn('Sende Vorschlag …');
    const r = await submitProposal({ ...s, label });
    showWarn(r.ok ? 'Danke! Vorschlag eingereicht – wird nach Prüfung aufgenommen.' : 'Konnte nicht senden: ' + ((r.error && r.error.message) || r.reason || 'Fehler'));
    return;
  }
  const json = proposalJSON(label, s);
  try { await navigator.clipboard.writeText(json); } catch {}
  window.open(`mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent('Nabendeckel-Vorlage: ' + label)}&body=${encodeURIComponent('Neue Vorlage (bitte prüfen):\n\n' + json)}`, '_blank');
  showWarn('Maße kopiert – E-Mail-Fenster geöffnet.');
}
function flash(btn, txt) { const o = btn.textContent; btn.textContent = txt; setTimeout(() => btn.textContent = o, 1200); }
function applyValues(values) { Object.assign(state, values); syncInputs(); onParamChange(true); }

// ============ Aufbau + Modus ============
function buildUI() {
  const root = document.getElementById('controls');
  buildLibrarySection(root);

  for (const g of GROUPS) {
    const sec = document.createElement('div'); sec.className = 'section'; sec.dataset.group = g.id;
    sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS[g.icon] || ''}</span><h2>${g.label}</h2><span class="chev"></span></div>`;
    const body = document.createElement('div'); body.className = 'section-body';
    for (const meta of g.params) {
      body.appendChild(makeControl(meta));
      if (meta.key === 'logoMode') body.appendChild(makeLogoSourceControls());
    }
    sec.appendChild(body);
    sec.querySelector('.section-head').addEventListener('click', () => sec.classList.toggle('collapsed'));
    root.appendChild(sec);
  }
  buildExportSection(root);

  const mt = document.getElementById('modeToggle');
  mt.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  document.getElementById('download').addEventListener('click', () => downloadSTL(false));
  setMode(mode);
}

function buildExportSection(root) {
  const sec = document.createElement('div'); sec.className = 'section';
  sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS.palette}</span><h2>Export</h2><span class="chev"></span></div>`;
  const body = document.createElement('div'); body.className = 'section-body';
  const b1 = document.createElement('button'); b1.className = 'btn btn-ghost btn-block'; b1.textContent = 'STL komplett (1 Teil)';
  b1.addEventListener('click', () => downloadSTL(false));
  const b2 = document.createElement('button'); b2.className = 'btn btn-ghost btn-block'; b2.style.marginTop = '8px'; b2.textContent = 'Deckel + Logo getrennt (2 STL)';
  b2.addEventListener('click', () => downloadSTL(true));
  body.append(b1, b2);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:8px">Für Mehrfarb-Druck (z. B. AMS): getrennt exportieren und im Slicer je Farbe zuweisen. STL selbst ist farblos.</div>`);
  sec.appendChild(body);
  sec.querySelector('.section-head').addEventListener('click', () => sec.classList.toggle('collapsed'));
  root.appendChild(sec);
}

function setMode(m) {
  mode = m; localStorage.setItem('nd_mode', m);
  document.querySelectorAll('#modeToggle button').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  updateVisibility();
}
function syncInputs() {
  for (const key in inputs) {
    const el = inputs[key]; el.value = state[key];
    const wrap = controlEls[key]; if (!wrap) continue;
    const num = wrap.querySelector('.num-input'); if (num) num.value = fmt(state[key], findMeta(key).step);
    const hx = wrap.querySelector('.hex-input'); if (hx) hx.value = state[key];
  }
}
function updateVisibility() {
  for (const g of GROUPS) {
    let anyVisible = false;
    for (const m of g.params) {
      const el = controlEls[m.key]; if (!el) continue;
      const visible = !(m.expert && mode === 'standard') && !(m.showIf && !m.showIf(state));
      el.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;
    }
    const sec = document.querySelector(`.section[data-group="${g.id}"]`);
    if (sec) sec.style.display = anyVisible ? '' : 'none';
  }
  const isSvg = state.logoMode === 'svg';
  if (controlEls['logoLibrary']) controlEls['logoLibrary'].style.display = isSvg ? '' : 'none';
  if (controlEls['logoFile']) controlEls['logoFile'].style.display = isSvg ? '' : 'none';
}

// ============ Rebuild ============
const statusEl = document.getElementById('status');
const warnEl = document.getElementById('warn');
const badgeEl = document.getElementById('badge');
let rebuildTimer = null, building = false, pending = false, warnTimer = null;

function onParamChange(immediate) { updateVisibility(); clearTimeout(rebuildTimer); rebuildTimer = setTimeout(rebuild, immediate ? 0 : 90); }

function checkWarnings() {
  const msgs = [];
  if (state.outerDiameter <= state.mountDiameter) msgs.push('Außen-Ø muss größer als Montage-Ø sein.');
  const d = derive(state);
  if (d.clipW < 4) msgs.push('Zu viele/zu breite Clips.');
  if (state.gripThickness + state.barbRamp > d.skirtH) msgs.push('Klemmdicke + Einführschräge > Clip-Länge.');
  if (msgs.length) { warnEl.textContent = '⚠ ' + msgs.join('  ·  '); warnEl.classList.add('show'); }
  else warnEl.classList.remove('show');
}

async function rebuild() {
  if (building) { pending = true; return; }
  building = true; statusEl.classList.add('show'); checkWarnings();
  await new Promise(r => setTimeout(r, 20));
  try {
    let logo = null;
    if (state.logoMode === 'svg' && logoSvgText) {
      try { logo = { geometry: svgToGeometry(logoSvgText, state.logoDepth, state.logoSize) }; }
      catch (e) { showWarn(e.message); }
    } else if (state.logoMode === 'text' && state.logoText.trim()) {
      logo = { geometry: await textToGeometry(state.logoText, state.logoDepth, state.logoSize) };
    }
    const { body, logo: logoGeo } = buildCap(state, logo);
    if (capMesh) { capMesh.geometry.dispose(); capMesh.geometry = body; }
    else { capMesh = new THREE.Mesh(body, capMaterial); scene.add(capMesh); frameObject(body); }
    if (logoGeo) {
      if (logoMesh) { logoMesh.geometry.dispose(); logoMesh.geometry = logoGeo; logoMesh.visible = true; }
      else { logoMesh = new THREE.Mesh(logoGeo, logoMaterial); scene.add(logoMesh); }
    } else if (logoMesh) { logoMesh.visible = false; logoMesh.geometry.dispose(); logoMesh.geometry = new THREE.BufferGeometry(); }
    updateBadge(body, logoGeo);
  } catch (e) { console.error(e); showWarn('Fehler beim Erzeugen: ' + e.message); }
  finally { statusEl.classList.remove('show'); building = false; if (pending) { pending = false; rebuild(); } }
}

function showWarn(m) { warnEl.textContent = '⚠ ' + m; warnEl.classList.add('show'); clearTimeout(warnTimer); warnTimer = setTimeout(() => checkWarnings(), 2600); }
function frameObject(geo) { geo.computeBoundingBox(); const c = new THREE.Vector3(); geo.boundingBox.getCenter(c); controls.target.copy(c); controls.update(); }

function meshVolume(geo) {
  const pos = geo.attributes.position, idx = geo.index;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(); let v = 0;
  const tri = (i0, i1, i2) => { a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2); v += a.dot(b.clone().cross(c)) / 6; };
  if (idx) for (let i = 0; i < idx.count; i += 3) tri(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
  else for (let i = 0; i < pos.count; i += 3) tri(i, i + 1, i + 2);
  return Math.abs(v);
}
function updateBadge(body, logoGeo) {
  const bb = body.boundingBox.clone();
  if (logoGeo) { logoGeo.computeBoundingBox(); bb.union(logoGeo.boundingBox); }
  const s = new THREE.Vector3(); bb.getSize(s);
  const dia = Math.max(s.x, s.z);
  const vol = (meshVolume(body) + (logoGeo ? meshVolume(logoGeo) : 0)) / 1000;
  badgeEl.innerHTML =
    `<span>Ø <b>${dia.toFixed(1)}</b> mm</span><span class="sep"></span>` +
    `<span>Höhe <b>${s.y.toFixed(1)}</b> mm</span><span class="sep"></span>` +
    `<span>Material <b>${vol.toFixed(1)}</b> cm³</span>`;
}

// ============ Export ============
function stlBlob(geo) {
  const g = geo.clone(); g.rotateX(-Math.PI / 2);
  const buffer = exporter.parse(new THREE.Mesh(g), { binary: true });
  g.dispose();
  return new Blob([buffer], { type: 'application/octet-stream' });
}
function download(blob, name) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}
// Nur Position behalten, damit sich Deckel- und Logo-Geometrie verschmelzen lassen.
function forExport(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', g.getAttribute('position').clone());
  return out;
}
function downloadSTL(separate) {
  if (!capMesh) return;
  const base = `nabendeckel_${state.outerDiameter}x${state.mountDiameter}mm`;
  const hasLogo = logoMesh && logoMesh.visible;
  if (separate && hasLogo) {
    download(stlBlob(capMesh.geometry), base + '_deckel.stl');
    download(stlBlob(logoMesh.geometry), base + '_logo.stl');
  } else {
    const geos = [forExport(capMesh.geometry)];
    if (hasLogo) geos.push(forExport(logoMesh.geometry));
    const merged = geos.length > 1 ? mergeGeometries(geos, false) : geos[0];
    download(stlBlob(merged), base + '.stl');
  }
}

// ============ Start ============
try {
  initThree(); buildUI(); rebuild();
  if (supabaseEnabled()) {
    fetchCommunityGroup().then(g => { if (g && g.brands.length) { library = [...BRAND_LIBRARY, g]; refreshBrands(); } });
  }
} catch (e) {
  console.error(e);
  document.getElementById('fatal').classList.add('show');
  document.getElementById('fatal-msg').textContent = e.message + '\n' + (e.stack || '');
}
