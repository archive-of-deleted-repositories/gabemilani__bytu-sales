"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import { site } from "@/lib/site";

const schema = z.object({
  school: z.string().trim().min(2, "Informe o nome da escola."),
  name: z.string().trim().min(2, "Informe o nome do responsável."),
  email: z.string().trim().email("Informe um e-mail válido."),
  whatsapp: z.string().trim().min(8, "Informe um WhatsApp válido."),
  location: z.string().trim().min(2, "Informe a cidade/estado."),
  message: z.string().trim().max(2000).optional(),
});

export type BetaSignupState =
  | { success: true }
  | { error: string }
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
  const raw = {
    school: formData.get("school"),
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    location: formData.get("location"),
    message: formData.get("message") || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
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
    ["Cidade/Estado", d.location],
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
    return { success: true };
  } catch {
    return {
      error: "Não foi possível enviar agora. Tente novamente em instantes.",
    };
  }
}
