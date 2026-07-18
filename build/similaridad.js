/* ============================================================
   similaridad.js — Gate anti-duplicado. Sin IA, determinístico.
   Compara la página nueva contra TODAS las hermanas ya publicadas
   de la misma marca (otros países). Si se parecen demasiado, no sale.
   Fuente de verdad de nodes/nodo-similaridad.js
   ============================================================ */

const UMBRAL = 0.55;   // subilo/bajalo mirando las primeras 10 páginas
const SHINGLE = 5;     // n-gramas de 5 palabras

/** Deja solo el texto visible: sin tags, sin scripts, sin JSON-LD. */
function textoVisible(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shingles(texto, n = SHINGLE) {
  const w = texto.split(' ').filter(Boolean);
  const set = new Set();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(' '));
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

/**
 * @param htmlNuevo   HTML de la página que se quiere publicar
 * @param hermanas    [{ url, html }] páginas ya publicadas de la misma marca
 * @returns { ok, peor: { url, score }, scores: [...] }
 */
function chequear(htmlNuevo, hermanas, umbral = UMBRAL) {
  const sNuevo = shingles(textoVisible(htmlNuevo));
  const scores = hermanas.map((h) => ({
    url: h.url,
    score: Number(jaccard(sNuevo, shingles(textoVisible(h.html))).toFixed(3)),
  })).sort((a, b) => b.score - a.score);

  const peor = scores[0] || { url: null, score: 0 };
  return { ok: peor.score < umbral, peor, scores, umbral };
}
