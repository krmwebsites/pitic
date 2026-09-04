import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { MailIcon, PhoneIcon } from "../icons";

type Props = {
  /** Vaikimisi „Veebibroneerimine on seadistamisel“; vea korral teine pealkiri. */
  heading?: string;
  /** Vaikimisi heaks kiidetud tekst content.json-ist. */
  intro?: string;
};

/**
 * Aus varulahendus, kui veebipõhine broneerimine pole kättesaadav: kalendrit
 * ei teeselda, kuvatakse päris kontaktid. Tekst on content.json-ist; e-posti
 * aadress ja telefon on selles linkideks tehtud.
 */
export function BookingFallback({ heading = content.booking.fallbackHeading, intro }: Props) {
  return (
    <div className="flex h-full flex-col justify-center p-6 sm:p-8" role="status">
      <h3 className="text-h3">{heading}</h3>
      <p className="mt-3 max-w-prose">
        {intro ?? (
          <>
            Broneerimiseks kirjuta{" "}
            <a href={site.email.href} className="link">
              {site.email.display}
            </a>{" "}
            või helista{" "}
            <a href={site.phone.href} className="link">
              {site.phone.display}
            </a>
            .
          </>
        )}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href={site.email.href} className="btn btn-primary">
          <MailIcon size={18} />
          {site.email.display}
        </a>
        <a href={site.phone.href} className="btn btn-secondary">
          <PhoneIcon size={18} />
          {site.phone.display}
        </a>
      </div>
      <p className="meta mt-5">Vastame {site.hours.label}.</p>
    </div>
  );
}
