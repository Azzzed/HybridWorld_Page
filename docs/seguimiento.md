# Seguimiento: Google Tag Manager, GA4 y conversiones de Google Ads

El sitio carga el contenedor **GTM-TXSJT9FL** (snippet oficial, `src/components/analytics/GoogleTagManager.tsx`)
solo en producción: los deploys de preview de Vercel no lo cargan. Las etiquetas se configuran en
[tagmanager.google.com](https://tagmanager.google.com), no en el código.

## Eventos que el sitio envía al dataLayer

`src/components/analytics/TrackContactClicks.tsx` escucha los clics de todo el sitio:

| Evento | Cuándo | Conversión sugerida en Ads |
|---|---|---|
| `phone_click` | Clic en cualquier enlace `tel:` | **Principal** |
| `whatsapp_click` | Clic en cualquier enlace `wa.me` | **Principal** |
| `directions_click` | Clic en "Cómo llegar" (Google Maps) | Secundaria |
| `email_click` | Clic en el correo | Secundaria |

Cada evento lleva:

- `branch`: `norwalk`, `fullerton`, `mountain-view` o `general`. El teléfono y el WhatsApp generales son los de Norwalk, así que cuentan como `norwalk`.
- `click_area`: dónde estaba el enlace (`header`, `footer`, `quick-call`, `locations`, `norwalk`…).
- `link_url` y `page_path`.

## Configuración en GTM (una vez)

1. **Variables → Variables de capa de datos**: crear `branch`, `click_area` y `link_url`.
2. **Activadores → Evento personalizado**: uno por evento (`phone_click`, `whatsapp_click`, `directions_click`, `email_click`), o uno solo con la expresión regular `phone_click|whatsapp_click|directions_click|email_click`.
3. **Etiqueta Google (GA4)** con el ID `G-…`, activador *Initialization – All Pages*. En GA4, deja activada la medición mejorada: "Cambios de página según eventos del historial" cuenta las páginas vistas aunque la navegación interna no recargue la página.
4. **Etiqueta GA4 – Evento** con el nombre `{{Event}}` y los parámetros `branch`, `click_area` y `link_url`, en el activador del paso 2. En GA4, marca `phone_click` y `whatsapp_click` como **eventos clave**.
5. **Vinculación de conversiones** (Conversion Linker), activador *All Pages*: guarda el `gclid` del anuncio.
6. **Seguimiento de conversiones de Google Ads**: una etiqueta por conversión (ID y etiqueta de conversión, sacados de Google Ads → Objetivos → Conversiones → "Sitio web" → "Configurar manualmente con Tag Manager"):
   - "Clic en llamar" → activador `phone_click`
   - "Clic en WhatsApp" → activador `whatsapp_click`
7. Opcional: en Google Ads, "Llamadas desde el sitio web" con el número de desvío de Google. Cuenta las llamadas reales y su duración, no solo el clic.
8. Probar con **Vista previa** (Tag Assistant) en `https://www.hybridworldinc.com` y luego **Publicar**.

Si las conversiones también se importan desde GA4, no hay que marcarlas dos veces como principales en Ads: elige o la etiqueta de Ads o la importación de GA4.

## Privacidad

Con GA4, Ads y remarketing, hay que actualizar la Política de privacidad (`src/content/legal.ts`):
cookies de Google Analytics y Google Ads, publicidad personalizada y cómo desactivarla
(adssettings.google.com), y el derecho de California a excluirse de que se "compartan" datos (CCPA/CPRA).
