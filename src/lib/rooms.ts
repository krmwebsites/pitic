import { content } from "./content";
import { galleries, type Photo } from "./photos";

/**
 * Pitici renditavad ruumid. Nimed ja mahutavus tulevad heaks kiidetud
 * content.json-ist; kirjeldused, omadused ja varustus on tellija antud
 * (hindu ega muid kontrollimata fakte ei lisata).
 */

export type RoomSlug = "jousaal" | "noupidamiste-ruum" | "suursaal";

export type Room = {
  slug: RoomSlug;
  /** ID content.json-is (gym, meeting-room, main-hall). */
  id: string;
  name: string;
  capacity: number;
  capacityLabel: string;
  /** Ühelauseline kirjeldus kaardile. */
  tagline: string;
  description: string;
  /** Milleks ruum sobib (tellija loetelu). */
  suitedFor: string[];
  /** Ruumi enda omadused lisaks kõigi ruumide ühistele (vt commonFeatures). */
  features: string[];
  /** Täielik varustuse loetelu (ainult jõusaalil). */
  equipment?: string[];
  /** Põhifoto (kaartidel). */
  photo: Photo;
  /** Ruumi lehe galerii; esimene on põhifoto. */
  gallery: Photo[];
};

/** Kuulub kõigi kolme ruumi juurde. */
export const commonFeatures = ["WiFi", "Parkimine", "Privaatsed tualettruumid", "Ruumis vajalik inventar"];

type Extra = Omit<Room, "id" | "name" | "capacityLabel">;

const extras: Record<string, Extra> = {
  gym: {
    slug: "jousaal",
    capacity: 8,
    tagline: "Privaatne ruum treeninguteks.",
    description:
      "Jõusaal sobib personaaltreeninguteks ja väikeste rühmade treeninguteks kuni 8 inimesele. Ruum broneeritakse ainult sinu seltskonnale.",
    suitedFor: ["Privaatne ja rahulik treenimine", "Väikeste rühmade treeningud"],
    features: ["Jõusaalivarustus", "Ise kontrollitav kõlarisüsteem"],
    equipment: [
      "Plokkmasin (cable machine)",
      "Lamamispink (bench press)",
      "Kükiraam (squat rack)",
      "Hantlid 1–30 kg",
      "Hack-kükk ja jalapress (2-in-1)",
      "Reie lähendajad ja eemaldajad (2-in-1)",
      "Jalasirutus ja -painutus (2-in-1)",
      "Lõuatõmbe- ja dip-raam",
      "Jooksulint",
      "Jalgratas",
      "Sõudeergomeeter",
    ],
    photo: galleries.jousaal[0],
    gallery: [...galleries.jousaal],
  },
  "meeting-room": {
    slug: "noupidamiste-ruum",
    capacity: 12,
    tagline: "Kohtumisteks ja meeskonnatööks.",
    description:
      "Nõupidamiste ruum on mõeldud koosolekuteks, läbirääkimisteks ja väiksemateks koolitusteks kuni 12 osalejale.",
    suitedFor: [
      "Koosolekud ja nõupidamised",
      "Väikesed koolitused ja kursused",
      "Väiksema grupi õppe- või treeningsessioonid",
    ],
    features: ["Projektor"],
    photo: galleries["noupidamiste-ruum"][0],
    gallery: [...galleries["noupidamiste-ruum"]],
  },
  "main-hall": {
    slug: "suursaal",
    capacity: 50,
    tagline: "Koolitusteks, töötubadeks ja treeninguteks.",
    description:
      "Suur saal mahutab kuni 50 inimest ning sobib koolitusteks, koosolekuteks, töötubadeks ja treeninguteks. Paigutuse lepime kokku vastavalt üritusele.",
    suitedFor: ["Suuremad koolitused ja kursused", "Koosolekud", "Töötoad", "Õppetunnid", "Tantsu- ja hüppetreeningud"],
    features: ["Projektor", "Suur peegel", "Kõlarisüsteem"],
    photo: galleries.suursaal[0],
    gallery: [...galleries.suursaal],
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
