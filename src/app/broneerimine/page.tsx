import type { Metadata } from "next";
import { BookingSearch } from "@/components/booking/booking-search";
import { getBookingConfig } from "@/lib/booking";
import { content } from "@/lib/content";
import { rooms } from "@/lib/rooms";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: content.hero.secondaryCta,
  description: `Leia oma sündmusele sobiv ruum ja vaata vabu aegu. ${site.address.full}, ${site.hours.label}.`,
  alternates: { canonical: "/broneerimine" },
};

/** Broneerimine otsingu kaudu: aeg ja külalised → sobivad ruumid → andmed → makse. */
export default function BookingPage() {
  const config = getBookingConfig();

  return (
    <div className="wrap py-10 lg:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1>{content.hero.secondaryCta}</h1>
        <p className="lead mt-4">Leia oma sündmusele sobiv ruum ja vaata vabu aegu.</p>
      </div>
      <div className="mt-10">
        <BookingSearch rooms={rooms} config={config} />
      </div>
    </div>
  );
}
