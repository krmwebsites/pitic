import type { Metadata } from "next";
import Link from "next/link";
import { RoomCard } from "@/components/room-card";
import { content } from "@/lib/content";
import { rooms } from "@/lib/rooms";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: content.navigation[1].label,
  description:
    "Pitici renditavad ruumid Keila keskväljakul: jõusaal kuni 8, nõupidamiste ruum kuni 12 ja suursaal kuni 50 inimesele.",
  alternates: { canonical: "/ruumide-rent" },
};

/** Layout-artifacti vaade 02: kolm ühesugust kaarti (pilt → nimi → mahutavus → Broneeri). */
export default function RoomsPage() {
  return (
    <div className="wrap section">
      <div className="max-w-2xl">
        <h1>{content.spacesSection.heading}</h1>
        <p className="lead mt-4">
          {content.spacesSection.body} Kõik ruumid asuvad aadressil {site.address.full} ja on
          broneeritavad {site.hours.label}.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
        {rooms.map((room, index) => (
          <li key={room.slug}>
            <RoomCard room={room} variant="booking" priority={index === 0} />
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
    </div>
  );
}
