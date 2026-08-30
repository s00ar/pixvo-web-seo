# Changelog

## 2026-08-30 — Consolidación sobre la aplicación activa `v1.1.0`

- Identificada `v1.1.0` como la aplicación realmente servida por Vite; la implementación anterior había quedado en la copia `v1.0`.
- Consolidada una única fuente de navegación para desktop, mobile y footer con URLs resueltas por mercado.
- Publicados el índice y los cinco casos de éxito en México, Argentina y España desde una fuente compartida.
- Incorporados assets reales de casos, variantes responsive disponibles y metadata de imágenes.
- Añadidos registro SEO central, keyword map expandido a las 172 URLs reales, ownership, interlinking, prerender de Growth/blog/proyectos/casos, sitemaps segmentados y auditoría reproducible del build.
- Corregida la URL de CRO con destino final localizado y 301 histórico para México.
- Retirado de `public` el asset genérico de Paola Informa de 6,1 MB, sin referencias, conservando la captura WebP específica de 47 KB.
- Corregidas las dimensiones declaradas del visual compartido del hero y su metadata social de 1280×853 a sus dimensiones físicas reales, 512×279.
- Revalidado el build activo: 172 URLs indexables, 172 titles únicos, sin enlaces rotos, páginas huérfanas, enlaces internos a redirects, cruces de mercado, imágenes rotas ni conflictos de ownership.

## 2026-08-04 — Formulario por WhatsApp

- Sustituida la entrega del formulario al webhook por una conversación de WhatsApp precompletada al +39 392 142 5033.
- El formulario conserva validación, persistencia por pasos, UTMs y tracking, pero ya no necesita backend ni variables de integración para recibir la solicitud.
- Por las restricciones de WhatsApp, la persona usuaria confirma manualmente el envío del mensaje preparado.

## 2026-08-04

- Añadido acceso global a WhatsApp con el número +39 392 142 5033.
- Publicados los teléfonos aprobados de Italia/Europa y Argentina/Latinoamérica en contacto y footer.
- Centralizada la garantía de tráfico y KPI: continuidad bonificada durante tres meses para Core/Growth y seis meses para Scale cuando no se alcanza el objetivo acordado y se cumplen sus condiciones.
- Ampliadas las preguntas frecuentes visibles y su marcado FAQPage con medición, atribución, límites y ausencia de garantía de ventas.
- Actualizadas las condiciones del servicio para evitar contradicciones con la garantía.

## 2026-08-02

- Transformación de la propuesta generalista en Pixvo Growth System.
- Arquitectura internacional `/mx/`, `/ar/`, `/es/` y raíz x-default.
- 52 rutas comerciales y de conversión declaradas; 49 indexables y tres páginas de gracias noindex.
- Plantillas reutilizables de home, sistema, planes, auditoría, solución, problema, recurso, casos y conversión.
- Precios de España; fallback seguro y configuración para México y Argentina.
- Formulario de 3 pasos con validación doble, honeypot, tiempo mínimo, persistencia de sesión y UTM.
- Endpoint serverless desacoplado mediante webhook.
- Eventos compatibles con GTM sin PII.
- Canonicals, hreflang recíproco, x-default, Open Graph, Twitter Cards y schemas aplicables.
- Sitemaps por mercado, índice, robots y HTML SEO generado por ruta.
- Redirecciones 301 para rutas comerciales sustituidas.
- Restauración de la identidad visual anterior a partir de la referencia Figma/Stitch: paleta Pixvo, Plus Jakarta Sans e Inter, logo corporativo, hero visual, tarjetas Soft-Tech, CTA naranja, superficies, formularios y responsive; sin cambios en rutas, copy ni señales SEO.
- Banderas accesibles en el selector de mercado, numeración de tarjetas reforzada y hover limitado a superficies completamente enlazadas.
- Corrección del interlinking localizado para impedir enlaces desde Argentina o España hacia soluciones publicadas únicamente en México.
- Eliminación de metadatos duplicados después de la hidratación manteniendo SEO estático previo a JavaScript.
