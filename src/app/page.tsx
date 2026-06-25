import Link from "next/link";
import {
  Users,
  CalendarDays,
  Wind,
  Wallet,
  GraduationCap,
  Gauge,
  MessageCircle,
  FileSignature,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { BetaForm } from "@/components/beta-form";
import { TrackLink } from "@/components/track-link";
import { faq } from "@/lib/faq";
import { site } from "@/lib/site";

const year = new Date().getFullYear();

const features = [
  {
    icon: Users,
    title: "Alunos e matrículas",
    text: "Cadastro completo de alunos, pacotes contratados e histórico de aulas — sempre à mão.",
  },
  {
    icon: CalendarDays,
    title: "Agenda de aulas",
    text: "Monte a agenda da escola por dia e por instrutor, com controle de aulas usadas e remarcações.",
  },
  {
    icon: Wind,
    title: "Operação movida pelo vento",
    text: "Pensado para a rotina de quem depende da janela de vento: aulas que mudam de horário sem virar bagunça.",
  },
  {
    icon: Wallet,
    title: "Pacotes e financeiro",
    text: "Pacotes de aulas, valores e o financeiro da escola organizados em um só lugar.",
  },
  {
    icon: Gauge,
    title: "Equipamentos e horas de uso",
    text: "Controle o inventário de kites, pranchas e barras e acompanhe as horas de uso de cada equipamento para planejar manutenção e troca.",
  },
  {
    icon: MessageCircle,
    title: "Integração com WhatsApp",
    text: "Converse com os alunos e envie lembretes de aulas direto pelo WhatsApp, sem sair da plataforma.",
  },
  {
    icon: FileSignature,
    title: "Termo de compromisso digital",
    text: "Envie e colete a assinatura do termo de compromisso dos alunos de forma 100% digital, com registro de data, IP e confirmação para mais segurança jurídica.",
  },
  {
    icon: GraduationCap,
    title: "Vários instrutores",
    text: "Distribua aulas entre instrutores e acompanhe a operação de toda a equipe.",
  },
];

const betaPerks = [
  "Acesso gratuito durante todo o beta",
  "Suporte direto com a equipe que constrói o produto",
  "Influência real no roadmap e nas próximas funcionalidades",
  "Ajuda na migração dos seus dados atuais",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
          <Logo width={92} height={36} priority className="h-8 w-auto" />
          <div className="flex items-center gap-2">
            <a
              href={site.appUrl}
              className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Entrar
            </a>
            <TrackLink
              href="#beta"
              event="cta_beta"
              eventData={{ location: "header" }}
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Quero participar
            </TrackLink>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6 md:py-24">
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            Beta exclusivo para escolas no Ceará
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Gestão completa para a sua escola de kitesurf
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            O BYTU reúne alunos, matrículas, pacotes, agenda de aulas e
            financeiro em uma só plataforma feita para escolas movidas pelo
            vento. Nesta fase, o beta é exclusivo para escolas no Ceará,
            próximas do time que desenvolve o produto — e gratuito durante todo
            o período.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackLink
              href="#beta"
              event="cta_beta"
              eventData={{ location: "hero" }}
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
            >
              Participar do beta
            </TrackLink>
            <TrackLink
              href={site.whatsappUrl}
              event="whatsapp_click"
              eventData={{ location: "hero" }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border px-6 text-sm font-medium text-foreground transition hover:bg-secondary sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden />
              Falar no WhatsApp
            </TrackLink>
          </div>
          <p className="mt-4 text-sm">
            <a
              href="#recursos"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Ver recursos
            </a>
          </p>
        </section>

        {/* Features */}
        <section id="recursos" className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                Tudo o que a escola precisa, em um só lugar
              </h2>
              <p className="mt-3 text-muted-foreground">
                O BYTU substitui planilhas e mensagens soltas pela operação
                organizada de ponta a ponta.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="rounded-xl border border-border bg-card p-5 md:p-6"
                >
                  <f.icon className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Beta program */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                Faça parte do beta do BYTU
              </h2>
              <p className="mt-3 text-muted-foreground">
                Nesta primeira fase, estamos selecionando escolas de kitesurf,
                wingfoil e windsurf <strong className="font-medium text-foreground">
                localizadas no Ceará</strong>, perto do time que desenvolve o
                produto — assim conseguimos dar suporte de perto, inclusive
                presencial. Você ajuda a moldar a plataforma e ganha acesso
                antecipado a tudo.
              </p>
              <ul className="mt-6 space-y-3">
                {betaPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span className="text-sm text-foreground">{perk}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                Prefere conversar?{" "}
                <TrackLink
                  href={site.whatsappUrl}
                  event="whatsapp_click"
                  eventData={{ location: "beta_section" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Fale com a gente no WhatsApp
                </TrackLink>
                .
              </p>
            </div>
            <div id="beta" className="scroll-mt-20">
              <BetaForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border bg-card/40 scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
            <h2 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
              Perguntas frequentes
            </h2>
            <dl className="mt-10 space-y-4">
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-border bg-card p-5 md:p-6"
                >
                  <dt className="font-semibold text-foreground">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm text-muted-foreground">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-6">
          <Logo width={72} height={28} className="h-7 w-auto" />
          <p>Plataforma de gestão para escolas movidas pelo vento.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href={`mailto:${site.contactEmail}`} className="hover:text-foreground">
              {site.contactEmail}
            </a>
            <TrackLink
              href={site.whatsappUrl}
              event="whatsapp_click"
              eventData={{ location: "footer" }}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {site.phone}
            </TrackLink>
            <Link href={site.appUrl} className="hover:text-foreground">
              Acessar app
            </Link>
          </div>
        </div>
        <p className="pb-6 text-center text-xs text-muted-foreground">
          © {year} {site.name}
        </p>
      </footer>
    </div>
  );
}
