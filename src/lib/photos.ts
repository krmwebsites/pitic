/**
 * Kõik lehe fotod ühest kohast. Päris Pitici fotode saabudes asenda failid
 * kaustas public/fotod (sama nimi) ja muuda `placeholder` väärtuseks false.
 *
 * Praegused failid on lõigatud disaini reference-mockupist. Need on
 * kontseptuaalsed näidised, mitte Pitici päris ruumid, ja on lehel
 * märgistatud sildiga „Näidisfoto“.
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** true = näidisfoto, mis tuleb enne avaldamist asendada. */
  placeholder: boolean;
};

export const photos = {
  hero: {
    src: "/fotod/hero-space.webp",
    alt: "Avar ja valgusküllane vastuvõturuum puitseina ja istumisnurgaga",
    width: 1048,
    height: 906,
    placeholder: true,
  },
  gym: {
    src: "/fotod/room-gym.webp",
    alt: "Jõusaal jõuraami, hantlite ja treeningpinkidega",
    width: 490,
    height: 410,
    placeholder: true,
  },
  meeting: {
    src: "/fotod/room-meeting.webp",
    alt: "Nõupidamiste ruum pika puidust laua, toolide ja ekraaniga",
    width: 488,
    height: 410,
    placeholder: true,
  },
  hall: {
    src: "/fotod/room-hall.webp",
    alt: "Suursaal toolide ridade ja suurte akendega",
    width: 490,
    height: 410,
    placeholder: true,
  },
} as const satisfies Record<string, Photo>;
