/* ============================================================
   PENDIENTE LEGAL (nota interna — NO se renderiza en el sitio):
   Términos, Privacidad y Cookies son un borrador de base. Hacelos revisar
   por un profesional con matrícula en cada país donde vendas — en Perú mirá
   además el libro de reclamaciones virtual que exige Indecopi. La política de
   cookies hay que ajustarla a las cookies que realmente termines usando.
   ============================================================ */

/* Páginas institucionales. Son estáticas: se escriben una vez y no las toca el pipeline.
   Son señal de confianza — en este rubro pesan más que en cualquier otro.
   Usan las globales SITE_NAME y SITE_EMAIL que exporta templates.js. */

const HOY_LEGAL = new Date().toISOString().slice(0, 10);

const INSTITUCIONALES = [
  {
    slug: 'como-funciona',
    title: `Cómo funciona — ${SITE_NAME}`,
    desc: 'Cómo comprás, cómo te llega el código y por qué la región importa.',
    h1: 'Cómo funciona',
    cuerpo: `
      <p class="lead">Vendemos códigos de gift card region-locked. Eso quiere decir que el código que comprás está atado a un país y solo se canjea en una cuenta de ese país.</p>
      <h2>El paso a paso</h2>
      <ol class="pasos">
        <li><span>Elegís tu país arriba a la derecha. Todo el sitio pasa a tu moneda.</span></li>
        <li><span>Elegís marca y denominación. Te mostramos cuántos meses de cada plan cubre esa tarjeta en tu país.</span></li>
        <li><span>Vas al checkout, comprás una tarjeta de Amazon por el monto indicado y pegás el código.</span></li>
        <li><span>Te llega tu código por mail, entre 5 y 30 minutos. Si el pago tarda en acreditarse, contamos desde ahí.</span></li>
        <li><span>Lo canjeás en la web oficial de la marca, desde una cuenta de tu país.</span></li>
      </ol>
      <h2>Por qué la región importa</h2>
      <p>Netflix, Spotify, Disney+, Amazon y Google emiten sus tarjetas por mercado. Una tarjeta comprada para Argentina no se acredita en una cuenta de Perú, y al revés tampoco. No es una restricción nuestra: es de la marca. Por eso cada país tiene su propia página, su propio precio y su propio stock.</p>
      <div class="notice warn">Antes de comprar, fijate en qué país está registrada tu cuenta. Un código canjeado en la región equivocada no se puede recuperar.</div>`,
  },
  {
    slug: 'medios-de-pago',
    title: `Medios de pago por país — ${SITE_NAME}`,
    desc: 'Con qué podés pagar en cada país. Siempre en moneda local.',
    h1: 'Medios de pago',
    cuerpo: `
      <p class="lead">Cobramos siempre en la moneda del país que elegiste. Nunca vas a ver un cargo en dólares ni una conversión de tu banco por comprarnos.</p>
      <h2>Argentina</h2>
      <div class="pagos">
        <span class="pago">Mercado Pago</span><span class="pago">Transferencia (CBU/CVU)</span>
        <span class="pago">Rapipago</span><span class="pago">Pago Fácil</span><span class="pago">Tarjeta en cuotas</span>
      </div>
      <p style="margin-top:12px">El precio publicado es final: no se le suman percepciones, porque no es un consumo en el exterior.</p>
      <h2>Perú</h2>
      <div class="pagos">
        <span class="pago">Yape</span><span class="pago">Plin</span>
        <span class="pago">Transferencia BCP / Interbank</span><span class="pago">PagoEfectivo</span><span class="pago">Tarjeta</span>
      </div>
      <h2>Chile</h2>
      <div class="pagos">
        <span class="pago">Webpay</span><span class="pago">Transferencia (Banco de Chile / BancoEstado)</span>
        <span class="pago">Mercado Pago</span><span class="pago">Khipu</span><span class="pago">Tarjeta</span>
      </div>
      <h2>Colombia</h2>
      <div class="pagos">
        <span class="pago">PSE</span><span class="pago">Nequi</span><span class="pago">Daviplata</span>
        <span class="pago">Transferencia Bancolombia</span><span class="pago">Efecty</span><span class="pago">Tarjeta</span>
      </div>
      <h2>México</h2>
      <div class="pagos">
        <span class="pago">SPEI (transferencia)</span><span class="pago">Mercado Pago</span>
        <span class="pago">OXXO</span><span class="pago">Tarjeta</span>
      </div>
      <p style="margin-top:12px">En todos los casos pagás en tu moneda y no te cae comisión por conversión por comprarnos a nosotros.</p>`,
  },
  {
    slug: 'garantia',
    title: `Garantía — ${SITE_NAME}`,
    desc: 'Qué cubre nuestra garantía y qué no.',
    h1: 'Garantía',
    cuerpo: `
      <p class="lead">Si el código que te mandamos no funciona, lo reemplazamos o te devolvemos la plata. Sin vueltas.</p>
      <h2>Qué cubre</h2>
      <ul>
        <li>Código inválido, ya usado o que la marca rechaza.</li>
        <li>Código de una región distinta a la que compraste.</li>
        <li>Demora de entrega mayor a 24 horas hábiles.</li>
      </ul>
      <h2>Qué no cubre</h2>
      <ul>
        <li>Códigos canjeados en una cuenta de otro país. La región está avisada en cada página y en el mail de entrega.</li>
        <li>Cambios de precio de los planes de la marca después de tu compra.</li>
        <li>Suscripciones contratadas por App Store o Google Play, que no aceptan códigos.</li>
      </ul>
      <div class="notice">Para reclamar, escribinos a <a href="mailto:${SITE_EMAIL}"><b>${SITE_EMAIL}</b></a> con el número de orden y una captura del error que te da la marca al canjear. Contestamos dentro de las 24 horas hábiles.</div>`,
  },
  {
    slug: 'devoluciones',
    title: `Devoluciones — ${SITE_NAME}`,
    desc: 'Cuándo se puede devolver una gift card digital y cómo.',
    h1: 'Devoluciones',
    cuerpo: `
      <p class="lead">Un código digital no canjeado se puede devolver. Uno ya canjeado, no: la marca no lo revierte y nosotros tampoco podemos.</p>
      <h2>Se devuelve</h2>
      <p>Si el código todavía no fue canjeado y pedís la devolución dentro de las 48 horas de la compra, te devolvemos el total por el mismo medio de pago. La devolución tarda lo que tarde tu medio de pago (Mercado Pago y Yape son casi inmediatos; una transferencia bancaria puede tardar 72 horas hábiles).</p>
      <h2>No se devuelve</h2>
      <p>Un código ya canjeado, aunque lo hayas canjeado en la región equivocada. Es la restricción más común y por eso la repetimos en cada página: verificá el país de tu cuenta antes de canjear.</p>
      <div class="notice">Para pedir una devolución, escribinos a <a href="mailto:${SITE_EMAIL}"><b>${SITE_EMAIL}</b></a> con tu número de orden.</div>`,
  },
  {
    slug: 'preguntas-frecuentes',
    title: `Preguntas frecuentes — ${SITE_NAME}`,
    desc: 'Región, entrega, medios de pago y canje. Las dudas más comunes.',
    h1: 'Preguntas frecuentes',
    cuerpo: `
      <div class="faq" style="margin-top:20px">
        <details open><summary>¿Por qué hay una página por país?</summary><p>Porque son productos distintos. El código, el precio, la moneda, las denominaciones y los medios de pago cambian según el país. Una gift card de Netflix Argentina no es la misma que una de Netflix Perú, y no se pueden usar de forma intercambiable.</p></details>
        <details><summary>¿Cómo sé de qué país es mi cuenta?</summary><p>En la configuración de tu cuenta de Netflix, Spotify, Disney+, Amazon o Google figura el país de registro. Ese es el que manda, no dónde estés viviendo.</p></details>
        <details><summary>¿Cuánto tarda la entrega?</summary><p>Entre 5 y 30 minutos al mail que dejás en la compra. Si el pago tarda en acreditarse, contamos desde ese momento.</p></details>
        <details><summary>¿El código vence?</summary><p>No. El saldo queda en la cuenta hasta que lo uses.</p></details>
        <details><summary>¿Son revendedores oficiales?</summary><p>Somos un revendedor independiente. No estamos afiliados a Netflix, Spotify, Disney, Amazon ni Google, y las marcas que nombramos pertenecen a sus dueños.</p></details>
        <details><summary>Tengo otra duda.</summary><p>Escribinos a <a href="mailto:${SITE_EMAIL}"><b>${SITE_EMAIL}</b></a> y te respondemos dentro de las 24 horas hábiles.</p></details>
      </div>`,
  },
  {
    slug: 'contacto',
    title: `Contacto — ${SITE_NAME}`,
    desc: `Escribinos a ${SITE_EMAIL}. Respondemos dentro de las 24 horas hábiles.`,
    h1: 'Contacto',
    cuerpo: `
      <p class="lead">La forma más rápida de llegarnos es por mail. Respondemos dentro de las 24 horas hábiles.</p>
      <p style="margin:18px 0"><a class="btn btn-primary btn-lg" href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a></p>
      <h2>Si es un reclamo</h2>
      <p>Sumá tu número de orden y, si un código no funcionó, una captura del error que te da la marca al canjear. Con eso lo resolvemos mucho más rápido.</p>
      <h2>Horario de atención</h2>
      <p>Lunes a viernes, de 9 a 19 h. Los pedidos se entregan igual fuera de ese horario; lo que se responde en horario hábil son las consultas y reclamos.</p>`,
  },
  {
    slug: 'terminos-y-condiciones',
    title: `Términos y condiciones — ${SITE_NAME}`,
    desc: 'Condiciones de uso y de compra.',
    h1: 'Términos y condiciones',
    cuerpo: `
      <p class="updated">Última actualización: ${HOY_LEGAL}</p>
      <h2>1. Quiénes somos</h2>
      <p>${SITE_NAME} es un revendedor independiente de gift cards digitales. No somos revendedores oficiales de Netflix, Spotify, Disney, Amazon ni Google, ni tenemos relación comercial con esas empresas. Las marcas mencionadas pertenecen a sus respectivos titulares.</p>
      <h2>2. Producto</h2>
      <p>Vendemos códigos de gift card digitales, atados a una región específica. El código es de un solo uso y no es transferible entre regiones. Es responsabilidad del comprador verificar el país en el que está registrada su cuenta antes de canjear.</p>
      <h2>3. Entrega</h2>
      <p>La entrega es digital, al correo informado en la compra, entre 5 y 30 minutos una vez acreditado el pago. No hay envío físico.</p>
      <h2>4. Precios y pagos</h2>
      <p>Los precios están en la moneda local de cada país y pueden cambiar sin aviso. El precio que vale es el que ves al momento de pagar. Los pagos se procesan por los medios indicados en cada país.</p>
      <h2>5. Garantía y devoluciones</h2>
      <p>Aplican las condiciones descritas en <a href="/garantia/">Garantía</a> y <a href="/devoluciones/">Devoluciones</a>, que forman parte de estos términos.</p>
      <h2>6. Contacto</h2>
      <p>Cualquier consulta sobre estos términos: <a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a>.</p>`,
  },
  {
    slug: 'politica-de-privacidad',
    title: `Política de privacidad — ${SITE_NAME}`,
    desc: 'Qué datos pedimos, para qué los usamos y cómo ejercer tus derechos.',
    h1: 'Política de privacidad',
    cuerpo: `
      <p class="updated">Última actualización: ${HOY_LEGAL}</p>
      <p class="lead">Pedimos los datos mínimos para procesar tu compra y entregarte el código. Nada más.</p>
      <h2>Qué datos recopilamos</h2>
      <ul>
        <li><b>Correo electrónico:</b> para enviarte el código y comunicarnos por tu pedido.</li>
        <li><b>Datos del pedido:</b> producto, país, denominación y el estado del pago.</li>
        <li><b>Datos técnicos básicos:</b> los que genera tu navegador al visitar el sitio (ver <a href="/politica-de-cookies/">Política de cookies</a>).</li>
      </ul>
      <h2>Para qué los usamos</h2>
      <p>Únicamente para procesar y entregar tu compra, brindarte soporte, y cumplir obligaciones legales o contables. No vendemos ni cedemos tus datos a terceros para fines publicitarios.</p>
      <h2>Con quién los compartimos</h2>
      <p>Solo con los proveedores necesarios para operar: la pasarela o el medio de pago que uses y el proveedor de correo. Cada uno accede únicamente a lo que necesita para su función.</p>
      <h2>Cuánto tiempo los guardamos</h2>
      <p>El tiempo necesario para dar soporte a tu compra y cumplir con las obligaciones legales aplicables. Después, se eliminan o anonimizan.</p>
      <h2>Tus derechos</h2>
      <p>Podés pedir acceso, rectificación o eliminación de tus datos escribiendo a <a href="mailto:${SITE_EMAIL}"><b>${SITE_EMAIL}</b></a>. Respondemos dentro de los plazos que fija la ley de tu país.</p>`,
  },
  {
    slug: 'politica-de-cookies',
    title: `Política de cookies — ${SITE_NAME}`,
    desc: 'Qué cookies usamos y cómo controlarlas.',
    h1: 'Política de cookies',
    cuerpo: `
      <p class="updated">Última actualización: ${HOY_LEGAL}</p>
      <p class="lead">Una cookie es un archivo chico que el sitio guarda en tu navegador. Las usamos para que el sitio funcione y para entender, de forma agregada, cómo se usa.</p>
      <h2>Tipos de cookies</h2>
      <ul>
        <li><b>Necesarias:</b> hacen que el sitio funcione (recordar tu país, el carrito, la sesión de pago). Sin ellas el sitio no anda bien.</li>
        <li><b>De medición:</b> nos dicen, de forma anónima y agregada, qué páginas se visitan más. Nos ayudan a mejorar.</li>
        <li><b>De terceros:</b> las que pueda dejar el proveedor del medio de pago al procesar tu compra.</li>
      </ul>
      <h2>Cómo controlarlas</h2>
      <p>Podés borrar o bloquear las cookies desde la configuración de tu navegador. Si bloqueás las necesarias, algunas partes del sitio pueden dejar de funcionar.</p>
      <h2>Consultas</h2>
      <p>Cualquier duda sobre cookies o privacidad: <a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a>.</p>`,
  },
];
