import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheckIcon, DumbbellIcon, PinIcon, UsersIcon } from "@/components/icons";
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
        Hero: ümarate nurkadega konteiner, milles foto täidab parema poole ja
        valge kaart asetseb foto peal (desktopil vasakul, mobiilis foto all,
        kattes foto alumist serva).
      */}
      <section aria-labelledby="hero-pealkiri" className="wrap pt-4 lg:pt-6">
        <div className="relative overflow-hidden rounded-xl bg-surface-hover lg:min-h-[clamp(26rem,calc(100svh-9.5rem),40rem)]">
          <Photo
            photo={photos.hero}
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="rise rise-4 aspect-[5/4] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:h-full lg:w-[60%]"
          />

          <div className="relative z-10 mx-4 -mt-20 mb-4 rounded-lg bg-surface p-6 shadow-soft sm:mx-6 sm:-mt-24 sm:p-8 lg:m-8 lg:max-w-[46%] lg:p-9 xl:m-10 xl:max-w-[44%] xl:p-10">
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
              <Link href="/ruumide-rent" className="btn btn-sage">
                {content.hero.primaryCta}
              </Link>
              <Link href="/broneerimine" className="btn btn-sage-outline">
                {content.hero.secondaryCta}
              </Link>
            </div>

            <ul className="rise rise-4 mt-7 flex justify-between border-t border-line pt-5 sm:justify-start" aria-label="Sobib">
              {USES.map((use, index) => {
                const Icon = use.icon;
                return (
                  <li
                    key={use.label}
                    className={`flex items-center gap-1.5 text-sm text-body sm:gap-2 sm:pr-5 sm:text-[0.9375rem] ${
                      index > 0 ? "border-l border-line pl-3 sm:pl-5" : ""
                    }`}
                  >
                    <Icon size={18} className="shrink-0 text-sage" />
                    {use.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Meie ruumid: kolm kaarti, iga kaart viib ruumi lehele. */}
      <Reveal as="section" className="wrap section">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">Meie ruumid</p>
          <span className="pill pill-outline">{rooms.length} ruumi</span>
        </div>
        <div className="max-w-2xl">
          <h2 className="mt-3">{content.spacesSection.heading}</h2>
          <p className="lead mt-3">{content.spacesSection.body}</p>
        </div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {rooms.map((room) => (
            <li key={room.slug}>
              <RoomCard room={room} compact />
            </li>
          ))}
        </ul>
        <p className="sr-only">
          {site.address.full}, {site.hours.label}
        </p>
      </Reveal>
    </>
  );
}
