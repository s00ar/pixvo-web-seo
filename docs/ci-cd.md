# CI/CD de Pixvo

El workflow [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml) valida cada cambio y publica el sitio en Vercel solo después de superar todas las comprobaciones.

## Comportamiento

- Cada `pull request` hacia `main` ejecuta lint, pruebas, build, auditoría del HTML y QA SEO.
- Cada `push` a una rama distinta de `main` ejecuta las mismas comprobaciones y crea una Preview de Vercel.
- Cada `push` a `main` despliega Producción después de superar todas las comprobaciones.
- `workflow_dispatch` permite repetir manualmente el despliegue de `main` desde GitHub Actions.
- La concurrencia cancela ejecuciones antiguas de la misma rama para impedir despliegues obsoletos.

## Configuración única en GitHub

Crear los entornos `preview` y `production` en **Settings → Environments**. En cada entorno, añadir estos secrets con los valores del mismo proyecto de Vercel:

- `VERCEL_TOKEN`: token de acceso creado en la cuenta de Vercel.
- `VERCEL_ORG_ID`: identificador de la cuenta o equipo propietario.
- `VERCEL_PROJECT_ID`: identificador del proyecto Pixvo.

Los dos identificadores aparecen al enlazar el proyecto con `vercel link`, dentro del archivo local `.vercel/project.json`. Ese directorio contiene configuración local y está excluido de Git.

Para que la actualización de Producción sea totalmente automática, el entorno `production` no debe exigir aprobación manual. Si se prefiere una autorización antes de publicar, se puede activar un revisor requerido en ese entorno sin cambiar el workflow.

## Evitar despliegues duplicados

Este workflow es el mecanismo de despliegue autoritativo. Si el repositorio ya está conectado mediante la integración Git nativa de Vercel, hay que desactivar sus despliegues automáticos o retirar esa conexión; de lo contrario, un mismo `push` puede iniciar el workflow y además otro despliegue independiente en Vercel.

## Secuencia de publicación

1. Instala exactamente las dependencias de `package-lock.json` con `npm ci`.
2. Ejecuta `npm run lint`, `npm test`, `npm run build` y `npm run check:seo`.
3. Recupera la configuración del entorno con `vercel pull`.
4. Genera `.vercel/output` con `vercel build`.
5. Publica el artefacto verificado con `vercel deploy --prebuilt`.

Si cualquier prueba, auditoría editorial o comprobación SEO falla, el job de despliegue no comienza.

## Seguridad de credenciales

- Los valores se guardan exclusivamente como GitHub Actions Secrets; el workflow solo contiene referencias `${{ secrets.NOMBRE }}`.
- `VERCEL_TOKEN` se inyecta únicamente en los pasos de Vercel. No está disponible durante `npm ci`, lint, pruebas ni el control SEO general.
- `.env`, sus variantes y `.vercel/` están excluidos mediante `.gitignore`; `.env.example` solo contiene nombres y valores públicos o vacíos.
- `npm run check:secrets` revisa los archivos versionados y los archivos no ignorados antes de instalar dependencias, y bloquea el pipeline si encuentra rutas sensibles, claves privadas o formatos de tokens conocidos. El control solo informa el archivo y el tipo; nunca imprime el valor detectado.
- Ninguna credencial privada debe usar el prefijo `VITE_`: Vite incluye esas variables en el JavaScript que recibe el navegador.

Si una clave llegara a aparecer en un commit o log, ocultarla después no es suficiente: debe revocarse, rotarse y eliminarse también del historial de Git.
