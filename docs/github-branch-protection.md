# Protección de `main` en GitHub

Requiere permisos de administración del repositorio y debe realizarse en GitHub.

1. Abrir **Settings → Rules → Rulesets → New branch ruleset**.
2. Nombrar la regla `main-quality-gate`, activarla y apuntarla a la rama `main`.
3. Habilitar **Require a pull request before merging** y al menos una aprobación cuando haya más colaboradores.
4. Habilitar **Require status checks to pass** y **Require branches to be up to date**.
5. Ejecutar antes una pull request para que GitHub registre los nombres, y seleccionar: `Secrets`, `Lint`, `Tests`, `Build y SEO`.
6. Habilitar resolución de conversaciones y bloquear force pushes y eliminaciones de `main`.
7. No marcar como requerido un job de deploy: Hostinger despliega después del merge, mientras GitHub controla la calidad previa.
8. Probar con una PR pequeña: el botón de merge debe quedar bloqueado si falla cualquier check.

Si el plan de GitHub no permite rulesets, aplicar la misma configuración desde **Settings → Branches → Add branch protection rule**.
