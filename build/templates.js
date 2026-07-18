/* ============================================================
   templates.js — Motor de HTML del sitio tukicards.
   Solo render: los datos llegan ya resueltos y validados desde
   resolver.js. No hay lógica de negocio acá.
   ============================================================ */

const SITE_NAME  = 'Tukicards';
const SITE_URL   = 'https://www.tukicards.com';   // sin barra final — CONFIRMAR dominio real
const SITE_MARK  = 'T';
const SITE_EMAIL = 'contacto@tukicards.com';

const BRAND_COLORS = {
  'netflix': '#E50914',
  'spotify': '#1DB954',
  'disney-plus': '#2B57F0',
  'prime-video': '#00A8E1',
  'google-play': '#01875F',
};
const brandColor = (slug) => BRAND_COLORS[slug] || '#1B3FCC';

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const jsonld = (obj) => JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/');

const fmt = (n, pais) => {
  const v = Number(n) || 0;
  // Enteros sin decimales ($10.000). Con decimales, siempre dos (S/44,90).
  const dec = Number.isInteger(v) ? 0 : 2;
  return new Intl.NumberFormat(pais.locale, {
    minimumFractionDigits: dec, maximumFractionDigits: dec,
  }).format(v);
};

const money = (n, pais) => `${pais.simbolo}${fmt(n, pais)}`;

const vos = (pais) => /voseo/i.test(String(pais && pais.registro || ''));
const V = (pais, conVoseo, conTuteo) => (vos(pais) ? conVoseo : conTuteo);

const urlPagina = (marca, pais) => `/${pais.iso.toLowerCase()}/${marca.slug}-gift-card/`;
const urlHubMarca = (marca) => `/${marca.slug}-gift-card/`;
const urlHubPais = (pais) => `/${pais.iso.toLowerCase()}/`;
const urlBandera = (pais) => `/img/paises/${pais.iso.toLowerCase()}.svg`;

/** Chip con la bandera del país. Se usa en el hero de cada página con país. */
const chipBandera = (pais) =>
  `<span class="flag-chip"><img src="${urlBandera(pais)}" alt="Bandera de ${esc(pais.nombre)}" width="24" height="16" loading="lazy" /> ${esc(pais.nombre)} · ${esc(pais.moneda)}</span>`;

/* ---------------- Partes comunes ---------------- */

function head({ title, desc, canonical, alternates = [], extraCss = [], jsonldBlocks = [], locale, noindex = false }) {
  // hreflang solo tiene sentido con 2+ versiones de idioma/país. Con una sola es ruido.
  const conAlternates = alternates.length > 1;
  const hreflangs = conAlternates ? alternates
    .map((a) => `  <link rel="alternate" hreflang="${esc(a.locale)}" href="${esc(SITE_URL + a.url)}" />`)
    .join('\n') : '';
  const xdefault = conAlternates
    ? `  <link rel="alternate" hreflang="x-default" href="${esc(SITE_URL + alternates[0].xdefault)}" />`
    : '';
  // noindex: la página se puede visitar y Google sigue los links, pero no la lista.
  const robots = noindex
    ? '  <meta name="robots" content="noindex, follow" />\n'
    : '';
  const css = ['/styles.css', ...extraCss]
    .map((h) => `  <link rel="stylesheet" href="${h}" />`).join('\n');
  const ld = jsonldBlocks
    .map((b) => `  <script type="application/ld+json">\n${jsonld(b)}\n  </script>`).join('\n');

  return `<!DOCTYPE html>
<html lang="${esc(locale || 'es')}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
${robots}
  <link rel="canonical" href="${esc(SITE_URL + canonical)}" />
${hreflangs}
${xdefault}

  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="${esc(SITE_NAME)}" />
  <meta property="og:locale" content="${esc((locale || 'es-AR').replace('-', '_'))}" />
  <meta property="og:url" content="${esc(SITE_URL + canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/favicon.svg" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
${css}
  <meta name="theme-color" content="#1B3FCC" />
${ld}
</head>`;
}

function header(paisActual, paises) {
  const chips = paises.map((p) => {
    const activo = paisActual && p.iso === paisActual.iso;
    return `<a href="${urlHubPais(p)}"${activo ? ' aria-current="true"' : ''}>${esc(p.iso)}</a>`;
  }).join('');
  return `
  <header class="site-header">
    <div class="wrap">
      <nav class="nav" aria-label="Principal">
        <a href="/" class="logo"><span class="mark">${esc(SITE_MARK)}</span>${esc(SITE_NAME)}</a>
        <div class="nav-links">
          <a href="/como-funciona/">Cómo funciona</a>
          <a href="/medios-de-pago/">Medios de pago</a>
          <a href="/preguntas-frecuentes/">Ayuda</a>
          <div class="country-switch" aria-label="Elegí tu país">${chips}</div>
        </div>
      </nav>
    </div>
  </header>`;
}

function footer(marcas, paises) {
  const cols = marcas
    .map((m) => `<li><a href="${urlHubMarca(m)}">${esc(m.nombre)}</a></li>`).join('');
  const cps = paises
    .map((p) => `<li><a href="${urlHubPais(p)}">${esc(p.nombre)}</a></li>`).join('');
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <a href="/" class="logo" style="color:#fff"><span class="mark">${esc(SITE_MARK)}</span>${esc(SITE_NAME)}</a>
          <p style="margin-top:12px;font-size:.88rem;max-width:32ch">Gift cards digitales con el código de la región de tu país. Entrega por mail en minutos.</p>
          <p style="margin-top:12px"><a class="footer-mail" href="mailto:${esc(SITE_EMAIL)}">${esc(SITE_EMAIL)}</a></p>
        </div>
        <div><h4>Marcas</h4><ul>${cols}</ul></div>
        <div><h4>Países</h4><ul>${cps}</ul></div>
        <div><h4>Ayuda</h4><ul>
          <li><a href="/como-funciona/">Cómo funciona</a></li>
          <li><a href="/medios-de-pago/">Medios de pago</a></li>
          <li><a href="/preguntas-frecuentes/">Preguntas frecuentes</a></li>
          <li><a href="/contacto/">Contacto</a></li>
        </ul></div>
        <div><h4>Legal</h4><ul>
          <li><a href="/garantia/">Garantía</a></li>
          <li><a href="/devoluciones/">Devoluciones</a></li>
          <li><a href="/terminos-y-condiciones/">Términos y condiciones</a></li>
          <li><a href="/politica-de-privacidad/">Privacidad</a></li>
          <li><a href="/politica-de-cookies/">Cookies</a></li>
        </ul></div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${esc(SITE_NAME)}</span>
        <span>Somos un revendedor independiente. No estamos afiliados a Netflix, Spotify, Disney, Amazon ni Google.</span>
      </div>
    </div>
  </footer>`;
}

/* ---------------- Imagen del producto ---------------- */
/* Talón ilustrado por defecto: no es un placeholder gris, tiene identidad
   de marca (gradiente, textura, ribbon). Si cargás una imagen propia en la
   columna Imagen del catálogo, esa reemplaza a este dibujo. */

function mediaProducto(d) {
  const { marca, pais, region_code, imagen } = d;
  if (imagen) {
    return `<div class="producto-media"><img src="${esc(imagen)}" alt="${esc(marca.nombre)} Gift Card ${esc(pais.nombre)} — código región ${esc(region_code)}" loading="lazy" width="640" height="360" /></div>`;
  }
  const c = brandColor(marca.slug);
  const svg = `<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(marca.nombre)} Gift Card ${esc(pais.nombre)}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".78"/>
      </linearGradient>
      <radialGradient id="glow" cx="80%" cy="10%" r="70%">
        <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.4" fill="#fff" opacity=".12"/>
      </pattern>
    </defs>
    <rect width="640" height="360" rx="20" fill="url(#g)"/>
    <rect width="640" height="360" rx="20" fill="url(#dots)"/>
    <rect width="640" height="360" rx="20" fill="url(#glow)"/>
    <circle cx="560" cy="80" r="120" fill="#fff" opacity=".06"/>
    <circle cx="40" cy="320" r="90" fill="#000" opacity=".08"/>
    <rect x="34" y="34" width="150" height="30" rx="15" fill="#fff" opacity=".16"/>
    <text x="52" y="54" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="600" fill="#fff" letter-spacing="1">GIFT CARD</text>
    <text x="44" y="150" font-family="Archivo, sans-serif" font-weight="800" font-size="40" fill="#fff">${esc(marca.nombre)}</text>
    <text x="44" y="182" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#fff" opacity="0.92">Código región ${esc(region_code)} · ${esc(pais.nombre)}</text>
    <rect x="44" y="252" width="1" height="0" />
    <line x1="44" y1="238" x2="596" y2="238" stroke="#fff" stroke-opacity=".22" stroke-dasharray="2 6" stroke-width="2" stroke-linecap="round"/>
    <text x="44" y="272" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="14" fill="#fff" opacity="0.85">Entrega digital por mail · 5 a 30 min</text>
    <circle cx="580" cy="70" r="26" fill="#fff"/>
    <text x="580" y="79" font-family="Archivo, sans-serif" font-weight="800" font-size="24" fill="${c}" text-anchor="middle">${esc(SITE_MARK)}</text>
  </svg>`;
  return `<div class="producto-media">${svg}</div>`;
}

/* ---------------- Página país × marca ---------------- */

function paginaPais(d) {
  const { marca, pais, denominaciones, cobertura, cobertura_por_denom, nominal_ref,
          planes_actualizado, seo, descripcion, faqs, region_code,
          hermanos, paises, marcas, entrega, canje, imagen } = d;

  const url = urlPagina(marca, pais);
  const brand = brandColor(marca.slug);
  const esSaldo = marca.tipo === 'saldo';

  const alternates = hermanos.map((h) => ({ locale: h.locale, url: h.url, xdefault: urlHubMarca(marca) }));

  const disponibles = denominaciones.filter((x) => x.stock > 0);
  const precioDesde = disponibles.length ? Math.min(...disponibles.map((x) => x.precio)) : null;

  const offers = denominaciones.map((x) => ({
    '@type': 'Offer',
    name: `${marca.nombre} Gift Card ${money(x.nominal, pais)} — ${pais.nombre}`,
    url: SITE_URL + url,
    priceCurrency: pais.moneda,
    price: String(x.precio),
    availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    eligibleRegion: { '@type': 'Country', name: pais.nombre },
    seller: { '@type': 'Organization', name: SITE_NAME },
  }));

  const ldProduct = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${marca.nombre} Gift Card — ${pais.nombre}`,
    description: seo.desc,
    sku: `GC-${marca.slug.toUpperCase()}-${pais.iso}`,
    image: imagen ? [SITE_URL + imagen] : undefined,
    brand: { '@type': 'Brand', name: marca.nombre },
    category: `Gift cards > ${marca.nombre} > ${pais.nombre}`,
    offers,
  };

  const ldBreadcrumb = {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: pais.nombre, item: SITE_URL + urlHubPais(pais) },
      { '@type': 'ListItem', position: 3, name: `${marca.nombre} Gift Card` },
    ],
  };

  const ldFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const maxMeses = Math.max(1, ...Object.values(cobertura_por_denom).flat().map((c) => c.meses), 1);
  // Plan de referencia = el más caro de la marca en ese país (cobertura viene ordenada desc).
  const planRef = (cobertura && cobertura[0]) || { plan: '', precio_plan: 0, meses: 0 };
  const heat = (m) => (m < 1 ? 0 : m < 3 ? 1 : m < 6 ? 2 : 3);
  const mesesTxt = (m) => (m >= 1 ? `${m} ${m === 1 ? 'mes' : 'meses'}` : 'menos de 1 mes');

  const pillsCobertura = (filas) => filas.map((c) =>
    `<span class="pc-pill" data-heat="${heat(c.meses)}"><b>${mesesTxt(c.meses)}</b> de ${esc(c.plan)}</span>`
  ).join('\n              ');

  const bloqueCoberturaInicial = esSaldo
    ? `<div class="pc-usos">
              <span class="pc-coverage-label">Con este saldo podés pagar</span>
              <ul class="pc-usos-list">${(marca.usos || []).map((u) => `<li>${esc(u)}</li>`).join('')}</ul>
            </div>`
    : `<div class="pc-coverage" id="pc-coverage">
              <span class="pc-coverage-label">Te alcanza para</span>
              <div class="pc-pills" id="pc-pills">
              ${pillsCobertura(cobertura)}
              </div>
            </div>`;

  const denMap = {};
  denominaciones.forEach((x) => { denMap[x.nominal] = { precio: x.precio, usd: x.usd || '' }; });

  return `${head({
    title: seo.title,
    desc: seo.desc,
    canonical: url,
    alternates,
    extraCss: ['/pagina.css'],
    locale: pais.locale,
    jsonldBlocks: [ldProduct, ldBreadcrumb, ldFaq],
  })}
<body data-marca="${esc(marca.slug)}" data-pais="${esc(pais.iso)}" style="--brand:${brand}">
${header(pais, paises)}

  <main class="wrap">
    <nav class="breadcrumb" aria-label="Miga de pan">
      <a href="/">Inicio</a> / <a href="${urlHubPais(pais)}">${esc(pais.nombre)}</a> / <span>${esc(marca.nombre)} Gift Card</span>
    </nav>

    <div class="producto">

      <!-- ===== Contenido ===== -->
      <div class="contenido">
        ${mediaProducto(d)}
        <div class="prod-eyebrow">
          ${chipBandera(pais)}
          <span class="eyebrow">Región ${esc(region_code)}</span>
        </div>
        <h1>${esc(marca.nombre)} Gift Card ${esc(pais.nombre)}</h1>
        <p class="resumen">${esc(seo.resumen)}</p>

        ${descripcion.map((p) => `<p style="color:var(--ink-2);margin-bottom:10px">${esc(p)}</p>`).join('\n        ')}

        <section class="bloque">
          <h2>Qué te da cada tarjeta en ${esc(pais.nombre)}</h2>
          ${esSaldo ? `
          <p class="muted" style="font-size:.92rem">El saldo de ${esc(marca.nombre)} es libre: no está atado a un plan, así que lo ${V(pais, "gastás", "gastas")} en lo que quieras dentro de la tienda. Estos son los valores disponibles y su precio final.</p>
          <table class="table" style="margin-top:12px">
            <thead><tr><th>Valor de la tarjeta</th><th>Se acredita</th><th>${V(pais, "Pagás", "Pagas")}</th></tr></thead>
            <tbody>
              ${denominaciones.map((x) => `<tr>
                <td><strong>${money(x.nominal, pais)}</strong>${x.stock > 0 ? '' : ' <span class="muted" style="font-size:.8rem">(agotado)</span>'}</td>
                <td class="n">${money(x.nominal, pais)} de saldo</td>
                <td class="n" style="color:var(--value);font-weight:700">${money(x.precio, pais)}</td>
              </tr>`).join('\n              ')}
            </tbody>
          </table>` : `
          <p class="muted" style="font-size:.92rem">Tomamos como referencia el <strong>${esc(planRef.plan)}</strong>, que es el plan más caro de ${esc(marca.nombre)} en ${esc(pais.nombre)} (${money(planRef.precio_plan, pais)} al mes). Si ${V(pais, "usás", "usas")} un plan más barato, la tarjeta te rinde más meses.</p>
          <table class="table" style="margin-top:12px">
            <thead><tr>
              <th>Valor de la tarjeta</th>
              <th>${esc(planRef.plan)}</th>
              <th>Ese plan, oficial</th>
              <th>Te sobra de saldo</th>
              <th>${V(pais, "Pagás", "Pagas")}</th>
            </tr></thead>
            <tbody>
              ${denominaciones.map((x) => {
                const filas = cobertura_por_denom[x.nominal] || [];
                const ref = filas[0] || { meses: 0, precio_plan: 0 };
                const oficial = ref.meses * ref.precio_plan;
                const sobra = x.nominal - oficial;
                return `<tr>
                <td><strong>${money(x.nominal, pais)}</strong>${x.stock > 0 ? '' : ' <span class="muted" style="font-size:.8rem">(agotado)</span>'}</td>
                <td class="n">${ref.meses >= 1 ? `${ref.meses} ${ref.meses === 1 ? 'mes' : 'meses'}` : 'no alcanza'}</td>
                <td class="n">${money(oficial, pais)}</td>
                <td class="n">${money(sobra, pais)}</td>
                <td class="n" style="color:var(--value);font-weight:700">${money(x.precio, pais)}</td>
              </tr>`;
              }).join('\n              ')}
            </tbody>
          </table>
          <p class="muted" style="font-size:.84rem;margin-top:10px">El saldo que sobra no se pierde: queda en tu cuenta y se descuenta el mes siguiente. Sobre el precio de la tarjeta cobramos entre 2% y 3% por el servicio (conseguir el código de la región ${esc(region_code)} y entregártelo por mail sin que necesites tarjeta internacional).</p>`}
        </section>

        <section class="bloque">
          <h2>Impuestos y restricciones en ${esc(pais.nombre)}</h2>
          <div class="notice">${esc(pais.impuestos_nota)}</div>
        </section>

        <section class="bloque">
          <h2>Cómo ${V(pais, "pagás", "pagas")} desde ${esc(pais.nombre)}</h2>
          <p class="muted" style="font-size:.92rem">Cobramos en ${esc(pais.moneda)}. Sin conversión, sin tarjeta internacional.</p>
          <div class="pagos">
            ${pais.medios_pago.map((m) => `<span class="pago">${esc(m)}</span>`).join('\n            ')}
          </div>
        </section>

        <section class="bloque">
          <h2>Cómo se canjea</h2>
          <ol class="pasos">
            ${canje.map((p) => `<li><span>${esc(p)}</span></li>`).join('\n            ')}
          </ol>
        </section>

        <section class="bloque faq">
          <h2>Preguntas frecuentes</h2>
          ${faqs.map((f) => `<details>
            <summary>${esc(f.q)}</summary>
            <p>${esc(f.a)}</p>
          </details>`).join('\n          ')}
        </section>

        ${hermanos.filter((h) => h.iso !== pais.iso).length ? `<section class="bloque">
          <h2>La misma gift card en otros países</h2>
          <p class="muted" style="font-size:.92rem">Cada versión tiene su propio código de región y su propio precio. No son intercambiables.</p>
          <div class="otros-paises">
            ${hermanos.filter((h) => h.iso !== pais.iso).map((h) => `<a href="${h.url}">${esc(marca.nombre)} ${esc(h.nombre)}</a>`).join('\n            ')}
          </div>
        </section>` : ''}
      </div>

      <!-- ===== UN SOLO bloque: elegir monto + precio + para cuánto alcanza + comprar ===== -->
      <aside class="pc" id="pc">
        <div class="pc-top">
          <span class="pc-brand">${esc(marca.nombre)}</span>
          <span class="pc-flag" data-pais="${esc(pais.iso)}"><img src="${urlBandera(pais)}" alt="" width="20" height="14" /> ${esc(pais.iso)} · ${esc(pais.moneda)}</span>
        </div>

        <div class="pc-body">
          ${disponibles.length ? `<span class="stock"><span class="dot"></span>En stock · entrega en ${esc(entrega)}</span>` : `<span class="stock" style="color:var(--muted)"><span class="dot" style="background:var(--muted)"></span>Sin stock por ahora</span>`}

          <span class="pc-label">${V(pais, "Elegí", "Elige")} el valor de la tarjeta</span>
          <div class="pc-denoms" role="radiogroup" aria-label="${V(pais, 'Elegí', 'Elige')} la denominación" id="pc-denoms">
            ${denominaciones.map((x, i) => `<label class="pc-denom${i === 0 && x.stock > 0 ? ' sel' : ''}${x.stock > 0 ? '' : ' off'}">
              <input type="radio" name="denom" value="${x.nominal}" hidden ${i === 0 && x.stock > 0 ? 'checked' : ''} ${x.stock > 0 ? '' : 'disabled'} />
              <span class="pc-nominal">${money(x.nominal, pais)}</span>
              ${x.stock > 0 ? '' : `<span class="pc-agotado">agotado</span>`}
            </label>`).join('\n            ')}
          </div>
          <p class="pc-explain">Es el saldo que se acredita en tu cuenta de ${esc(marca.nombre)}. El precio final lo ${V(pais, "ves", "ves")} en el botón de compra.</p>

          ${bloqueCoberturaInicial}

          ${precioDesde !== null
            ? `<a class="btn btn-primary btn-block btn-lg" id="btn-comprar" href="/checkout/">Comprar por <span id="btn-precio">${money(denominaciones.find((x) => x.nominal === nominal_ref).precio, pais)}</span></a>`
            : `<button class="btn btn-ghost btn-block" disabled>${V(pais, "Avisame", "Avísame")} cuando haya stock</button>`}

          <div class="pc-meta">
            <span><b>Región del código</b> ${esc(region_code)}</span>
            <span><b>Se canjea en</b> ${esc(pais.region_canje)}</span>
            <span><b>Entrega</b> ${esc(entrega)}</span>
            <span><b>Vencimiento</b> ${esc(marca.vencimiento)}</span>
          </div>
        </div>
      </aside>
    </div>
  </main>
${footer(marcas, paises)}
<script>
  const COB = ${JSON.stringify(cobertura_por_denom).replace(/</g, '\\u003c')};
  const DEN = ${JSON.stringify(denMap).replace(/</g, '\\u003c')};
  const LOCALE = ${JSON.stringify(pais.locale)};
  const FMT = { format: (v) => {
    const dec = Number.isInteger(Number(v)) ? 0 : 2;
    return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(Number(v) || 0);
  } };
  const SIM = ${JSON.stringify(pais.simbolo)};
  const ES_SALDO = ${JSON.stringify(esSaldo)};
  const BUY = {
    marca: ${JSON.stringify(marca.nombre)}, pais: ${JSON.stringify(pais.nombre)},
    iso: ${JSON.stringify(pais.iso)}, moneda: ${JSON.stringify(pais.moneda)},
    sim: ${JSON.stringify(pais.simbolo)}, img: ${JSON.stringify(imagen || '')},
  };
  const btn = document.getElementById('btn-comprar');
  const pills = document.getElementById('pc-pills');

  function heat(m) { return m < 1 ? 0 : m < 3 ? 1 : m < 6 ? 2 : 3; }
  function mesesTxt(m) { return m >= 1 ? m + (m === 1 ? ' mes' : ' meses') : 'menos de 1 mes'; }

  function pintar(nominal) {
    if (!ES_SALDO && pills) {
      const filas = COB[nominal] || [];
      pills.innerHTML = filas.map((c) =>
        '<span class="pc-pill" data-heat="' + heat(c.meses) + '"><b>' + mesesTxt(c.meses) + '</b> de ' + c.plan + '</span>'
      ).join('');
    }
    const d = DEN[nominal];
    if (btn && d) {
      const precioTxt = SIM + FMT.format(d.precio);
      const span = document.getElementById('btn-precio');
      if (span) span.textContent = precioTxt;
      const u = new URLSearchParams({
        marca: BUY.marca, pais: BUY.pais, iso: BUY.iso, moneda: BUY.moneda, sim: BUY.sim,
        nominal: String(nominal), precio: String(d.precio), usd: String(d.usd || ''), img: BUY.img,
      });
      btn.href = '/checkout/?' + u.toString();
    }
  }

  document.querySelectorAll('#pc-denoms input').forEach((r) => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.pc-denom').forEach((d) => d.classList.remove('sel'));
      if (!r.checked) return;
      r.closest('.pc-denom').classList.add('sel');
      pintar(r.value);
    });
  });

  pintar(${JSON.stringify(String(nominal_ref))});
</script>
</body>
</html>`;
}

/* ---------------- Hub de marca ---------------- */

function hubMarca(d) {
  const { marca, filas, paises, marcas } = d;
  const url = urlHubMarca(marca);

  const ldProduct = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${marca.nombre} Gift Card`,
    description: `Gift card de ${marca.nombre} con código de la región de cada país. Precio en moneda local.`,
    brand: { '@type': 'Brand', name: marca.nombre },
    offers: filas.map((f) => ({
      '@type': 'Offer',
      url: SITE_URL + urlPagina(marca, f.pais),
      priceCurrency: f.pais.moneda,
      price: String(f.precioDesde),
      availability: 'https://schema.org/InStock',
      eligibleRegion: { '@type': 'Country', name: f.pais.nombre },
      seller: { '@type': 'Organization', name: SITE_NAME },
    })),
  };

  const alternates = filas.map((f) => ({
    locale: f.pais.locale, url: urlPagina(marca, f.pais), xdefault: url,
  }));

  // Con un solo país esta página es una tabla de una fila: no aporta nada que no
  // esté en el artículo, y las de las distintas marcas quedan casi idénticas.
  // Se saca del índice hasta que haya 2+ países que comparar.
  const soloUnPais = filas.length < 2;

  return `${head({
    title: `${marca.nombre} Gift Card — precio por país | ${SITE_NAME}`,
    desc: `Gift card de ${marca.nombre} con el código de la región de tu país, en moneda local y con medios de pago locales.`,
    canonical: url,
    alternates,
    locale: 'es',
    noindex: soloUnPais,
    jsonldBlocks: soloUnPais ? [] : [ldProduct],
  })}
<body style="--brand:${brandColor(marca.slug)}">
${header(null, paises)}
  <main class="wrap">
    <section class="section">
      <span class="eyebrow">Gift card</span>
      <h1>${esc(marca.nombre)} Gift Card</h1>
      <p class="lead" style="margin-top:12px">Las gift cards de ${esc(marca.nombre)} tienen <strong>código por región</strong>: la que compraste para un país no se canjea en otro. Elegí tu país y vas a ver el precio en tu moneda, las denominaciones que existen ahí y los medios de pago que podés usar.</p>

      <h2 style="margin:38px 0 14px">Elegí tu país</h2>
      <table class="table">
        <thead><tr><th>País</th><th>Moneda</th><th>Desde</th><th>Denominación mínima</th><th></th></tr></thead>
        <tbody>
          ${filas.map((f) => `<tr>
            <td><strong>${esc(f.pais.nombre)}</strong></td>
            <td class="n">${esc(f.pais.moneda)}</td>
            <td class="n" style="color:var(--value);font-weight:600">${money(f.precioDesde, f.pais)}</td>
            <td class="n">${money(f.denomMin, f.pais)}</td>
            <td><a class="btn btn-ghost" style="padding:7px 14px" href="${urlPagina(marca, f.pais)}">Ver ${esc(f.pais.nombre)}</a></td>
          </tr>`).join('\n          ')}
        </tbody>
      </table>
      <p class="muted" style="font-size:.85rem;margin-top:12px">Los precios de cada país están en su propia moneda y no son comparables entre sí.</p>
    </section>
  </main>
${footer(marcas, paises)}
</body>
</html>`;
}

/* ---------------- Hub de país ---------------- */

function hubPais(d) {
  const { pais, filas, paises, marcas } = d;
  const url = urlHubPais(pais);

  return `${head({
    title: `Gift cards en ${pais.nombre} — código región ${pais.iso} | ${SITE_NAME}`,
    desc: `Gift cards digitales con código de la región ${pais.iso}. ${V(pais, "Pagás", "Pagas")} en ${pais.moneda} con ${pais.medios_pago.slice(0, 2).join(' o ')}. Entrega por mail.`,
    canonical: url,
    locale: pais.locale,
    jsonldBlocks: [{
      '@context': 'https://schema.org/',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: pais.nombre },
      ],
    }],
  })}
<body>
${header(pais, paises)}
  <main>
    <section class="pais-hero" style="--flag:url('${urlBandera(pais)}')">
      <div class="pais-hero-bg" aria-hidden="true"></div>
      <div class="wrap pais-hero-inner">
        <img class="pais-hero-flag" src="${urlBandera(pais)}" alt="Bandera de ${esc(pais.nombre)}" width="84" height="56" />
        <div>
          <span class="eyebrow">${esc(pais.iso)} · ${esc(pais.moneda)}</span>
          <h1>Gift cards en ${esc(pais.nombre)}</h1>
          <p class="lead" style="margin-top:12px">Todas las tarjetas de esta página son de la <strong>región ${esc(pais.iso)}</strong>: se canjean en cuentas de ${esc(pais.region_canje)}. ${V(pais, "Pagás", "Pagas")} en ${esc(pais.moneda)} con ${esc(pais.medios_pago.slice(0, 3).join(', '))}.</p>
        </div>
      </div>
    </section>

    <section class="section wrap" style="padding-top:34px">
      <div class="grid grid-4">
        ${filas.map((f) => `<a class="card card-link brand-card" href="${urlPagina(f.marca, pais)}" style="--brand:${brandColor(f.marca.slug)}">
          <span class="brand-dot">${esc(f.marca.nombre.slice(0, 1))}</span>
          <span class="brand-name">${esc(f.marca.nombre)}</span>
          <p class="from">Desde <strong>${money(f.precioDesde, pais)}</strong></p>
        </a>`).join('\n        ')}
      </div>

      <div class="notice" style="margin-top:32px">${esc(pais.impuestos_nota)}</div>
    </section>
  </main>
${footer(marcas, paises)}
</body>
</html>`;
}

/* ---------------- Sitemap ---------------- */

function sitemap(urls) {
  const hoy = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${hoy}</lastmod></url>`).join('\n')}
</urlset>`;
}

/* ---------------- Home ---------------- */

function home(d) {
  const { paises, marcas, catalogo = [] } = d;
  // El artículo destacado es el primero del catálogo (columna Orden_Subida).
  const destacado = catalogo[0] || null;
  return `${head({
    title: `${SITE_NAME} — Gift cards con el código de tu país`,
    desc: 'Gift cards de Netflix, Spotify y Google Play con el código de la región de tu país. Pagás en tu moneda con medios locales y recibís el código por mail.',
    canonical: '/',
    locale: 'es',
    jsonldBlocks: [{
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      email: SITE_EMAIL,
    }],
  })}
<body>
${header(null, paises)}
  <main>

    <!-- ===== Hero con imagen ===== -->
    <section class="hero wrap">
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Netflix · Spotify · Disney+ · Prime Video · Google Play</span>
          <h1>Tu suscripción, pagada en tu moneda y sin sorpresas en el resumen.</h1>
          <p class="lead" style="margin-top:14px">Comprás la gift card de tu país en toda América Latina, la pagás en tu moneda local con un medio de pago de tu país, y te llega el código por mail. Sin tarjeta internacional, sin percepciones, sin que el banco te sume nada por “consumo en el exterior”.</p>
          <div class="hero-cta">
            ${paises.slice(0, 3).map((p, i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'} btn-lg" href="${urlHubPais(p)}"><img class="btn-flag" src="${urlBandera(p)}" alt="" width="22" height="15" /> Precios en ${esc(p.nombre)}</a>`).join('\n            ')}
          </div>
          <div class="hero-reassure">
            <span><span class="tick">✓</span> Entrega en 5 a 30 minutos</span>
            <span><span class="tick">✓</span> Medios de pago locales</span>
            <span><span class="tick">✓</span> Garantía: si no funciona, te lo cambiamos</span>
          </div>
        </div>
        <div class="hero-art">
          <img src="/img/hero-cards.svg" alt="Gift cards de Netflix, Spotify, Disney+, Prime Video y Google Play para distintos países de América Latina" width="560" height="520" />
        </div>
      </div>
    </section>

    <!-- ===== Artículo destacado (primero del catálogo) ===== -->
    ${destacado ? `<section class="wrap" style="padding-bottom:8px">
      <a class="destacado" href="${destacado.url}" style="--brand:${brandColor(destacado.marca.slug)}">
        <div class="destacado-art">
          <img src="${esc(destacado.imagen || `/img/cards/${destacado.marca.slug}.svg`)}" alt="${esc(destacado.marca.nombre)} Gift Card ${esc(destacado.pais.nombre)}" width="1280" height="720" loading="lazy" />
        </div>
        <div class="destacado-copy">
          <span class="destacado-tag">
            <img src="${urlBandera(destacado.pais)}" alt="" width="20" height="14" /> Destacado en ${esc(destacado.pais.nombre)}
          </span>
          <h2>${esc(destacado.marca.nombre)} Gift Card ${esc(destacado.pais.nombre)}</h2>
          <p>Saldo de la región ${esc(destacado.pais.iso)}, ${V(destacado.pais, "pagalo", "págalo")} en ${esc(destacado.pais.moneda)} con medios locales. Desde <strong>${money(destacado.precioDesde, destacado.pais)}</strong>.</p>
          <span class="destacado-cta">Ver la ficha completa →</span>
        </div>
      </a>
    </section>` : ''}

    <!-- ===== Problema / solución ===== -->
    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head">
          <h2>Pagar Netflix o Spotify con la tarjeta salió caro</h2>
          <p>Y no es culpa tuya: es cómo funciona pagar un servicio de afuera con plástico de tu banco.</p>
        </div>
        <div class="split">
          <div class="box bad">
            <h3>Con tarjeta, directo a la app</h3>
            <ul>
              <li>Se suman impuestos y recargos que no viste al contratar.</li>
              <li>El banco cobra su comisión por conversión de moneda.</li>
              <li>Se renueva sola todos los meses contra tu tarjeta.</li>
              <li>El precio “final” cambia según el tipo de cambio del día del cierre.</li>
            </ul>
          </div>
          <div class="box good">
            <h3>Con una gift card de tu país</h3>
            <ul>
              <li>Pagás una vez, en tu moneda, y el precio que ves es el que pagás.</li>
              <li>Sin recargos: no es un consumo en el exterior.</li>
              <li>No dejás ninguna tarjeta guardada. Se termina el saldo y listo.</li>
              <li>Elegís vos cuánto cargar y para cuántos meses te alcanza.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Region-lock explicado sin vueltas ===== -->
    <section class="section wrap">
      <div class="section-head">
        <h2>¿Por qué te pedimos tu país antes que nada?</h2>
        <p>Porque una gift card no es un número mágico universal. Está atada a un país.</p>
      </div>
      <p class="lead">Netflix, Spotify, Disney+, Amazon y Google emiten sus tarjetas <strong>por región</strong>, en cada uno de los países donde operamos. El código que compraste para un país solo entra en una cuenta registrada en ese mismo país. No es una regla nuestra: es de la marca, y no hay forma de saltearla.</p>
      <div class="ejemplo">
        <p>Un ejemplo real: tenés tu cuenta de Netflix registrada en <b>Argentina</b>. <span class="arrow">→</span> Necesitás una gift card de <b>Netflix región AR</b>. Una tarjeta de <b>Perú</b> o de <b>México</b>, aunque sea más barata en el papel, <b>no se va a acreditar</b> en tu cuenta. Pasa lo mismo entre cualquier par de países: por eso cada uno tiene su propia página, su precio y su stock, para que compres la que de verdad vas a poder usar.</p>
      </div>
      <p class="muted" style="margin-top:16px;font-size:.92rem">El país de tu cuenta figura en la configuración de Netflix, Spotify, Disney+, Amazon o Google. Es el que manda, no dónde estés viviendo hoy.</p>
    </section>

    <!-- ===== Marcas ===== -->
    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head">
          <h2>Elegí la marca</h2>
          <p>Cada una tiene una página por país, con su propio código de región.</p>
        </div>
        <div class="grid grid-5">
          ${marcas.map((m) => `<a class="card card-link brand-card" href="${urlHubMarca(m)}" style="--brand:${brandColor(m.slug)}">
            <span class="brand-dot">${esc(m.nombre.slice(0, 1))}</span>
            <span class="brand-name">${esc(m.nombre)}</span>
            <p class="from">Disponible en ${paises.map((p) => esc(p.iso)).join(' · ')}</p>
          </a>`).join('\n          ')}
        </div>
      </div>
    </section>

    <!-- ===== Cómo funciona ===== -->
    <section class="section wrap">
      <div class="section-head"><h2>Cómo funciona, en 4 pasos</h2></div>
      <div class="pasos-home">
        <div class="paso"><div class="n">1</div><p>Elegís tu país. Todo pasa a tu moneda y aparecen solo las denominaciones que existen ahí.</p></div>
        <div class="paso"><div class="n">2</div><p>Elegís marca y monto. Te mostramos para cuánto te alcanza esa tarjeta.</p></div>
        <div class="paso"><div class="n">3</div><p>Pagás con un medio local. Te llega el código por mail, entre 5 y 30 minutos.</p></div>
        <div class="paso"><div class="n">4</div><p>Lo canjeás en la web oficial, desde una cuenta de tu país. Listo.</p></div>
      </div>
      <div class="notice ok" style="margin-top:28px">¿Dudas antes de comprar? Escribinos a <a href="mailto:${esc(SITE_EMAIL)}" style="font-weight:600">${esc(SITE_EMAIL)}</a> y te respondemos.</div>
    </section>
  </main>
${footer(marcas, paises)}
</body>
</html>`;
}

/* ---------------- Página institucional ---------------- */

function paginaSimple({ slug, title, desc, h1, cuerpo, paises, marcas }) {
  return `${head({ title, desc, canonical: '/' + slug + '/', locale: 'es' })}
<body>
${header(null, paises)}
  <main class="wrap">
    <section class="section doc" style="max-width:72ch">
      <h1>${esc(h1)}</h1>
      ${cuerpo}
    </section>
  </main>
${footer(marcas, paises)}
</body>
</html>`;
}
