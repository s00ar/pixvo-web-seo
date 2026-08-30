# Plan de medición

No hay cifras de GA4 o Search Console incluidas en el proyecto. Los eventos pasan por `src/utils/tracking.js`, que limita parámetros y evita enviar nombre, correo, empresa, web o el texto libre del formulario.

| event | trigger | business meaning | page type | role | implementation status |
|---|---|---|---|---|---|
| `country_select` | selección de mercado en `/` | entrada a un mercado | selector | secondary | Implementado |
| `cta_click` | CTA principal hacia diagnóstico | intención BOFU | all | primary | Implementado |
| `form_start` | primera interacción con diagnóstico | inicio de solicitud | diagnosis | primary | Implementado; deduplicado por vista |
| `form_step_complete` | paso válido completado | avance del formulario | diagnosis | primary | Implementado |
| `form_submit` | solicitud validada antes de WhatsApp | solicitud preparada | diagnosis | primary | Implementado; no equivale a mensaje recibido |
| `whatsapp_click` | apertura de WhatsApp | contacto iniciado | diagnosis/contact | primary | Implementado |
| `contact_click` | interacción con canal de contacto | canal elegido | all | primary | Implementado |
| `pricing_view` | planes entran en viewport | consideración comercial | pricing | secondary | Implementado |
| `plan_select` | selección de plan | preferencia declarada | pricing | primary | Implementado |
| `case_study_view` | vista de detalle de caso | consumo de evidencia | case study | secondary | Implementado |
| `article_to_money_click` | artículo enlaza a solución | apoyo editorial | article | secondary | Implementado |
| `plans_navigation` | enlace interno hacia planes | consideración de alcance/precio | all | secondary | Implementado |
| `outbound_click` | salida a otro dominio | navegación saliente | all | secondary | Implementado |

Pendiente externo: definir el identificador GA4/GTM aprobado, consentimiento aplicable y conversiones en la propiedad real. Probar en DebugView sin PII y documentar accesos. No activar una medición ficticia desde el repositorio.
