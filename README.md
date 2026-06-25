# BYTU — Landing de captação (beta)

Landing page estática para captar escolas de esportes de vento para o beta do
**BYTU**, servida em **bytu.com.br** (o app fica em **bytu.app**). Mesma
identidade visual do produto (paleta natural, fonte Jost, logo).

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind v4 · Resend (e-mail) ·
Vercel Analytics.

## Rodando localmente
```bash
npm install
npm run dev          # http://localhost:3000
```
> A porta 3000 pode estar ocupada por outro app; use `PORT=3100 npm run dev`.

Crie um `.env.local` (veja `.env.example`):
```
RESEND_API_KEY=...
RESEND_FROM_EMAIL="BYTU <naoresponda@bytu.app>"
BETA_NOTIFY_EMAIL=destino-dos-leads@bytu.com.br
```

## Scripts
- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run start` — serve o build
- `npm run lint` — lint

## Estrutura
- `src/app/page.tsx` — landing (hero, recursos, beta, FAQ, footer)
- `src/components/beta-form.tsx` — formulário (máscara de telefone, validação, a11y)
- `src/actions/beta-signup.ts` — server action: honeypot + rate limit + validação (zod) + e-mail (lead + confirmação)
- `src/lib/site.ts` — constantes (URLs, contato, WhatsApp)
- `src/lib/faq.ts` — FAQ (página + JSON-LD)
- SEO/AEO: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`, `src/components/json-ld.tsx`, `public/llms.txt`

## Deploy (Vercel)
1. Criar projeto a partir deste repo.
2. Definir as env vars (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `BETA_NOTIFY_EMAIL`).
3. Apontar o DNS de `bytu.com.br` para a Vercel e anexar o domínio.
4. Verificar o domínio no Google Search Console e submeter `/sitemap.xml`.
