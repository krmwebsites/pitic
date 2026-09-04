import type { ComponentType, SVGProps } from "react";
import { commonFeatures, type Room } from "@/lib/rooms";
import {
  BoxIcon,
  CarIcon,
  CheckIcon,
  DoorIcon,
  DumbbellIcon,
  MirrorIcon,
  ProjectorIcon,
  SpeakerIcon,
  WifiIcon,
} from "./icons";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

/** Omaduse ikoon sildi järgi; tundmatu silt saab linnukese. */
const ICONS: Record<string, Icon> = {
  WiFi: WifiIcon,
  Parkimine: CarIcon,
  "Privaatsed tualettruumid": DoorIcon,
  "Ruumis vajalik inventar": BoxIcon,
  Jõusaalivarustus: DumbbellIcon,
  "Ise kontrollitav kõlarisüsteem": SpeakerIcon,
  Kõlarisüsteem: SpeakerIcon,
  Projektor: ProjectorIcon,
  "Suur peegel": MirrorIcon,
};

/** Omaduste sildid ikoonidega (ruumi enda omadused eespool, ühised järel). */
export function FeatureList({
  items,
  label,
  className = "",
}: {
  items: string[];
  label: string;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={label}>
      {items.map((item) => {
        const Icon = ICONS[item] ?? CheckIcon;
        return (
          <li key={item} className="pill pill-outline gap-1.5 whitespace-normal">
            <Icon size={16} className="shrink-0 text-sage" />
            {item}
          </li>
        );
      })}
    </ul>
  );
}

/** Kõik ruumi omadused: ruumi enda omad + kõigile ruumidele ühised. */
export function RoomFeatureList({ room, className = "" }: { room: Room; className?: string }) {
  return <FeatureList items={[...room.features, ...commonFeatures]} label={`${room.name}: omadused`} className={className} />;
}

/** Milleks ruum sobib: kompaktne loetelu linnukestega. */
export function SuitedForList({ room, className = "" }: { room: Room; className?: string }) {
  return (
    <ul className={`grid gap-1.5 ${className}`} aria-label={`${room.name}: sobib`}>
      {room.suitedFor.map((item) => (
        <li key={item} className="flex items-start gap-2 text-[0.9375rem] text-body">
          <CheckIcon size={18} className="mt-0.5 shrink-0 text-sage" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Jõusaali täielik varustus: avatav loetelu, et ruumi leht jääks kompaktseks. */
export function EquipmentList({ room, open = false, className = "" }: { room: Room; open?: boolean; className?: string }) {
  if (!room.equipment?.length) return null;
  return (
    <details className={`group rounded-md border border-line bg-surface ${className}`} open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-[0.9375rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
        Kõik jõusaali masinad
        <span className="meta text-sm font-normal">
          {room.equipment.length} <span className="sr-only">ühikut</span>
          <span aria-hidden="true" className="ml-2 inline-block transition-transform group-open:rotate-180">
            ⌄
          </span>
        </span>
      </summary>
      <ul className="grid gap-x-6 gap-y-1 border-t border-line px-4 py-3 text-[0.9375rem] text-body sm:grid-cols-2">
        {room.equipment.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckIcon size={16} className="mt-1 shrink-0 text-sage" />
            {item}
          </li>
        ))}
      </ul>
    </details>
  );
}
