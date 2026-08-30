// Simulación temporal: reemplaza el cuerpo de esta función por la llamada a la API real.
export async function submitContactForm(payload) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Permite probar el estado de error sin backend usando "+error" en el correo.
  if (payload.email.toLowerCase().includes('+error')) {
    throw new Error('Fallo de envío simulado');
  }

  return { success: true, data: payload };
}
