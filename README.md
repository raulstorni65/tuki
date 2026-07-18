# Tukicards — sitio de gift cards

Sitio estático de gift cards region-locked, con una página por par (marca, país).
La diferenciación por país se apoya en **datos** (impuestos, medios de pago, canje,
cobertura de planes), no en prosa repetida.

**Sin automatización.** Se decidió no usar el pipeline de n8n: las páginas se
arman a mano cargando datos en `sheets/` y corriendo un build local. Por eso ya
no están los `nodes/` ni el `workflow/`.

## Qué hay acá

```
site/          El sitio ya renderizado (se genera con el build)
sheets/        Las 3 "hojas" (CSV) con los datos: catálogo, países, planes
build/         El motor. Editás acá + los CSV, y regenerás site/
```

## Cómo se regenera

```bash
node build/build.js     # lee sheets/, renderiza site/ y corre los dos gates
```

`build/` es la única fuente de verdad del HTML. Si tocás un template o un CSV,
volvé a correr el build.

## Antes de publicar — configuración

1. En `build/templates.js`, arriba de todo, revisá:
   - `SITE_NAME`  = `Tukicards`
   - `SITE_URL`   = `https://www.tukicards.com`  ← **confirmá el dominio real**
   - `SITE_MARK`  = `T`
   - `SITE_EMAIL` = `contacto@tukicards.com`
2. En `site/checkout.html`, revisá `APPSCRIPT_URL`. Ahora apunta al **mismo Apps
   Script de comprarjuegos** (los pedidos caen en esa misma hoja). Si querés una
   hoja separada para Tukicards, creá un Apps Script nuevo y pegá su URL `/exec`.

## Los precios son placeholders

Los números de `sheets/Planes.csv`, las denominaciones y los montos USD de
`sheets/Catalogo.csv` **son de ejemplo, para que veas el layout**. Cargá los
reales, con fecha. Si un precio de plan tiene más de 45 días
(`MAX_DIAS_PRECIO_PLAN` en `build/resolver.js`), la página se rechaza sola.

## Formato de los datos (lo nuevo)

**`sheets/Catalogo.csv`** — cada denominación es `nominal|precio_local|stock|usd`:
- `usd` (4º campo, opcional) = el monto de la tarjeta Amazon que compra el cliente
  en el checkout. Debe ser uno de los tramos de G2A: 10, 15, 20, 25, 30, 35, 50.
  Si lo dejás vacío, el checkout muestra todos los tramos y el cliente elige.
- Columna **`Imagen`**: ruta de la imagen propia de ese par (marca, país),
  ej. `/img/netflix-ar.jpg`. Si la dejás vacía, se genera un talón con el color de
  la marca. Poné tus imágenes en `site/img/` y referencialas acá.

**`sheets/Paises.csv`** — ya trae Argentina, Perú, Chile, Colombia y México.
Para agregar un país: sumá una fila con moneda, símbolo, locale, región de canje,
registro (voseo/tuteo), medios de pago (2+) y la nota de impuestos (60+ caracteres).

**`sheets/Planes.csv`** — precios oficiales de cada plan por país, para la
calculadora de "cuántos meses te dura". Para Google Play, los "planes" son las
suscripciones que se pagan con ese saldo (YouTube Premium, Disney+, etc.).

## Agregar una página nueva (el flujo a mano)

1. Si es un país nuevo → fila en `Paises.csv`.
2. Fila en `Catalogo.csv` (marca, país, region_code, denominaciones con USD, imagen).
3. Precios de los planes en `Planes.csv`, con fecha fresca.
4. Copy del par en `build/contenido.js` (seo + descripcion + faqs). **Escribilo
   distinto por país**: es lo que evita que Google lo lea como duplicado.
5. `node build/build.js`. Si la página no sale, el build te dice por qué.

Ya quedaron listas y renderizando: las 5 marcas en AR y PE (con Netflix también en
CL, CO y MX). El resto de los pares (Spotify/Disney+/Prime/Google Play en los países
nuevos) es cargar datos + copy y correr el build.

## Los dos gates (siguen activos, a propósito)

**Gate de datos** (`build/resolver.js`). Rechaza si falta: código de región,
denominaciones con stock, moneda, 2+ medios de pago, nota de impuestos de 60+
caracteres, región de canje, precios de planes frescos, o si ninguna denominación
cubre al menos un mes de un plan.

**Gate de similaridad** (`build/similaridad.js`). Jaccard sobre shingles de 5
palabras contra las otras versiones de país de la misma marca. Umbral 0.55.
Hoy las páginas dan entre 0.21 y 0.30 contra sus hermanas: margen de sobra.
Lo dejamos porque ya te comió una penalización por contenido duplicado antes.

## El checkout

`site/checkout.html` es igual al de comprarjuegos: muestra el producto y el precio,
manda a comprar la tarjeta de Amazon por el monto USD indicado (links de G2A por
tramo), y el cliente pega el código en un formulario que va al Apps Script.
El botón "Comprar ahora" de cada página arma solo el link al checkout con la
denominación elegida.


## Precios: cómo están calculados (actualizado 18/07/2026)

Dos reglas, y las dos importan:

1. **El precio siempre queda un poco ARRIBA del valor de la tarjeta** (2-3%). Ese
   es tu margen y es lo que hace que el precio se vea creíble. Una gift card que
   se vende por debajo de su valor nominal parece trucha.
2. **El precio cae exacto en un tramo de tarjeta Amazon** (10/15/20/25/30/35/50 USD),
   así el cliente compra la tarjeta justa en el checkout.
3. **La denominación más barata alcanza para 1 mes del plan más caro** de esa marca
   en ese país. Si no se cumple, el build te avisa por consola al publicar.

Perú (USD/PEN 3,40 al 18/07/2026):

| Marca | Valor | Paga | Margen | Tramo Amazon |
|---|---|---|---|---|
| Google Play | S/33 · S/66 · S/165 | S/34 · S/68 · S/170 | 3% | 10 · 20 · 50 |
| Netflix | S/50 · S/100 · S/165 | S/51 · S/102 · S/170 | 2-3% | 15 · 30 · 50 |
| Spotify | S/50 · S/100 · S/165 | S/51 · S/102 · S/170 | 2-3% | 15 · 30 · 50 |

Cuando se mueva el tipo de cambio, actualizá la columna `Denominaciones` de
`sheets/Catalogo.csv` y volvé a correr el build.

### Por qué la tabla NO dice "ahorrás"

Con el precio arriba del valor de la tarjeta, comprar acá sale **un poco más caro**
que pagarle directo a la marca. Los números de Netflix Perú: la tarjeta de S/50
cuesta S/51 y cubre 1 mes de Premium (S/44,90), o sea S/1 más que pagarlo oficial
(el saldo que sobra queda en la cuenta, no se pierde). Poner una columna de
"ahorro" ahí sería mentirle al cliente.

Lo que la tabla muestra es real: cuántos meses del plan más caro te da, cuánto
cuesta ese plan oficialmente, cuánto saldo te sobra y cuánto pagás. El argumento
de venta honesto es el otro: **no necesitás tarjeta internacional, no hay
renovación automática y no dejás la tarjeta guardada en la plataforma.**

## Imágenes

- `site/img/paises/*.svg` — banderas (AR, PE, CL, CO, MX). Se usan de fondo en el
  hero de cada país, en el chip del bloque de compra y en los botones de la home.
- `site/img/cards/{marca}-{iso}.webp` — la gift card REAL de cada marca, compuesta
  sobre un fondo con el color de la marca y con la chapa de la bandera del país.
  **Están las 25 combinaciones** (5 marcas x 5 países), así que cualquier artículo
  que abras después ya tiene su imagen esperando. Se generan con
  `work/componer.py` desde los originales en `work/originales/`.
  Prime Video es la única dibujada (no hay foto real de esa tarjeta); si conseguís
  una, guardala en `work/originales/` y sumala al diccionario `CARDS` del script.
- Para cambiar la imagen de un artículo, editá la columna `Imagen` de
  `sheets/Catalogo.csv` — esa columna manda sobre cualquier otra cosa.
- `site/favicon.svg` — favicon genérico con la marca.

## Artículo destacado

El primero del catálogo (`Orden_Subida` = 1) sale destacado en la home con imagen
grande. Hoy es **Google Play Perú**. Para cambiarlo, movelo de orden en
`sheets/Catalogo.csv`.


## Estado: qué está publicado y qué falta

Vamos de a poco: **solo Perú, solo 3 artículos.**

| | PE |
|---|---|
| Google Play | publicado (destacado) |
| Netflix | publicado |
| Spotify | publicado |

**La estructura del resto quedó intacta pero apagada:**

- `sheets/Catalogo-pendientes.csv` guarda las 10 filas de los otros países y marcas
  (Disney+, Prime Video, AR, CL, CO, MX) con sus precios e imágenes. Para reactivar
  una, movés la fila de vuelta a `Catalogo.csv` y corrés el build.
- `sheets/Paises.csv` sigue con los 5 países.
- Las 25 imágenes marca x país siguen generadas en `site/img/cards/`.
- El copy de los artículos apagados sigue en `build/contenido.js`.

La navegación se arma sola con lo que está publicado: hoy el selector de país
muestra solo PE y el footer solo las 3 marcas. No hay links a páginas que no
existen.


## SEO: reglas que aplica el build solo

No hace falta acordarse de estas, se aplican al publicar:

- **`noindex` automático en hubs de marca con un solo país.** Con un país, esa
  página es una tabla de una fila y las de distintas marcas quedan casi idénticas
  (medimos 0.87 entre ellas). Sale del índice y del sitemap. Cuando la marca tenga
  2+ países, vuelve sola: recupera el índice, el sitemap y su schema.
- **Gate global de duplicados.** Antes solo comparaba artículos de la misma marca
  entre países; ahora compara TODAS las páginas indexables entre sí (home, hubs de
  país, artículos) y avisa por consola arriba de 0.45.
- **`hreflang` solo con 2+ países.** Con uno solo era ruido.
- **Sitemap solo con páginas indexables.**
- **`image` en el Product schema**, apuntando a la imagen del artículo.

Lo que hay que cuidar a mano al escribir un artículo nuevo:

- **Title de 60 caracteres o menos** (contando " | Tukicards", que son 12).
- **Meta description de 160 o menos.**
- Apuntá a 600+ palabras de texto real. Referencia actual: Google Play Perú 949,
  Netflix Perú 639, Spotify Perú 558.


## Conectar el dominio

Del lado del código es **una sola línea**: `SITE_URL` en `build/templates.js`.
De ahí salen las canónicas, el sitemap, el robots.txt, los Open Graph y el schema
(109 referencias en total). Cambiás esa línea, corrés `node build/build.js`, y
listo. No toques las páginas generadas a mano.

Tres detalles que cuestan caro si se pasan por alto:

1. **Sin barra al final.** `https://www.tukicards.com` — nunca
   `https://www.tukicards.com/`, o quedan canónicas con doble barra.
2. **www o sin www: elegí una y que coincida.** En Vercel una queda como dominio
   principal y la otra redirige. `SITE_URL` tiene que ser exactamente la principal.
   Si Vercel sirve `tukicards.com` y acá dice `www.tukicards.com`, cada página se
   declara canónica de una URL que redirige — Google lo interpreta como señal
   contradictoria.
3. **`https://`, siempre.** Nunca `http://`.

Después de conectar el dominio:

- Verificá la propiedad en Google Search Console y subí el sitemap.
- **Configurá el correo del dominio.** `contacto@tukicards.com` está en cada
  página, en garantía, en devoluciones y en privacidad. Si el dominio no tiene MX
  configurado, los reclamos rebotan sin que te enteres. Mandate un mail de prueba.
