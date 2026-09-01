// Supabase-Anbindung für die gemeinsame Vorlagen-Bibliothek.
// Der Anon-Key ist bewusst öffentlich (durch Row-Level-Security abgesichert).
// Nach dem Anlegen des Supabase-Projekts hier URL + Anon-Key eintragen:

export const SUPABASE_URL = 'https://wndpyolpisazwbivvukw.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZHB5b2xwaXNhendiaXZ2dWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MzI0MjUsImV4cCI6MjEwMzUwODQyNX0.N6KFKVF07ZCSnV6noxGSoJFnAiQPnWyDRWXPhKesn2Y';

export function supabaseEnabled() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

let clientPromise = null;
async function getClient() {
  if (!supabaseEnabled()) return null;
  if (!clientPromise) {
    clientPromise = import('https://esm.sh/@supabase/supabase-js@2')
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  }
  return clientPromise;
}

// Freigegebene Vorlagen laden, gruppiert als eine „Community"-Gruppe für die UI.
export async function fetchCommunityGroup() {
  try {
    const c = await getClient();
    if (!c) return null;
    const { data, error } = await c
      .from('cap_templates')
      .select('id,brand,label,outer_diameter,mount_diameter,total_height,clip_count')
      .eq('approved', true)
      .order('brand', { ascending: true });
    if (error || !data || !data.length) return null;

    // Bewertungs-Zusammenfassung laden (best effort – fehlt die View, bleibt es leer).
    const sum = {};
    try {
      const { data: rs } = await c.from('cap_rating_summary').select('template_id,avg_rating,votes');
      if (rs) for (const r of rs) sum[r.template_id] = { avg: +r.avg_rating || 0, votes: +r.votes || 0 };
    } catch (_) { /* View evtl. noch nicht angelegt */ }

    const byBrand = new Map();
    for (const r of data) {
      if (!byBrand.has(r.brand)) byBrand.set(r.brand, []);
      byBrand.get(r.brand).push({
        id: r.id,
        label: r.label,
        rating: sum[r.id] || { avg: 0, votes: 0 },
        values: {
          outerDiameter: +r.outer_diameter, mountDiameter: +r.mount_diameter,
          totalHeight: +r.total_height || 12, clipCount: +r.clip_count || 6,
        },
      });
    }
    return {
      group: 'Community',
      brands: [...byBrand.entries()].map(([name, entries]) => ({ name, entries })),
    };
  } catch (e) { console.warn('Supabase fetch fehlgeschlagen:', e); return null; }
}

// Einen Vorschlag einreichen. Landet in cap_proposals (status = 'new') zur Moderation.
export async function submitProposal(p) {
  const c = await getClient();
  if (!c) return { ok: false, reason: 'not-configured' };
  const { error } = await c.from('cap_proposals').insert({
    brand: p.brand || null,
    label: p.label,
    outer_diameter: p.outerDiameter,
    mount_diameter: p.mountDiameter,
    total_height: p.totalHeight,
    clip_count: p.clipCount,
    submitted_by: p.email || null,
    note: p.note || null,
  });
  return { ok: !error, error };
}

// Eine Vorlage bewerten (1–5). Pro Browser (voter) eine Stimme – Upsert überschreibt.
export async function rateTemplate(templateId, rating, voter) {
  const c = await getClient();
  if (!c) return { ok: false, reason: 'not-configured' };
  const { error } = await c
    .from('cap_ratings')
    .upsert({ template_id: templateId, rating, voter }, { onConflict: 'template_id,voter' });
  if (error) return { ok: false, error };
  // Aktualisierten Schnitt zurückgeben
  const summary = await fetchTemplateRating(templateId);
  return { ok: true, summary };
}

// Aktuellen Schnitt + Stimmenzahl einer Vorlage holen.
export async function fetchTemplateRating(templateId) {
  const c = await getClient();
  if (!c) return null;
  try {
    const { data } = await c
      .from('cap_rating_summary')
      .select('avg_rating,votes')
      .eq('template_id', templateId)
      .maybeSingle();
    return data ? { avg: +data.avg_rating || 0, votes: +data.votes || 0 } : { avg: 0, votes: 0 };
  } catch (_) { return { avg: 0, votes: 0 }; }
}

// Allgemeines Feedback zum Designer senden.
export async function submitFeedback(f) {
  const c = await getClient();
  if (!c) return { ok: false, reason: 'not-configured' };
  const { error } = await c.from('cap_feedback').insert({
    rating: f.rating || null,
    message: f.message || null,
    email: f.email || null,
  });
  return { ok: !error, error };
}
