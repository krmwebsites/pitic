import Image from "next/image";
import type { Photo as PhotoAsset } from "@/lib/photos";

type Props = {
  photo: PhotoAsset;
  sizes: string;
  priority?: boolean;
  /** Konteineri klassid: kuvasuhe, nurgad, piirjoon. */
  className?: string;
  /** Pildi enda klassid, nt hover-skaala. */
  imgClassName?: string;
};

/**
 * Foto koos ausa märgistusega: kuni päris Pitici fotod puuduvad, kannab
 * iga näidisfoto väikest silti „Näidisfoto“. Silt kaob, kui photos.ts-is
 * on placeholder: false.
 */
export function Photo({ photo, sizes, priority, className = "", imgClassName = "" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-surface-hover ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        priority={priority}
        sizes={sizes}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {photo.placeholder && (
        <span className="absolute bottom-3 left-3 rounded-sm bg-surface/90 px-2 py-1 text-xs text-muted">
          Näidisfoto
        </span>
      )}
    </div>
  );
}
