/**
 * Koostööpartnerid, kes rendivad Keskväljak 15 majas ruume (tellija
 * nimekiri ja tutvustused). Logo lisamiseks pane fail kausta
 * public/partnerid ja anna `logo` väärtuseks tee (nt "/partnerid/late.svg");
 * seni kuvatakse monogramm.
 */

export type Partner = {
  name: string;
  /** Tegevusala silt kaardi ülaservas (suurtähtedega). */
  category: string;
  description: string;
  /** Logo fail (public/ all) või null, siis kuvatakse monogramm. */
  logo: string | null;
  /** Monogrammi käsitsi määratud tähed (vaikimisi nime algustähed). */
  mark?: string;
  /** Link kaardi all: väline veebileht või lehe enda link. */
  link: { label: string; href: string; external: boolean } | null;
};

export const partners: Partner[] = [
  {
    name: "Nokitsejad",
    category: "Töökoda",
    description: "Parandustöökoda ja puutööring, kus huvilised saavad ise meisterdada ja parandada.",
    logo: null,
    link: null,
  },
  {
    name: "Keila Teraapiakeskus",
    category: "Teraapia",
    description: "Teraapia- ja rehabilitatsiooniteenused Lääne-Harjumaa peredele.",
    logo: null,
    link: { label: "Veebileht", href: "https://teraapiamaja.ee/", external: true },
  },
  {
    name: "Minusinu ilu OÜ",
    category: "Ilu & heaolu",
    description: "Ilu- ja heaoluteenused.",
    logo: null,
    link: null,
  },
  {
    name: "Loovtee OÜ",
    category: "Loovtegevus",
    description: "Loovust ja arengut toetavad tegevused.",
    logo: null,
    link: null,
  },
  {
    name: "Läte kool",
    category: "Haridus",
    description: "Waldorfkool, mille klassid tegutsevad Keskväljak 15 majas.",
    logo: null,
    link: { label: "Veebileht", href: "https://late.ee/", external: true },
  },
  {
    name: "Rave Sport OÜ",
    category: "Sport",
    mark: "R",
    description: "Jõusaali ruumide rent ja treeninguvõimalused.",
    logo: null,
    link: { label: "Vaata jõusaali", href: "/ruumide-rent/jousaal", external: false },
  },
];

/** Monogramm logo asemel: kuni kaks algustähte. */
export function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-ZÕÄÖÜ]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}
