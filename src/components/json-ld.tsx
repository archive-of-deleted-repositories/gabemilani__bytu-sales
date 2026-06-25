import { site } from "@/lib/site";
import { faq } from "@/lib/faq";

/**
 * Structured data for search + answer engines. Rendered as a single JSON-LD
 * graph: Organization, WebSite, the SoftwareApplication being offered, and the
 * FAQPage mirroring the on-page FAQ.
 */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/images/logo.png`,
        email: site.contactEmail,
        telephone: site.phone,
        sameAs: [site.appUrl],
        description: site.description,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phone,
          email: site.contactEmail,
          contactType: "sales",
          areaServed: "BR",
          availableLanguage: "Portuguese",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: site.locale,
        publisher: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}/#software`,
        name: site.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: site.url,
        inLanguage: site.locale,
        description: site.description,
        publisher: { "@id": `${site.url}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
          description: "Acesso gratuito durante o período de beta.",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
