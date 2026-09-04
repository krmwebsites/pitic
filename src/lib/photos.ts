/**
 * Kõik lehe fotod ühest kohast. Failid on kaustas public/fotod.
 *
 * Ruumide galeriid: viis vaadet ruumi kohta, esimene on ruumi põhifoto
 * (kaartidel ja galerii avapilt). Uue foto lisamiseks pane fail kausta ja
 * lisa üks kirje vastavasse massiivi. `placeholder: true` kuvab pildil
 * sildi „Näidisfoto“; avalehe hero-pilt on veel näidis.
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** true = näidisfoto, mis tuleb enne avaldamist asendada. */
  placeholder: boolean;
};

function gallery(slug: string, alts: string[]): Photo[] {
  return alts.map((alt, i) => ({
    src: `/fotod/${slug}-${i + 1}.webp`,
    alt,
    width: 1536,
    height: 1024,
    placeholder: false,
  }));
}

export const photos = {
  hero: {
    src: "/fotod/hero-space.webp",
    alt: "Avar ja valgusküllane vastuvõturuum puitseina ja istumisnurgaga",
    width: 1048,
    height: 906,
    placeholder: true,
  },
} as const satisfies Record<string, Photo>;

export const galleries = {
  jousaal: gallery("jousaal", [
    "Jõusaal: jõuraam, kang ja kardiotrenažöör suurte akende all",
    "Jõusaal: jõuraam ja kettad lähemalt",
    "Jõusaal: jõuraam, treeningpink ja hantlite rest",
    "Jõusaal: hantlite rest ja reguleeritav pink",
    "Jõusaal: vaade akende ja kardiotrenažööride poole",
  ]),
  "noupidamiste-ruum": gallery("noupidamiste-ruum", [
    "Nõupidamiste ruum: pikk puidust laud, toolid ja ekraan seinal",
    "Nõupidamiste ruum: vaade akende poolt laua suunas",
    "Nõupidamiste ruum: laud ja toolid diagonaalvaates",
    "Nõupidamiste ruum: laud ja ekraan lähemalt",
    "Nõupidamiste ruum: vaade ukse poolt",
  ]),
  suursaal: gallery("suursaal", [
    "Suursaal: toolide read lava ees, suured aknad",
    "Suursaal: toolide read külgvaates",
    "Suursaal: toolide read vaadatuna saali tagant",
    "Suursaal: toolide read paremalt küljelt",
    "Suursaal: laudade paigutus ürituseks",
  ]),
} satisfies Record<string, Photo[]>;
