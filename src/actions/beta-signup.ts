"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

/**
 * Valida telefone aceitando números brasileiros e estrangeiros.
 * - Iniciado com "+": modo internacional (E.164) — 8 a 15 dígitos.
 * - Sem "+": número nacional brasileiro — DDD (11–99) + 8 (fixo) ou 9 (celular)
 *   dígitos, com DDI 55 opcional.
 */
function isValidPhone(value: string) {
  const intl = value.trim().startsWith("+");
  const digits = value.replace(/\D/g, "");

  if (intl) {
    return digits.length >= 8 && digits.length <= 15;
  }

  let d = digits;
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false; // DDDs brasileiros vão de 11 a 99
  if (d.length === 11 && d[2] !== "9") return false; // celular: nono dígito = 9
  return true;
}

const schema = z.object({
  school: z.string().trim().min(2, "Informe o nome da escola."),
  name: z.string().trim().min(2, "Informe o nome do responsável."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido.")
    .max(254, "E-mail muito longo."),
  whatsapp: z
    .string()
    .trim()
    .refine(
      isValidPhone,
      "Informe um WhatsApp válido com DDD (ex.: (85) 99999-9999) ou, se estrangeiro, com + e o código do país.",
    ),
  city: z.string().trim().min(2, "Informe a cidade."),
  state: z
    .string()
    .trim()
    .length(2, "Selecione o estado.")
    .regex(/^[A-Z]{2}$/, "Selecione o estado."),
  message: z.string().trim().max(2000).optional(),
});

export type BetaSignupState =
  | { success: true }
  | { error: string; field?: string }
  | null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function betaSignup(
  _prev: BetaSignupState,
  formData: FormData,
): Promise<BetaSignupState> {
  // Honeypot: campo oculto que humanos não veem. Se vier preenchido é bot —
  // respondemos sucesso sem enviar nada, para não sinalizar a rejeição.
  if (formData.get("website")) {
    return { success: true };
  }

  // Rate limit por IP (best-effort) para conter flood de submissões.
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(`beta-signup:${ip}`).ok) {
    return {
      error: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
    };
  }

  const raw = {
    school: formData.get("school"),
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    city: formData.get("city"),
    state: formData.get("state"),
    message: formData.get("message") || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue?.message ?? "Dados inválidos.",
      field: issue?.path[0]?.toString(),
    };
  }

  const d = parsed.data;
  const to = process.env.BETA_NOTIFY_EMAIL;
  if (!to) {
    return {
      error: "Configuração de e-mail ausente. Tente novamente mais tarde.",
    };
  }

  const rows: [string, string][] = [
    ["Escola", d.school],
    ["Responsável", d.name],
    ["E-mail", d.email],
    ["WhatsApp", d.whatsapp],
    ["Cidade", d.city],
    ["Estado", d.state],
    ["Mensagem", d.message ?? "—"],
  ];

  const html = `
    <h2>Novo interesse no beta do ${site.name}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="font-weight:600">${k}</td><td>${escapeHtml(
              String(v),
            )}</td></tr>`,
        )
        .join("")}
    </table>
  `;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    await sendEmail({
      to,
      subject: `Novo interesse no beta — ${d.school}`,
      html,
      text,
      replyTo: d.email,
    });
  } catch {
    return {
      error: "Não foi possível enviar agora. Tente novamente em instantes.",
    };
  }

  // Confirmação ao interessado — opcional: se falhar, o lead já foi registrado,
  // então não quebramos o fluxo de sucesso.
  try {
    const firstName = d.name.split(" ")[0];
    const confirmationHtml = `
      <p>Olá, ${escapeHtml(firstName)}!</p>
      <p>Recebemos o interesse da <strong>${escapeHtml(
        d.school,
      )}</strong> em participar do beta do ${site.name}. 🤙</p>
      <p>Nossa equipe vai avaliar a inscrição e entrar em contato em breve pelo
      e-mail ou WhatsApp para liberar seu acesso.</p>
      <p>Enquanto isso, se quiser falar com a gente:<br>
      E-mail: ${site.contactEmail}<br>
      Telefone: ${site.phone}</p>
      <p>Abraços,<br>Equipe ${site.name}</p>
    `;
    const confirmationText =
      `Olá, ${firstName}!\n\n` +
      `Recebemos o interesse da ${d.school} em participar do beta do ${site.name}.\n` +
      `Nossa equipe vai avaliar e entrar em contato em breve.\n\n` +
      `Contato: ${site.contactEmail} · ${site.phone}\n\n` +
      `Equipe ${site.name}`;

    await sendEmail({
      to: d.email,
      subject: `Recebemos seu interesse no beta do ${site.name}`,
      html: confirmationHtml,
      text: confirmationText,
      replyTo: site.contactEmail,
    });
  } catch {
    // silencioso — confirmação é best-effort
  }

  return { success: true };
}
