import Link from "next/link";
import { content } from "@/lib/content";
import { roomHref, type Room } from "@/lib/rooms";
import { ArrowRightIcon } from "./icons";
import { Photo } from "./photo";

type Props = {
  room: Room;
  /**
   * link – kogu kaart on link ruumi lehele („Vaata lähemalt →“, avaleht);
   * booking – kaardil on nupp „Broneeri ruum“ (ruumide ülevaade, layout-artifacti vaade 02).
   */
  variant?: "link" | "booking";
  priority?: boolean;
};

export function RoomCard({ room, variant = "link", priority }: Props) {
  const href = roomHref(room.slug);
  const photo = (
    <Photo
      photo={room.photo}
      priority={priority}
      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
      className="aspect-[4/3] border-b border-line"
      imgClassName="transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]"
    />
  );

  if (variant === "booking") {
    return (
      <article className="surface group flex h-full flex-col overflow-hidden transition-colors hover:border-line-strong">
        <Link href={href} className="block" aria-label={`${room.name}: ${content.spacesSection.linkLabel}`}>
          {photo}
        </Link>
        <div className="flex flex-1 flex-col p-6">
          <h2 className="text-h3">
            <Link href={href} className="transition-colors hover:text-sage">
              {room.name}
            </Link>
          </h2>
          <p className="meta mt-1">{room.capacityLabel}</p>
          <p className="mt-4 text-[0.9375rem]">{room.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <Link href={`${href}#broneeri`} className="btn btn-primary btn-sm">
              {content.hero.secondaryCta}
            </Link>
            <Link href={href} className="arrow-link">
              {content.spacesSection.linkLabel}
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Link
      href={href}
      className="surface group flex h-full flex-col overflow-hidden transition-colors hover:border-line-strong focus-visible:border-line-strong"
    >
      {photo}
      <span className="flex flex-1 flex-col p-6">
        <span className="text-h3 font-medium text-ink">{room.name}</span>
        <span className="meta mt-1">{room.capacityLabel}</span>
        <span className="arrow-link mt-6 justify-between border-t border-line pt-5">
          {content.spacesSection.linkLabel}
          <ArrowRightIcon />
        </span>
      </span>
    </Link>
  );
}
