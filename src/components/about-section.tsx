import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { content } from "@/lib/content";
import { gymOperator, monogram, partners } from "@/lib/partners";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

/**
 * „Meist“ (avalehe sektsioon, menüü „Meist“ kerib siia): maja tutvustus
 * hoovi poolt tehtud fotoga, kutse külla tulla (kontakti CTA) ja
 * koostööpartnerid, kes majas ruume rendivad. Jõusaali ruumi rendiga
 * tegelev Rave Sport OÜ on kirjas ainult siin.
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
              {content.hero.houseCta}
            </h2>
            <p className="lead mt-4 max-w-[48ch]">
              Pitic asub Keila keskväljakul, aadressil {site.address.full}. Ühes majas on renditavad jõusaal, nõupidamiste
              ruum ja suur saal ning siin tegutsevad ka mitmed kohalikud tegijad.
            </p>

            {/* Kutse: eristuv, must ja paks; all kontakti nupp. */}
            <p className="mt-9 max-w-[20ch] text-[clamp(1.625rem,1.1rem+1.6vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.01em] text-ink text-balance">
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
            className="aspect-[4/5] rounded-lg border border-line lg:aspect-auto lg:h-[clamp(22rem,55vh,32rem)]"
          />
        </div>

        {/* Koostööpartnerid. Logo puudumisel monogramm; tutvustuse puudumisel ainult nimi. */}
        <div className="mt-14 lg:mt-20">
          <h3 className="text-h3">Koostööpartnerid</h3>
          <p className="lead mt-3 max-w-[52ch]">Majas rendivad ruume ja tegutsevad ka need tegijad.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <li key={partner.name} className="surface flex gap-4 p-5">
                {partner.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.logo} alt="" width={56} height={56} className="size-14 shrink-0 rounded-md object-contain" />
                ) : (
                  <span
                    className="flex size-14 shrink-0 items-center justify-center rounded-md bg-sage-soft text-base font-medium text-sage"
                    aria-hidden="true"
                  >
                    {monogram(partner.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-ink">{partner.name}</p>
                  {partner.description ? (
                    <p className="mt-1 text-[0.9375rem] text-body">{partner.description}</p>
                  ) : (
                    <p className="meta mt-1">Tutvustus lisandub.</p>
                  )}
                  {partner.url && (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link mt-2 inline-flex items-center gap-1 text-sm"
                    >
                      Veebileht
                      <ExternalLinkIcon size={14} />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="meta mt-6 border-t border-line pt-5">
            <span className="font-medium text-ink">{gymOperator.name}</span> {gymOperator.description.charAt(0).toLowerCase()}
            {gymOperator.description.slice(1)}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
