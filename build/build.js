/* Build local del piloto: lee los CSV, resuelve, renderiza y corre el gate.
   Node 18+. Uso: node build/build.js  */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'site');

// Cargamos los módulos "planos" (no usan module.exports para poder pegarse en n8n)
const ctx = { console };
vm.createContext(ctx);
const EXPORTS = {
  'templates.js': ['paginaPais', 'hubMarca', 'hubPais', 'home', 'paginaSimple', 'sitemap', 'SITE_NAME', 'SITE_URL', 'SITE_EMAIL', 'esc', 'header', 'footer', 'head'],
  'resolver.js': ['resolver', 'MARCAS', 'slugify', 'matchMarca'],
  'similaridad.js': ['chequear', 'textoVisible'],
  'contenido.js': ['CONTENIDO'],
  'institucionales.js': ['INSTITUCIONALES'],
};
for (const f of Object.keys(EXPORTS)) {
  const src = fs.readFileSync(path.join(__dirname, f), 'utf8');
  const glue = '\n' + EXPORTS[f].map((n) => `globalThis[${JSON.stringify(n)}] = ${n};`).join('\n');
  vm.runInContext(src + glue, ctx, { filename: f });
}

// --- CSV mínimo (soporta comillas) ---
function parseCSV(txt) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) {
      if (c === '"' && txt[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.some((x) => x.trim()))
    .map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const sheet = (n) => parseCSV(fs.readFileSync(path.join(ROOT, 'sheets', n), 'utf8'));
const catalogo = sheet('Catalogo.csv');
const paisesRaw = sheet('Paises.csv');
const planesRaw = sheet('Planes.csv');

const write = (rel, contenido) => {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, contenido);
};

// --- Pasada 1: resolver + copy (todavía no renderizamos) ---
const candidatos = [];
const rechazadas = [];

for (const fila of catalogo) {
  const d = ctx.resolver({ fila, paisesRaw, planesRaw, catalogo, marcasDef: ctx.MARCAS });
  if (!d.ok) { rechazadas.push({ fila, motivos: d.motivos }); continue; }

  const key = `${d.marca.slug}|${d.pais.iso}`;
  const copy = ctx.CONTENIDO[key];
  if (!copy) { rechazadas.push({ fila, motivos: ['sin copy en build/contenido.js'] }); continue; }

  candidatos.push({ d, copy });
}

// La navegación (selector de país, footer, "otros países") tiene que listar SOLO
// lo que de verdad se publica. Si no, quedan links a páginas que no existen.
const paisesObj = [...new Map(candidatos.map((c) => [c.d.pais.iso, c.d.pais])).values()];
const marcasObj = [...new Map(candidatos.map((c) => [c.d.marca.slug, c.d.marca])).values()];
const isosVivos = new Set(paisesObj.map((p) => p.iso));

// --- Pasada 2: render + gate + escritura ---
const publicadas = [];   // { url, html, marca, pais, precioDesde, denomMin }

for (const { d, copy } of candidatos) {
  const html = ctx.paginaPais({
    ...d, ...copy,
    paises: paisesObj,
    marcas: marcasObj,
    hermanos: d.hermanos.filter((h) => isosVivos.has(h.iso)),
  });

  // GATE: contra las hermanas ya publicadas de la MISMA marca
  const hermanas = publicadas.filter((p) => p.marca.slug === d.marca.slug);
  const chk = ctx.chequear(html, hermanas);
  if (!chk.ok) {
    rechazadas.push({ fila: { Marca: d.marca.nombre, Pais: d.pais.nombre },
                      motivos: [`duplicado con ${chk.peor.url} (jaccard ${chk.peor.score} >= ${chk.umbral})`] });
    continue;
  }
  if (hermanas.length) {
    console.log(`  similaridad ${d.url} -> ${chk.peor.url}: ${chk.peor.score} (umbral ${chk.umbral}) OK`);
  }

  write(d.url + 'index.html', html);
  const conStock = d.denominaciones.filter((x) => x.stock > 0);

  // Regla de negocio: la tarjeta más barata TIENE que alcanzar para al menos
  // un mes del plan más caro. Si no, el artículo se ve flojo.
  if (d.marca.tipo !== 'saldo' && conStock.length) {
    const menor = Math.min(...conStock.map((x) => x.nominal));
    const caro = (d.cobertura_por_denom[menor] || [])[0];
    if (caro && caro.meses < 1) {
      console.log(`  AVISO ${d.url}: la tarjeta más barata (${menor}) no cubre 1 mes de "${caro.plan}" (${caro.precio_plan}). Subí la denominación mínima.`);
    }
  }

  publicadas.push({
    url: d.url, html, marca: d.marca, pais: d.pais, imagen: d.imagen,
    precioDesde: Math.min(...conStock.map((x) => x.precio)),
    denomMin: Math.min(...conStock.map((x) => x.nominal)),
  });
}

// --- Hubs de marca ---

const hubsMarca = [];
for (const marca of marcasObj) {
  const filas = publicadas.filter((p) => p.marca.slug === marca.slug)
    .map((p) => ({ pais: p.pais, precioDesde: p.precioDesde, denomMin: p.denomMin }));
  const html = ctx.hubMarca({ marca, filas, paises: paisesObj, marcas: marcasObj });
  write(`/${marca.slug}-gift-card/index.html`, html);
  hubsMarca.push({ url: `/${marca.slug}-gift-card/`, html, indexable: filas.length >= 2 });
}

// --- Hubs de país ---
const hubsPais = [];
for (const pais of paisesObj) {
  const filas = publicadas.filter((p) => p.pais.iso === pais.iso)
    .map((p) => ({ marca: p.marca, precioDesde: p.precioDesde }));
  const html = ctx.hubPais({ pais, filas, paises: paisesObj, marcas: marcasObj });
  write(`/${pais.iso.toLowerCase()}/index.html`, html);
  hubsPais.push({ url: `/${pais.iso.toLowerCase()}/`, html });
}

// --- Home + institucionales ---
const homeHtml = ctx.home({ paises: paisesObj, marcas: marcasObj, catalogo: publicadas });
write('/index.html', homeHtml);
for (const i of ctx.INSTITUCIONALES) {
  write('/' + i.slug + '/index.html', ctx.paginaSimple({ ...i, paises: paisesObj, marcas: marcasObj }));
}

// --- Sitemap + índice ---
const urls = [
  '/',
  // Los hubs con un solo país salen con noindex: no van al sitemap.
  ...hubsMarca.filter((h) => h.indexable).map((h) => h.url),
  ...paisesObj.map((p) => `/${p.iso.toLowerCase()}/`),
  ...publicadas.map((p) => p.url),
  ...ctx.INSTITUCIONALES.map((i) => '/' + i.slug + '/'),
];
write('/sitemap.xml', ctx.sitemap(urls));

// robots.txt se genera para que la URL del sitemap siga a SITE_URL.
// Antes era un archivo a mano y se desincronizaba al cambiar de dominio.
write('/robots.txt', [
  'User-agent: *',
  'Allow: /',
  'Disallow: /checkout/',
  '',
  `Sitemap: ${ctx.SITE_URL}/sitemap.xml`,
  '',
].join('\n'));
write('/data/catalogo.json', JSON.stringify(publicadas.map((p) => ({
  marca: p.marca.slug, marca_nombre: p.marca.nombre,
  pais: p.pais.iso, pais_nombre: p.pais.nombre, moneda: p.pais.moneda,
  url: p.url, precio_desde: p.precioDesde, denom_min: p.denomMin,
})), null, 2));

// --- Gate global: ninguna página indexable puede parecerse demasiado a otra.
// El gate original solo miraba productos de la misma marca; los hubs se le escapaban.
const indexables = [
  { url: '/', html: homeHtml },
  ...hubsPais,
  ...publicadas.map((p) => ({ url: p.url, html: p.html })),
  ...hubsMarca.filter((h) => h.indexable),
];
const choques = [];
for (let i = 0; i < indexables.length; i++) {
  for (let j = i + 1; j < indexables.length; j++) {
    const chk = ctx.chequear(indexables[i].html, [indexables[j]]);
    if (chk.peor.score >= 0.45) {
      choques.push(`${indexables[i].url} vs ${indexables[j].url}: ${chk.peor.score}`);
    }
  }
}
if (choques.length) {
  console.log(`\n⚠ páginas indexables demasiado parecidas (>= 0.45):`);
  choques.forEach((c) => console.log('   ' + c));
} else {
  console.log(`\n✔ gate global: ${indexables.length} páginas indexables, ninguna se parece de más`);
}

console.log(`\n✔ publicadas: ${publicadas.length}`);
publicadas.forEach((p) => console.log('   ' + p.url));
if (rechazadas.length) {
  console.log(`\n✖ rechazadas: ${rechazadas.length}`);
  rechazadas.forEach((r) => console.log(`   ${r.fila.Marca} / ${r.fila.Pais} → ${r.motivos.join(' | ')}`));
}
