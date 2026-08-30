# Pixvo.Tech v1.1.0

Sitio internacional de Pixvo para México, Argentina y España, construido con React y Vite. La versión de trabajo es `v1.1.0`; `v1.0` no es la copia activa.

El build genera HTML estático por ruta, sitemaps segmentados y configuración para Hostinger/Apache. `seoRegistry.js` mantiene ownership, intención, canonical y rutas publicadas; los catálogos de negocio alimentan soluciones, problemas, comparativas y casos.

## Requisitos y comandos

- Node.js 22
- npm 10 o superior

```bash
npm ci
npm run check:secrets
npm run lint
npm test
npm run build
npm run check:seo
npm run preview
```

`npm run build` genera los mapas SEO, compila Vite, prerenderiza las rutas, crea `.htaccess` y audita el HTML de `dist`.

## Arquitectura publicada

- `/`: marca y selector internacional.
- `/{mx|ar|es}/`: entrada nacional.
- `/{pais}/sistema-crecimiento-digital/`: money page propietaria de Growth System.
- `/{pais}/soluciones/`, `problemas/`, `recursos/`, `planes/`, `auditoria-crecimiento-digital/`, `solicitar-diagnostico/` y `casos-de-exito/`: arquitectura comercial localizada.
- `/blog/` y versiones localizadas: contenido editorial con siguiente paso comercial.
- `/proyectos/shortcodes-en-pestanas/`: portfolio técnico global, separado de los casos.

Las rutas legacy con equivalencia usan 301 explícitos desde `src/data/legacyRoutes.js`. No existe fallback SPA global: una ruta desconocida debe devolver 404 y el spam confirmado sin sustituto, 410.

## Fuentes de verdad y QA

- `src/data/seoRegistry.js`: registro SEO e indexabilidad.
- `src/data/growthSystem.js`: oferta, mercados, planes, problemas y recursos.
- `src/data/entityPresentation.js`: ID/slug → label humano y URL.
- `src/data/legacyRoutes.js`: migraciones 301/404/410.
- `scripts/postbuild.mjs`: HTML y sitemaps físicos.
- `scripts/audit-build.mjs` y `scripts/qa.mjs`: canonical, hreflang, schema, enlaces, ownership, imágenes, sitemaps y HTML.
- `docs/seo/`: keyword map, inventarios, grafo real y evidencia de build.

Los rangos de palabras son orientativos. No se añade contenido para superar un mínimo; la información debe proceder de la oferta, proceso, entregables, evidencia y límites existentes.

## Seguridad y producción

No hay WordPress ni PHP en la copia activa. El antecedente de spam/WordPress exige una revisión separada del servidor: [procedimiento Hostinger](docs/security/production-cleanup.md). No debe declararse producción limpia hasta revisar filesystem, usuarios, cron jobs y bases en hPanel.

`.env`, credenciales, claves, certificados y `.vercel/` están excluidos. Nunca colocar secretos en `VITE_*`, porque se incorporan al frontend. Ejecutar `npm run check:secrets` antes de cada publicación.

## Despliegue

GitHub Actions ejecuta `Secrets`, `Lint`, `Tests` y `Build y SEO`. Tras un merge verde a `main`, Hostinger debe obtener el repositorio mediante OAuth y desplegar `dist`; no se guardan credenciales de Hostinger en GitHub. Configuración, rollback y verificación: [docs/ci-cd.md](docs/ci-cd.md). Protección de rama: [docs/github-branch-protection.md](docs/github-branch-protection.md).

## Limitaciones verificadas

- No hay acceso a hPanel, DNS, Search Console o GA4 desde el repositorio.
- El diagnóstico prepara un mensaje para WhatsApp; la persona confirma el envío. No equivale a un backend ni a una recepción garantizada.
- Hospital Metropolitano requiere capturas verificables mejores. Paola Informa y Arpitools requieren assets horizontales/sociales reales; no se generan screenshots ficticios.
- Las páginas legales requieren validación profesional.
- Las decisiones editoriales `MANUAL_REVIEW` requieren GSC/backlinks antes de borrar o desindexar.
