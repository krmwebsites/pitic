import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: content.seo.title,
    template: `%s | ${site.name}`,
  },
  description: content.seo.description,
  openGraph: {
    type: "website",
    locale: "et_EE",
    siteName: site.name,
    title: content.seo.title,
    description: content.seo.description,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
  width: "device-width",
  initialScale: 1,
};

const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  url: site.url,
  telephone: site.phone.display,
  email: site.email.display,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.county,
    addressCountry: "EE",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: site.hours.open,
    closes: site.hours.close,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="et" data-scroll-behavior="smooth" className={`${instrumentSans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#sisu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Liigu sisu juurde
        </a>
        <SiteHeader />
        <main id="sisu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
      </body>
    </html>
  );
}
