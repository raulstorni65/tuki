/* ============================================================
   resolver.js — Toda la data determinística de una página.
   NO usa IA. Si un dato no está en las hojas, la página no sale.
   ============================================================ */

const MAX_DIAS_PRECIO_PLAN = 45;   // si el precio del plan está más viejo, rechaza

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const num = (v) => {
  const n = parseFloat(String(v).replace(/[^0-9.,-]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
  return isFinite(n) ? n : null;
};
const slugify = (s) => clean(s).toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function matchMarca(nombreEnHoja, marca) {
  const k = slugify(nombreEnHoja);
  return k === marca.slug || (marca.match || []).includes(k);
}

/** "5000|4700|1|10" -> [{nominal, precio, stock, usd}] */
function parseDenoms(raw) {
  return clean(raw).split(';').map((chunk) => {
    const [nominal, precio, stock, usd] = chunk.split('|').map((x) => num(x));
    return { nominal, precio, stock: stock == null ? 0 : stock, usd: usd == null ? null : usd };
  }).filter((d) => d.nominal > 0 && d.precio > 0)
    .sort((a, b) => a.nominal - b.nominal);
}

function parseLista(raw) {
  return clean(raw).split(/[,;]/).map(clean).filter(Boolean);
}

function diasDesde(fechaISO) {
  const d = new Date(fechaISO);
  if (isNaN(d)) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function calcularCobertura(planes, denoms) {
  const porDenom = {};
  denoms.forEach((d) => {
    porDenom[d.nominal] = planes
      .map((p) => ({ plan: p.plan, precio_plan: p.precio, meses: Math.floor(d.nominal / p.precio) }))
      .sort((a, b) => b.precio_plan - a.precio_plan);
  });
  return porDenom;
}

/**
 * Gate de datos. Las marcas de tipo "saldo" (Google Play) no tienen un plan
 * fijo al que cubrir — el saldo es de uso libre — así que no exigimos ni
 * calculamos cobertura en meses para ellas.
 */
function validar({ pais, marca, denoms, planes, coberturaPorDenom, regionCode }) {
  const faltan = [];
  const esSuscripcion = marca.tipo !== 'saldo';

  if (!regionCode) faltan.push('falta Region_Code (¿es region-locked o no?)');
  if (!denoms.length) faltan.push('sin denominaciones válidas');
  if (!denoms.some((d) => d.stock > 0)) faltan.push('ninguna denominación con stock');
  if (!pais.moneda || !pais.simbolo) faltan.push('falta moneda/símbolo del país');
  if (pais.medios_pago.length < 2) faltan.push('menos de 2 medios de pago locales cargados');
  if (clean(pais.impuestos_nota).length < 60) faltan.push('nota de impuestos del país vacía o demasiado corta');
  if (!pais.region_canje) faltan.push('falta región de canje');

  if (esSuscripcion) {
    if (!planes.length) faltan.push(`sin precios de planes de ${marca.nombre} en ${pais.nombre}`);
    planes.forEach((p) => {
      const d = diasDesde(p.actualizado);
      if (d > MAX_DIAS_PRECIO_PLAN) {
        faltan.push(`precio del plan "${p.plan}" desactualizado (${d} días) — actualizá la hoja Planes`);
      }
    });
    const algunaCubre = Object.values(coberturaPorDenom || {})
      .some((filas) => filas.some((f) => f.meses >= 1));
    if (!algunaCubre) faltan.push('ninguna denominación cubre ni un mes de ningún plan (revisá precios)');
  }

  return faltan;
}

function resolver({ fila, paisesRaw, planesRaw, catalogo, marcasDef }) {
  const paisRow = paisesRaw.find((p) => clean(p.Pais) === clean(fila.Pais));
  if (!paisRow) throw new Error(`El país "${fila.Pais}" no está en la hoja Paises`);

  const pais = {
    iso: clean(paisRow.Codigo_ISO).toUpperCase(),
    nombre: clean(paisRow.Pais),
    moneda: clean(paisRow.Moneda),
    simbolo: clean(paisRow.Simbolo),
    locale: clean(paisRow.Locale_hreflang),
    medios_pago: parseLista(paisRow.Medios_Pago),
    impuestos_nota: clean(paisRow.Impuestos_Nota),
    region_canje: clean(paisRow.Region_Canje),
    registro: clean(paisRow.Registro),
  };

  const marcaKey = slugify(fila.Marca);
  const marca = marcasDef.find((m) => m.slug === marcaKey || (m.match || []).includes(marcaKey));
  if (!marca) throw new Error(`La marca "${fila.Marca}" no está definida`);

  const denoms = parseDenoms(fila.Denominaciones);
  const regionCode = clean(fila.Region_Code);
  const imagen = clean(fila.Imagen);

  const planes = planesRaw
    .filter((p) => matchMarca(p.Marca, marca) && clean(p.Pais) === pais.nombre)
    .map((p) => ({
      plan: clean(p.Plan),
      precio: num(p.Precio_Plan_Local),
      actualizado: clean(p.Fecha_Actualizacion),
    }))
    .filter((p) => p.precio > 0);

  const conStock = denoms.filter((d) => d.stock > 0);
  const coberturaPorDenom = marca.tipo === 'saldo' ? {} : calcularCobertura(planes, denoms);
  const nominalRef = conStock.length ? conStock[0].nominal : (denoms[0] ? denoms[0].nominal : 0);
  const cobertura = coberturaPorDenom[nominalRef] || [];
  const actualizado = planes.length ? planes[0].actualizado : '';

  const motivos = validar({ pais, marca, denoms, planes, coberturaPorDenom, regionCode });
  if (motivos.length) {
    return { ok: false, motivos, pais, marca };
  }

  const hermanos = catalogo
    .filter((c) => matchMarca(c.Marca, marca))
    .map((c) => {
      const pr = paisesRaw.find((p) => clean(p.Pais) === clean(c.Pais));
      if (!pr) return null;
      const iso = clean(pr.Codigo_ISO).toUpperCase();
      return {
        iso,
        nombre: clean(pr.Pais),
        locale: clean(pr.Locale_hreflang),
        url: `/${iso.toLowerCase()}/${marca.slug}-gift-card/`,
      };
    })
    .filter(Boolean)
    .filter((h, i, arr) => arr.findIndex((x) => x.iso === h.iso) === i);

  const paises = paisesRaw.map((p) => ({
    iso: clean(p.Codigo_ISO).toUpperCase(),
    nombre: clean(p.Pais),
    moneda: clean(p.Moneda),
    simbolo: clean(p.Simbolo),
    locale: clean(p.Locale_hreflang),
    region_canje: clean(p.Region_Canje),
    impuestos_nota: clean(p.Impuestos_Nota),
    medios_pago: parseLista(p.Medios_Pago),
  }));

  const marcaPlana = {
    slug: marca.slug, nombre: marca.nombre, vencimiento: marca.vencimiento,
    tipo: marca.tipo || 'suscripcion', usos: marca.usos || null,
  };
  const marcasPlanas = marcasDef.map((m) => ({ slug: m.slug, nombre: m.nombre }));

  return {
    ok: true,
    marca: marcaPlana,
    pais,
    paises,
    marcas: marcasPlanas,
    denominaciones: denoms,
    cobertura,
    cobertura_por_denom: coberturaPorDenom,
    nominal_ref: nominalRef,
    planes_actualizado: actualizado,
    region_code: regionCode,
    imagen,
    hermanos,
    entrega: clean(fila.Entrega) || '5 a 30 minutos',
    canje: marca.canje(pais),
    url: `/${pais.iso.toLowerCase()}/${marca.slug}-gift-card/`,
  };
}

/* Definición de marcas. Los pasos de canje son REALES y distintos por marca.
   "tipo" distingue las que cargan saldo de uso libre (no tiene sentido
   calcularles "meses de cobertura") de las que pagan una suscripción fija. */
const voseaPais = (p) => /voseo/i.test(String(p.registro || ''));
const VM = (p, conVoseo, conTuteo) => (voseaPais(p) ? conVoseo : conTuteo);

const MARCAS = [
  {
    slug: 'netflix', nombre: 'Netflix', tipo: 'suscripcion',
    vencimiento: 'Sin vencimiento',
    canje: (p) => [
      `${VM(p,'Entrá','Entra')} a netflix.com/redeem desde una cuenta de ${p.region_canje}.`,
      VM(p,'Ingresá','Ingresa') + ' el código de 11 dígitos que te mandamos por mail.',
      'El saldo queda acreditado en tu cuenta y se descuenta automáticamente cada mes.',
      'Cuando el saldo se agota, Netflix te pide un medio de pago. ' + VM(p,'Podés','Puedes') + ' cargar otra tarjeta antes de que pase.',
    ],
  },
  {
    slug: 'spotify', nombre: 'Spotify', tipo: 'suscripcion',
    vencimiento: 'Sin vencimiento',
    canje: (p) => [
      `${VM(p,'Entrá','Entra')} a spotify.com/redeem con tu cuenta de ${p.region_canje}.`,
      VM(p,'Pegá','Pega') + ' el código. Si ya ' + VM(p,'tenés','tienes') + ' Premium pago, el saldo se aplica al terminar el ciclo actual.',
      'Si estás en el plan gratuito, se activa Premium Individual por los meses que cubra la tarjeta.',
      'El código no sirve para planes Dúo, Familiar ni Estudiante.',
    ],
  },
  {
    slug: 'disney-plus', nombre: 'Disney+', tipo: 'suscripcion', match: ['disney', 'disney-plus'],
    vencimiento: 'Sin vencimiento',
    canje: (p) => [
      `${VM(p,'Entrá','Entra')} a disneyplus.com/redeem desde una cuenta de ${p.region_canje}.`,
      VM(p,'Cargá','Carga') + ' el código. Se aplica como saldo o como meses de suscripción según el tipo de tarjeta.',
      'Si ' + VM(p,'tenés','tienes') + ' una suscripción activa por app store, primero ' + VM(p,'cancelala','cancélala') + ': los códigos no se aplican sobre suscripciones de terceros.',
      VM(p,'Verificá','Verifica') + ' en Cuenta > Suscripción que quedó acreditado.',
    ],
  },
  {
    slug: 'prime-video', nombre: 'Prime Video', tipo: 'suscripcion',
    vencimiento: 'Sin vencimiento',
    canje: (p) => [
      `${VM(p,'Entrá','Entra')} a la sección de gift cards de Amazon con tu cuenta de ${p.region_canje}.`,
      VM(p,'Cargá','Carga') + ' el código: el saldo queda en tu cuenta de Amazon.',
      'Desde Prime Video, ' + VM(p,'elegí','elige') + ' pagar la suscripción con el saldo de la gift card.',
      'El saldo de Amazon es por región: una tarjeta de otro país no se acredita en esta cuenta.',
    ],
  },
  {
    slug: 'google-play', nombre: 'Google Play', tipo: 'saldo', match: ['google-play', 'googleplay', 'google'],
    vencimiento: 'Sin vencimiento',
    usos: ['Apps y juegos de Play Store', 'Compras dentro de apps y juegos', 'Suscripciones como YouTube Premium', 'Alquiler o compra de películas y series'],
    canje: (p) => [
      `${VM(p,'Abrí','Abre')} play.google.com/redeem o la app de Google Play con una cuenta de ${p.region_canje}.`,
      VM(p,'Ingresá','Ingresa') + ' el código: el saldo queda en tu cuenta de Google Play.',
      'Usás el saldo cuando quieras, en lo que quieras dentro de Google Play: no está atado a una sola app ni a un plan fijo.',
      'El saldo de Google Play es por región: una tarjeta de otro país no se acredita en esta cuenta.',
    ],
  },
];
