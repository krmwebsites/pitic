/**
 * Kõik lehe fotod ühest kohast. Failid on kaustas public/fotod.
 *
 * Ruumide galeriid: Keskväljak 15 päris fotod, järjestatud üldvaadetest
 * detailideni; esimene on ruumi põhifoto (kaartidel ja galerii avapilt).
 * Uue foto lisamiseks pane fail kausta ja lisa alt-tekst vastavasse
 * massiivi (fotode arv on vaba). `placeholder: true` kuvab sildi „Näidisfoto“.
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** true = näidisfoto, mis tuleb enne avaldamist asendada. */
  placeholder: boolean;
};

function photo(src: string, alt: string, width: number, height: number): Photo {
  return { src: `/fotod/${src}.webp`, alt, width, height, placeholder: false };
}

/** Galerii failid on nimega `<slug>-<n>.webp`; kõrgus antakse ette, kui foto ei ole 3:2. */
function gallery(slug: string, items: (string | [alt: string, height: number])[]): Photo[] {
  return items.map((item, i) => {
    const [alt, height] = typeof item === "string" ? [item, 1066] : item;
    return photo(`${slug}-${i + 1}`, alt, 1600, height);
  });
}

export const photos = {
  /** Avalehe hero: hoone tänava poolt. */
  hero: photo("hero-maja", "Keskväljak 15 hoone Keilas", 1427, 1102),
  /** „Meist“: hoone hoovi poolt (püstine). */
  house: photo("maja-hoov", "Keskväljak 15 hoone hoovi poolt", 798, 1060),
} as const satisfies Record<string, Photo>;

export const galleries = {
  jousaal: gallery("jousaal", [
    "Jõusaal: plokkmasin, kükiraam ja aknad",
    "Jõusaal: lamamispink ja kükiraam",
    "Jõusaal: hantlirest, kettad ja peegelsein",
    ["Jõusaal: jooksulint, jalgratas ja sõudeergomeeter", 1069],
    "Jõusaal: lõuatõmbe- ja dip-raam, jooksulint ja elliptiline trenažöör",
    "Jõusaal: reguleeritav pink ja hantlid peegelseina ees",
    "Jõusaali riietusruum pingi ja nagidega",
    "Riietusruumi koridor ja peegel",
    "Riietusruumi nagisein ja pink",
    "Dušširuum",
    "Hantlid lähivaates",
    "Riietusruumi nagid lähivaates",
    "Riidepuud riietusruumis",
  ]),
  "noupidamiste-ruum": gallery("noupidamiste-ruum", [
    ["Nõupidamiste ruum: koosolekulaud, toolid ja aknad", 1067],
    "Nõupidamiste ruum: projektoripilt seinal ja koosolekulaud",
    ["Nõupidamiste ruum: laud, toolid ja uksed", 1071],
    ["Nõupidamiste ruum: laud ukse poolt vaadatuna", 904],
    ["Nõupidamiste ruum: laud, pabertahvel ja kohvilaud", 1067],
    "Nõupidamiste ruum: laud ja projektoripilt lähemalt",
    "Nõupidamiste ruum koolituspaigutuses: toolid kirjutusalustega",
    ["Nõupidamiste ruum koolituspaigutuses ja pabertahvel", 871],
    "Koolituspaigutus akna poolt vaadatuna",
    "Sülearvuti ja pabertahvel koolituspaigutuses",
    "Klaasid, presskann ja veekeetja kohvilaual",
  ]),
  suursaal: gallery("suursaal", [
    "Suur saal: tühi saal, parkett ja aknad",
    "Suur saal: toolide read ja projektoriekraan",
    ["Suur saal: toolide read külgvaates", 1020],
    "Suur saal: toolid ringis",
    "Suur saal: toolid ringis ukse poolt",
    "Suur saal: toolid ringis lähemalt",
  ]),
} satisfies Record<string, Photo[]>;
