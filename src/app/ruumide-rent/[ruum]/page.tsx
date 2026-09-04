import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking/booking-flow";
import { ArrowLeftIcon, ArrowRightIcon, CalendarCheckIcon, PinIcon, UsersIcon } from "@/components/icons";
import { Photo } from "@/components/photo";
import { getBookingConfig } from "@/lib/booking";
import { content } from "@/lib/content";
import { getRoom, roomHref, rooms } from "@/lib/rooms";
import { site } from "@/lib/site";

type RoomPageProps = { params: Promise<{ ruum: string }> };

export async function generateStaticParams() {
  return rooms.map((room) => ({ ruum: room.slug }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { ruum } = await params;
  const room = getRoom(ruum);
  if (!room) return {};
  return {
    title: `${room.name}, ${room.capacityLabel.toLowerCase()}`,
    description: `${room.description} Asukoht: ${site.address.full}.`,
    alternates: { canonical: roomHref(room.slug) },
  };
}

/**
 * Ruumi vaade + broneerimine (layout-artifacti vaade 03, kompositsioon mockupi järgi):
 * vasakul suur foto, ruumi nimi, faktid ja omadused ning teised ruumid;
 * paremal kleepuv broneerimiskaart. Veerge eraldab vertikaalne joon.
 */
export default async function RoomPage({ params }: RoomPageProps) {
  const { ruum } = await params;
  const room = getRoom(ruum);
  if (!room) notFound();

  const config = getBookingConfig();
  const others = rooms.filter((item) => item.slug !== room.slug);

  const features = [
    {
      icon: CalendarCheckIcon,
      title: "Sobib",
      text: room.suitedFor.join(", ").toLowerCase().replace(/^./, (c) => c.toUpperCase()) + ".",
    },
    {
      icon: PinIcon,
      title: site.address.full,
      text: `Broneeritav ${site.hours.days.toLowerCase()} kell ${site.hours.open.replace(/^0/, "")}–${site.hours.close}.`,
    },
  ];

  return (
    <div className="wrap">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Vasak veerg: foto, nimi, faktid, omadused, teised ruumid */}
        <div className="py-6 lg:border-r lg:border-line lg:py-8 lg:pr-10 xl:pr-12">
          <Link href="/#ruumid" className="arrow-link text-sm">
            <ArrowLeftIcon />
            {content.navigation[1].label}
          </Link>

          <Photo
            photo={room.photo}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="mt-4 aspect-[16/9] rounded-md border border-line lg:aspect-auto lg:h-[clamp(11rem,calc(100svh-40rem),18rem)]"
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-h2">{room.name}</h1>
            <span className="pill pill-soft">
              <UsersIcon size={16} />
              {room.capacityLabel}
            </span>
          </div>

          <p className="mt-3 max-w-prose text-[0.9375rem]">{room.description}</p>

          <ul className="mt-4 divide-y divide-line border-y border-line">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="flex items-start gap-3 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                    <Icon size={17} />
                  </span>
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-ink">{feature.title}</span>
                    <span className="meta block">{feature.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <a href="#broneeri" className="btn btn-sage btn-block mt-6 lg:hidden">
            {content.hero.secondaryCta}
          </a>

          <nav aria-label="Teised ruumid" className="mt-6">
            <p className="meta">Teised ruumid</p>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={roomHref(item.slug)}
                    className="group flex items-center justify-between gap-4 py-2.5 text-base font-medium text-ink transition-colors hover:text-sage"
                  >
                    <span>
                      {item.name}
                      <span className="meta ml-2 font-normal">{item.capacityLabel}</span>
                    </span>
                    <ArrowRightIcon className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Parem veerg: broneerimiskaart */}
        <section
          id="broneeri"
          aria-labelledby={`broneeri-${room.slug}`}
          className="scroll-mt-28 border-t border-line py-6 lg:border-t-0 lg:py-8 lg:pl-10 xl:pl-12"
        >
          <h2 id={`broneeri-${room.slug}`} className="sr-only">
            {content.booking.heading}
          </h2>
          <div className="lg:sticky lg:top-24">
            <BookingFlow rooms={rooms} config={config} initialRoom={room.slug} />
          </div>
        </section>
      </div>
    </div>
  );
}
