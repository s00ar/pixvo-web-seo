# Limpieza operativa de producción y WordPress legacy

## Estado comprobable

### RESUELTO EN REPO

- No existen `wp-config.php`, `wp-content`, `wp-admin`, `wp-includes` ni archivos PHP en la copia activa `v1.1.0`.
- No se encontraron SQL, ZIP/TAR de backup, shells PHP, `eval`, `base64_decode` ni ofuscación equivalente en archivos de producción.
- Ninguna URL de spam forma parte del registro SEO, prerender, navegación o sitemaps.
- `/official-site/` está inventariada como contenido ajeno y configurada para responder 410.
- Los endpoints WordPress conocidos se configuran como 404; no se bloquean en robots.txt.
- Los redirects válidos son explícitos. No existe redirect masivo de spam a la Home.

### REQUIERE ACCIÓN EN PRODUCCIÓN/HOSTINGER

El repositorio no permite inspeccionar el filesystem, las bases, usuarios, tareas programadas ni logs de hPanel. La observación HTTP no demuestra que un WordPress antiguo haya sido retirado del servidor. Ejecutar este procedimiento con una cuenta administrativa autorizada.

## Procedimiento exacto en hPanel

1. **Backup:** generar y descargar una copia de archivos y bases antes de tocar producción. Registrar fecha, document root y checksum del archivo; almacenar fuera del directorio público.
2. **Document root:** identificar la carpeta realmente servida por `pixvo.tech` y subdominios. Compararla con el output `dist` esperado.
3. **Inventario de archivos:** activar archivos ocultos y buscar `wp-config.php`, `wp-content`, `wp-admin`, `wp-includes`, `.user.ini`, `.htaccess`, PHP, SQL, ZIP, TAR, backups y carpetas ajenas. No ejecutar archivos sospechosos.
4. **Aislamiento:** mover una instalación legacy confirmada fuera del directorio público y sin ejecución, o descargarla y retirarla. Conservar ruta, hashes, timestamps y lista de nombres como evidencia.
5. **Reinstalación limpia:** ante PHP ofuscado, shells, usuarios desconocidos o cambios fuera del deploy, recrear el document root vacío y publicar únicamente `dist` desde un SHA verificado.
6. **Usuarios administrativos:** revisar usuarios de Hostinger, WordPress, bases y servicios vinculados. Deshabilitar cuentas desconocidas y activar MFA.
7. **Passwords:** rotar hPanel, WordPress residual, SFTP/FTP, SSH, bases y correos administradores. Usar valores únicos en un gestor.
8. **Claves y APIs:** revocar tokens accesibles desde un servidor comprometido. Nunca guardarlos como `VITE_*` ni en Git.
9. **`.htaccess`:** comparar con `public/.htaccess`. Retirar rewrites WordPress, dominios ajenos, PHP inesperado o redirects de spam.
10. **Cron jobs:** en hPanel → Advanced → Cron Jobs, retirar tareas desconocidas, descargas remotas, PHP residual o procesos que regeneren archivos.
11. **FTP/SFTP/SSH:** revisar cuentas, claves y últimos accesos disponibles. Eliminar cuentas antiguas y limitar permisos al usuario de deploy.
12. **Bases de datos:** inventariar y exportar antes de borrar. Retirar una base WordPress sin uso solo tras confirmar propietario y revisar backlinks/GSC; eliminar usuarios DB innecesarios.
13. **Plugins/themes:** si otro host necesita WordPress, reinstalar core, plugins y themes desde fuentes oficiales; retirar componentes abandonados y actualizar antes de exponerlo.
14. **PHP malicioso:** buscar `eval`, `base64_decode`, `gzinflate`, `assert`, `shell_exec`, nombres aleatorios, includes remotos y PHP en uploads. Ante compromiso, reinstalar limpio.
15. **Permisos:** evitar escritura global. Usar como referencia 644 para archivos y 755 para directorios, ajustado al hosting; ninguna credencial debe ser pública.
16. **Deploy:** conectar por OAuth y publicar solo `dist` desde `main` después de CI verde. Confirmar que no se mezcla con archivos previos.
17. **URLs comprometidas:** comprobar `docs/seo/legacy-url-migration.csv`, búsquedas `site:pixvo.tech` y exportes de GSC. Inventariar cada hallazgo antes de decidir.
18. **Códigos esperados:** vigente 200; equivalencia real 301; spam sin sustituto 410; endpoint WordPress o ruta desconocida 404. Nunca 200 genérico ni redirect a Home para spam.
19. **Search Console:** inspeccionar URLs, enviar sitemaps, solicitar retirada temporal si urge y comprobar 404/410. Revisar Security Issues, Manual Actions y backlinks antes de borrar legacy valioso.

## Smoke test posterior

```text
https://pixvo.tech/                         → 200
http://pixvo.tech/                          → 301 https apex
https://www.pixvo.tech/                     → 301 https apex
https://pixvo.tech/servicios/seo/           → 301 money page MX
https://pixvo.tech/official-site/            → 410
https://pixvo.tech/wp-login.php              → 404
https://pixvo.tech/ruta-inexistente-control/ → 404
```

Guardar fecha, headers y SHA desplegado. Hasta completar el procedimiento no debe afirmarse que producción está limpia.
