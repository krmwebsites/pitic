/**
 * Kõik lehe fotod ühest kohast. Päris Pitici fotode saabudes asenda failid
 * kaustas public/fotod (sama nimi) ja muuda `placeholder` väärtuseks false.
 *
 * Praegused failid on lõigatud disaini reference-mockupist. Need on
 * kontseptuaalsed näidised, mitte Pitici päris ruumid, ja on lehel
 * märgistatud sildiga „Näidisfoto“. Galeriisse võib lisada nii palju fotosid
 * kui vaja: lisa fail kausta ja üks kirje vastavasse galerii massiivi.
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
  gymDetail: {
    src: "/fotod/room-gym-2.webp",
    alt: "Jõusaal lähemalt: jõuraam ja treeningpink",
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
  meetingDetail: {
    src: "/fotod/room-meeting-2.webp",
    alt: "Nõupidamiste ruum lähemalt: laud ja ekraan",
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
  hallDetail: {
    src: "/fotod/room-hall-2.webp",
    alt: "Suursaal lähemalt: toolide read ja aknad",
    width: 490,
    height: 410,
    placeholder: true,
  },
} as const satisfies Record<string, Photo>;

/** Ruumide galeriid: esimene foto on ruumi põhifoto (kaartidel), ülejäänud lisavaated. */
export const galleries = {
  jousaal: [photos.gym, photos.gymDetail, photos.hero],
  "noupidamiste-ruum": [photos.meeting, photos.meetingDetail, photos.hero],
  suursaal: [photos.hall, photos.hallDetail, photos.hero],
} as const satisfies Record<string, readonly Photo[]>;
