import { content } from "./content";
import { photos, type Photo } from "./photos";

/**
 * Pitici renditavad ruumid. Nimed ja mahutavus tulevad heaks kiidetud
 * content.json-ist; lühikirjeldused on tuletatud ainult ruumi nimest ja
 * mahutavusest (hindu, varustust ega muid kontrollimata fakte ei lisata).
 */

export type RoomSlug = "jousaal" | "noupidamiste-ruum" | "suursaal";

export type Room = {
  slug: RoomSlug;
  /** ID content.json-is (gym, meeting-room, main-hall). */
  id: string;
  name: string;
  capacity: number;
  capacityLabel: string;
  description: string;
  suitedFor: string[];
  photo: Photo;
};

type Extra = Omit<Room, "id" | "name" | "capacityLabel">;

const extras: Record<string, Extra> = {
  gym: {
    slug: "jousaal",
    capacity: 8,
    description:
      "Jõusaal sobib personaaltreeninguteks ja väikeste rühmade treeninguteks kuni 8 inimesele. Ruum broneeritakse ainult sinu seltskonnale.",
    suitedFor: ["Personaaltreeningud", "Väikerühmade treeningud", "Treenerite kliendiajad"],
    photo: photos.gym,
  },
  "meeting-room": {
    slug: "noupidamiste-ruum",
    capacity: 12,
    description:
      "Nõupidamiste ruum on mõeldud koosolekuteks, läbirääkimisteks ja väiksemateks koolitusteks kuni 12 osalejale.",
    suitedFor: ["Koosolekud ja läbirääkimised", "Väiksemad koolitused", "Töötoad ja intervjuud"],
    photo: photos.meeting,
  },
  "main-hall": {
    slug: "suursaal",
    capacity: 50,
    description:
      "Suursaal mahutab kuni 50 inimest ning sobib seminarideks, esitlusteks ja sündmusteks. Paigutuse lepime kokku vastavalt üritusele.",
    suitedFor: ["Seminarid ja koolitused", "Esitlused ja infopäevad", "Sündmused kuni 50 inimesele"],
    photo: photos.hall,
  },
};

export const rooms: Room[] = content.spaces.map((space) => ({
  id: space.id,
  name: space.name,
  capacityLabel: space.capacity,
  ...extras[space.id],
}));

export function getRoom(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}

export function roomHref(slug: RoomSlug): `/ruumide-rent/${RoomSlug}` {
  return `/ruumide-rent/${slug}`;
}
