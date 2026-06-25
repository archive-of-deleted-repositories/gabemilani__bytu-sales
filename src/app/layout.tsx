import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s | BYTU",
  },
  description: site.description,
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "kitesurf",
    "escola de kitesurf",
    "gestão de escola de kitesurf",
    "software para escola de kitesurf",
    "wingfoil",
    "windsurf",
    "foil",
    "vento",
    "agenda de aulas",
    "matrículas",
    "gestão",
    "erp esportivo",
    "bytu",
  ],
  authors: [{ name: "BYTU", url: site.url }],
  creator: "BYTU",
  publisher: "BYTU",
  category: "business software",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#3e2e1f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${jost.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
