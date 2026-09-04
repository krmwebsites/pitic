import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheckIcon, DumbbellIcon, PinIcon, UsersIcon } from "@/components/icons";
import { AboutSection } from "@/components/about-section";
import { Photo } from "@/components/photo";
import { BlurText } from "@/components/reactbits/blur-text";
import { Reveal } from "@/components/reveal";
import { RoomCard } from "@/components/room-card";
import { getBookingConfig } from "@/lib/booking";
import { content } from "@/lib/content";
import { photos } from "@/lib/photos";
import { rooms } from "@/lib/rooms";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Kolm kasutusotstarvet hero kaardi allservas. */
const USES = [
  { icon: UsersIcon, label: "Kohtumised" },
  { icon: DumbbellIcon, label: "Treeningud" },
  { icon: CalendarCheckIcon, label: "Sündmused" },
];

export default function HomePage() {
  const booking = getBookingConfig();

  return (
    <>
      {/*
        Hero: ümarate nurkadega konteiner, milles foto täidab desktopil kogu
        ala ja valge kaart asetseb foto peal vasakul; mobiilis on kaart foto
        all, kattes foto alumist serva.
      */}
      <section aria-labelledby="hero-pealkiri" className="wrap pt-4 lg:pt-6">
        <div className="relative flex min-h-[calc(100svh-6.5rem)] flex-col overflow-hidden rounded-xl bg-surface-hover lg:h-[calc(100svh-8rem)] lg:min-h-[26rem] lg:flex-row lg:items-center">
          <Photo
            photo={photos.hero}
            priority
            sizes="100vw"
            className="rise rise-4 min-h-[15rem] flex-1 lg:absolute lg:inset-0 lg:h-full lg:w-full lg:flex-none"
          />

          <div className="relative z-10 mx-3 -mt-20 mb-3 shrink-0 rounded-lg bg-surface p-4 shadow-soft sm:mx-6 sm:-mt-24 sm:mb-4 sm:p-8 lg:m-8 lg:max-w-[46%] lg:p-9 xl:m-10 xl:max-w-[44%] xl:p-10">
            <div className="rise flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">
                <PinIcon size={18} />
                Keila keskväljakul
              </p>
              <span className="pill pill-soft">
                <span className={`size-2 rounded-full ${booking.enabled ? "bg-sage" : "bg-muted"}`} aria-hidden="true" />
                {booking.enabled ? "Broneerimine avatud" : "Broneerimine e-posti teel"}
              </span>
            </div>

            {/* React Bits „Blur Text“: sõnad ilmuvad hägust, üks tagasihoidlik stagger. */}
            <BlurText
              as="h1"
              id="hero-pealkiri"
              text={content.hero.heading}
              className="mt-6 max-w-[6.9em] text-[clamp(2.5rem,1.2rem+3.2vw,3.875rem)] text-wrap"
            />
            <p className="lead rise rise-2 mt-5 max-w-[34ch]">{content.hero.body}</p>

            <div className="rise rise-3 mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/#ruumid" className="btn btn-sage">
                {content.hero.primaryCta}
              </Link>
              <Link href="/#meist" className="btn btn-sage-outline">
                {content.hero.houseCta}
              </Link>
            </div>

            <ul className="rise rise-4 mt-7 flex flex-wrap justify-between gap-y-2 border-t border-line pt-5 sm:justify-start" aria-label="Sobib">
              {USES.map((use, index) => {
                const Icon = use.icon;
                return (
                  <li
                    key={use.label}
                    className={`flex items-center gap-1 text-[0.8125rem] text-body sm:gap-2 sm:pr-5 sm:text-[0.9375rem] ${
                      index > 0 ? "sm:border-l sm:border-line sm:pl-5" : ""
                    }`}
                  >
                    <Icon size={18} className="size-4 shrink-0 text-sage sm:size-[18px]" />
                    {use.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/*
        Ruumid (layout-artifacti vaade 02 avalehe osana): menüü „Ruumid“ kerib siia.
        Kolm kaarti: pilt → nimi ja mahutavus → kirjeldus → Broneeri ruum / Vaata lähemalt.
      */}
      <section aria-labelledby="ruumid-pealkiri" className="wrap section">
        {/* Ankur on pealkirja juures, et menüü „Ruumid“ maanduks otse pealkirjale, mitte sektsiooni ülavahesse. */}
        <Reveal>
          <div id="ruumid" className="max-w-2xl scroll-mt-4">
            <h2 id="ruumid-pealkiri">{content.spacesSection.heading}</h2>
            <p className="lead mt-4">
              {content.spacesSection.body} Kõik ruumid asuvad aadressil {site.address.full} ja on broneeritavad{" "}
              {site.hours.label}.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {rooms.map((room) => (
              <li key={room.slug}>
                <RoomCard room={room} variant="booking" />
              </li>
            ))}
          </ul>
          <p className="mt-10 border-t border-line pt-6">
            Ei ole kindel, milline ruum sobib?{" "}
            <Link href="/kontakt" className="link">
              Võta ühendust
            </Link>
            , aitame valida.
          </p>
        </Reveal>
      </section>

      {/* Meist (menüü „Meist“ kerib siia): maja, ruumide omadused, koostööpartnerid. */}
      <AboutSection />
    </>
  );
}
