import type { SVGProps } from "react";

/**
 * Ühtne joonikoonide komplekt: 24 px ruudustik, 1.5 px joon, ümarad otsad.
 * Kõik ikoonid on dekoratiivsed (aria-hidden), tähendus tuleb kõrvalolevast tekstist.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 22, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21s6.5-5.7 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.3 6.5 11 6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </Base>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Base>
  );
}

export function CalendarCheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M9.2 15l2 2 3.8-4" />
    </Base>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.6 3.8h2.9l1.5 3.9-2 1.5a11.4 11.4 0 0 0 5.8 5.8l1.5-2 3.9 1.5v2.9a1.9 1.9 0 0 1-1.9 1.9A15.6 15.6 0 0 1 4.7 5.7a1.9 1.9 0 0 1 1.9-1.9Z" />
    </Base>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </Base>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Base>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </Base>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.3 2.3 4.7-4.8" />
    </Base>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 13v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H11" />
    </Base>
  );
}

export function AccessibilityIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <circle cx="12" cy="4.5" r="1.6" />
      <path d="M5 9.5c4.7 1 9.3 1 14 0M12 9.8v4.7M12 14.5l-3.2 5.5M12 14.5l3.2 5.5" />
    </Base>
  );
}

export function DumbbellIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <path d="M7 8v8M17 8v8M4.5 9.5v5M19.5 9.5v5M7 12h10M2.5 12h2M19.5 12h2" />
    </Base>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7a1 1 0 0 1 .7.3l7.3 7.3a1 1 0 0 1 0 1.4l-7.4 7.4a1 1 0 0 1-1.4 0l-7.6-7.6a1 1 0 0 1-.3-.8Z" />
      <circle cx="8" cy="8" r="1.4" />
    </Base>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <Base size={18} {...props}>
      <circle cx="9.5" cy="8.5" r="3" />
      <path d="M3.5 19a6 6 0 0 1 12 0M15.5 6a3 3 0 0 1 0 5.6M20.5 19a5.5 5.5 0 0 0-3.8-5.3" />
    </Base>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2.5 9.5a14 14 0 0 1 19 0" />
      <path d="M5.8 13a9.5 9.5 0 0 1 12.4 0" />
      <path d="M9 16.3a5 5 0 0 1 6 0" />
      <circle cx="12" cy="19.3" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 16v-4l2.2-5.2A1.5 1.5 0 0 1 7.6 6h8.8a1.5 1.5 0 0 1 1.4.8L20 12v4" />
      <path d="M4 12h16" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.6" />
      <circle cx="16.5" cy="16.5" r="1.6" />
    </Base>
  );
}

export function DoorIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6" y="3" width="12" height="18" rx="1.5" />
      <path d="M3.5 21h17" />
      <circle cx="14.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3.5 8 12 3.5 20.5 8v8L12 20.5 3.5 16z" />
      <path d="M3.5 8 12 12.5 20.5 8" />
      <path d="M12 12.5v8" />
    </Base>
  );
}

export function ProjectorIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="7.5" width="18" height="9" rx="2" />
      <circle cx="15" cy="12" r="2.5" />
      <path d="M6 12h4" />
      <path d="M7 16.5v2M17 16.5v2" />
    </Base>
  );
}

export function MirrorIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="m9.5 10 4-4" />
      <path d="m9.5 14.5 6.5-6.5" />
    </Base>
  );
}

export function SpeakerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <circle cx="12" cy="14.5" r="3" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Base>
  );
}
