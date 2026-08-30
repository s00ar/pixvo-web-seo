# Evidencia de seguridad del repositorio

Fecha de ejecución: 2026-08-30. Alcance: copia activa `v1.1.0`; no representa el filesystem de Hostinger.

| comprobación | resultado |
|---|---|
| `wp-config.php`, `wp-content`, `wp-admin`, `wp-includes` | 0 hallazgos de WordPress en el proyecto activo |
| archivos `.php` | 0 |
| `.htaccess` inesperados | 0; existe únicamente el archivo generado para Hostinger |
| SQL, ZIP/TAR y backups | 0 artefactos legacy encontrados |
| `eval`, `base64_decode`, `gzinflate`, shells PHP | 0 patrones de compromiso en código de producción |
| casino, betting, cosmobet, vavada | solo documentación de seguridad/antecedente; 0 en HTML indexable |
| `npm run check:secrets` | 1.423 archivos revisados; 0 patrones detectados |
| historial Git | 3 commits revisados; 0 archivos con patrones de private key, GitHub, AWS, Stripe o Slack |

El scanner solo informa archivo y tipo de regla si falla; no imprime el valor coincidente. Un resultado local limpio no autoriza a declarar limpio el hosting anterior. Seguir `production-cleanup.md` en hPanel.
