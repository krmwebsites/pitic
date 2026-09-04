import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { content } from "@/lib/content";
import { monogram, partners } from "@/lib/partners";
import { photos } from "@/lib/photos";

/**
 * „Meist“ (avalehe sektsioon, menüü „Meist“ kerib siia): maja tutvustus
 * hoovi poolt tehtud fotoga, kutse külla tulla (kontakti CTA) ja
 * koostööpartnerid, kes majas ruume rendivad (sh Rave Sport OÜ, kes
 * tegeleb jõusaali ruumi rendiga; jõusaali kirjeldus jääb puutumata).
 */
export function AboutSection() {
  const meist = content.navigation[2].label;

  return (
    <section aria-labelledby="meist-pealkiri" className="wrap section border-t border-line">
      <Reveal>
        {/* Ankur pealkirja juures, nagu ruumide sektsioonis. */}
        <div id="meist" className="grid gap-8 scroll-mt-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow">{meist}</p>
            <h2 id="meist-pealkiri" className="mt-3">
              {content.about.heading}
            </h2>
            {/* Kolm lõiku ühes ühtlases suuruses; esimene lõik veidi tumedam kui juhtlõik. */}
            <div className="mt-5 grid max-w-[54ch] gap-4 text-[1.0625rem] leading-[1.65] text-body">
              {content.about.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-ink" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Kutse: eristuv, must ja paks; all kontakti nupp. */}
            <p className="mt-8 max-w-[20ch] text-[clamp(1.5rem,1rem+1.4vw,2rem)] leading-[1.15] font-semibold tracking-[-0.01em] text-ink text-balance">
              Soovid lähemalt tutvuda?
            </p>
            <Link href="/kontakt" className="btn btn-primary mt-6">
              Võta ühendust
              <ArrowRightIcon size={18} />
            </Link>
          </div>
          <Photo
            photo={photos.house}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] rounded-lg border border-line lg:aspect-auto lg:h-full lg:max-h-[38rem] lg:min-h-[26rem]"
          />
        </div>

        {/* Koostööpartnerid: kaart rohelise ülajoone, monogrammiplaadi, tegevusala sildi, nime, tutvustuse ja lingiga. */}
        <div className="mt-14 lg:mt-20">
          <h3 className="text-h3">Koostööpartnerid</h3>
          <p className="lead mt-3 max-w-[52ch]">Majas rendivad ruume ja tegutsevad ka need tegijad.</p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {partners.map((partner) => (
              <li key={partner.name} className="surface flex flex-col p-6">
                <span className="block h-0.5 w-12 bg-sage" aria-hidden="true" />
                <div className="mt-6 flex gap-6">
                  {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={partner.logo} alt="" width={96} height={96} className="size-24 shrink-0 rounded-md object-contain" />
                  ) : (
                    <span
                      className="flex size-24 shrink-0 items-center justify-center rounded-md bg-sage-soft text-[2.25rem] font-medium tracking-tight text-sage"
                      aria-hidden="true"
                    >
                      {partner.mark ?? monogram(partner.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="eyebrow text-xs">{partner.category}</p>
                    <p className="mt-1.5 text-[1.25rem] leading-snug font-medium text-ink">{partner.name}</p>
                    <p className="mt-2 text-[0.9375rem] text-body">{partner.description}</p>
                    {partner.link &&
                      (partner.link.external ? (
                        <a
                          href={partner.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link mt-3 inline-flex items-center gap-1 text-[0.9375rem]"
                        >
                          {partner.link.label}
                          <ExternalLinkIcon size={14} />
                        </a>
                      ) : (
                        <Link href={partner.link.href} className="link mt-3 inline-block text-[0.9375rem]">
                          {partner.link.label}
                        </Link>
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
