"use client";

import { useActionState } from "react";
import { betaSignup, type BetaSignupState } from "@/actions/beta-signup";

const inputClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 placeholder:text-muted-foreground";
const labelClass = "text-sm font-medium text-foreground";

const fields = [
  { name: "school", label: "Nome da escola", type: "text", placeholder: "Ex.: Windcoast Kite", autoComplete: "organization" },
  { name: "name", label: "Responsável", type: "text", placeholder: "Seu nome", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", placeholder: "voce@escola.com", autoComplete: "email" },
  { name: "whatsapp", label: "WhatsApp", type: "tel", placeholder: "(00) 00000-0000", autoComplete: "tel" },
  { name: "location", label: "Cidade / Estado", type: "text", placeholder: "Ex.: Cumbuco, CE", autoComplete: "address-level2" },
] as const;

export function BetaForm() {
  const [state, formAction, pending] = useActionState<BetaSignupState, FormData>(
    betaSignup,
    null,
  );

  if (state && "success" in state) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center md:p-8">
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
              required
              className={inputClass}
            />
          </div>
        ))}
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

      {state && "error" in state && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
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
