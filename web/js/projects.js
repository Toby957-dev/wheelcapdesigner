// Ganze Projekte lokal im Browser speichern (localStorage).
// Ein Projekt enthält den kompletten Zustand (Maße, Logo, Farben, SVG …).

const KEY = 'wcd_projects_v1';

export function loadProjects() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function persist(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { console.warn('Projekt speichern fehlgeschlagen:', e); }
}

export function saveProject(name, payload) {
  const list = loadProjects();
  const id = 'p_' + Date.now().toString(36);
  const rec = { id, name, savedAt: new Date().toISOString(), payload };
  list.unshift(rec);
  persist(list);
  return rec;
}

export function updateProject(id, name, payload) {
  const list = loadProjects();
  const i = list.findIndex(p => p.id === id);
  if (i < 0) return saveProject(name, payload);
  list[i] = { ...list[i], name, payload, savedAt: new Date().toISOString() };
  persist(list);
  return list[i];
}

export function deleteProject(id) {
  persist(loadProjects().filter(p => p.id !== id));
}

export function getProject(id) {
  return loadProjects().find(p => p.id === id) || null;
}
