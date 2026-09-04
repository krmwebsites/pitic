import type { Metadata } from "next";
import Image from "next/image";
import { AccessibilityIcon, ClockIcon, ExternalLinkIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { content } from "@/lib/content";
import { initials, people } from "@/lib/people";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: content.navigation[3].label,
  description: `${content.contact.body} ${site.address.full}, ${site.phone.display}, ${site.email.display}.`,
  alternates: { canonical: "/kontakt" },
};

const channels = [
  { icon: PinIcon, label: site.address.full, href: site.maps.link, external: true },
  { icon: PhoneIcon, label: site.phone.display, href: site.phone.href },
  { icon: MailIcon, label: site.email.display, href: site.email.href },
  { icon: ClockIcon, label: site.hours.label, href: null },
];

/** Asukoha omadused. Ainult kontrollitud faktid (content.json: „mugavalt ligipääsetav“). */
const locationFacts = [
  { icon: PinIcon, label: "Keila keskväljakul" },
  { icon: AccessibilityIcon, label: "Mugav ligipääs" },
];

/**
 * Kontakt: vasakul kontaktisikud (kaartidena) ja üldkontakt (2 × 2), paremal
 * „Meie asukoht“ kaardiga, Google Mapsi lingiga ja asukoha omadustega.
 * Mobiilis kõik üksteise all.
 */
export default function ContactPage() {
  return (
    <div className="wrap pt-10 pb-12 lg:pt-14 lg:pb-16">
      <div className="max-w-3xl">
        <p className="eyebrow">{content.navigation[3].label}</p>
        <h1 className="mt-3">{content.contact.heading}</h1>
        <p className="lead mt-4">{content.contact.body}</p>
        <span className="pill pill-soft mt-5">
          <span className="size-2 rounded-full bg-sage" aria-hidden="true" />
          Vastame tööpäeviti
        </span>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <div className="grid gap-5 lg:gap-6">
          {/* Kontaktisikud */}
          <section aria-labelledby="kontaktisikud" className="surface p-5 sm:p-6">
            <h2 id="kontaktisikud" className="text-h3">
              Kontaktisikud
            </h2>
            <ul className="mt-5 grid gap-3 md:grid-cols-3">
              {people.map((person) => (
                <li key={person.email} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3.5">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      width={112}
                      height={112}
                      sizes="56px"
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sm font-medium text-sage"
                      aria-hidden="true"
                    >
                      {initials(person.name)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] leading-tight font-medium text-ink">{person.name}</span>
                    <a href={`mailto:${person.email}`} className="link mt-0.5 block truncate text-sm">
                      {person.email}
                    </a>
                    {person.phone && (
                      <a href={`tel:${person.phone.replace(/[^\d+]/g, "")}`} className="link block text-sm">
                        {person.phone}
                      </a>
                    )}
                  </span>
                  <a
                    href={`mailto:${person.email}`}
                    aria-label={`Kirjuta: ${person.name}`}
                    className="hidden size-10 shrink-0 items-center justify-center rounded-md border border-line text-sage transition-colors hover:bg-sage-soft 2xl:flex"
                  >
                    <MailIcon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Üldkontakt */}
          <section aria-labelledby="uldkontakt" className="surface p-5 sm:p-6">
            <h2 id="uldkontakt" className="text-h3">
              Üldkontakt
            </h2>
            <ul className="mt-5 grid overflow-hidden rounded-lg border border-line sm:grid-cols-2">
              {channels.map((channel, index) => {
                const Icon = channel.icon;
                const inner = (
                  <>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 truncate text-[0.9375rem] text-ink">{channel.label}</span>
                  </>
                );
                return (
                  <li
                    key={channel.label}
                    className={`flex items-center gap-3 px-4 py-3.5 ${index > 0 ? "border-t border-line" : ""} ${
                      index >= 2 ? "sm:border-t" : "sm:border-t-0"
                    } ${index % 2 === 1 ? "sm:border-l sm:border-line" : ""}`}
                  >
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="flex min-w-0 items-center gap-3 transition-colors hover:text-sage"
                        {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Meie asukoht */}
        <section aria-labelledby="asukoht" className="surface p-5 sm:p-6">
          <h2 id="asukoht" className="text-h3">
            Meie asukoht
          </h2>
          <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface-hover">
            <iframe
              src={site.maps.embed}
              title={`Pitici asukoht kaardil: ${site.address.full}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <a
            href={site.maps.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-block mt-4 justify-between"
          >
            <span className="flex-1 text-center">Ava Google Mapsis</span>
            <ExternalLinkIcon size={18} />
          </a>
          <ul className="mt-5 grid grid-cols-2 border-t border-line pt-5">
            {locationFacts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <li
                  key={fact.label}
                  className={`flex items-center gap-3 text-[0.9375rem] text-ink ${index > 0 ? "border-l border-line pl-4" : "pr-4"}`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sage/40 text-sage">
                    <Icon size={18} />
                  </span>
                  {fact.label}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
