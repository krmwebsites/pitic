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
    link: "https://maps.app.goo.gl/Pm7U2x4DLtvxNmSn9",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2036.4762469910804!2d24.420968912721126!3d59.308304112597654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692bc7719100001%3A0x18b13b6d100f828d!2sKeskv%C3%A4ljak%2015%2C%20Keila%2C%2076608%20Harju%20maakond!5e0!3m2!1sen!2see!4v1788538439730!5m2!1sen!2see",
  },
} as const;

/**
 * Peamenüü. Sildid on content.json-ist; sihtkohad on lehed, mille määrab
 * layout-artifact (avaleht, ruumid, ruum + broneerimine, kontakt).
 */
export const nav = [
  { label: content.navigation[0].label, href: "/" },
  { label: content.navigation[1].label, href: "/#ruumid" },
  { label: content.navigation[2].label, href: "/#meist" },
  { label: content.navigation[4].label, href: "/kontakt" },
] as const;
/* „Broneerimine“ ei ole menüüs, sest päises on juba CTA „Broneeri ruum“ (/broneerimine). */
