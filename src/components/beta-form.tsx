"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { betaSignup, type BetaSignupState } from "@/actions/beta-signup";

/**
 * Máscara de telefone que só aceita números (e um "+" inicial opcional).
 * - Começando com "+": modo internacional — mantém "+" e até 15 dígitos
 *   (ex.: escolas estrangeiras como da Argentina).
 * - Sem "+": aplica a máscara brasileira (XX) XXXX-XXXX / (XX) XXXXX-XXXX.
 */
function formatPhone(value: string) {
  const intl = value.trimStart().startsWith("+");
  if (intl) {
    const d = value.replace(/\D/g, "").slice(0, 15);
    return d.length ? `+${d}` : "+";
  }
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const inputClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 placeholder:text-muted-foreground";
const labelClass = "text-sm font-medium text-foreground";

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE",
  "TO",
];

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel";
  pattern?: string;
  title?: string;
  maxLength?: number;
};

const fields: Field[] = [
  { name: "school", label: "Nome da escola", type: "text", placeholder: "Ex.: KiteSchool", autoComplete: "organization" },
  { name: "name", label: "Responsável", type: "text", placeholder: "Seu nome", autoComplete: "name" },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    placeholder: "voce@escola.com",
    autoComplete: "email",
    inputMode: "email",
    maxLength: 254,
    title: "Informe um e-mail válido, ex.: voce@escola.com",
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    placeholder: "(85) 99999-9999",
    autoComplete: "tel",
    inputMode: "tel",
    pattern: "\\+?[\\d\\s().-]{8,}",
    maxLength: 20,
    title:
      "WhatsApp com DDD (ex.: (85) 99999-9999). Para número estrangeiro, comece com + e o código do país.",
  },
  { name: "city", label: "Cidade", type: "text", placeholder: "Ex.: Cumbuco", autoComplete: "address-level2" },
];

export function BetaForm() {
  const [state, formAction, pending] = useActionState<BetaSignupState, FormData>(
    betaSignup,
    null,
  );
  const [whatsapp, setWhatsapp] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  const errorState = state && "error" in state ? state : null;

  // Sucesso: foca/rola para a confirmação e registra a conversão.
  useEffect(() => {
    if (state && "success" in state) {
      track("beta_signup");
      successRef.current?.focus();
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  // Erro: leva o foco para o campo problemático (ou para o alerta).
  useEffect(() => {
    if (errorState) {
      const el = document.getElementById(errorState.field ?? "beta-form-error");
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorState]);

  if (state && "success" in state) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="rounded-xl border border-border bg-card p-6 text-center outline-none md:p-8"
      >
        <h3 className="text-xl font-semibold text-foreground">
          Inscrição recebida! 🤙
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Obrigado pelo interesse. Nossa equipe vai avaliar e entrar em contato
          para liberar seu acesso ao beta.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-xl border border-border bg-card p-6 md:p-8"
    >
      {/* Honeypot — invisível para humanos, atrativo para bots. Se preenchido,
          o server action ignora silenciosamente o envio. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className="grid gap-1.5">
            <label htmlFor={f.name} className={labelClass}>
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              inputMode={f.inputMode}
              pattern={f.pattern}
              title={f.title}
              maxLength={f.maxLength}
              required
              aria-invalid={errorState?.field === f.name || undefined}
              aria-describedby={
                errorState?.field === f.name ? "beta-form-error" : undefined
              }
              className={inputClass}
              {...(f.name === "whatsapp"
                ? {
                    value: whatsapp,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setWhatsapp(formatPhone(e.target.value)),
                  }
                : {})}
            />
          </div>
        ))}

        <div className="grid gap-1.5">
          <label htmlFor="state" className={labelClass}>
            Estado
          </label>
          <div className="relative">
            <select
              id="state"
              name="state"
              defaultValue="CE"
              required
              aria-invalid={errorState?.field === "state" || undefined}
              aria-describedby={
                errorState?.field === "state" ? "beta-form-error" : undefined
              }
              className={`${inputClass} appearance-none pr-9`}
            >
              {states.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="message" className={labelClass}>
          Mensagem (opcional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Conte um pouco sobre sua escola e sua operação."
          className={inputClass}
        />
      </div>

      {errorState && (
        <p
          id="beta-form-error"
          tabIndex={-1}
          role="alert"
          className="text-sm text-destructive outline-none"
        >
          {errorState.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Quero participar do beta"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Sem custo durante o beta. Sem cartão de crédito.
      </p>
    </form>
  );
}
