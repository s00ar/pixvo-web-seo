# Pixvo.Tech — plataforma web corporativa

Sitio corporativo completo construido a partir de la maqueta visual de Pixvo.Tech. Incluye páginas institucionales, seis servicios, portfolio y casos de estudio, blog local, artículos completos, contacto y página 404.

La primera versión es una SPA sin backend ni CMS. Los datos de contacto, cuatro proyectos, trece artículos, el programa de referidos y la política de privacidad se migraron desde el sitio público de Pixvo.Tech. Las métricas y testimonios no verificados continúan identificados como contenido demostrativo.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Instalación

```bash
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

Si npm muestra `UNABLE_TO_VERIFY_LEAF_SIGNATURE` en Windows con Node 24, utiliza el almacén de certificados del sistema sin desactivar TLS:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm install
```

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Arquitectura

```text
public/                 favicon, robots y sitemap inicial
src/assets/             imágenes y logos locales
src/components/common/  primitives, estados, SEO y schemas
src/components/layout/  header, navegaciones y footer
src/components/blog/    tarjetas, índice y renderizado de artículos
src/components/services/ y portfolio/  tarjetas de dominio
src/components/forms/   contacto y newsletter
src/data/               configuración y todo el contenido local
src/layouts/            layout global
src/pages/              páginas cargadas de forma diferida
src/routes/             árbol de rutas
src/sections/           secciones compartidas
src/services/           adaptadores reemplazables para APIs
src/styles/             tokens, base, componentes, páginas y responsive
src/utils/              utilidades puras
```

Las páginas de servicio usan una sola plantilla (`ServiceDetailPage`) y se alimentan de `src/data/services.js`. Los artículos se representan desde bloques estructurados, sin renderizar HTML arbitrario. Las rutas se cargan con `React.lazy` y `Suspense`.

## Rutas

- `/`
- `/servicios`
- `/servicios/desarrollo-web`
- `/servicios/aplicaciones`
- `/servicios/seo`
- `/servicios/google-ads`
- `/servicios/meta-ads`
- `/servicios/automatizacion`
- `/proyectos`
- `/proyectos/:slug`
- `/blog`
- `/blog/:slug`
- `/nosotros`
- `/contacto`
- `/referidos`
- `/politica-de-privacidad`
- `/legal/:slug`
- Cualquier ruta desconocida muestra la página 404.

## Gestión y sustitución de contenido

- Datos corporativos, dominio, contacto, redes y navegación: `src/data/siteConfig.js`.
- Servicios y FAQ: `src/data/services.js`.
- Portfolio y casos: `src/data/projects.js`.
- Blog: `src/data/articles.js`.
- Testimonios: `src/data/testimonials.js`.
- Tecnologías: `src/data/technologies.js`.
- Métricas editables: `src/data/homeContent.js`.
- Referencias de imágenes: `src/data/media.js`.

Los proyectos reales migrados son Paola Informa, Sanidad Web, Microcuotas y el plugin gratuito de shortcodes en pestañas. No sustituyas los textos “demostrativo” o “pendiente de validación” por cifras comerciales hasta contar con una fuente verificable.

## Contenido migrado y criterio de seguridad

El contenido se inventarió desde `https://pixvo.tech/` y su API pública de WordPress. Durante la revisión se detectaron numerosas entradas ajenas a Pixvo.Tech sobre casinos y apuestas, además de duplicados editoriales. Esos registros se excluyeron de forma deliberada y no forman parte del nuevo proyecto.

Antes de utilizar el WordPress anterior como CMS o redireccionar el dominio, revisa usuarios, plugins, temas, tareas programadas, archivos modificados, claves, base de datos, Search Console y sitemaps. Rota las credenciales y trabaja desde una copia limpia. La migración de este repositorio no corrige por sí sola el origen comprometido.

## Formulario de contacto

`src/services/contactService.js` simula una petición con 800 ms de espera. No envía ni almacena datos. La interfaz incluye validación por campo, foco en el primer error, prevención de doble envío y estados de envío, éxito y error.

Para probar el error simulado, utiliza un correo con `+error`, por ejemplo `nombre+error@empresa.com`.

Para conectar una API real:

1. Conserva la firma `submitContactForm(payload)`.
2. Reemplaza la espera local por `fetch` o el cliente HTTP acordado.
3. Normaliza la respuesta a `{ success, data }` o lanza un error controlado.
4. Añade protección anti-spam, consentimiento, logs seguros y tratamiento legal de datos en el backend.

## SEO

`SeoHead` gestiona título, descripción, canonical, robots, Open Graph y Twitter Card por ruta mediante `react-helmet-async`.

Schemas disponibles:

- `OrganizationSchema`
- `ServiceSchema`
- `ArticleSchema`
- `BreadcrumbSchema`
- `FaqSchema`

`public/robots.txt` y `public/sitemap.xml` parten del dominio `https://pixvo.tech`. El sitemap incluye las rutas de los proyectos y artículos legítimos migrados, además de referidos y privacidad.

## Assets y sistema visual

Los logos proporcionados se conservan sin recolorear ni deformar. El logo completo se utiliza en header y footer; el isotipo, en favicon, carga y 404. Las imágenes de los proyectos y artículos migrados se guardan localmente en `src/assets/images` para evitar hotlinks al WordPress anterior.

Los tokens visuales están en `src/styles/tokens.css`. La fuente principal es Plus Jakarta Sans y la fuente funcional es Inter, cargadas con `preconnect` y `display=swap`. Si se requiere funcionamiento completamente offline, descarga y sirve los archivos WOFF2 desde `src/assets/fonts`.

## Responsive y accesibilidad

El sistema contempla móvil, tablet, desktop y wide desktop y se comprobó sin overflow horizontal en 320, 375, 768, 1024, 1366, 1440 y 1920 px.

Incluye navegación con teclado, enlace para saltar al contenido, estados `focus-visible`, etiquetas y asociaciones ARIA en formularios, acordeones accesibles, cierre de menús con Escape, bloqueo de scroll móvil y reducción de movimiento con `prefers-reduced-motion`.

## Build y despliegue

```bash
npm run lint
npm run build
npm run preview
```

El resultado queda en `dist/`. En Netlify, Vercel, Cloudflare Pages, Apache o Nginx se debe configurar un fallback de SPA para que todas las rutas no estáticas resuelvan a `index.html`. Sin ese rewrite, abrir directamente `/blog/algun-slug` puede devolver un 404 del servidor aunque la ruta exista en React.

## Limitaciones actuales

- No existe backend, base de datos, CMS ni persistencia del formulario/newsletter.
- Los artículos y casos proceden del sitio público anterior; conviene revisarlos editorialmente antes de publicación definitiva.
- Los testimonios y cualquier resultado expresamente marcado siguen siendo demostrativos o están pendientes de validación.
- Los teléfonos, WhatsApp y correos son los publicados actualmente por Pixvo.Tech. No se encontraron perfiles sociales oficiales visibles, por lo que no se inventaron enlaces.
- Las páginas legales son plantillas y requieren revisión jurídica.
- Una SPA no aporta renderizado HTML por ruta en el servidor; para SEO editorial intensivo conviene evaluar prerender estático en una fase posterior sin cambiar necesariamente el frontend.
- Las imágenes adicionales reutilizan el banco visual de la maqueta. Sustituye las que correspondan por material autorizado de proyectos reales.

## Próximos pasos

1. Sanear o retirar el WordPress anterior y rotar credenciales.
2. Completar datos fiscales, registrales y revisión jurídica.
3. Validar testimonios y resultados comerciales antes de publicarlos.
4. Conectar formulario y newsletter a una API con protección anti-spam.
5. Integrar un CMS limpio o mantener el repositorio editorial local.
6. Incorporar analítica, consentimiento y eventos de conversión.
7. Ejecutar auditorías Lighthouse, accesibilidad y SEO sobre el dominio de producción.
