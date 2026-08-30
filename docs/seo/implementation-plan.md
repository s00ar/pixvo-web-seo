# Implementación SEO transaccional

Aplicación React 18 + Vite 6 localizada en `/mx/`, `/ar/` y `/es/`, con blog y proyectos globales. La arquitectura nacional, navegación, rutas, casos, ownership SEO e interlinking se resuelven desde fuentes compartidas.

El build ejecuta, en orden:

1. `scripts/generate-seo-map.mjs` para derivar keyword map, inventario de URLs e interlinking desde el registro SEO central.
2. Vite para generar los assets de producción.
3. `scripts/postbuild.mjs` para materializar HTML estático por ruta, metadata, schema y sitemaps.
4. `scripts/audit-build.mjs` para comprobar HTML, enlaces, imágenes, ownership y convenciones de URL.

La conversión por formulario prepara una conversación de WhatsApp que la persona debe confirmar manualmente. No existe envío automático de datos ni webhook activo.

