import Link from "next/link";
import { content } from "@/lib/content";
import { roomHref, type Room } from "@/lib/rooms";
import { ArrowRightIcon } from "./icons";
import { Photo } from "./photo";
import { CountUp } from "./reactbits/count-up";
import { SpotlightCard } from "./reactbits/spotlight-card";

type Props = {
  room: Room;
  /**
   * link – kogu kaart on link ruumi lehele („Vaata lähemalt →“, avaleht);
   * booking – kaardil on nupp „Broneeri ruum“ (ruumide ülevaade, layout-artifacti vaade 02).
   */
  variant?: "link" | "booking";
  priority?: boolean;
  /** Avalehe kompaktne kaart: lai foto ja ühelauseline kirjeldus. */
  compact?: boolean;
};

/** Mahutavuse silt: „Kuni 8 inimest“, number loetakse vaatevälja jõudes üles (React Bits Count Up). */
function CapacityPill({ room }: { room: Room }) {
  return (
    <span className="pill pill-soft shrink-0 gap-0">
      Kuni&nbsp;<CountUp to={room.capacity} />&nbsp;inimest
    </span>
  );
}

export function RoomCard({ room, variant = "link", priority, compact = false }: Props) {
  const href = roomHref(room.slug);
  const photo = (
    <Photo
      photo={room.photo}
      priority={priority}
      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
      className={compact ? "aspect-[16/10]" : "aspect-[4/3]"}
      imgClassName="transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]"
    />
  );

  if (variant === "booking") {
    return (
      <SpotlightCard className="surface group h-full rounded-lg transition-colors hover:border-line-strong">
        <article className="flex h-full flex-col">
          <Link href={href} className="block" aria-label={`${room.name}: ${content.spacesSection.linkLabel}`}>
            {photo}
          </Link>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="min-w-0 text-h3">
                <Link href={href} className="transition-colors hover:text-sage">
                  {room.name}
                </Link>
              </h2>
              <CapacityPill room={room} />
            </div>
            <p className="mt-3 flex-1 text-[0.9375rem]">{room.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-line pt-5 sm:gap-x-6">
              <Link href={`${href}#broneeri`} className="btn btn-sage btn-sm">
                {content.hero.secondaryCta}
              </Link>
              <Link href={href} className="arrow-link">
                {content.spacesSection.linkLabel}
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </article>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard className="surface group h-full rounded-lg transition-colors hover:border-line-strong focus-within:border-line-strong">
      <Link href={href} className="flex h-full flex-col">
        {photo}
        <span className="flex flex-1 flex-col p-6">
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0 text-[1.375rem] leading-tight font-medium text-ink">{room.name}</span>
            <CapacityPill room={room} />
          </span>
          <span className="mt-2 text-[0.9375rem] text-body">{room.tagline}</span>
          <span className="arrow-link mt-5 justify-between border-t border-line pt-4">
            {content.spacesSection.linkLabel}
            <ArrowRightIcon />
          </span>
        </span>
      </Link>
    </SpotlightCard>
  );
}
