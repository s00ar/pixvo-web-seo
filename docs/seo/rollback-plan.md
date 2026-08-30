# Plan de rollback

No existe un repositorio Git en el directorio recibido. Antes de desplegar, crear un snapshot o inicializar Git y etiquetar el estado previo.

1. Conservar el artefacto `dist` de la versión desplegada anterior.
2. Si falla la nueva versión, restaurar ese artefacto desde el proveedor de hosting.
3. Restaurar conjuntamente `vercel.json` o `_redirects`; no dejar reglas nuevas apuntando a páginas retiradas.
4. Restaurar el receptor serverless anterior si fuera necesario retirar el traspaso directo a WhatsApp.
5. Verificar `/`, una ruta por mercado, `/api/diagnosis`, `robots.txt` y `sitemap_index.xml`.

Los mensajes ya confirmados por la persona en WhatsApp no pueden revertirse desde el frontend; su gestión debe seguir la política de conservación aprobada.
