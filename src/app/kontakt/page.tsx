import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { content } from "@/lib/content";
import { initials, people } from "@/lib/people";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: content.navigation[3].label,
  description: `${content.contact.body} ${site.address.full}, ${site.phone.display}, ${site.email.display}.`,
  alternates: { canonical: "/kontakt" },
};

const channels = [
  {
    icon: PinIcon,
    label: "Aadress",
    value: site.address.full,
    href: site.maps.link,
    external: true,
  },
  { icon: PhoneIcon, label: "Telefon", value: site.phone.display, href: site.phone.href },
  { icon: MailIcon, label: "E-post", value: site.email.display, href: site.email.href },
];

/**
 * Layout-artifacti vaade 04: vasakul kolm kontaktisikut üksteise all (ümar pilt,
 * nimi, telefon, e-post) ja üldkontakt, paremal Google Mapsi kaart sama kõrgusega,
 * all eraldi riba aadressi ja andmetega. IBAN-id eskiisil olid poolikud ja neid ei kuvata.
 */
export default function ContactPage() {
  return (
    <div className="wrap">
      <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-16">
        <div>
          <h1>{content.contact.heading}</h1>
          <p className="lead mt-5 max-w-prose">{content.contact.body}</p>

          {/* Kontaktisikud: ümar pilt vasakul, nimi + telefon + e-post kõrval. */}
          <h2 className="mt-10 text-h3">Kontaktisikud</h2>
          <ul className="mt-4 flex flex-col divide-y divide-line border-y border-line">
            {people.map((person) => (
              <li key={person.email} className="flex items-center gap-5 py-5">
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.name}
                    width={112}
                    height={112}
                    sizes="56px"
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex size-14 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sm font-medium text-sage"
                    aria-hidden="true"
                  >
                    {initials(person.name)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-lg font-medium text-ink">{person.name}</span>
                  <span className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[0.9375rem]">
                    {person.phone && (
                      <a href={`tel:${person.phone.replace(/[^\d+]/g, "")}`} className="link">
                        {person.phone}
                      </a>
                    )}
                    <a href={`mailto:${person.email}`} className="link break-all">
                      {person.email}
                    </a>
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-h3">Üldkontakt</h2>
          <ul className="mt-4 flex flex-col divide-y divide-line border-y border-line">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <li key={channel.label} className="flex items-center gap-5 py-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sage">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="meta block">{channel.label}</span>
                    <a
                      href={channel.href}
                      className="link text-lg font-medium break-words"
                      {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {channel.value}
                    </a>
                  </span>
                </li>
              );
            })}
            <li className="flex items-center gap-5 py-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sage">
                <ClockIcon size={20} />
              </span>
              <span>
                <span className="meta block">Avatud</span>
                <span className="text-lg font-medium text-ink">{site.hours.label}</span>
              </span>
            </li>
          </ul>

          <Link href="/broneerimine" className="btn btn-primary mt-8">
            {content.hero.secondaryCta}
          </Link>
        </div>

        <div className="flex flex-col">
          <div className="surface relative min-h-[22rem] flex-1 overflow-hidden sm:min-h-[26rem]">
            <iframe
              src={site.maps.embed}
              title={`Pitici asukoht kaardil: ${site.address.full}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <p className="meta mt-3">
            <a href={site.maps.link} target="_blank" rel="noopener noreferrer" className="link">
              Ava Google Mapsis
            </a>
          </p>
        </div>
      </div>

      {/* Alumine riba: aadress, e-post ja telefon, lahtiolekuajad. */}
      <dl className="grid gap-8 border-t border-line py-8 sm:grid-cols-3 lg:py-10">
        <div>
          <dt className="meta">Aadress</dt>
          <dd className="mt-1 text-ink">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.county}
          </dd>
        </div>
        <div>
          <dt className="meta">E-post ja telefon</dt>
          <dd className="mt-1 text-ink">
            <a href={site.email.href} className="link">
              {site.email.display}
            </a>
            <br />
            <a href={site.phone.href} className="link">
              {site.phone.display}
            </a>
          </dd>
        </div>
        <div>
          <dt className="meta">Avatud</dt>
          <dd className="mt-1 text-ink">
            {site.hours.days}
            <br />
            {site.hours.label.replace("E–R ", "")}
          </dd>
        </div>
      </dl>
    </div>
  );
}
