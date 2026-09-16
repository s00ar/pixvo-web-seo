---
title: "Microcuotas — Caso de éxito"
meta_title: "Microcuotas | Caso de éxito Pixvo"
description: "Un funnel de crédito que precalifica, valida, clasifica e integra un volumen semanal alto antes de la intervención comercial."
date: 2025-01-01
draft: false

page_header:
  badge: "Servicios financieros"
  title: "Microcuotas"
  content: "Un funnel de crédito que precalifica, valida, clasifica e integra un volumen semanal alto antes de la intervención comercial."

image: "/images/case-study/microcuotas/microcuotas-1536.png"
thumbnail: "/images/case-study/microcuotas/microcuotas-768.png"
logo: "/images/isotipo.png"
company: "Microcuotas"
badge: "Servicios financieros"

stats:
  - value: "Más de 5.600"
    label: "leads semanales"
  - value: "≈ 400"
    label: "leads calificados/semana"
  - value: "21"
    label: "potenciales aprobados/semana"
  - value: "< USD 0,10"
    label: "CPL"

client_info:
  - label: "Cliente"
    value: "Microcuotas"
    icon: "/images/icons/careerdevelopment.svg"
  - label: "Industria"
    value: "Servicios financieros"
    icon: "/images/icons/careerdevelopment.svg"
  - label: "Servicio"
    value: "Automatización, seguimiento de leads, analítica"
    icon: "/images/icons/careerdevelopment.svg"

overview:
  image: "/images/case-study/microcuotas/microcuotas-1024.png"
  title: "Resumen"
  content: |
    Microcuotas necesitaba transformar un proceso manual de gran volumen en un recorrido trazable. La solución conecta captación, formulario, reglas de validación, clasificación y CRM para que el equipo comercial reciba oportunidades mucho más filtradas.
    
    Más de 5.600 leads semanales requerían revisión manual. El volumen hacía que la mayor parte del esfuerzo se concentrara en leer, comprobar y trasladar datos antes de saber qué registros cumplían las condiciones necesarias.

challenges:
  title: "Desafío"
  content: |
    La calificación ocurría demasiado tarde. Datos personales, condiciones crediticias y escenarios de validación debían revisarse antes de que el equipo pudiera distinguir una consulta de una oportunidad comercial.
    
    El cuello de botella no era captar más registros, sino procesar el volumen existente con criterios consistentes, trazabilidad y una salida útil para ventas.
  quote: "El cuello de botella no era captar más registros, sino procesar el volumen existente con criterios consistentes, trazabilidad y una salida útil para ventas."
  quote_author:
    name: "Equipo Pixvo"
    designation: "Nota de implementación"
    avatar: "/images/isotipo.png"

solution:
  image: "/images/case-study/microcuotas/microcuotas-1024.png"
  title: "Solución"
  content: |
    Se construyó un flujo React con formulario multipaso, validaciones progresivas de CUIL, teléfono y correo, reglas crediticias y escenarios BCRA. Firestore conserva el estado y un entorno de administración permite filtrar, exportar, revisar métricas y gestionar aprobaciones o rechazos.
    
    Google Ads capta la solicitud y la entrega mediante webhook. El formulario y las reglas validan y normalizan los datos. El sistema precalifica y clasifica cada registro. Los resultados, logs y errores quedan disponibles para control y reintentos. Las oportunidades filtradas se integran con Clientify para el seguimiento comercial.
    
    React organiza la experiencia multipaso; Firestore soporta persistencia y administración; webhooks desacoplan la captación; y Clientify recibe la información normalizada.
  items:
    - "Formulario React multipaso con validaciones progresivas"
    - "Validación de CUIL, teléfono, correo, reglas crediticias y escenarios BCRA"
    - "Persistencia en Firestore y administración con filtros, exportación y métricas"
    - "Aprobaciones, rechazos, integración con Clientify, logs, errores y reintentos"

results:
  title: "Resultados"
  content: |
    La transformación comprobable es funcional: el equipo comercial deja de ser la primera capa de validación y trabaja sobre un conjunto de oportunidades que ya atravesó reglas, normalización y clasificación.
    
    Nota: los 21 potenciales aprobados no se comparan con cifras de cierres porque corresponden a etapas diferentes del funnel. Tampoco se publica ningún porcentaje de reducción del tiempo operativo: la formulación original era matemáticamente incorrecta y no existe una métrica base suficiente para reconstruirla.

    ¿Buscás el detalle de implementación? Podés ver [la ficha técnica del proyecto, con capturas del formulario multipaso](/proyectos/microcuotas).
  metrics:
    - value: "Más de 5.600"
      label: "leads semanales"
    - value: "≈ 400"
      label: "leads calificados/semana"
    - value: "21"
      label: "potenciales aprobados/semana"
    - value: "< USD 0,10"
      label: "CPL"
---
