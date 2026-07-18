/* ============================================================
   contenido.js — Copy por página (seo, descripcion, faqs).
   Lo escribís vos a mano, una por par (marca, país). Cada
   versión de país tiene que estar anclada en datos y ángulos
   REALES de ese país (impuestos, medios, canje) para que Google
   las trate como productos distintos y no como duplicados.
   ============================================================ */

const CONTENIDO = {
  'netflix|AR': {
    seo: {
      title: 'Netflix Gift Card Argentina — Código región AR en pesos | Tukicards',
      desc: 'Gift card de Netflix con código de la región Argentina. Pagás en pesos con Mercado Pago o transferencia, sin percepciones ni tarjeta internacional. Entrega por mail.',
      resumen: 'Código de la región AR: se canjea únicamente en cuentas de Netflix de Argentina. Lo pagás en pesos y lo recibís por mail.',
    },
    descripcion: [
      'La gift card de Netflix para Argentina es un código de 11 dígitos que se acredita como saldo en una cuenta argentina. Netflix descuenta el plan de ese saldo cada mes, así que mientras te dure no te toca la tarjeta ni el resumen.',
      'Es el camino que usa mucha gente acá para sacar la suscripción de la tarjeta de crédito: se paga una vez, en pesos, y no hay renovación automática contra el plástico. Cuando el saldo se agota, Netflix te avisa y recién ahí pide un medio de pago.',
    ],
    faqs: [
      { q: '¿Sirve si mi cuenta de Netflix es de otro país?', a: 'No. El código es de la región AR y solo se acredita en cuentas de Netflix registradas en Argentina. Si tu cuenta es de Perú, México o España, el canje falla y el código no se puede devolver una vez usado.' },
      { q: '¿Me cobran percepciones o impuestos extra?', a: 'No por esta compra. Pagás en pesos y de una sola vez: el precio que ves es el final. Las percepciones aparecen cuando pagás una suscripción extranjera con tarjeta, que es justamente lo que evitás cargando saldo.' },
      { q: '¿Qué pasa si ya tengo una tarjeta cargada en Netflix?', a: 'Netflix usa primero el saldo de la gift card y recién cuando se agota vuelve a cobrarle a la tarjeta. No hace falta que la borres, aunque podés hacerlo si no querés que se renueve sola.' },
      { q: '¿Cuánto tarda la entrega?', a: 'Entre 5 y 30 minutos al mail que dejás en la compra. Si pagás con transferencia, el reloj arranca cuando se acredita.' },
    ],
  },
  'netflix|PE': {
    seo: {
      title: 'Netflix Gift Card Perú — código región PE | Tukicards',
      desc: 'Gift card de Netflix con código de la región Perú. Paga en soles con Yape, Plin o transferencia BCP. Sin tarjeta internacional. Entrega por correo.',
      resumen: 'Código de la región PE: se canjea únicamente en cuentas de Netflix de Perú. Lo pagas en soles con Yape o Plin.',
    },
    descripcion: [
      'La gift card de Netflix para Perú es un código que se carga como saldo en una cuenta peruana. Netflix va descontando el plan mes a mes de ese saldo, sin necesidad de dejar una tarjeta guardada.',
      'Es la forma más simple de pagar Netflix si no tienes una tarjeta habilitada para consumos en el exterior: se paga en soles desde Yape, Plin o una transferencia del BCP o Interbank, y listo.',
    ],
    faqs: [
      { q: '¿Funciona si mi cuenta de Netflix es de Argentina o Chile?', a: 'No. El código es de la región PE y solo se acredita en cuentas de Netflix registradas en Perú. En una cuenta de otro país el canje va a fallar.' },
      { q: '¿Puedo pagar con Yape o Plin?', a: 'Sí. Yape, Plin, transferencia bancaria (BCP, Interbank), PagoEfectivo y tarjeta de crédito. Todo en soles, sin comisión por conversión de moneda.' },
      { q: '¿Necesito tarjeta de crédito para usar Netflix después?', a: 'No mientras te dure el saldo. Netflix descuenta el plan del saldo cargado y recién te pide un medio de pago cuando se termina.' },
      { q: '¿Cuánto tarda en llegar el código?', a: 'De 5 a 30 minutos al correo que dejaste en la compra. Con Yape o Plin la acreditación es casi inmediata.' },
    ],
  },
  'netflix|CL': {
    seo: {
      title: 'Netflix Gift Card Chile — Código región CL en pesos chilenos | Tukicards',
      desc: 'Gift card de Netflix con código de la región Chile. Paga en pesos chilenos con Webpay o transferencia, sin IVA extra ni recargo por conversión. Entrega por correo.',
      resumen: 'Código de la región CL: se canjea únicamente en cuentas de Netflix de Chile. Lo pagas en pesos chilenos con Webpay o transferencia.',
    },
    descripcion: [
      'La gift card de Netflix para Chile carga saldo directamente en una cuenta chilena, y Netflix descuenta el plan de ese saldo cada mes. No queda ninguna tarjeta atada a la cuenta.',
      'Cuando pagas Netflix con tarjeta desde Chile, al cobro se le suma el IVA a los servicios digitales y, según el banco, un recargo por conversión. Con la gift card evitas las dos cosas: pagas en pesos chilenos, de una vez, con Webpay o transferencia.',
    ],
    faqs: [
      { q: '¿Se le suma IVA a la gift card?', a: 'No a esta compra. El IVA a servicios digitales aparece cuando pagas la suscripción con tarjeta. Acá pagas un precio final en pesos chilenos y con eso cargas el saldo.' },
      { q: '¿Puedo pagar con Webpay?', a: 'Sí. Webpay, transferencia bancaria (Banco de Chile, BancoEstado), Mercado Pago, Khipu o tarjeta de crédito. Todo en pesos chilenos.' },
      { q: '¿Sirve en una cuenta de Netflix de otro país?', a: 'No. El código es de la región CL y solo se acredita en cuentas de Netflix registradas en Chile.' },
      { q: '¿Cuánto tarda en llegar?', a: 'Entre 5 y 30 minutos al correo que dejaste. Con Webpay o Khipu la acreditación es casi inmediata.' },
    ],
  },
  'netflix|CO': {
    seo: {
      title: 'Netflix Gift Card Colombia — Código región CO en pesos | Tukicards',
      desc: 'Gift card de Netflix con código de la región Colombia. Paga en pesos colombianos con PSE, Nequi o Daviplata, sin comisión internacional. Entrega por correo.',
      resumen: 'Código de la región CO: se canjea únicamente en cuentas de Netflix de Colombia. Lo pagas en pesos colombianos con PSE, Nequi o Daviplata.',
    },
    descripcion: [
      'La gift card de Netflix para Colombia acredita saldo en una cuenta colombiana. Netflix toma el plan de ese saldo mes a mes, y no necesitas dejar ninguna tarjeta guardada.',
      'Pagar la suscripción con tarjeta desde Colombia suele traer la comisión por transacción internacional más la conversión de moneda del banco. La gift card se paga en pesos colombianos con PSE, Nequi o Daviplata, así que ese recargo no aparece.',
    ],
    faqs: [
      { q: '¿Puedo pagar con Nequi o Daviplata?', a: 'Sí. PSE, Nequi, Daviplata, transferencia Bancolombia, Efecty o tarjeta de crédito. Todo en pesos colombianos.' },
      { q: '¿Me cobran comisión internacional?', a: 'No por esta compra. Esa comisión la cobra tu banco cuando pagas un servicio de afuera con tarjeta; acá pagas local, en pesos, y cargas saldo.' },
      { q: '¿Funciona en una cuenta de Netflix de otro país?', a: 'No. El código es de la región CO y solo se acredita en cuentas de Netflix registradas en Colombia.' },
      { q: '¿Cuánto demora la entrega?', a: 'De 5 a 30 minutos al correo que dejaste. Con PSE o Nequi la acreditación es prácticamente inmediata.' },
    ],
  },
  'netflix|MX': {
    seo: {
      title: 'Netflix Gift Card México — Código región MX en pesos | Tukicards',
      desc: 'Gift card de Netflix con código de la región México. Paga en pesos mexicanos con SPEI, OXXO o tarjeta local, sin conversión de moneda. Entrega por correo.',
      resumen: 'Código de la región MX: se canjea únicamente en cuentas de Netflix de México. Lo pagas en pesos mexicanos con SPEI, OXXO o tarjeta local.',
    },
    descripcion: [
      'La gift card de Netflix para México carga saldo en una cuenta mexicana. Netflix descuenta el plan de ese saldo cada mes, sin tarjeta atada y sin renovación automática contra el plástico.',
      'Si pagas la suscripción con una tarjeta que convierte moneda, el banco te suma su comisión en cada cobro. Con la gift card pagas una sola vez en pesos mexicanos —con SPEI, en un OXXO o con tarjeta local— y ese cargo por conversión desaparece.',
    ],
    faqs: [
      { q: '¿Puedo pagar en un OXXO?', a: 'Sí. SPEI (transferencia), Mercado Pago, OXXO o tarjeta de crédito. Todo en pesos mexicanos.' },
      { q: '¿Me cobran comisión por conversión?', a: 'No por esta compra. Esa comisión la cobra tu banco cuando el cobro de Netflix se hace en otra moneda; acá pagas local y cargas saldo de una vez.' },
      { q: '¿Sirve en una cuenta de Netflix de otro país?', a: 'No. El código es de la región MX y solo se acredita en cuentas de Netflix registradas en México.' },
      { q: '¿Cuánto tarda en llegar el código?', a: 'Entre 5 y 30 minutos al correo que dejaste. Con SPEI la acreditación es casi inmediata; en OXXO, cuando se registra el pago.' },
    ],
  },
  'spotify|AR': {
    seo: {
      title: 'Spotify Gift Card Argentina — Premium en pesos, código AR | Tukicards',
      desc: 'Gift card de Spotify de la región Argentina. Activá Premium Individual pagando en pesos con Mercado Pago o transferencia. Entrega por mail.',
      resumen: 'Código de la región AR para cuentas de Spotify de Argentina. Activa Premium Individual sin dejar tarjeta guardada.',
    },
    descripcion: [
      'La gift card de Spotify para Argentina acredita saldo en una cuenta argentina y lo aplica al plan Premium Individual. Es la forma de tener Premium sin dejar una tarjeta con débito automático.',
      'Un detalle importante: el saldo de Spotify solo se aplica a Premium Individual. Si estás en Dúo, Familiar o Estudiante, el código no se puede usar sobre ese plan.',
    ],
    faqs: [
      { q: '¿Sirve para el plan Dúo o Familiar?', a: 'No. Las gift cards de Spotify solo se aplican al plan Premium Individual. Si tenés Dúo o Familiar tendrías que pasarte a Individual antes de canjear.' },
      { q: '¿Y si ya estoy pagando Premium con tarjeta?', a: 'El saldo se aplica cuando termina el ciclo que ya pagaste. No se pierde: queda esperando en la cuenta.' },
      { q: '¿Funciona con una cuenta de Spotify de otro país?', a: 'No. El código es de la región AR y solo se acredita en cuentas registradas en Argentina.' },
      { q: '¿Cómo pago?', a: 'Mercado Pago, transferencia (CBU/CVU), Rapipago, Pago Fácil o tarjeta en cuotas. Siempre en pesos.' },
    ],
  },
  'spotify|PE': {
    seo: {
      title: 'Spotify Gift Card Perú — Premium en soles | Tukicards',
      desc: 'Gift card de Spotify de la región Perú. Activá Premium Individual pagando en soles con Yape, Plin o transferencia. Entrega por correo.',
      resumen: 'Código de la región PE para cuentas de Spotify de Perú. Activa Premium Individual pagando en soles.',
    },
    descripcion: [
      'La gift card de Spotify para Perú carga saldo en una cuenta peruana y lo destina al plan Premium Individual. No hace falta tarjeta ni débito automático.',
      'El saldo solo aplica a Premium Individual: los planes Dúo, Familiar y Estudiante no aceptan códigos de regalo.',
    ],
    faqs: [
      { q: '¿Se puede usar en el plan Familiar?', a: 'No. El saldo de las gift cards de Spotify solo se aplica a Premium Individual.' },
      { q: '¿Puedo pagar con Yape?', a: 'Sí, con Yape, Plin, transferencia BCP o Interbank, PagoEfectivo o tarjeta. En soles.' },
      { q: '¿Sirve en una cuenta de Spotify creada en otro país?', a: 'No. El código es de la región PE y solo se canjea en cuentas peruanas.' },
      { q: '¿Cuándo se activa Premium?', a: 'Apenas canjeas el código, si estás en el plan gratuito. Si ya venías pagando, arranca al terminar el ciclo actual.' },
    ],
  },
  'disney-plus|AR': {
    seo: {
      title: 'Disney+ Gift Card Argentina — Código región AR en pesos | Tukicards',
      desc: 'Gift card de Disney+ de la región Argentina. Pagá en pesos con Mercado Pago o transferencia, sin percepciones. Entrega por mail.',
      resumen: 'Código de la región AR para cuentas de Disney+ de Argentina. Se paga en pesos, una sola vez.',
    },
    descripcion: [
      'La gift card de Disney+ para Argentina acredita saldo en una cuenta argentina y cubre el plan Estándar o Premium según cuánto cargues.',
      'Ojo con un caso común: si venís pagando Disney+ a través de la App Store o Google Play, el código no se aplica sobre esa suscripción. Primero hay que cancelarla y contratar directo con Disney.',
    ],
    faqs: [
      { q: 'Pago Disney+ desde el iPhone. ¿Puedo usar la gift card?', a: 'No sobre esa suscripción. Las suscripciones contratadas por App Store o Google Play no aceptan códigos: tenés que cancelarla y suscribirte directo en disneyplus.com para poder usar el saldo.' },
      { q: '¿Sirve en una cuenta de Disney+ de otro país?', a: 'No. El código es de la región AR y solo se acredita en cuentas registradas en Argentina.' },
      { q: '¿Pago percepciones?', a: 'No por esta compra. Pagás en pesos, de una vez, y el precio que ves es el final.' },
      { q: '¿Cubre el plan Premium?', a: 'Depende de la denominación que elijas. Arriba de cada opción te mostramos cuántos meses de cada plan cubre.' },
    ],
  },
  'disney-plus|PE': {
    seo: {
      title: 'Disney+ Gift Card Perú — Código región PE en soles | Tukicards',
      desc: 'Gift card de Disney+ de la región Perú. Paga en soles con Yape, Plin o transferencia. Sin tarjeta internacional. Entrega por correo.',
      resumen: 'Código de la región PE para cuentas de Disney+ de Perú. Se paga en soles, una sola vez.',
    },
    descripcion: [
      'La gift card de Disney+ para Perú carga saldo en una cuenta peruana y cubre el plan Estándar o Premium según la denominación.',
      'Igual que en el resto de la región: si tu suscripción la contrataste por la App Store o Google Play, el código no se puede aplicar ahí. Hay que cancelar y suscribirse directo con Disney.',
    ],
    faqs: [
      { q: '¿Puedo aplicarlo si pago Disney+ por Google Play?', a: 'No. Las suscripciones cobradas por Google Play o App Store no aceptan códigos de regalo. Cancela esa suscripción y contrata directo en disneyplus.com.' },
      { q: '¿Funciona en una cuenta de otro país?', a: 'No. El código es de la región PE y solo se canjea en cuentas peruanas.' },
      { q: '¿Con qué puedo pagar?', a: 'Yape, Plin, transferencia BCP o Interbank, PagoEfectivo o tarjeta. Todo en soles.' },
      { q: '¿El saldo vence?', a: 'No. Queda en la cuenta hasta que lo uses.' },
    ],
  },
  'prime-video|AR': {
    seo: {
      title: 'Prime Video Gift Card Argentina — Saldo Amazon región AR | Tukicards',
      desc: 'Gift card de Amazon para pagar Prime Video en Argentina. Saldo en la cuenta de Amazon argentina, pagás en pesos. Entrega por mail.',
      resumen: 'Código de la región AR: acredita saldo en tu cuenta de Amazon argentina y con eso pagás Prime Video.',
    },
    descripcion: [
      'Prime Video no tiene una gift card propia: lo que se compra es saldo de Amazon, y desde ahí elegís pagar la suscripción de Prime Video con ese saldo.',
      'El saldo de Amazon es por región. Un código comprado para Argentina se acredita en la cuenta argentina y no sirve en Amazon.com ni en Amazon de otro país.',
    ],
    faqs: [
      { q: '¿Es una gift card de Prime Video o de Amazon?', a: 'De Amazon. Prime Video no emite tarjetas propias: cargás saldo en tu cuenta de Amazon y con ese saldo pagás la suscripción de Prime Video.' },
      { q: '¿Sirve en Amazon.com?', a: 'No. El saldo es de la región AR y solo se acredita en la cuenta de Amazon de Argentina.' },
      { q: '¿Puedo usar el saldo para comprar otra cosa en Amazon?', a: 'Sí, el saldo es genérico de la cuenta. Vos elegís aplicarlo a Prime Video o a cualquier otra compra.' },
      { q: '¿Cómo pago acá?', a: 'Mercado Pago, transferencia, Rapipago, Pago Fácil o tarjeta en cuotas. En pesos.' },
    ],
  },
  'prime-video|PE': {
    seo: {
      title: 'Prime Video Gift Card Perú — Saldo Amazon región PE en soles | Tukicards',
      desc: 'Gift card de Amazon para pagar Prime Video en Perú. Saldo en tu cuenta de Amazon peruana, pagas en soles con Yape o Plin.',
      resumen: 'Código de la región PE: acredita saldo en tu cuenta de Amazon de Perú y con eso pagas Prime Video.',
    },
    descripcion: [
      'Prime Video no emite gift cards propias: lo que compras es saldo de Amazon, que después aplicás a la suscripción de Prime Video desde tu cuenta.',
      'El saldo está atado a la región de la cuenta. Este código se acredita en la cuenta de Amazon de Perú y no funciona en otras.',
    ],
    faqs: [
      { q: '¿Por qué la tarjeta es de Amazon y no de Prime Video?', a: 'Porque Prime Video no tiene gift cards propias. Se carga saldo en Amazon y desde ahí se paga la suscripción.' },
      { q: '¿Sirve en la cuenta de Amazon de otro país?', a: 'No. El saldo es de la región PE y solo se acredita en cuentas peruanas.' },
      { q: '¿Puedo pagar con Yape o Plin?', a: 'Sí, además de transferencia BCP o Interbank, PagoEfectivo y tarjeta. En soles.' },
      { q: '¿El saldo tiene vencimiento?', a: 'No. Queda disponible en la cuenta hasta que lo uses.' },
    ],
  },
  'google-play|AR': {
    seo: {
      title: 'Google Play Gift Card Argentina — Saldo región AR en pesos | Tukicards',
      desc: 'Gift card de Google Play con saldo de la región Argentina. Pagás en pesos y con ese saldo comprás apps, juegos y suscripciones como YouTube Premium. Entrega por mail.',
      resumen: 'Código de saldo de la región AR: se acredita en cuentas de Google Play de Argentina. Con ese saldo pagás apps, juegos y suscripciones.',
    },
    descripcion: [
      'La gift card de Google Play para Argentina carga saldo en tu cuenta de Google. Con ese saldo pagás lo que quieras dentro de Play: apps, juegos, compras dentro de las apps y suscripciones como YouTube Premium o Disney+ facturadas por Google.',
      'Es una forma de pagar todo eso en pesos y de una sola vez, sin dejar una tarjeta guardada en Google. El saldo no vence y lo vas gastando de a poco.',
    ],
    faqs: [
      { q: '¿Para qué me sirve el saldo de Google Play?', a: 'Para pagar apps, juegos, compras dentro de las apps y suscripciones facturadas por Google Play (YouTube Premium, muchas apps, etc.). No sirve para pagar Google Cloud ni hardware.' },
      { q: '¿Sirve en una cuenta de Google de otro país?', a: 'No. El saldo es de la región AR y solo se acredita en cuentas de Google Play configuradas con país Argentina.' },
      { q: '¿Cómo pago la tarjeta?', a: 'Mercado Pago, transferencia (CBU/CVU), Rapipago, Pago Fácil o tarjeta en cuotas. Siempre en pesos.' },
      { q: '¿El saldo vence?', a: 'No. Queda en tu cuenta de Google Play hasta que lo uses.' },
    ],
  },
  'google-play|PE': {
    seo: {
      title: 'Google Play Gift Card Perú — saldo región PE | Tukicards',
      desc: 'Gift card de Google Play con saldo de la región Perú. Paga en soles con Yape, Plin o PagoEfectivo y úsalo en apps, juegos y suscripciones.',
      resumen: 'Código de saldo de la región PE: se acredita en cuentas de Google Play registradas en Perú. Es saldo libre, no una suscripción: lo gastas en lo que quieras dentro de Play.',
    },
    descripcion: [
      'La gift card de Google Play para Perú acredita saldo directamente en tu cuenta de Google. A diferencia de una tarjeta de Netflix o Spotify, que va contra un plan fijo, acá el saldo es libre: lo usas en lo que quieras dentro de Play y lo vas gastando de a poco.',
      'Con ese saldo pagas apps y juegos de la Play Store, compras dentro de las apps (monedas, pases de temporada, vidas), suscripciones facturadas por Google como YouTube Premium, y alquiler o compra de películas y series. Todo se descuenta del saldo sin que Google te pida una tarjeta.',
      'Es la vía más usada en Perú por quien no tiene tarjeta habilitada para consumos en el exterior, o directamente no quiere dejar una tarjeta guardada en Google. Pagas una vez con Yape, Plin, PagoEfectivo o transferencia del BCP, y el saldo queda ahí hasta que lo uses: no vence ni se renueva solo.',
      'Un punto que confunde a mucha gente: el saldo de Google Play está atado al país de la cuenta, no al celular ni a dónde estés. Si tu cuenta de Google tiene país Perú, necesitas una tarjeta de la región PE. Si alguna vez cambiaste el país de tu cuenta, revisá eso antes de comprar, porque un código canjeado no se revierte.',
    ],
    faqs: [
      { q: '¿Qué puedo pagar exactamente con el saldo?', a: 'Apps y juegos de la Play Store, compras dentro de las apps, suscripciones facturadas por Google Play (YouTube Premium y muchas apps con suscripción), y alquiler o compra de películas y series en Google TV. No sirve para comprar hardware en la Google Store ni para pagar servicios de Google Cloud.' },
      { q: '¿Es lo mismo que una suscripción de YouTube Premium?', a: 'No. Esto es saldo libre. Con el saldo puedes pagar YouTube Premium si quieres, pero no estás obligado: podés gastarlo en juegos, apps o películas. Por eso no mostramos "cuántos meses te dura", como sí hacemos con las gift cards de Netflix o Spotify.' },
      { q: '¿Puedo pagar con Yape o Plin?', a: 'Sí. Yape, Plin, transferencia bancaria del BCP o Interbank, PagoEfectivo y tarjeta de crédito. Todo el cobro es en soles, sin comisión por conversión de moneda.' },
      { q: '¿Funciona en una cuenta de Google de otro país?', a: 'No. El saldo es de la región PE y solo se acredita en cuentas de Google Play cuyo país sea Perú. Si tu cuenta está registrada en otro país, el canje va a fallar y el código no se puede devolver una vez usado.' },
      { q: '¿Cómo veo en qué país está mi cuenta de Google Play?', a: 'Abre la app de Google Play, toca tu foto de perfil, entra en Pagos y suscripciones y luego en Configuración de pagos. Ahí aparece el país de la cuenta. Ese es el que manda para saber qué región de gift card necesitas.' },
      { q: '¿El saldo tiene vencimiento?', a: 'No. Queda disponible en tu cuenta de Google Play hasta que lo gastes, sin fecha límite y sin cargos por mantenerlo ahí.' },
      { q: '¿Puedo juntar varias tarjetas?', a: 'Sí. Los saldos se acumulan en la misma cuenta, así que puedes canjear varias tarjetas y el total se suma. Google descuenta de ese saldo hasta agotarlo.' },
    ],
  },
};
