const marketNames = {
  mx: 'México',
  ar: 'Argentina',
  es: 'España',
};

const targetWords = {
  home: 620,
  commercial_hub: 650,
  pricing: 760,
  audit: 1010,
  solution: 850,
  problem: 840,
  comparison: 1080,
  about: 520,
  case_index: 430,
  case_study: 680,
};

const cleanItems = (items = []) => items
  .map((item) => typeof item === 'string' ? item : item?.title || item?.label || item?.text)
  .filter(Boolean);

const summarize = (items, fallback) => {
  const values = cleanItems(items).slice(0, 6);
  if (!values.length) return fallback;
  if (values.length === 1) return values[0];
  return `${values.slice(0, -1).join(', ')} y ${values.at(-1)}`;
};

function pageProfile(pageType, data = {}) {
  const profiles = {
    home: {
      subject: 'Pixvo Growth System',
      purpose: 'conectar visibilidad, conversión, automatización, seguimiento y analítica dentro de una misma ruta comercial',
      inputs: ['objetivo comercial', 'sitio web actual', 'fuentes de oportunidades', 'proceso de atención', 'herramientas disponibles', 'datos de medición'],
      evidence: ['tráfico y consultas', 'páginas de entrada', 'formularios y eventos', 'tiempos de respuesta', 'estado de cada oportunidad'],
      boundaries: ['la oferta y el precio', 'la capacidad de atención', 'la negociación', 'el cierre comercial'],
    },
    commercial_hub: {
      subject: 'el sistema de crecimiento digital',
      purpose: 'ordenar SEO, contenido, conversión, automatización y medición alrededor del cuello de botella prioritario',
      inputs: ['demanda y visibilidad', 'arquitectura web', 'puntos de conversión', 'tareas manuales', 'seguimiento comercial', 'calidad de los datos'],
      evidence: ['línea base', 'dependencias técnicas', 'capacidad del equipo', 'eventos de conversión', 'calidad del seguimiento'],
      boundaries: ['los accesos disponibles', 'la velocidad de aprobación', 'la capacidad operativa', 'las decisiones comerciales'],
    },
    pricing: {
      subject: 'los planes de Pixvo Growth System',
      purpose: 'asignar una capacidad mensual realista a un roadmap priorizado, con alcance, permanencia y límites visibles',
      inputs: ['madurez del sitio', 'volumen de incidencias', 'unidades operativas necesarias', 'dependencias', 'ritmo de aprobación', 'continuidad requerida'],
      evidence: ['alcance acordado', 'unidades consumidas', 'entregables terminados', 'bloqueos', 'KPI definido para el periodo'],
      boundaries: ['las tareas ilimitadas', 'los cambios fuera de alcance', 'los retrasos por accesos', 'los resultados que dependen de ventas'],
    },
    audit: {
      subject: 'la auditoría de crecimiento digital',
      purpose: 'separar los problemas de captación, experiencia, conversión, seguimiento y medición antes de proponer una implementación',
      inputs: ['analítica disponible', 'visibilidad orgánica', 'arquitectura y contenidos', 'formularios', 'automatizaciones', 'proceso comercial'],
      evidence: ['fuentes de tráfico', 'eventos configurados', 'consultas recibidas', 'tiempos de respuesta', 'errores y pérdidas del recorrido'],
      boundaries: ['datos ausentes', 'accesos incompletos', 'atribución parcial', 'decisiones todavía no aprobadas'],
    },
    about: {
      subject: 'la forma de trabajo de Pixvo',
      purpose: 'operar un sistema de mejora continua con alcance definido, criterio profesional y supervisión humana',
      inputs: ['objetivo', 'responsable', 'accesos', 'prioridades', 'capacidad de implementación', 'evidencia disponible'],
      evidence: ['decisiones documentadas', 'trabajo terminado', 'resultados medibles', 'dependencias abiertas', 'límites declarados'],
      boundaries: ['promesas de posiciones', 'garantías de ventas', 'métricas inventadas', 'implementaciones sin responsable'],
    },
    case_index: {
      subject: 'los casos y proyectos documentados por Pixvo',
      purpose: 'explicar la transformación funcional, la evidencia disponible y las limitaciones de atribución de cada experiencia',
      inputs: ['situación inicial', 'problema operativo', 'solución aplicada', 'cambio verificable', 'métricas disponibles', 'límites de evidencia'],
      evidence: ['hechos verificables', 'antes y después', 'atribución pública cuando existe', 'métricas con contexto'],
      boundaries: ['estimaciones no documentadas', 'resultados de terceros', 'causalidad no demostrada', 'cifras sin fuente utilizable'],
    },
  };

  if (pageType === 'solution') {
    return {
      subject: data.title || data.h1 || 'esta solución',
      purpose: data.lead || 'resolver una prioridad concreta dentro del sistema de crecimiento digital',
      inputs: cleanItems(data.items),
      evidence: [...cleanItems(data.items), ...cleanItems(data.related)],
      boundaries: cleanItems(data.excluded),
    };
  }

  if (pageType === 'problem') {
    return {
      subject: data.h1 || 'este problema',
      purpose: data.lead || 'convertir síntomas dispersos en un diagnóstico accionable',
      inputs: cleanItems(data.symptoms),
      evidence: cleanItems(data.diagnosis),
      boundaries: cleanItems(data.causes),
    };
  }

  if (pageType === 'comparison') {
    return {
      subject: data.title || 'esta comparativa',
      purpose: data.decision || 'comparar alternativas con criterios operativos y comerciales explícitos',
      inputs: cleanItems(data.criteria),
      evidence: cleanItems(data.options),
      boundaries: ['elegir solo por precio', 'comparar funciones sin considerar el proceso', 'ignorar mantenimiento y dependencias', 'dar por hecho resultados no medidos'],
    };
  }

  if (pageType === 'case_study') {
    return {
      subject: data.title || 'este caso documentado',
      purpose: data.summary || 'explicar una transformación sin ampliar la atribución más allá de la evidencia disponible',
      inputs: cleanItems(data.workflow),
      evidence: cleanItems(data.verifiedFacts),
      boundaries: [data.caveat, 'métricas sin contexto', 'estimaciones presentadas como hechos', 'resultados ajenos a la solución descrita'].filter(Boolean),
    };
  }

  return profiles[pageType] || profiles.home;
}

function expansionSections(profile, marketName) {
  const inputs = summarize(profile.inputs, 'el objetivo, el proceso actual, los responsables y las herramientas disponibles');
  const evidence = summarize(profile.evidence, 'una línea base, eventos medibles, entregables y decisiones documentadas');
  const boundaries = summarize(profile.boundaries, 'las decisiones, recursos y resultados que quedan fuera del control directo de la implementación');

  return [
    {
      title: `Cómo interpretar ${profile.subject}`,
      paragraphs: [
        `Esta página debe leerse como una parte de un sistema y no como una promesa aislada. Su función es ${profile.purpose}. En una empresa de ${marketName}, el contexto comercial, la capacidad del equipo y la calidad de los datos modifican el orden de las acciones. Por eso la misma herramienta puede ser prioritaria en un caso y secundaria en otro, aunque el síntoma inicial parezca idéntico.`,
        `La decisión empieza por describir qué ocurre hoy, qué debería ocurrir y qué impide avanzar. Esa diferencia permite distinguir un problema de visibilidad de uno de conversión, un problema técnico de uno operativo y una falta de demanda de una pérdida de oportunidades ya existentes. El objetivo del análisis no es acumular tareas, sino reducir incertidumbre y seleccionar el siguiente cambio que pueda comprobarse.`,
      ],
      bullets: profile.inputs,
    },
    {
      title: 'Punto de partida y contexto necesario',
      paragraphs: [
        `Antes de definir alcance conviene reunir ${inputs}. Estos elementos ayudan a reconstruir el recorrido completo: cómo una persona descubre la empresa, qué información consulta, dónde deja sus datos, quién recibe la oportunidad y cómo se registra el resultado. Si una etapa no está documentada, se marca como una laguna y no se completa con una suposición conveniente.`,
        `También se separan las restricciones permanentes de los bloqueos temporales. Una limitación del equipo, una integración pendiente o una aprobación retrasada no se resuelven con más contenido por sí solos. Hacer visible cada dependencia evita que el roadmap trate todos los problemas como si tuvieran la misma urgencia y permite asignar responsables antes de iniciar una tarea que podría quedar detenida.`,
      ],
    },
    {
      title: 'Señales que ayudan a formular el diagnóstico',
      paragraphs: [
        `Las señales se interpretan en conjunto. Una caída de tráfico puede proceder de la demanda, de la cobertura de contenidos, de una incidencia técnica o de una medición incompleta. Del mismo modo, un aumento de consultas no demuestra por sí solo que el sistema comercial haya mejorado: todavía hay que revisar relevancia, tiempo de respuesta, clasificación, seguimiento y resultado final.`,
        `El diagnóstico contrasta lo que la empresa observa con ${evidence}. Cuando varias fuentes apuntan al mismo cuello de botella, la prioridad gana solidez. Cuando los datos se contradicen, el primer trabajo puede consistir en corregir la medición. Esta disciplina evita atribuir a SEO, automatización o diseño cambios que podrían depender de estacionalidad, campañas, disponibilidad del equipo o decisiones comerciales externas.`,
      ],
      bullets: profile.evidence,
    },
    {
      title: 'Criterios para ordenar el trabajo',
      paragraphs: [
        `Cada acción se compara por impacto esperado, evidencia disponible, esfuerzo, dependencias, reversibilidad y posibilidad de medición. Una mejora pequeña con datos claros puede ir antes que una reconstrucción amplia si permite validar una hipótesis importante. En cambio, una tarea aparentemente rápida pierde prioridad cuando depende de accesos, contenido, aprobación legal o capacidad comercial que todavía no existen.`,
        `La priorización también protege la continuidad. El roadmap necesita dejar espacio para incidencias, aprendizaje y ajustes posteriores a la implementación. No todo debe ejecutarse al mismo tiempo: algunas decisiones requieren una línea base; otras necesitan que una etapa anterior ya esté funcionando. Ordenar el trabajo por secuencia reduce retrabajo y hace más fácil explicar por qué una acción entra en el periodo actual y otra queda documentada para después.`,
      ],
    },
    {
      title: 'De la recomendación a una implementación verificable',
      paragraphs: [
        `Una recomendación útil define el cambio, el responsable, las dependencias, el criterio de finalización y la señal que se observará después. La implementación puede combinar ajustes técnicos, contenido, automatizaciones, analítica o cambios de proceso, pero cada elemento conserva una función concreta. Así se evita confundir el número de entregables con el progreso real del sistema.`,
        `Después de publicar o activar un cambio se comprueba que funciona como fue diseñado. Esto incluye revisar enlaces, formularios, eventos, avisos, datos transferidos y comportamiento en los puntos críticos. Si el resultado no puede medirse todavía, se documenta esa condición. El aprendizaje se incorpora al siguiente ciclo sin reescribir la historia ni convertir una correlación temprana en una conclusión definitiva.`,
      ],
    },
    {
      title: 'Medición, lectura de resultados y continuidad',
      paragraphs: [
        `La medición parte de una línea base y conserva el contexto de cada indicador. Tráfico, visibilidad, eventos, consultas, oportunidades y ventas pertenecen a etapas distintas; sumarlos o intercambiarlos elimina información. Cuando existe una métrica válida, se indica qué representa, durante qué periodo se observó y qué condiciones pueden haber influido. Cuando no existe, la ausencia se trata como una tarea de medición y no como permiso para estimar.`,
        `La continuidad permite observar efectos, corregir fricciones y decidir si conviene ampliar, mantener o retirar una acción. No significa repetir el mismo trabajo indefinidamente. Cada revisión debe responder qué cambió, qué permanece bloqueado, qué evidencia apareció y cuál es la siguiente hipótesis razonable. Esa secuencia convierte el mantenimiento en aprendizaje operativo y mantiene alineadas las decisiones técnicas con la capacidad real de la empresa.`,
      ],
    },
    {
      title: 'Dependencias, límites y responsabilidades',
      paragraphs: [
        `El alcance no controla ${boundaries}. La calidad de la oferta, el precio, la disponibilidad, la atención y el cierre comercial pueden modificar el resultado aunque la implementación técnica funcione. Declarar estos límites no reduce la exigencia del trabajo; permite evaluar cada etapa con el criterio que le corresponde y evita prometer un efecto que depende de varias partes.`,
        `Pixvo aporta diagnóstico, priorización, implementación dentro del alcance y medición con la evidencia disponible. La empresa aporta contexto, accesos, aprobaciones, responsables y capacidad para atender las oportunidades. Si una de estas condiciones cambia, el roadmap también debe revisarse. La transparencia sobre responsabilidades facilita decisiones tempranas y evita que un bloqueo operativo se oculte detrás de más tareas digitales.`,
      ],
      bullets: profile.boundaries,
    },
    {
      title: 'Cómo decidir el siguiente paso',
      paragraphs: [
        `El siguiente paso depende de cuánta certeza existe. Si el problema todavía mezcla síntomas de varias etapas, una auditoría ayuda a construir la línea base y ordenar hipótesis. Si el cuello de botella ya está comprobado, puede definirse una implementación concreta. Si además existe capacidad para medir y mejorar durante varios ciclos, un plan recurrente permite trabajar el roadmap con continuidad y límites mensuales claros.`,
        `La decisión final debe poder explicarse sin depender de lenguaje técnico: qué problema se prioriza, por qué importa ahora, qué se hará, qué necesita la empresa, cómo se comprobará y qué queda fuera. Cuando esas respuestas no están disponibles, avanzar a una solución más grande añade coste pero no necesariamente claridad. Empezar con el alcance mínimo verificable suele producir una base más útil para la siguiente decisión.`,
      ],
    },
  ];
}

const wordCount = (sections) => sections
  .flatMap((section) => [section.title, ...(section.paragraphs || []), ...(section.bullets || [])])
  .join(' ')
  .match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length || 0;

export function getEditorialExpansion({ pageType, marketCode = 'mx', data = {} }) {
  const minimum = targetWords[pageType];
  if (!minimum) return [];
  const sections = expansionSections(pageProfile(pageType, data), marketNames[marketCode] || marketNames.mx);
  const selected = [];
  for (const section of sections) {
    selected.push(section);
    if (wordCount(selected) >= minimum) break;
  }
  return selected;
}

