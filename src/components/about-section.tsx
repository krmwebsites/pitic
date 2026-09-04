import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon, UsersIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { EquipmentList, FeatureList, RoomFeatureList, SuitedForList } from "@/components/room-features";
import { content } from "@/lib/content";
import { gymOperator, monogram, partners } from "@/lib/partners";
import { photos } from "@/lib/photos";
import { commonFeatures, roomHref, rooms } from "@/lib/rooms";
import { site } from "@/lib/site";

/**
 * „Meist“ (avalehe sektsioon, menüü „Meist“ kerib siia): maja tutvustus
 * hoovi poolt tehtud fotoga, kõigi ruumide omadused ja koostööpartnerid,
 * kes majas ruume rendivad. Jõusaali ruumi rendiga tegelev Rave Sport OÜ
 * on kirjas ainult siin (jõusaali enda kirjeldus jääb puutumata).
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
            <p className="mt-6 text-[0.9375rem] font-medium text-ink">Kõigi kolme ruumi juurde kuuluvad</p>
            <FeatureList items={commonFeatures} label="Kõigi ruumide juurde kuulub" className="mt-3" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#ruumid" className="btn btn-sage">
                {content.hero.primaryCta}
              </Link>
              <Link href="/kontakt" className="btn btn-sage-outline">
                {content.navigation[4].label}
              </Link>
            </div>
          </div>
          <Photo
            photo={photos.house}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] rounded-lg border border-line lg:aspect-auto lg:h-[clamp(22rem,55vh,32rem)]"
          />
        </div>

        {/* Ruumide tutvustus: omadused ja kasutusotstarbed. */}
        <div className="mt-14 lg:mt-20">
          <h3 className="text-h3">Ruumid majas</h3>
          <ul className="mt-6 grid gap-5 md:grid-cols-3 lg:gap-6">
            {rooms.map((room) => (
              <li key={room.slug} className="surface flex flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-[1.25rem] font-medium text-ink">
                    <Link href={roomHref(room.slug)} className="transition-colors hover:text-sage">
                      {room.name}
                    </Link>
                  </h4>
                  <span className="pill pill-soft shrink-0">
                    <UsersIcon size={16} />
                    {room.capacityLabel}
                  </span>
                </div>
                <p className="mt-2 text-[0.9375rem]">{room.tagline}</p>
                <RoomFeatureList room={room} className="mt-4" />
                <p className="mt-5 text-[0.9375rem] font-medium text-ink">Sobib</p>
                <SuitedForList room={room} className="mt-2" />
                <EquipmentList room={room} className="mt-4" />
                <Link href={roomHref(room.slug)} className="arrow-link mt-auto pt-6 text-[0.9375rem]">
                  {content.spacesSection.linkLabel}
                  <ArrowRightIcon />
                </Link>
              </li>
            ))}
          </ul>
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
