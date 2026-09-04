import type { Metadata } from "next";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: content.footer.termsLabel,
  description: "Pitici ruumide broneerimise ja kasutamise üldised tingimused.",
  alternates: { canonical: "/kasutustingimused" },
  robots: { index: false, follow: true },
};

/**
 * Üldised tingimused ilma väljamõeldud detailideta: hinnad, tühistamistähtajad
 * ja maksetingimused seadistab Pitic broneerimissüsteemis ning need kuvatakse
 * broneerimise käigus.
 */
export default function TermsPage() {
  return (
    <article className="wrap section max-w-prose">
      <h1>{content.footer.termsLabel}</h1>
      <p className="lead mt-5">
        Pitic rendib ruume aadressil {site.address.full}. Ruumid on broneeritavad{" "}
        {site.hours.days.toLowerCase()} kell {site.hours.open}–{site.hours.close}.
      </p>

      <h2 className="mt-12 text-h3">Broneerimine</h2>
      <p className="mt-3">
        Broneering tehakse veebis broneerimissüsteemi kaudu või e-posti ja telefoni teel. Broneering
        kehtib pärast Pitici kinnitust. Ruumi hind, tasumise kord ning tühistamise ja muutmise
        tähtajad kuvatakse broneerimise käigus enne broneeringu kinnitamist.
      </p>

      <h2 className="mt-10 text-h3">Ruumi kasutamine</h2>
      <p className="mt-3">
        Ruumi kasutatakse broneeritud ajal ja kokkulepitud otstarbel ning kuni märgitud
        mahutavuse piires. Ruum antakse tagasi samas korras, nagu see vastu võeti.
      </p>

      <h2 className="mt-10 text-h3">Küsimused</h2>
      <p className="mt-3">
        Tingimuste kohta küsi{" "}
        <a href={site.email.href} className="link">
          {site.email.display}
        </a>{" "}
        või{" "}
        <a href={site.phone.href} className="link">
          {site.phone.display}
        </a>
        .
      </p>
    </article>
  );
}
