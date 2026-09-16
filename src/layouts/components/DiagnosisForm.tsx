import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

/**
 * Formulario de diagnóstico en 3 pasos. No envía datos a ningún servidor:
 * arma un mensaje y lo abre en WhatsApp, que es lo que la persona confirma.
 * Réplica funcional del formulario de la v1.1.0 con la estética del theme.
 */

type Props = {
  market: "mx" | "ar" | "es";
  countryName: string;
  currency: string;
  whatsappNumber: string;
  privacyUrl: string;
  contactUrl: string;
};

type Values = {
  name: string;
  company: string;
  email: string;
  website: string;
  country: string;
  companyType: string;
  problem: string;
  channels: string[];
  monthlyLeads: string;
  tools: string;
  crm: string;
  leadCapacity: string;
  budget: string;
  startDate: string;
  responsible: string;
  interest: string;
  consent: boolean;
  website_confirm: string;
};

const STEP_FIELDS: (keyof Values)[][] = [
  ["name", "company", "email", "website", "country", "companyType"],
  ["problem", "channels", "monthlyLeads", "tools", "crm", "leadCapacity"],
  ["budget", "startDate", "responsible", "interest", "consent"],
];

const LABELS: Partial<Record<keyof Values, string>> = {
  name: "Nombre",
  company: "Empresa",
  email: "Correo",
  website: "Sitio web",
  country: "País",
  companyType: "Tipo de empresa",
  problem: "Principal problema",
  channels: "Canales actuales",
  monthlyLeads: "Leads mensuales aproximados",
  tools: "Herramientas utilizadas",
  crm: "CRM",
  leadCapacity: "Capacidad para atender leads",
  budget: "Presupuesto",
  startDate: "Fecha estimada de inicio",
  responsible: "Persona responsable",
  interest: "Plan de interés",
  consent: "Consentimiento",
};

const OPTIONAL: (keyof Values)[] = ["website", "tools", "crm"];
const STEP_NAMES = ["Empresa", "Situación", "Encaje"];

const INPUT_CLASS =
  "w-full rounded-full bg-white/5 backdrop-blur-[44px] px-7 py-4 border border-border text-white placeholder:text-text-dark focus:border-primary focus:outline-none transition-colors";
const SELECT_CLASS = `${INPUT_CLASS} appearance-none cursor-pointer`;
const LABEL_CLASS = "mb-3 block text-text text-sm";

export default function DiagnosisForm({
  market,
  countryName,
  currency,
  whatsappNumber,
  privacyUrl,
  contactUrl,
}: Props) {
  const storageKey = `pixvo-diagnostico-${market}`;
  const [values, setValues] = useState<Values>(() => ({
    name: "",
    company: "",
    email: "",
    website: "",
    country: countryName,
    companyType: "",
    problem: "",
    channels: [],
    monthlyLeads: "",
    tools: "",
    crm: "",
    leadCapacity: "",
    budget: "",
    startDate: "",
    responsible: "",
    interest: "",
    consent: false,
    website_confirm: "",
  }));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [hydrated, setHydrated] = useState(false);
  const alertRef = useRef<HTMLParagraphElement>(null);

  // Recupera el borrador solo en cliente, para no romper la hidratación.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) setValues((v) => ({ ...v, ...JSON.parse(saved), country: v.country }));
    } catch {
      /* sessionStorage puede no estar disponible */
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(values));
    } catch {
      /* modo privado o almacenamiento bloqueado */
    }
  }, [values, storageKey, hydrated]);

  const set = (name: keyof Values, value: unknown) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = (index: number) => {
    const found: Partial<Record<string, string>> = {};
    for (const field of STEP_FIELDS[index]) {
      if (OPTIONAL.includes(field)) continue;
      const value = values[field];
      const empty =
        value === "" ||
        value === false ||
        (Array.isArray(value) && value.length === 0);
      if (empty) found[field] = `${LABELS[field]} es obligatorio.`;
    }
    if (index === 0) {
      if (values.name.trim().length < 2) found.name = "Escribí al menos dos caracteres.";
      if (!/^\S+@\S+\.\S+$/.test(values.email)) found.email = "Introducí un correo válido.";
      if (values.website && !/^https?:\/\/.+/i.test(values.website))
        found.website = "Incluí https:// al principio.";
    }
    if (index === 2 && !values.consent)
      found.consent = "Necesitamos tu confirmación para continuar.";
    return found;
  };

  const goNext = () => {
    const found = validate(step);
    setErrors(found);
    if (Object.keys(found).length) {
      alertRef.current?.focus();
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate(2);
    setErrors(found);
    if (Object.keys(found).length) {
      alertRef.current?.focus();
      return;
    }
    if (values.website_confirm) return; // honeypot

    const opt = (label: string, value: string) => (value ? `\n${label}: ${value}` : "");
    const message = [
      "Hola, quiero solicitar un diagnóstico de Pixvo Growth System.",
      "",
      "DATOS DE CONTACTO",
      `Nombre: ${values.name}`,
      `Empresa: ${values.company}`,
      `Correo: ${values.email}${opt("Sitio web", values.website)}`,
      `País: ${values.country}`,
      `Tipo de empresa: ${values.companyType}`,
      "",
      "SITUACIÓN ACTUAL",
      `Principal problema: ${values.problem}`,
      `Canales actuales: ${values.channels.join(", ")}`,
      `Leads mensuales aproximados: ${values.monthlyLeads}${opt("Herramientas", values.tools)}${opt("CRM", values.crm)}`,
      `Capacidad para atender leads: ${values.leadCapacity}`,
      "",
      "ENCAJE",
      `Presupuesto: ${values.budget}`,
      `Fecha estimada de inicio: ${values.startDate}`,
      `Responsabilidad en la decisión: ${values.responsible}`,
      `Plan de interés: ${values.interest}`,
    ].join("\n");

    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      /* ignorado */
    }
    window.location.assign(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    );
  };

  const budgetOptions =
    market === "es"
      ? ["Menos de 550 EUR", "550–799 EUR", "800–1.199 EUR", "1.200 EUR o más", "Pendiente de definir"]
      : ["Presupuesto aprobado", "Presupuesto por definir", "Necesitamos una propuesta"];

  const errorList = Object.values(errors).filter(Boolean) as string[];

  return (
    <div>
      {/* Indicador de pasos */}
      <ol className="flex flex-wrap items-center gap-3 mb-10" aria-label="Progreso del formulario">
        {STEP_NAMES.map((name, i) => (
          <li key={name} className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm border transition-colors ${
                i === step
                  ? "border-primary text-white bg-primary/15"
                  : i < step
                    ? "border-border text-text bg-white/5"
                    : "border-border text-text-dark"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="font-semibold">{i + 1}</span>
              {name}
            </span>
            {i < STEP_NAMES.length - 1 && <span className="text-text-dark" aria-hidden="true">·</span>}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} noValidate className="flex flex-col gap-8">
        {errorList.length > 0 && (
          <p
            ref={alertRef}
            tabIndex={-1}
            role="alert"
            className="rounded-2xl border border-secondary/60 bg-secondary/10 px-6 py-4 text-white"
          >
            Revisá los campos marcados: {errorList[0]}
          </p>
        )}

        {/* Honeypot anti-spam */}
        <div className="hidden" aria-hidden="true">
          <label>
            Confirmar sitio
            <input
              tabIndex={-1}
              autoComplete="off"
              value={values.website_confirm}
              onChange={(e) => set("website_confirm", e.target.value)}
            />
          </label>
        </div>

        {step === 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nombre" error={errors.name}>
              <input
                className={INPUT_CLASS}
                value={values.name}
                autoComplete="name"
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <Field label="Empresa" error={errors.company}>
              <input
                className={INPUT_CLASS}
                value={values.company}
                autoComplete="organization"
                onChange={(e) => set("company", e.target.value)}
              />
            </Field>
            <Field label="Correo" error={errors.email}>
              <input
                className={INPUT_CLASS}
                type="email"
                value={values.email}
                autoComplete="email"
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="Sitio web (opcional)" error={errors.website}>
              <input
                className={INPUT_CLASS}
                type="url"
                placeholder="https://"
                value={values.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </Field>
            <Field label="País" error={errors.country}>
              <select
                className={SELECT_CLASS}
                value={values.country}
                onChange={(e) => set("country", e.target.value)}
              >
                {["México", "Argentina", "España"].map((o) => (
                  <option key={o} value={o} className="bg-body">
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tipo de empresa" error={errors.companyType}>
              <Options
                value={values.companyType}
                onChange={(v) => set("companyType", v)}
                options={["PyME B2B", "Empresa de servicios", "Estudio profesional", "Consultora", "Agencia", "Otro"]}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Principal problema" error={errors.problem}>
              <Options
                value={values.problem}
                onChange={(v) => set("problem", v)}
                options={[
                  "Poca visibilidad orgánica",
                  "La web no convierte",
                  "Leads sin seguimiento",
                  "Demasiadas tareas manuales",
                  "Falta de medición",
                  "Otro",
                ]}
              />
            </Field>
            <Field label="Leads mensuales aproximados" error={errors.monthlyLeads}>
              <Options
                value={values.monthlyLeads}
                onChange={(v) => set("monthlyLeads", v)}
                options={["0–5", "6–20", "21–50", "Más de 50", "No lo sabemos"]}
              />
            </Field>
            <fieldset className="md:col-span-2">
              <legend className={LABEL_CLASS}>Canales actuales</legend>
              <div className="flex flex-wrap gap-3">
                {["SEO", "Google Ads", "Redes sociales", "Referidos", "Email", "Ninguno"].map((o) => {
                  const active = values.channels.includes(o);
                  return (
                    <label
                      key={o}
                      className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors ${
                        active
                          ? "border-primary bg-primary/15 text-white"
                          : "border-border text-text hover:border-primary/60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={active}
                        onChange={(e) =>
                          set(
                            "channels",
                            e.target.checked
                              ? [...values.channels, o]
                              : values.channels.filter((x) => x !== o),
                          )
                        }
                      />
                      {o}
                    </label>
                  );
                })}
              </div>
              {errors.channels && <small className="mt-2 block text-secondary">{errors.channels}</small>}
            </fieldset>
            <Field label="Herramientas utilizadas (opcional)">
              <input
                className={INPUT_CLASS}
                value={values.tools}
                onChange={(e) => set("tools", e.target.value)}
              />
            </Field>
            <Field label="CRM (opcional)">
              <input
                className={INPUT_CLASS}
                value={values.crm}
                onChange={(e) => set("crm", e.target.value)}
              />
            </Field>
            <Field label="Capacidad para atender nuevos leads" error={errors.leadCapacity}>
              <Options
                value={values.leadCapacity}
                onChange={(v) => set("leadCapacity", v)}
                options={["Sí, actualmente", "Sí, con ajustes", "No actualmente"]}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Field label={`Presupuesto mensual en ${currency}`} error={errors.budget}>
              <Options value={values.budget} onChange={(v) => set("budget", v)} options={budgetOptions} />
            </Field>
            <Field label="Fecha estimada de inicio" error={errors.startDate}>
              <Options
                value={values.startDate}
                onChange={(v) => set("startDate", v)}
                options={["Este mes", "En 1–3 meses", "En 3–6 meses", "Sin fecha definida"]}
              />
            </Field>
            <Field label="Persona responsable" error={errors.responsible}>
              <Options
                value={values.responsible}
                onChange={(v) => set("responsible", v)}
                options={[
                  "Soy responsable de la decisión",
                  "Participo en la decisión",
                  "Recopilo información",
                ]}
              />
            </Field>
            <Field label="Plan de interés" error={errors.interest}>
              <Options
                value={values.interest}
                onChange={(v) => set("interest", v)}
                options={["Pixvo Core", "Pixvo Growth", "Pixvo Scale", "Auditoría", "No lo sé todavía"]}
              />
            </Field>
            <label className="md:col-span-2 flex items-start gap-4 rounded-3xl border border-border bg-white/5 p-6 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 size-5 shrink-0 accent-[var(--color-primary)]"
                checked={values.consent}
                onChange={(e) => set("consent", e.target.checked)}
              />
              <span className="text-text">
                Acepto que Pixvo trate estos datos y que se preparen para enviarlos por WhatsApp,
                conforme a la{" "}
                <a href={privacyUrl} className="text-white underline">
                  política de privacidad
                </a>
                .
                {errors.consent && <small className="mt-2 block text-secondary">{errors.consent}</small>}
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {step > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
              Anterior
            </button>
          )}
          {step < 2 ? (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Continuar
            </button>
          ) : (
            <button type="submit" className="btn btn-primary">
              Continuar en WhatsApp
            </button>
          )}
          <a href={contactUrl} className="text-text hover:text-white transition-colors text-sm">
            Prefiero escribir por otro canal
          </a>
        </div>

        <p className="text-text-dark text-sm">
          Nada se envía automáticamente: al terminar se abre WhatsApp con el resumen y vos decidís
          si lo mandás.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={LABEL_CLASS}>{label}</span>
      {children}
      {error && <small className="mt-2 block text-secondary">{error}</small>}
    </label>
  );
}

/** Select nativo, estilado con la paleta del theme. */
function Options({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select className={SELECT_CLASS} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" className="bg-body">
        Seleccioná una opción
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-body">
          {o}
        </option>
      ))}
    </select>
  );
}
