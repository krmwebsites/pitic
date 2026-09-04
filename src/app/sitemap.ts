import type { MetadataRoute } from "next";
import { roomHref, rooms } from "@/lib/rooms";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    ...rooms.map((room) => roomHref(room.slug)),
    "/broneerimine",
    "/kontakt",
    "/privaatsus",
    "/kasutustingimused",
  ];
  return pages.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/privaatsus") || path.startsWith("/kasutus") ? 0.3 : 0.8,
  }));
}
