/**
 * Kontaktisikud (layout-artifacti vaade 04). Nimed ja e-postid on eskiisilt;
 * telefoninumbrid olid eskiisil poolikud („+372 ...“) ja fotosid ei ole antud,
 * seetõttu on need väljad tühjad. Täida, kui andmed on olemas: telefon kuvatakse
 * automaatselt, foto asendab initsiaalidega ringi.
 */
export type Person = {
  name: string;
  email: string;
  /** Kuvatakse ainult siis, kui number on teada, nt "+372 5xx xxxx". */
  phone: string | null;
  /** Ruudukujuline foto kaustas public/inimesed, nt "/inimesed/kaire-kononen.webp". */
  photo: string | null;
};

export const people: Person[] = [
  { name: "Kaire Kononen", email: "kaire@pitic.eu", phone: null, photo: null },
  { name: "Katrin Pirn", email: "katrin@pitic.eu", phone: null, photo: null },
  { name: "Peeter Kõresaar", email: "peeter@pitic.eu", phone: null, photo: null },
];

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}
