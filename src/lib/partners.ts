/**
 * Koostööpartnerid, kes rendivad Keskväljak 15 majas ruume. Nimekiri on
 * tellijalt; tutvustused on lühikesed ja ainult avalikult kontrollitud
 * faktide põhjal. Kus tutvustust ei õnnestunud kontrollida, on see
 * `null` ja lehel kuvatakse ainult nimi. Logo lisamiseks pane fail kausta
 * public/partnerid ja anna `logo` väärtuseks tee (nt "/partnerid/late.svg").
 */

export type Partner = {
  name: string;
  /** Lühitutvustus või null, kui see on veel täpsustamisel. */
  description: string | null;
  /** Logo fail (public/ all) või null, siis kuvatakse monogramm. */
  logo: string | null;
  /** Avalik veebileht, kui on. */
  url: string | null;
};

export const partners: Partner[] = [
  {
    name: "Nokitsejad",
    description: "Parandustöökoda ja puutööring, kus huvilised saavad ise meisterdada ja parandada.",
    logo: null,
    url: null,
  },
  {
    name: "Keila Teraapiakeskus",
    description:
      "Teraapia- ja rehabilitatsiooniteenused Lääne-Harjumaa peredele, muu hulgas logopeedia, psühholoogia ja füsioteraapia.",
    logo: null,
    url: "https://teraapiamaja.ee/",
  },
  {
    name: "Minusinuilu OÜ",
    description: null,
    logo: null,
    url: null,
  },
  {
    name: "Loovtee OÜ",
    description: null,
    logo: null,
    url: null,
  },
  {
    name: "Läte kool",
    description: "Waldorfkool Läte on lapsevanemate loodud erakool, mille klassid tegutsevad Keskväljak 15 majas.",
    logo: null,
    url: "https://late.ee/",
  },
];

/** Jõusaali ruumi rendiga tegeleb majas Rave Sport OÜ (kuvatakse ainult partnerite juures). */
export const gymOperator = {
  name: "Rave Sport OÜ",
  description: "Tegeleb majas jõusaali ruumi rendiga.",
};

/** Monogramm logo asemel: kuni kaks algustähte. */
export function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-ZÕÄÖÜ]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}
