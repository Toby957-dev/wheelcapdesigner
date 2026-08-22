// Eigene Vorlagen des Nutzers – lokal im Browser gespeichert (localStorage).

const KEY = 'nd_user_presets_v1';

export function loadUserPresets() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function persist(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function saveUserPreset(label, values) {
  const list = loadUserPresets();
  const id = 'u_' + Date.now().toString(36);
  list.push({ id, label, values });
  persist(list);
  return id;
}

export function deleteUserPreset(id) {
  persist(loadUserPresets().filter(p => p.id !== id));
}

// JSON-Payload zum Vorschlagen einer Vorlage (für Community-Sammlung / E-Mail / Export).
export function proposalJSON(label, values, meta = {}) {
  return JSON.stringify({
    type: 'nabendeckel-vorlage',
    label,
    values,
    submittedBy: meta.email || '',
    note: meta.note || '',
    date: new Date().toISOString(),
  }, null, 2);
}
