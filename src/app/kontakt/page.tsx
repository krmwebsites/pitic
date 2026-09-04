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
 * Kompaktne, et desktopil ja sülearvutil mahuks kogu sisu esimesse vaatesse;
 * mobiilis kõik üksteise all.
 */
export default function ContactPage() {
  return (
    <div className="wrap pt-6 pb-8 lg:pt-7 lg:pb-6">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="eyebrow">{content.navigation[3].label}</p>
          <h1 className="mt-2 text-h2">{content.contact.heading}</h1>
          <p className="lead mt-2">{content.contact.body}</p>
        </div>
        <span className="pill pill-soft mb-1">
          <span className="size-2 rounded-full bg-sage" aria-hidden="true" />
          Vastame tööpäeviti
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start lg:gap-5">
        <div className="grid gap-4 lg:gap-5">
          {/* Kontaktisikud: nimi ja e-post tekstina (mitte lingina), e-post alati täies pikkuses. */}
          <section aria-labelledby="kontaktisikud" className="surface p-4 sm:p-5">
            <h2 id="kontaktisikud" className="text-[1.125rem] font-medium text-ink">
              Kontaktisikud
            </h2>
            <ul className="mt-3 grid gap-2 md:grid-cols-3 md:gap-2.5">
              {people.map((person) => (
                <li key={person.email} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2.5 md:p-3">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      width={96}
                      height={96}
                      sizes="44px"
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-xs font-medium text-sage"
                      aria-hidden="true"
                    >
                      {initials(person.name)}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] leading-tight font-medium text-ink">{person.name}</span>
                    <span className="mt-0.5 block text-sm break-all text-body">{person.email}</span>
                    {person.phone && <span className="block text-sm text-body">{person.phone}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Üldkontakt */}
          <section aria-labelledby="uldkontakt" className="surface p-4 sm:p-5">
            <h2 id="uldkontakt" className="text-[1.125rem] font-medium text-ink">
              Üldkontakt
            </h2>
            <ul className="mt-3 grid overflow-hidden rounded-lg border border-line sm:grid-cols-2">
              {channels.map((channel, index) => {
                const Icon = channel.icon;
                const inner = (
                  <>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 truncate text-[0.9375rem] text-ink">{channel.label}</span>
                  </>
                );
                return (
                  <li
                    key={channel.label}
                    className={`flex items-center gap-3 px-3.5 py-2 md:py-2.5 ${index > 0 ? "border-t border-line" : ""} ${
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
        <section aria-labelledby="asukoht" className="surface flex flex-col p-4 sm:p-5 lg:h-[clamp(19rem,calc(100svh-18rem),34rem)]">
          <h2 id="asukoht" className="text-[1.125rem] font-medium text-ink">
            Meie asukoht
          </h2>
          <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-lg border border-line bg-surface-hover lg:aspect-auto lg:min-h-[9rem] lg:flex-1">
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
            className="btn btn-secondary btn-sm btn-block mt-3 justify-between"
          >
            <span className="flex-1 text-center">Ava Google Mapsis</span>
            <ExternalLinkIcon size={17} />
          </a>
          <ul className="mt-3 grid grid-cols-2 border-t border-line pt-3">
            {locationFacts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <li
                  key={fact.label}
                  className={`flex items-center gap-2.5 text-sm text-ink ${index > 0 ? "border-l border-line pl-3" : "pr-3"}`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-sage/40 text-sage">
                    <Icon size={17} />
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
