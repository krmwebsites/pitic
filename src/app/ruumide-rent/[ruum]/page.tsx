import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking/booking-flow";
import { ArrowLeftIcon, ArrowRightIcon, UsersIcon } from "@/components/icons";
import { EquipmentList, RoomFeatureList, SuitedForList } from "@/components/room-features";
import { RoomGallery } from "@/components/room-gallery";
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
 * vasakul galerii, ruumi nimi ja kirjeldus ning teised ruumid;
 * paremal kleepuv broneerimiskaart. Veerge eraldab vertikaalne joon.
 */
export default async function RoomPage({ params }: RoomPageProps) {
  const { ruum } = await params;
  const room = getRoom(ruum);
  if (!room) notFound();

  const config = getBookingConfig();
  const others = rooms.filter((item) => item.slug !== room.slug);

  return (
    <div className="wrap">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Vasak veerg: galerii, nimi, kirjeldus, teised ruumid */}
        <div className="py-6 lg:border-r lg:border-line lg:py-8 lg:pr-10 xl:pr-12">
          <Link href="/#ruumid" className="arrow-link text-sm">
            <ArrowLeftIcon />
            {content.navigation[1].label}
          </Link>

          {/* Galerii: suur pilt, nooled, pisipildid ja täisekraanivaade. */}
          <div className="mt-4">
            <RoomGallery
              photos={room.gallery}
              roomName={room.name}
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[clamp(18rem,calc(100svh-31.5rem),34rem)]"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-h2">{room.name}</h1>
            <span className="pill pill-soft">
              <UsersIcon size={16} />
              {room.capacityLabel}
            </span>
          </div>

          <p className="mt-2 max-w-prose text-[0.9375rem]">{room.description}</p>

          <RoomFeatureList room={room} className="mt-4" />
          <p className="mt-4 text-[0.9375rem] font-medium text-ink">Sobib</p>
          <SuitedForList room={room} className="mt-1.5 sm:grid-cols-2" />
          <EquipmentList room={room} className="mt-4" />

          <a href="#broneeri" className="btn btn-sage btn-block mt-6 lg:hidden">
            {content.hero.secondaryCta}
          </a>

          <nav aria-label="Teised ruumid" className="mt-4">
            <p className="meta">Teised ruumid</p>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={roomHref(item.slug)}
                    className="group flex items-center justify-between gap-4 py-2 text-base font-medium text-ink transition-colors hover:text-sage"
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
