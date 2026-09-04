import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheckIcon, ClockIcon, PinIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { RoomCard } from "@/components/room-card";
import { content } from "@/lib/content";
import { photos } from "@/lib/photos";
import { rooms } from "@/lib/rooms";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const highlightIcons = [PinIcon, ClockIcon, CalendarCheckIcon];

export default function HomePage() {
  return (
    <>
      {/* Hero: tekst vasakul (u 40 %), foto paremal (u 60 %), mobiilis tekst enne fotot. */}
      <section aria-labelledby="hero-pealkiri" className="wrap">
        <div className="grid items-center gap-10 py-10 lg:min-h-[37.5rem] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 lg:py-0">
          <div className="lg:py-16">
            <h1 id="hero-pealkiri" className="rise max-w-[16ch]">
              {content.hero.heading}
            </h1>
            <p className="lead rise rise-2 mt-6 max-w-[34ch]">{content.hero.body}</p>
            <div className="rise rise-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/ruumide-rent" className="btn btn-primary">
                {content.hero.primaryCta}
              </Link>
              <Link href="/broneerimine" className="btn btn-secondary">
                {content.hero.secondaryCta}
              </Link>
            </div>
          </div>
          <Photo
            photo={photos.hero}
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="rise rise-4 bleed-right aspect-[4/3] rounded-md lg:aspect-auto lg:h-full lg:min-h-[34rem] lg:rounded-none"
          />
        </div>
      </section>

      {/* Info-riba: aadress, lahtiolekuajad, veebibroneerimine. */}
      <section aria-label="Põhiinfo" className="border-y border-line bg-surface">
        <ul className="wrap grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {content.highlights.map((item, index) => {
            const Icon = highlightIcons[index];
            return (
              <li key={item.title} className="flex items-center gap-4 py-5 md:px-6 md:first:pl-0 md:last:pr-0">
                <span className="text-sage">
                  <Icon />
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium text-ink">{item.title}</span>
                  <span className="meta block">{item.body}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Kolm ruumi ühel real; iga kaart viib ruumi lehele. */}
      <Reveal as="section" className="wrap section">
        <div className="max-w-2xl">
          <h2>{content.spacesSection.heading}</h2>
          <p className="lead mt-3">{content.spacesSection.body}</p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {rooms.map((room) => (
            <li key={room.slug}>
              <RoomCard room={room} />
            </li>
          ))}
        </ul>
      </Reveal>
    </>
  );
}
