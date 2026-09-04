import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { ClockIcon, MailIcon, PhoneIcon } from "./icons";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const copyright = content.footer.copyrightTemplate.replace("{year}", String(year));

  return (
    <footer className="bg-ink text-canvas">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:items-start md:gap-12 lg:py-16">
        <div>
          <Link href="/" className="inline-flex" aria-label="Pitic, avaleht">
            {/* Valge versioon on loodud originaalist alfakanalit muutmata, geomeetria on sama. */}
            <Image
              src="/brand/pitic-logo-white.png"
              alt="Pitic"
              width={981}
              height={404}
              sizes="150px"
              className="h-11 w-auto"
            />
          </Link>
          <p className="mt-5">
            <a
              href={site.maps.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-canvas/80 underline decoration-canvas/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              {site.address.full}
            </a>
          </p>
        </div>

        <ul className="flex flex-col gap-3 md:pt-2">
          <li>
            <a
              href={site.phone.href}
              className="inline-flex items-center gap-3 text-canvas/80 transition-colors hover:text-white"
            >
              <PhoneIcon size={20} />
              {site.phone.display}
            </a>
          </li>
          <li>
            <a
              href={site.email.href}
              className="inline-flex items-center gap-3 text-canvas/80 transition-colors hover:text-white"
            >
              <MailIcon size={20} />
              {site.email.display}
            </a>
          </li>
        </ul>

        {/* Sotsiaalmeedia linke ei ole teada, seetõttu on siin lahtiolekuajad. */}
        <p className="inline-flex items-center gap-3 text-canvas/80 md:justify-self-end md:pt-2">
          <ClockIcon size={20} />
          {site.hours.label}
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-sm text-canvas/60 sm:flex-row sm:items-center sm:justify-between">
          <span>{copyright}</span>
          <span className="flex gap-5">
            <Link href="/privaatsus" className="transition-colors hover:text-white">
              {content.footer.privacyLabel}
            </Link>
            <Link href="/kasutustingimused" className="transition-colors hover:text-white">
              {content.footer.termsLabel}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
