import type { Metadata } from "next";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: content.footer.privacyLabel,
  description: "Kuidas Pitici veebileht ja broneerimissüsteem isikuandmeid töötlevad.",
  alternates: { canonical: "/privaatsus" },
  robots: { index: false, follow: true },
};

/**
 * Lühike ja faktiline privaatsusteave. Kirjeldab ainult seda, mida see leht
 * päriselt teeb; täiendavad juriidilised tingimused lisab Pitic ise.
 */
export default function PrivacyPage() {
  return (
    <article className="wrap section max-w-prose">
      <h1>{content.footer.privacyLabel}</h1>
      <p className="lead mt-5">
        See leht kirjeldab, milliseid andmeid Pitici veebileht ja broneerimissüsteem töötlevad.
      </p>

      <h2 className="mt-12 text-h3">Veebilehe külastamine</h2>
      <p className="mt-3">
        Veebileht ise ei kogu isikuandmeid ega kasuta jälgimisküpsiseid. Kontaktilehel olev kaart
        laaditakse Google Mapsi teenusest ja sellele kehtivad Google Mapsi kasutustingimused.
      </p>

      <h2 className="mt-10 text-h3">Broneerimine</h2>
      <p className="mt-3">
        Ruumi broneerimisel sisestad oma nime, e-posti aadressi ja telefoninumbri
        broneerimissüsteemi SimplyBook.me. Neid andmeid kasutab Pitic broneeringu kinnitamiseks,
        meeldetuletuste saatmiseks ja sinuga ühenduse võtmiseks broneeringuga seotud küsimustes.
        Andmete töötlemise täpsemad tingimused kuvatakse broneerimise käigus.
      </p>

      <h2 className="mt-10 text-h3">Küsimused</h2>
      <p className="mt-3">
        Andmete vaatamiseks, parandamiseks või kustutamiseks kirjuta{" "}
        <a href={site.email.href} className="link">
          {site.email.display}
        </a>{" "}
        või helista{" "}
        <a href={site.phone.href} className="link">
          {site.phone.display}
        </a>
        .
      </p>
    </article>
  );
}
