const marketNames = { mx: 'México', ar: 'Argentina', es: 'España' };

const staticSections = {
  home: (market) => [{
    title: 'Dónde empieza el trabajo',
    paragraphs: [
      `En ${market}, el punto de partida no es contratar todas las capacidades a la vez. Primero se identifica si la pérdida principal está en la visibilidad, la conversión, el trabajo manual, el seguimiento de oportunidades o la medición. Esa decisión determina qué parte del sistema merece prioridad.`,
      'Para construir esa línea base se necesita una oferta definida, acceso al sitio y a la medición disponible, una persona responsable y capacidad para atender las oportunidades. Los datos ausentes se registran como una limitación; no se completan con estimaciones.',
    ],
  }],
  commercial_hub: () => [{
    title: 'La secuencia depende del cuello de botella',
    paragraphs: [
      'SEO puede captar demanda, pero no corrige por sí solo un formulario con fricción ni un seguimiento tardío. Una automatización puede ahorrar trabajo, pero no arregla un proceso que todavía no tiene responsables o estados definidos. El roadmap ordena esas dependencias antes de implementar.',
      'Cada cambio conserva un criterio de finalización y una señal que pueda revisarse. Si la medición está incompleta, configurarla puede ser el primer entregable; si el recorrido ya es trazable, la prioridad puede pasar a una página comercial, un flujo o una mejora de seguimiento.',
    ],
  }],
  pricing: () => [{
    title: 'Cómo se determina el alcance',
    paragraphs: [
      'Las unidades operativas representan capacidad de trabajo priorizada, no una bolsa ilimitada de solicitudes. Antes de seleccionar un plan se revisan la línea base, las dependencias, el ritmo de aprobación y quién puede implementar o validar cada cambio.',
      'Cuando un mercado no tiene importes aprobados, la página lo indica como precio bajo consulta. La propuesta debe dejar por escrito mensualidad, onboarding, permanencia, entregables, límites y condiciones de medición antes de comenzar.',
    ],
  }],
  audit: () => [{
    title: 'Cómo se convierte la revisión en un roadmap',
    paragraphs: [
      'Cada hallazgo se relaciona con su impacto, evidencia, esfuerzo, dependencias y responsable. Un error de medición puede ir antes que una ampliación de contenido; una fricción de formulario puede ir antes que captar más tráfico. La prioridad se justifica por el recorrido completo, no por la disciplina que detectó el problema.',
      'La auditoría distingue hechos comprobados, hipótesis y lagunas de acceso. El roadmap define qué cambiar, cómo comprobarlo y qué queda fuera. No sustituye la implementación posterior ni garantiza ventas o posiciones en buscadores.',
    ],
  }],
  about: () => [{
    title: 'Responsabilidades compartidas',
    paragraphs: [
      'Pixvo aporta diagnóstico, priorización, implementación dentro del alcance y medición con los datos disponibles. La empresa aporta contexto, accesos, aprobaciones, responsables y capacidad de atención. Si una dependencia cambia, el roadmap debe revisarse.',
      'La supervisión humana se mantiene en las decisiones y entregables relevantes. Las herramientas y la inteligencia artificial pueden asistir investigación o producción, pero no sustituyen la revisión ni justifican datos que no existen.',
    ],
  }],
  case_index: () => [{
    title: 'Evidencia y atribución',
    paragraphs: [
      'Cada caso separa el contexto, el trabajo realizado, el cambio funcional y la evidencia disponible. Una cifra solo se publica cuando el proyecto contiene contexto suficiente para interpretarla; de lo contrario se describe la transformación sin convertirla en una estimación.',
      'Las limitaciones también forman parte del caso. La atribución de terceros, la ausencia de datos comparables o una imagen pendiente se declaran para que el lector pueda valorar el alcance real de la evidencia.',
    ],
  }],
};

export function getEditorialExpansion({ pageType, marketCode = 'mx' }) {
  const factory = staticSections[pageType];
  return factory ? factory(marketNames[marketCode] || marketNames.mx) : [];
}
