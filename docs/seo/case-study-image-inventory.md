# Inventario de imágenes de casos de éxito

Auditoría física realizada sobre la aplicación activa `v1.1.0`. No se generaron ni descargaron imágenes nuevas.

| Caso | Archivo publicado | Desktop / mobile | Alt |
| --- | --- | --- | --- |
| Microcuotas | `public/images/case-studies/microcuotas/microcuotas-1024.png` | `srcset` de 300, 768, 1024 y 1536 px; el navegador elige según viewport y densidad | Simulador de préstamos de Microcuotas con formulario mobile |
| Hospital Metropolitano | `public/images/case-studies/hospital-metropolitano/hospital-metropolitano.jpg` | Una sola variante 4681×3121, usada debajo del hero con lazy loading; el hero usa el visual liviano compartido | Ilustración de una plataforma digital para gestionar eventos y operaciones |
| Sanidad Web | `public/images/case-studies/sanidad-web/sanidad-1024.png` | 768, 1024 y 1536 px; variante vertical `sanidad-mobile.png` para detalle hasta 480 px | Mapa georreferenciado de servicios en la plataforma Sanidad Web |
| Paola Informa | `public/images/case-studies/paola-informa/paola-informa.webp` | Única captura vertical 430×932, mostrada con `object-fit: contain` | Pantalla de noticias y eventos de la aplicación Paola Informa |
| Arpitools | `public/images/case-studies/arpitools/arpitools-mobile.jpg` | Única captura vertical 473×1024, mostrada con `object-fit: contain` | Pantalla de inicio de sesión de la aplicación móvil Arpitools |

Todos los usos publicados incluyen dimensiones, `decoding="async"` y estrategia de carga. Los hero específicos no usan lazy loading; las cards y los medios bajo el fold sí. Microcuotas y Sanidad Web usan `picture`, `srcset` y `sizes` con variantes físicas comprobadas.

El asset genérico `paola-informa.jpg` de 6,1 MB fue retirado de `public`: no tenía referencias y fue sustituido por la captura específica WebP de 47 KB. No es recuperable desde `v1.1.0`; el WebP publicado permanece intacto.

## Assets que faltan físicamente

- Hospital Metropolitano: falta una captura verificable de la aplicación/backoffice y variantes optimizadas horizontal, tablet y mobile. La imagen actual debe seguir identificándose como ilustración conceptual.
- Paola Informa: falta una serie responsive del mismo encuadre y una imagen social horizontal.
- Arpitools: falta una variante horizontal para cards/social y una variante mobile más pequeña.

No se simula la existencia de esas variantes en `srcset` ni en metadata.

