# Informe de QA

## Revalidación de la aplicación activa — 2026-08-30

La aplicación activa se identificó por el proceso de Vite en ejecución y su ruta de trabajo: `v1.1.0`. La implementación SEO anterior estaba en `v1.0`, una copia que no era la servida en `http://127.0.0.1:5173`.

Resultados ejecutados desde `v1.1.0`:

- `npm run lint`: 0 errores.
- `npm test`: método, antispam, validación y fallo seguro sin webhook validados.
- `npm run build`: correcto; 125 módulos transformados.
- `npm run audit:build`: 172 URLs indexables, 243 usos de imágenes, sin páginas huérfanas, enlaces rotos, enlaces a redirects, enlaces comerciales hacia otro país ni conflictos de ownership.
- `npm run check:seo`: 52 rutas indexables idénticas por mercado, 172 URLs totales, 172 filas reales en el keyword map, 172 titles únicos, 6 sitemaps y 3 páginas noindex validados.
- HTTP sobre el servidor activo: las homes, índices de casos y muestras de los cinco casos responden 200; los siete assets principales/responsive comprobados responden 200 con su tipo MIME correcto.
- El servidor activo entrega `src/data/navigation.js` con una sola configuración compartida, `Casos de éxito` en header/footer y sin prefijos nacionales hardcodeados.
- El servidor activo entrega los cinco slugs desde una única fuente: Microcuotas, Hospital Metropolitano, Sanidad Web, Paola Informa y Arpitools.

La validación visual automatizada no se repitió en esta ejecución porque el navegador integrado no tenía ninguna instancia disponible. No se declara como verificada. Las comprobaciones de estructura responsive, dimensiones, `picture/srcset/sizes`, alt, carga, decoding, overflow y menús siguen cubiertas por el QA del HTML/build, pero requieren una nueva sesión de navegador para confirmación visual independiente.

## Observaciones editoriales

- 105 URLs quedan por debajo de los rangos editoriales orientativos del encargo. No es un error de build ni se añadió texto redundante sólo para alcanzar una cifra.
- Hay 10 advertencias de imagen no bloqueantes: assets verticales usados en social/cards y la ilustración grande de Hospital Metropolitano, que se carga de forma diferida fuera del hero.
- Hospital Metropolitano conserva atribución explícita a Metamorfosis 360 y Events Group y se presenta únicamente como experiencia asociada del equipo.
- El proyecto global `shortcodes-en-pestanas` permanece separado de los casos de éxito nacionales.
