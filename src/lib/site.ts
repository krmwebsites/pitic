import { content } from "./content";

/** Pitici kontaktandmed ja lehe püsiväärtused. Ühest kohast hallatavad. */
export const site = {
  name: content.brand.name,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitic.ee",
  address: {
    street: "Keskväljak 15",
    city: "Keila",
    county: "Harjumaa",
    full: content.brand.address,
  },
  hours: {
    label: content.brand.openingHours,
    days: "Esmaspäevast reedeni",
    open: "09:00",
    close: "17:00",
  },
  phone: {
    display: content.brand.phone,
    href: `tel:${content.brand.phone.replace(/[^\d+]/g, "")}`,
  },
  email: {
    display: content.brand.email,
    href: `mailto:${content.brand.email}`,
  },
  maps: {
    link: "https://www.google.com/maps/search/?api=1&query=Keskv%C3%A4ljak+15%2C+Keila",
    embed: "https://www.google.com/maps?q=Keskv%C3%A4ljak+15%2C+Keila&z=16&output=embed",
  },
} as const;

/**
 * Peamenüü. Sildid on content.json-ist; sihtkohad on lehed, mille määrab
 * layout-artifact (avaleht, ruumid, ruum + broneerimine, kontakt).
 */
export const nav = [
  { label: content.navigation[0].label, href: "/" },
  { label: content.navigation[1].label, href: "/ruumide-rent" },
  { label: content.navigation[3].label, href: "/kontakt" },
] as const;
/* „Broneerimine“ ei ole menüüs, sest päises on juba CTA „Broneeri ruum“ (/broneerimine). */
