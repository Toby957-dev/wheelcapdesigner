import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DEFAULTS, GROUPS } from './config.js';
import { BRAND_LIBRARY, GENERIC } from './brands.js';
import { loadUserPresets, saveUserPreset, deleteUserPreset, proposalJSON } from './userPresets.js';
import { loadProjects, saveProject, updateProject, deleteProject } from './projects.js';
import { t, getLang, setLang, LANGS, FLAGS, applyHtmlLang } from './i18n.js';
import { supabaseEnabled, fetchCommunityGroup, submitProposal, rateTemplate, submitFeedback } from './supabase.js';
import { buildCap, derive, initGeometry } from './geometry.js';
import { svgToGeometry, textToGeometry, shapeToGeometry } from './logo.js';
import { export3MF } from './threemf.js';

const SUBMIT_EMAIL = 'vorlagen@example.com';

// >>> HIER deinen MakerWorld-Profil-Link eintragen (dann erscheint der Button oben) <<<
const MAKERWORLD_URL = 'https://makerworld.com/de/models/3245007-wheelcap-designer#profileId-3676964';

// Eindeutige, anonyme Kennung pro Browser (eine Stimme je Vorlage).
function voterId() {
  let v = null;
  try { v = localStorage.getItem('wcd_voter'); } catch (_) {}
  if (!v) {
    v = (self.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'v' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem('wcd_voter', v); } catch (_) {}
  }
  return v;
}
function myVote(id) { try { return +localStorage.getItem('wcd_vote_' + id) || 0; } catch (_) { return 0; } }
function setMyVote(id, r) { try { localStorage.setItem('wcd_vote_' + id, String(r)); } catch (_) {} }

const STAR_SVG = '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.26L21.8 9.3l-5 4.9 1.2 6.9L12 17.8 6 21.1l1.2-6.9-5-4.9 6.9-1.04z"/></svg>';

// Sterne-Widget. onPick != null => interaktiv. filled = Anzahl voller Sterne (gerundet).
function buildStars(container, filled, onPick) {
  container.innerHTML = '';
  container.classList.toggle('readonly', !onPick);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement('span');
    s.className = 'star' + (i <= filled ? ' on' : '');
    s.innerHTML = STAR_SVG;
    if (onPick) {
      s.setAttribute('role', 'radio'); s.setAttribute('aria-label', i + ' Sterne'); s.tabIndex = 0;
      const paint = n => stars.forEach((el, k) => el.classList.toggle('on', k < n));
      s.addEventListener('mouseenter', () => paint(i));
      s.addEventListener('click', () => onPick(i));
      s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(i); } });
    }
    container.appendChild(s); stars.push(s);
  }
  container.onmouseleave = onPick ? () => stars.forEach((el, k) => el.classList.toggle('on', k < filled)) : null;
  return stars;
}

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
let currentProjectId = null, currentProjectName = '';
let projNameInput = null;
const inputs = {}, controlEls = {};
let library = BRAND_LIBRARY.slice();
let refreshBrands = () => {};
let refreshRateBox = () => {};

// ============ 3D ============
const canvas = document.getElementById('viewport');
const stage = canvas.parentElement;
let renderer, scene, camera, controls, capMesh, logoMesh, capMaterial, logoMaterial, grid;
let theme = localStorage.getItem('nd_theme') || 'dark';
const exporter = new STLExporter();

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  renderer.setClearColor(0x000000, 0);   // transparent -> gethemter CSS-Hintergrund scheint durch
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

  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(50, 80, 60); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbcd0ff, 0.6); fill.position.set(-60, 30, -40); scene.add(fill);
  const under = new THREE.DirectionalLight(0xffffff, 0.9); under.position.set(15, -60, 25); scene.add(under); // beleuchtet die Unterseite
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa2b0, 0.55)); // hellerer „Boden" -> Unterseite nicht mehr schwarz
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  capMaterial = new THREE.MeshStandardMaterial({ color: state.capColor, roughness: 0.52, metalness: 0.02 });
  logoMaterial = new THREE.MeshStandardMaterial({ color: state.logoColor, roughness: 0.45, metalness: 0.02, polygonOffset: true, polygonOffsetFactor: -1 });

  applyTheme(theme);
  addEventListener('resize', onResize);
  new ResizeObserver(onResize).observe(stage);
  animate();
}

function applyTheme(t) {
  theme = t; localStorage.setItem('nd_theme', t);
  document.body.classList.toggle('theme-light', t === 'light');
  if (grid) { scene.remove(grid); grid.geometry.dispose(); grid.material.dispose(); }
  const c = t === 'light' ? [0xcfd6df, 0xe2e7ed] : [0x2a2f38, 0x1c2027];
  grid = new THREE.GridHelper(400, 40, c[0], c[1]); grid.position.y = -0.01; scene.add(grid);
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
    wrap.innerHTML = `<div class="row"><label>${t(meta.label)}</label></div>`;
    const sel = document.createElement('select'); sel.className = 'ctl';
    for (const o of meta.options) sel.innerHTML += `<option value="${o.value}">${t(o.label)}</option>`;
    sel.value = state[meta.key];
    sel.addEventListener('change', () => { state[meta.key] = sel.value; onParamChange(true); });
    wrap.appendChild(sel); inputs[meta.key] = sel;
  } else if (meta.type === 'text') {
    wrap.innerHTML = `<div class="row"><label>${t(meta.label)}</label></div>`;
    const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'ctl'; inp.value = state[meta.key];
    inp.addEventListener('input', () => { state[meta.key] = inp.value; onParamChange(false); });
    wrap.appendChild(inp); inputs[meta.key] = inp;
  } else if (meta.type === 'color') {
    wrap.innerHTML = `<div class="row"><label>${t(meta.label)}</label></div>`;
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
    wrap.innerHTML = `<div class="row"><label>${t(meta.label)}</label><span class="valedit"><input type="number" class="num-input" min="${meta.min}" max="${meta.max}" step="${meta.step}"><span class="u">${meta.unit || ''}</span></span></div>`;
    const numInp = wrap.querySelector('.num-input'); numInp.value = fmt(state[meta.key], meta.step);
    const rw = document.createElement('div'); rw.className = 'range-wrap';
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = meta.min; inp.max = meta.max; inp.step = meta.step; inp.value = state[meta.key];
    rw.appendChild(inp);
    // Mittelstrich = Standardwert der Vorlage; der Griff startet genau darauf.
    // 16px = Thumb-Breite, damit Tick & Griffmitte exakt fluchten (Rand-Einzug).
    const def = DEFAULTS[meta.key];
    const p = meta.max > meta.min ? (def - meta.min) / (meta.max - meta.min) : 0.5;
    rw.insertAdjacentHTML('beforeend', `<span class="range-center" title="Standard: ${fmt(def, meta.step)}${meta.unit || ''}" style="left:calc(8px + ${p} * (100% - 16px))"></span>`);
    inp.addEventListener('input', () => { state[meta.key] = parseFloat(inp.value); numInp.value = fmt(state[meta.key], meta.step); onParamChange(false); });
    numInp.addEventListener('input', () => {
      let v = parseFloat(numInp.value); if (isNaN(v)) return;
      v = Math.min(meta.max, Math.max(meta.min, v));
      state[meta.key] = v; inp.value = v; onParamChange(false);
    });
    numInp.addEventListener('blur', () => { numInp.value = fmt(state[meta.key], meta.step); });
    wrap.appendChild(rw); inputs[meta.key] = inp;
  }
  if (meta.hint) wrap.insertAdjacentHTML('beforeend', `<div class="hint">${t(meta.hint)}</div>`);
  return wrap;
}

function makeLogoSourceControls() {
  // Bibliothek-Auswahl + Datei-Upload (nur bei SVG)
  const frag = document.createDocumentFragment();

  const libWrap = document.createElement('div'); libWrap.className = 'control'; controlEls['logoLibrary'] = libWrap;
  libWrap.innerHTML = `<div class="row"><label>${t('Bibliothek')}</label></div>`;
  const libSel = document.createElement('select'); libSel.className = 'ctl';
  libSel.innerHTML = `<option value="">${t('— auswählen —')}</option>` + LOGO_LIBRARY.map((l, i) => `<option value="${i}">${l.label}</option>`).join('');
  libSel.addEventListener('change', async () => {
    if (libSel.value === '') return;
    const item = LOGO_LIBRARY[+libSel.value];
    try {
      logoSvgText = await (await fetch(item.file)).text();
      logoFileName = item.label; setFileName(item.label); onParamChange(true);
    } catch { showWarn(t('Bibliotheks-Logo konnte nicht geladen werden.')); }
  });
  libWrap.appendChild(libSel); frag.appendChild(libWrap);

  const fileWrap = document.createElement('div'); fileWrap.className = 'control'; controlEls['logoFile'] = fileWrap;
  fileWrap.innerHTML = `
    <label class="filebtn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14"/></svg>
      <span>${t('Eigenes SVG hochladen')}</span>
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
function uiLocale() { return ({ de: 'de-DE', en: 'en-GB', fr: 'fr-FR', es: 'es-ES', it: 'it-IT' })[getLang()] || 'de-DE'; }

// ============ Projekt-Sektion ============
function buildProjectSection(root) {
  const sec = document.createElement('div'); sec.className = 'section';
  const folder = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
  sec.innerHTML = `<div class="section-head"><span class="ico">${folder}</span><h2>${t('Projekt')}</h2><span class="chev"></span></div>`;
  const body = document.createElement('div'); body.className = 'section-body';

  const saveRow = document.createElement('div'); saveRow.className = 'proj-save-row';
  const nameInp = document.createElement('input'); nameInp.type = 'text'; nameInp.className = 'ctl'; nameInp.placeholder = t('Projektname');
  nameInp.value = currentProjectName || '';
  const saveBtn = document.createElement('button'); saveBtn.className = 'btn btn-ghost btn-sm'; saveBtn.textContent = t('Speichern');
  saveBtn.addEventListener('click', () => { saveProjectToBrowser(nameInp.value); nameInp.value = currentProjectName; flash(saveBtn, t('Gespeichert ✓')); });
  saveRow.append(nameInp, saveBtn); body.appendChild(saveRow);
  projNameInput = nameInp;

  const acts = document.createElement('div'); acts.className = 'proj-actions';
  const dl = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"/></svg>';
  const op = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
  const nw = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  const fileBtn = document.createElement('button'); fileBtn.className = 'btn btn-ghost'; fileBtn.innerHTML = dl + ' ' + t('Als Datei');
  const openBtn = document.createElement('button'); openBtn.className = 'btn btn-ghost'; openBtn.innerHTML = op + ' ' + t('Öffnen');
  const newBtn = document.createElement('button'); newBtn.className = 'btn btn-ghost proj-full'; newBtn.innerHTML = nw + ' ' + t('Neues Projekt');
  fileBtn.addEventListener('click', saveProjectFile);
  openBtn.addEventListener('click', () => openProjectFile(() => { if (projNameInput) projNameInput.value = currentProjectName; }));
  newBtn.addEventListener('click', () => { newProject(); if (projNameInput) projNameInput.value = ''; });
  acts.append(fileBtn, openBtn, newBtn); body.appendChild(acts);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:8px">${t('„Als Datei" = .wcd zum Sichern/Teilen · „Speichern" legt es in diesem Browser ab.')}</div>`);

  sec.appendChild(body);
  sec.querySelector('.section-head').addEventListener('click', () => sec.classList.toggle('collapsed'));
  root.appendChild(sec);
}

// ============ Vorlagen ============
function buildLibrarySection(root) {
  const sec = document.createElement('div'); sec.className = 'section';
  sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS.book}</span><h2>${t('Vorlagen')}</h2><span class="chev"></span></div>`;
  const body = document.createElement('div'); body.className = 'section-body';

  const brandSel = document.createElement('select'); brandSel.className = 'ctl';
  const sizeSel = document.createElement('select'); sizeSel.className = 'ctl'; sizeSel.style.marginTop = '8px';

  function populateBrands() {
    const prev = brandSel.value;
    brandSel.innerHTML = `<option value="generic">${t('Allgemeine Größen')}</option>`;
    for (const grp of library) {
      let og = `<optgroup label="${t(grp.group)}">`;
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
  function fillSizes() { sizeSel.innerHTML = entriesFor(brandSel.value).map((e, i) => `<option value="${i}">${t(e.label)}</option>`).join(''); }
  function currentEntry() { return entriesFor(brandSel.value)[+sizeSel.value]; }
  brandSel.addEventListener('change', () => { fillSizes(); applyValues(entriesFor(brandSel.value)[0].values); updateRateBox(); });
  sizeSel.addEventListener('change', () => { applyValues(currentEntry().values); updateRateBox(); });
  populateBrands(); fillSizes();

  const l1 = document.createElement('div'); l1.className = 'sub-label'; l1.textContent = t('Hersteller');
  const l2 = document.createElement('div'); l2.className = 'sub-label'; l2.textContent = t('Größe / Modell'); l2.style.marginTop = '10px';
  body.append(l1, brandSel, l2, sizeSel);

  // Bewertung – nur für Community-Vorlagen (haben eine id).
  const rateBox = document.createElement('div'); rateBox.className = 'tpl-rating'; rateBox.style.display = 'none';
  body.appendChild(rateBox);
  refreshRateBox = updateRateBox;
  function updateRateBox() {
    const e = currentEntry();
    if (!e || e.id == null) { rateBox.style.display = 'none'; return; }
    rateBox.style.display = '';
    rateBox.innerHTML = `<div class="tr-head">${t('Passt diese Vorlage?')}</div><div class="tr-row"><span class="stars"></span><span class="tr-avg"></span></div>`;
    const starsEl = rateBox.querySelector('.stars');
    const avgEl = rateBox.querySelector('.tr-avg');
    const mine = myVote(e.id);
    const showAvg = () => {
      const r = e.rating || { avg: 0, votes: 0 };
      avgEl.innerHTML = r.votes ? `Ø <b>${r.avg.toFixed(1)}</b> (${r.votes})` : t('Noch keine Bewertung');
    };
    buildStars(starsEl, mine || Math.round((e.rating && e.rating.avg) || 0), async (n) => {
      if (!supabaseEnabled()) { avgEl.textContent = t('Bewerten aktuell nicht möglich'); return; }
      setMyVote(e.id, n); buildStars(starsEl, n, null); avgEl.innerHTML = `<span class="tr-thanks">${t('Danke! ✓')}</span>`;
      const res = await rateTemplate(e.id, n, voterId());
      if (res.ok && res.summary) { e.rating = res.summary; showAvg(); }
    });
    showAvg();
  }

  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:8px">${t('Richtwerte – bitte am Rad nachmessen.')}</div>`);

  body.insertAdjacentHTML('beforeend', `<div class="divider"></div><div class="sub-label">${t('Eigene Maße speichern')}</div>`);
  const saveRow = document.createElement('div'); saveRow.className = 'save-row';
  const nameInp = document.createElement('input'); nameInp.type = 'text'; nameInp.className = 'ctl'; nameInp.placeholder = t('z. B. Meine Felge 18 Zoll');
  const saveBtn = document.createElement('button'); saveBtn.className = 'btn btn-ghost btn-sm'; saveBtn.textContent = t('Speichern');
  saveRow.append(nameInp, saveBtn); body.appendChild(saveRow);
  const myList = document.createElement('div'); myList.className = 'preset-list'; body.appendChild(myList);

  function renderMy() {
    const list = loadUserPresets(); myList.innerHTML = '';
    if (!list.length) { myList.innerHTML = `<div class="hint">${t('Noch keine eigenen Vorlagen.')}</div>`; return; }
    for (const p of list) {
      const row = document.createElement('div'); row.className = 'preset-row';
      row.innerHTML = `<span class="pr-name"></span>`;
      row.querySelector('.pr-name').textContent = p.label;
      const apply = document.createElement('button'); apply.className = 'pr-btn'; apply.textContent = t('Anwenden');
      const del = document.createElement('button'); del.className = 'pr-btn pr-del'; del.innerHTML = '&times;';
      apply.addEventListener('click', () => applyValues(p.values));
      del.addEventListener('click', () => { deleteUserPreset(p.id); renderMy(); });
      row.append(apply, del); myList.appendChild(row);
    }
  }
  saveBtn.addEventListener('click', () => {
    const label = nameInp.value.trim() || `${t('Vorlage')} ${new Date().toLocaleDateString(uiLocale())}`;
    saveUserPreset(label, snapshot()); nameInp.value = ''; renderMy(); flash(saveBtn, t('Gespeichert ✓'));
  });
  renderMy();

  const propBtn = document.createElement('button'); propBtn.className = 'btn btn-ghost btn-block';
  propBtn.style.marginTop = '10px'; propBtn.textContent = t('Als Vorlage vorschlagen');
  propBtn.addEventListener('click', proposeCurrent); body.appendChild(propBtn);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:6px">${t('Hilft, die Bibliothek für alle zu füllen.')}</div>`);

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
    showWarn(t('Sende Vorschlag …'));
    const r = await submitProposal({ ...s, label });
    showWarn(r.ok ? t('Danke! Vorschlag eingereicht – wird nach Prüfung aufgenommen.') : t('Konnte nicht senden: ') + ((r.error && r.error.message) || r.reason || t('Fehler')));
    return;
  }
  const json = proposalJSON(label, s);
  try { await navigator.clipboard.writeText(json); } catch {}
  window.open(`mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent('Nabendeckel-Vorlage: ' + label)}&body=${encodeURIComponent('Neue Vorlage (bitte prüfen):\n\n' + json)}`, '_blank');
  showWarn(t('Maße kopiert – E-Mail-Fenster geöffnet.'));
}
function flash(btn, txt) { const o = btn.textContent; btn.textContent = txt; setTimeout(() => btn.textContent = o, 1200); }
function applyValues(values) { Object.assign(state, values); syncInputs(); onParamChange(true); }

// ============ Projekte (ganzer Zustand) ============
function buildProjectPayload() {
  const p = { type: 'wheelcap-project', version: 1, savedAt: new Date().toISOString(), state: { ...state } };
  if (state.logoMode === 'svg' && logoSvgText) p.logo = { svgText: logoSvgText, fileName: logoFileName || 'logo.svg' };
  return p;
}
function applyProjectPayload(p) {
  if (!p || p.type !== 'wheelcap-project' || !p.state) throw new Error('Keine gültige Projektdatei.');
  Object.assign(state, DEFAULTS, p.state);          // fehlende Keys -> Standard
  logoSvgText = null; logoFileName = null;
  if (p.logo && p.logo.svgText) { logoSvgText = p.logo.svgText; logoFileName = p.logo.fileName || 'logo.svg'; }
  setFileName(logoFileName || '');
  syncInputs(); updateVisibility(); onParamChange(true);
}
function newProject() {
  Object.assign(state, DEFAULTS);
  logoSvgText = null; logoFileName = null;
  currentProjectId = null; currentProjectName = '';
  setFileName(''); syncInputs(); updateVisibility(); onParamChange(true);
}
function saveProjectFile() {
  const name = (currentProjectName || 'wheelcap-projekt').replace(/[^\w\-. ]+/g, '_');
  const blob = new Blob([JSON.stringify(buildProjectPayload(), null, 2)], { type: 'application/json' });
  download(blob, name + '.wcd');   // download() zeigt bereits einen Toast
}
function openProjectFile(then) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.wcd,.json,application/json';
  inp.onchange = async () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    try {
      const p = JSON.parse(await f.text());
      applyProjectPayload(p);
      currentProjectId = null;
      currentProjectName = f.name.replace(/\.(wcd|json)$/i, '');
      showToast(t('✓ Projekt geöffnet: ') + currentProjectName);
      if (then) then();
    } catch (e) { showToast(t('⚠ Datei konnte nicht geöffnet werden')); }
  };
  inp.click();
}
function saveProjectToBrowser(name) {
  const nm = (name || currentProjectName || '').trim() || (t('Projekt') + ' ' + new Date().toLocaleString(uiLocale()));
  const payload = buildProjectPayload();
  if (currentProjectId) { updateProject(currentProjectId, nm, payload); }
  else { const rec = saveProject(nm, payload); currentProjectId = rec.id; }
  currentProjectName = nm;
  renderHomeList();
  showToast(t('✓ Projekt gespeichert: ') + nm);
}
function openBrowserProject(rec) {
  try { applyProjectPayload(rec.payload); currentProjectId = rec.id; currentProjectName = rec.name; showToast(t('✓ Projekt geöffnet: ') + rec.name); }
  catch (e) { showToast(t('⚠ Projekt beschädigt')); }
}

// ============ Startseite ============
function showHome() { renderHomeList(); document.getElementById('home').classList.add('show'); }
function hideHome() { document.getElementById('home').classList.remove('show'); }
function renderHomeList() {
  const list = document.getElementById('homeList'); if (!list) return;
  const projs = loadProjects();
  list.innerHTML = '';
  if (!projs.length) { list.innerHTML = `<div class="empty">${t('Noch keine gespeicherten Projekte. Speichere im Designer über „Projekt".')}</div>`; return; }
  for (const rec of projs) {
    const row = document.createElement('div'); row.className = 'home-row';
    const main = document.createElement('div'); main.className = 'hr-main';
    const nm = document.createElement('div'); nm.className = 'hr-name'; nm.textContent = rec.name;
    const dt = document.createElement('div'); dt.className = 'hr-date';
    dt.textContent = new Date(rec.savedAt).toLocaleString(uiLocale(), { dateStyle: 'medium', timeStyle: 'short' });
    main.append(nm, dt);
    const open = document.createElement('button'); open.className = 'hr-open'; open.textContent = t('Öffnen');
    const del = document.createElement('button'); del.className = 'hr-del'; del.innerHTML = '&times;'; del.title = t('Löschen');
    const doOpen = () => { openBrowserProject(rec); hideHome(); };
    main.addEventListener('click', doOpen);
    open.addEventListener('click', doOpen);
    del.addEventListener('click', (e) => { e.stopPropagation(); deleteProject(rec.id); if (currentProjectId === rec.id) currentProjectId = null; renderHomeList(); });
    row.append(main, open, del); list.appendChild(row);
  }
}
function setupHome() {
  document.getElementById('homeNew').addEventListener('click', () => { newProject(); hideHome(); });
  document.getElementById('homeOpen').addEventListener('click', () => openProjectFile(hideHome));
  document.getElementById('homeContinue').addEventListener('click', hideHome);
  // Kein Schließen durch Klick auf den Hintergrund – nur die Buttons öffnen den Designer.
  const hb = document.getElementById('homeBtn');
  if (hb) { hb.addEventListener('click', showHome); hb.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showHome(); } }); }
}

// ============ Aufbau + Modus ============
function buildUI() {
  const root = document.getElementById('controls');
  buildProjectSection(root);
  buildLibrarySection(root);

  for (const g of GROUPS) {
    const sec = document.createElement('div'); sec.className = 'section'; sec.dataset.group = g.id;
    sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS[g.icon] || ''}</span><h2>${t(g.label)}</h2><span class="chev"></span></div>`;
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
  document.getElementById('themeToggle').addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));
  document.getElementById('download').addEventListener('click', downloadSTL);
  setMode(mode);
}

function buildExportSection(root) {
  const sec = document.createElement('div'); sec.className = 'section';
  sec.innerHTML = `<div class="section-head"><span class="ico">${ICONS.palette}</span><h2>${t('Export')}</h2><span class="chev"></span></div>`;
  const body = document.createElement('div'); body.className = 'section-body';
  const b1 = document.createElement('button'); b1.className = 'btn btn-ghost btn-block'; b1.textContent = t('STL herunterladen');
  b1.addEventListener('click', downloadSTL);
  const b2 = document.createElement('button'); b2.className = 'btn btn-ghost btn-block'; b2.style.marginTop = '8px'; b2.textContent = t('3MF · mit Farben (Bambu Studio)');
  b2.addEventListener('click', download3MF);
  body.append(b1, b2);
  body.insertAdjacentHTML('beforeend', `<div class="hint" style="margin-top:8px">${t('Eine Datei, beide Teile korrekt positioniert. <b>3MF</b> enthält die Farben – Bambu Studio erkennt Deckel + Logo als getrennte Objekte. STL ist farblos (Teile lassen sich im Slicer trennen).')}</div>`);
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
  if (state.outerDiameter <= state.mountDiameter) msgs.push(t('Außen-Ø muss größer als Montage-Ø sein.'));
  const d = derive(state);
  if (d.clipW < 4) msgs.push(t('Zu viele/zu breite Clips.'));
  if (state.gripThickness + state.barbRamp > d.skirtH) msgs.push(t('Klemmdicke + Einführschräge > Clip-Länge.'));
  if (msgs.length) { warnEl.textContent = '⚠ ' + msgs.join('  ·  '); warnEl.classList.add('show'); }
  else warnEl.classList.remove('show');
}

async function rebuild() {
  if (building) { pending = true; return; }
  building = true; statusEl.classList.add('show'); checkWarnings();
  await new Promise(r => setTimeout(r, 20));
  try {
    let logo = null;
    if (state.logoMode === 'shape') {
      logo = { geometry: shapeToGeometry(state.logoShape, state.logoDepth, state.logoSize) };
    } else if (state.logoMode === 'svg' && logoSvgText) {
      try { logo = { geometry: svgToGeometry(logoSvgText, state.logoDepth, state.logoSize) }; }
      catch (e) { showWarn(e.message); }
    } else if (state.logoMode === 'text' && state.logoText.trim()) {
      logo = { geometry: await textToGeometry(state.logoText, state.logoDepth, state.logoSize) };
    }
    const { body, bodyExport, logo: logoGeo, logoExport } = await buildCap(state, logo);
    // Anzeige = kantenbetont (body/logoGeo); Export = exakt wasserdicht (…Export).
    if (capMesh) { capMesh.geometry.dispose(); capMesh.userData.exportGeo?.dispose(); capMesh.geometry = body; }
    else { capMesh = new THREE.Mesh(body, capMaterial); scene.add(capMesh); frameObject(body); }
    capMesh.userData.exportGeo = bodyExport;
    if (logoGeo) {
      if (logoMesh) { logoMesh.geometry.dispose(); logoMesh.userData.exportGeo?.dispose(); logoMesh.geometry = logoGeo; logoMesh.visible = true; }
      else { logoMesh = new THREE.Mesh(logoGeo, logoMaterial); scene.add(logoMesh); }
      logoMesh.userData.exportGeo = logoExport;
    } else if (logoMesh) { logoMesh.visible = false; logoMesh.geometry.dispose(); logoMesh.userData.exportGeo?.dispose(); logoMesh.userData.exportGeo = null; logoMesh.geometry = new THREE.BufferGeometry(); }
    updateBadge(bodyExport, logoExport);
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
    `<span>${t('Höhe')} <b>${s.y.toFixed(1)}</b> mm</span><span class="sep"></span>` +
    `<span>${t('Material')} <b>${vol.toFixed(1)}</b> cm³</span>`;
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
  showToast('✓ ' + name + ' ' + t('heruntergeladen'));
}

// Kurze Bestätigung bei jedem Download (jedes Mal, nicht nur einmal pro Sitzung).
let toastEl = null, toastTimer = null;
function showToast(msg) {
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl); }
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ---- Ko-fi ----
const KOFI = { id: 'O8C525LFQ2', color: '#72a4f2', text: 'Kaffee spendieren' };
let kofiHTML = null;
function initKofi() {
  const s = document.createElement('script');
  s.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
  s.onload = () => {
    try {
      window.kofiwidget2.init(t(KOFI.text), KOFI.color, KOFI.id);
      kofiHTML = window.kofiwidget2.getHTML();
      const top = document.getElementById('kofiTop'); if (top) top.innerHTML = kofiHTML;
    } catch (e) { console.warn('Ko-fi:', e); }
  };
  document.head.appendChild(s);
}
function setupDownloadPopup() {
  const modal = document.getElementById('dlModal');
  const hide = () => modal.classList.remove('show');
  document.getElementById('dlClose').addEventListener('click', hide);
  document.getElementById('dlContinue').addEventListener('click', hide);
  modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
}
function showDownloadPopup() {
  if (sessionStorage.getItem('nd_kofi_shown')) return;   // pro Sitzung nur einmal
  sessionStorage.setItem('nd_kofi_shown', '1');
  const pop = document.getElementById('kofiPopup');
  if (pop && kofiHTML && !pop.innerHTML) pop.innerHTML = kofiHTML;
  document.getElementById('dlModal').classList.add('show');
}
// Nur Position behalten, damit sich Deckel- und Logo-Geometrie verschmelzen lassen.
function forExport(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', g.getAttribute('position').clone());
  return out;
}
function baseName() { return `wheelcap_${state.outerDiameter}x${state.mountDiameter}mm`; }

// Immer die wasserdichte Export-Geometrie verwenden (nicht die Anzeige-Variante).
function capExportGeo() { return capMesh.userData.exportGeo || capMesh.geometry; }
function logoExportGeo() { return logoMesh.userData.exportGeo || logoMesh.geometry; }

function downloadSTL() {
  if (!capMesh) return;
  const geos = [forExport(capExportGeo())];
  if (logoMesh && logoMesh.visible) geos.push(forExport(logoExportGeo()));
  const merged = geos.length > 1 ? mergeGeometries(geos, false) : geos[0];
  download(stlBlob(merged), baseName() + '.stl');
  showDownloadPopup();
}

function download3MF() {
  if (!capMesh) return;
  const parts = [{ geometry: capExportGeo(), color: state.capColor, name: t('Deckel') }];
  if (logoMesh && logoMesh.visible) parts.push({ geometry: logoExportGeo(), color: state.logoColor, name: 'Logo' });
  download(export3MF(parts), baseName() + '.3mf');
  showDownloadPopup();
}

// ============ MakerWorld-Link + Feedback ============
function setupMakerWorld() {
  const a = document.getElementById('mwLink');
  if (!a) return;
  if (MAKERWORLD_URL) {
    a.href = MAKERWORLD_URL;
    const img = a.querySelector('img');
    if (img && img.dataset.src) img.src = img.dataset.src;   // Logo erst jetzt laden
    a.style.display = '';
  } else {
    a.style.display = 'none';
  }
}

function setupFeedback() {
  const modal = document.getElementById('fbModal');
  const starsEl = document.getElementById('fbStars');
  const textEl = document.getElementById('fbText');
  const emailEl = document.getElementById('fbEmail');
  const sendBtn = document.getElementById('fbSend');
  const st = document.getElementById('fbStatus');
  if (!modal) return;
  let picked = 0;
  const renderStars = () => buildStars(starsEl, picked, (n) => { picked = n; renderStars(); });
  const close = () => modal.classList.remove('show');
  const open = () => {
    picked = 0; textEl.value = ''; emailEl.value = ''; st.textContent = ''; st.className = 'fb-status';
    sendBtn.disabled = false; sendBtn.textContent = t('Feedback senden');
    renderStars(); modal.classList.add('show');
  };
  document.getElementById('feedbackBtn').addEventListener('click', open);
  document.getElementById('fbClose').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  sendBtn.addEventListener('click', async () => {
    const message = textEl.value.trim();
    if (!picked && !message) { st.className = 'fb-status err'; st.textContent = t('Bitte Sterne oder eine Nachricht angeben.'); return; }
    if (!supabaseEnabled()) { st.className = 'fb-status err'; st.textContent = t('Feedback ist gerade nicht verfügbar.'); return; }
    sendBtn.disabled = true; sendBtn.textContent = t('Sende …');
    const r = await submitFeedback({ rating: picked, message, email: emailEl.value.trim() });
    if (r.ok) { st.className = 'fb-status ok'; st.textContent = t('Danke für dein Feedback! 🙌'); setTimeout(close, 1400); }
    else { st.className = 'fb-status err'; st.textContent = t('Konnte nicht senden: ') + ((r.error && r.error.message) || r.reason || t('Fehler')); sendBtn.disabled = false; sendBtn.textContent = t('Feedback senden'); }
  });
}

// ============ Sprache (i18n) ============
function setBtnText(btn, txt) {
  if (!btn) return;
  const svg = btn.querySelector('svg');
  btn.textContent = '';
  if (svg) { btn.appendChild(svg); btn.appendChild(document.createTextNode(' ' + txt)); }
  else btn.textContent = txt;
}
function setText(sel, txt) { const el = document.querySelector(sel); if (el) el.textContent = txt; }
function setAttr(sel, attr, val) { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); }

function setupI18nStatic() {
  applyHtmlLang();
  // Topbar
  setText('.brand p', t('Maße einstellen · Logo wählen · als STL / 3MF herunterladen'));
  setText('#modeToggle button[data-mode="standard"]', t('Standard'));
  setText('#modeToggle button[data-mode="expert"]', t('Experte'));
  setBtnText(document.getElementById('download'), t('STL herunterladen'));
  setAttr('#feedbackBtn', 'title', t('Feedback geben')); setAttr('#feedbackBtn', 'aria-label', t('Feedback geben'));
  setAttr('#themeToggle', 'title', t('Hell/Dunkel umschalten')); setAttr('#themeToggle', 'aria-label', t('Hell/Dunkel umschalten'));
  setAttr('#homeBtn', 'title', t('Zur Startseite'));
  // Stage
  setText('.hintbar', t('Linksklick: drehen · Rechtsklick: verschieben · Scrollen: zoomen'));
  const stSpan = document.querySelector('#status span:last-child'); if (stSpan) stSpan.textContent = t('berechne…');
  setText('#fatal h3', t('Konnte nicht laden'));
  setText('#fatal p', t('Die 3D-Bibliothek konnte nicht geladen werden (Internetverbindung nötig).'));
  // Download-Popup
  setText('#dlModal h3', t('Dein Nabendeckel wird geladen …'));
  setText('#dlModal p', t('Wenn dir WheelCapDesigner gefällt, freue ich mich riesig über einen Kaffee. Danke! 🙌'));
  setText('#dlContinue', t('Weiter zum Designen'));
  // Feedback
  setText('#fbModal h3', t('Feedback zum Designer'));
  setText('#fbModal p', t('Wie gefällt dir WheelCapDesigner? Über Sterne und ein paar Worte freue ich mich sehr.'));
  setAttr('#fbText', 'placeholder', t('Was läuft gut, was fehlt dir?'));
  setAttr('#fbEmail', 'placeholder', t('E-Mail (optional, für Rückfragen)'));
  setText('#fbSend', t('Feedback senden'));
  // Startseite
  setText('.home-brand p', t('Nabendeckel selbst gestalten – Maße, Logo, 3D-Vorschau, STL/3MF'));
  setText('#homeNew .ht-t', t('Neues Projekt'));
  setText('#homeNew .ht-s', t('Leer mit Standardmaßen starten'));
  setText('#homeOpen .ht-t', t('Projekt öffnen'));
  setText('#homeOpen .ht-s', t('.wcd-Datei vom Rechner laden'));
  setText('.home-recent-head span:first-child', t('Gespeicherte Projekte'));
  setText('.home-recent-head span:last-child', t('in diesem Browser'));
  setText('#homeContinue', t('Aktuelles Projekt weiter bearbeiten →'));
}

function setupLangSwitcher() {
  const row = document.getElementById('langRow'); if (!row) return;
  const cur = getLang();
  row.innerHTML = '';
  for (const l of LANGS) {
    const b = document.createElement('button');
    b.className = 'lang-btn' + (l.code === cur ? ' active' : '');
    b.type = 'button'; b.title = l.name; b.setAttribute('aria-label', l.name);
    b.innerHTML = `<span class="flag">${FLAGS[l.code]}</span>`;
    b.addEventListener('click', () => { if (l.code === getLang()) return; setLang(l.code); location.reload(); });
    row.appendChild(b);
  }
}

// ============ Start ============
try {
  initThree(); buildUI(); initGeometry(); rebuild();
  setupDownloadPopup(); initKofi(); setupMakerWorld(); setupFeedback();
  setupI18nStatic(); setupLangSwitcher();
  setupHome(); showHome();
  if (supabaseEnabled()) {
    fetchCommunityGroup().then(g => { if (g && g.brands.length) { library = [...BRAND_LIBRARY, g]; refreshBrands(); refreshRateBox(); } });
  }
} catch (e) {
  console.error(e);
  document.getElementById('fatal').classList.add('show');
  document.getElementById('fatal-msg').textContent = e.message + '\n' + (e.stack || '');
}
