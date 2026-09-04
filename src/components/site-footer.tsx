import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

const items = [
  { icon: PinIcon, label: site.address.full, href: site.maps.link, external: true },
  { icon: PhoneIcon, label: site.phone.display, href: site.phone.href },
  { icon: MailIcon, label: site.email.display, href: site.email.href },
  { icon: ClockIcon, label: site.hours.label, href: null },
];

/**
 * Tume footer: logo ja lühitekst vasakul, neli kontaktielementi ikoonidega
 * (desktopil ühes reas vertikaalsete joontega, mobiilis 2 × 2), all autoriõigus ja lingid.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const copyright = content.footer.copyrightTemplate.replace("{year}", String(year));

  return (
    <footer className="bg-ink text-canvas">
      <div className="wrap grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:items-center lg:gap-10 lg:py-14">
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
          <p className="mt-4 max-w-xs text-canvas/85">Ruumid kohtumisteks, treeninguteks ja sündmusteks.</p>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/15 lg:border-l lg:border-white/15">
          {items.map((item, index) => {
            const Icon = item.icon;
            const inner = (
              <>
                <Icon size={20} className="shrink-0 text-sage-soft" />
                <span className="text-[0.9375rem]">{item.label}</span>
              </>
            );
            return (
              <li
                key={item.label}
                className={`flex items-center lg:justify-center lg:px-4 ${index % 2 === 1 ? "border-l border-white/15 pl-6 lg:border-0 lg:pl-4" : ""}`}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-3 text-canvas/85 transition-colors hover:text-white"
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {inner}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-3 text-canvas/85">{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="wrap">
        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-sm text-canvas/60 sm:flex-row sm:items-center sm:justify-between">
          <span>{copyright}</span>
          <span className="flex gap-6">
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
