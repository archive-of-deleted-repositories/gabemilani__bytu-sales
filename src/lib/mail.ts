import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions) {
  const { error } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || "BYTU <naoresponda@bytu.app>",
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
