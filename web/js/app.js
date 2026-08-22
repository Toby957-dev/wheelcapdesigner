import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DEFAULTS, GROUPS } from './config.js';
import { BRAND_LIBRARY, GENERIC } from './brands.js';
import { loadUserPresets, saveUserPreset, deleteUserPreset, proposalJSON } from './userPresets.js';
import { supabaseEnabled, fetchCommunityGroup, submitProposal } from './supabase.js';
import { buildCap, derive } from './geometry.js';
import { svgToGeometry, textToGeometry } from './logo.js';

const SUBMIT_EMAIL = 'vorlagen@example.com'; // Ziel für Vorlagen-Vorschläge (anpassen)

const ICONS = {
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v3M10 7v5M14 7v3M18 7v5"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
  clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v6M12 21v-4M5 8l3 3M19 8l-3 3M4 15h4M16 15h4"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.9 6.9 20l1.5-6.3L3.5 9.5 9.9 9z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
};

const state = { ...DEFAULTS };
let mode = localStorage.getItem('nd_mode') || 'standard';
let logoSvgText = null, logoFileName = null;
const inputs = {}, controlEls = {};
let library = BRAND_LIBRARY.slice();   // wird ggf. um eine "Community"-Gruppe erweitert
let refreshBrands = () => {};

// ============ 3D-Setup ============
const canvas = document.getElementById('viewport');
const stage = canvas.parentElement;
let renderer, scene, camera, controls, mesh, material;
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
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 5, 0);
  controls.minDistance = 20;
  controls.maxDistance = 600;

  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(50, 80, 60); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbcd0ff, 0.7); fill.position.set(-60, 30, -40); scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x20242c, 0.5));
  const grid = new THREE.GridHelper(400, 40, 0x2a2f38, 0x1c2027); grid.position.y = -0.01; scene.add(grid);

  material = new THREE.MeshStandardMaterial({ color: 0xd7dbe1, roughness: 0.52, metalness: 0.02 });

  addEventListener('resize', onResize);
  new ResizeObserver(onResize).observe(stage);
  animate();
}

function onResize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}

function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }

// ============ UI: Parameter ============
function fmt(v, step) { const dec = (String(step).split('.')[1] || '').length; return Number(v).toFixed(dec); }

function makeControl(meta) {
  const wrap = document.createElement('div');
  wrap.className = 'control';
  controlEls[meta.key] = wrap;

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
  } else {
    wrap.innerHTML = `<div class="row"><label>${meta.label}</label><span class="val"><span class="num">${fmt(state[meta.key], meta.step)}</span><span class="u">${meta.unit || ''}</span></span></div>`;
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = meta.min; inp.max = meta.max; inp.step = meta.step; inp.value = state[meta.key];
    const numEl = wrap.querySelector('.num');
    inp.addEventListener('input', () => {
      state[meta.key] = parseFloat(inp.value); numEl.textContent = fmt(state[meta.key], meta.step); onParamChange(false);
    });
    wrap.appendChild(inp); inputs[meta.key] = inp;
  }
  if (meta.hint) wrap.insertAdjacentHTML('beforeend', `<div class="hint">${meta.hint}</div>`);
  return wrap;
}

function makeFileControl() {
  const wrap = document.createElement('div'); wrap.className = 'control'; controlEls['logoFile'] = wrap;
  wrap.innerHTML = `
    <label class="filebtn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14"/></svg>
      <span>SVG hochladen</span>
      <input type="file" accept=".svg,image/svg+xml" style="display:none">
    </label>
    <div class="filename" style="display:none"></div>`;
  const fileInput = wrap.querySelector('input'), nameEl = wrap.querySelector('.filename');
  fileInput.addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    logoSvgText = await f.text(); logoFileName = f.name;
    nameEl.textContent = f.name; nameEl.style.display = 'block';
    onParamChange(true);
  });
  return wrap;
}

function findMeta(key) { for (const g of GROUPS) for (const m of g.params) if (m.key === key) return m; return { step: 1 }; }

// ============ UI: Vorlagen ============
function buildLibrarySection(root) {
  const sec = document.createElement('div'); sec.className = 'section';
  sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS.book}</span><h2>Vorlagen</h2><span class="chev"></span></div>`;
  const body = document.createElement('div'); body.className = 'section-body';

  // Hersteller + Größe
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
  refreshBrands = populateBrands;   // für späteres Nachladen der Community-Vorlagen

  function entriesFor(val) {
    if (val === 'generic') return GENERIC;
    const [group, i] = val.split('::');
    const grp = library.find(g => g.group === group);
    return grp ? grp.brands[+i].entries : [];
  }
  populateBrands();
  function fillSizes() {
    const list = entriesFor(brandSel.value);
    sizeSel.innerHTML = list.map((e, i) => `<option value="${i}">${e.label}</option>`).join('');
  }
  brandSel.addEventListener('change', () => { fillSizes(); applyValues(entriesFor(brandSel.value)[0].values); });
  sizeSel.addEventListener('change', () => { applyValues(entriesFor(brandSel.value)[+sizeSel.value].values); });
  fillSizes();

  const lbl1 = document.createElement('div'); lbl1.className = 'sub-label'; lbl1.textContent = 'Hersteller';
  const lbl2 = document.createElement('div'); lbl2.className = 'sub-label'; lbl2.textContent = 'Größe / Modell'; lbl2.style.marginTop = '10px';
  body.append(lbl1, brandSel, lbl2, sizeSel);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:8px">Richtwerte aus gängigen Sortimenten – bitte am Rad nachmessen.</div>`);

  // Eigene Vorlagen speichern
  body.insertAdjacentHTML('beforeend', `<div class="divider"></div><div class="sub-label">Eigene Maße speichern</div>`);
  const saveRow = document.createElement('div'); saveRow.className = 'save-row';
  const nameInp = document.createElement('input'); nameInp.type = 'text'; nameInp.className = 'ctl'; nameInp.placeholder = 'z. B. Meine Felge 17"';
  const saveBtn = document.createElement('button'); saveBtn.className = 'btn btn-ghost btn-sm'; saveBtn.textContent = 'Speichern';
  saveRow.append(nameInp, saveBtn); body.appendChild(saveRow);

  const myList = document.createElement('div'); myList.className = 'preset-list'; body.appendChild(myList);

  function renderMy() {
    const list = loadUserPresets();
    myList.innerHTML = '';
    if (!list.length) { myList.innerHTML = `<div class="hint">Noch keine eigenen Vorlagen.</div>`; return; }
    for (const p of list) {
      const row = document.createElement('div'); row.className = 'preset-row';
      row.innerHTML = `<span class="pr-name">${p.label}</span>`;
      const apply = document.createElement('button'); apply.className = 'pr-btn'; apply.title = 'Anwenden'; apply.textContent = 'Anwenden';
      const del = document.createElement('button'); del.className = 'pr-btn pr-del'; del.title = 'Löschen'; del.innerHTML = '&times;';
      apply.addEventListener('click', () => applyValues(p.values));
      del.addEventListener('click', () => { deleteUserPreset(p.id); renderMy(); });
      row.append(apply, del); myList.appendChild(row);
    }
  }
  saveBtn.addEventListener('click', () => {
    const label = nameInp.value.trim() || `Vorlage ${new Date().toLocaleDateString('de-DE')}`;
    saveUserPreset(label, snapshot()); nameInp.value = ''; renderMy();
    flash(saveBtn, 'Gespeichert ✓');
  });
  renderMy();

  // Vorschlagen
  const propBtn = document.createElement('button'); propBtn.className = 'btn btn-ghost btn-block';
  propBtn.style.marginTop = '10px'; propBtn.textContent = 'Als Vorlage vorschlagen';
  propBtn.addEventListener('click', proposeCurrent);
  body.appendChild(propBtn);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:6px">Kopiert die Maße und öffnet eine E-Mail – hilft, die Bibliothek für alle zu füllen.</div>`);

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
  const s = snapshot();
  const label = `${s.outerDiameter} / ${s.mountDiameter} mm`;
  if (supabaseEnabled()) {
    showWarn('Sende Vorschlag …');
    const r = await submitProposal({ ...s, label });
    if (r.ok) showWarn('Danke! Vorschlag eingereicht – wird nach Prüfung aufgenommen.');
    else showWarn('Konnte nicht senden: ' + ((r.error && r.error.message) || r.reason || 'Fehler'));
    return;
  }
  // Fallback ohne DB: JSON kopieren + E-Mail
  const json = proposalJSON(label, s);
  try { await navigator.clipboard.writeText(json); } catch {}
  const subject = encodeURIComponent('Nabendeckel-Vorlage: ' + label);
  const bodyTxt = encodeURIComponent('Neue Vorlage (bitte prüfen):\n\n' + json);
  window.open(`mailto:${SUBMIT_EMAIL}?subject=${subject}&body=${bodyTxt}`, '_blank');
  showWarn('Maße in die Zwischenablage kopiert – E-Mail-Fenster geöffnet.');
}

function flash(btn, txt) { const o = btn.textContent; btn.textContent = txt; setTimeout(() => btn.textContent = o, 1200); }

function applyValues(values) {
  Object.assign(state, values);
  syncInputs(); onParamChange(true);
}

// ============ UI: Aufbau + Modus ============
function buildUI() {
  const root = document.getElementById('controls');
  buildLibrarySection(root);

  for (const g of GROUPS) {
    const sec = document.createElement('div'); sec.className = 'section'; sec.dataset.group = g.id;
    sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS[g.icon] || ''}</span><h2>${g.label}</h2><span class="chev"></span></div>`;
    const body = document.createElement('div'); body.className = 'section-body';
    for (const meta of g.params) {
      body.appendChild(makeControl(meta));
      if (meta.key === 'logoMode') body.appendChild(makeFileControl());
    }
    sec.appendChild(body);
    sec.querySelector('.section-head').addEventListener('click', () => sec.classList.toggle('collapsed'));
    root.appendChild(sec);
  }

  // Modus-Umschalter
  const mt = document.getElementById('modeToggle');
  mt.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  document.getElementById('download').addEventListener('click', downloadSTL);
  setMode(mode);
}

function setMode(m) {
  mode = m; localStorage.setItem('nd_mode', m);
  document.querySelectorAll('#modeToggle button').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  updateVisibility();
}

function syncInputs() {
  for (const key in inputs) {
    const el = inputs[key]; el.value = state[key];
    const num = controlEls[key] && controlEls[key].querySelector('.num');
    if (num) num.textContent = fmt(state[key], findMeta(key).step);
  }
}

function updateVisibility() {
  for (const g of GROUPS) {
    let anyVisible = false;
    for (const m of g.params) {
      const el = controlEls[m.key]; if (!el) continue;
      const hiddenByMode = m.expert && mode === 'standard';
      const hiddenByCond = m.showIf && !m.showIf(state);
      const visible = !hiddenByMode && !hiddenByCond;
      el.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;
    }
    const sec = document.querySelector(`.section[data-group="${g.id}"]`);
    if (sec) sec.style.display = anyVisible ? '' : 'none';
  }
  if (controlEls['logoFile']) controlEls['logoFile'].style.display = state.logoMode === 'svg' ? '' : 'none';
}

// ============ Rebuild ============
const statusEl = document.getElementById('status');
const warnEl = document.getElementById('warn');
const badgeEl = document.getElementById('badge');
let rebuildTimer = null, building = false, pending = false, warnTimer = null;

function onParamChange(immediate) {
  updateVisibility();
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuild, immediate ? 0 : 90);
}

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
    const geo = buildCap(state, logo);
    if (mesh) { mesh.geometry.dispose(); mesh.geometry = geo; }
    else { mesh = new THREE.Mesh(geo, material); scene.add(mesh); frameObject(geo); }
    updateBadge(geo);
  } catch (e) { console.error(e); showWarn('Fehler beim Erzeugen: ' + e.message); }
  finally {
    statusEl.classList.remove('show'); building = false;
    if (pending) { pending = false; rebuild(); }
  }
}

function showWarn(m) {
  warnEl.textContent = '⚠ ' + m; warnEl.classList.add('show');
  clearTimeout(warnTimer); warnTimer = setTimeout(() => checkWarnings(), 2600);
}

function frameObject(geo) {
  geo.computeBoundingBox();
  const c = new THREE.Vector3(); geo.boundingBox.getCenter(c);
  controls.target.copy(c); controls.update();
}

function meshVolume(geo) {
  const pos = geo.attributes.position, idx = geo.index;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(); let v = 0;
  const tri = (i0, i1, i2) => { a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2); v += a.dot(b.clone().cross(c)) / 6; };
  if (idx) for (let i = 0; i < idx.count; i += 3) tri(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
  else for (let i = 0; i < pos.count; i += 3) tri(i, i + 1, i + 2);
  return Math.abs(v);
}

function updateBadge(geo) {
  const s = new THREE.Vector3(); geo.boundingBox.getSize(s);
  const dia = Math.max(s.x, s.z), vol = meshVolume(geo) / 1000;
  badgeEl.innerHTML =
    `<span>Ø <b>${dia.toFixed(1)}</b> mm</span><span class="sep"></span>` +
    `<span>Höhe <b>${s.y.toFixed(1)}</b> mm</span><span class="sep"></span>` +
    `<span>Material <b>${vol.toFixed(1)}</b> cm³</span>`;
}

// ============ Export ============
function downloadSTL() {
  if (!mesh) return;
  const exp = mesh.geometry.clone();
  exp.rotateX(-Math.PI / 2);
  const buffer = exporter.parse(new THREE.Mesh(exp), { binary: true });
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `nabendeckel_${state.outerDiameter}x${state.mountDiameter}mm.stl`; a.click();
  URL.revokeObjectURL(url); exp.dispose();
}

// ============ Start ============
try {
  initThree(); buildUI(); rebuild();
  // Gemeinsame Community-Vorlagen nachladen (nur wenn Supabase konfiguriert)
  if (supabaseEnabled()) {
    fetchCommunityGroup().then(g => {
      if (g && g.brands.length) { library = [...BRAND_LIBRARY, g]; refreshBrands(); }
    });
  }
}
catch (e) {
  console.error(e);
  document.getElementById('fatal').classList.add('show');
  document.getElementById('fatal-msg').textContent = e.message + '\n' + (e.stack || '');
}
