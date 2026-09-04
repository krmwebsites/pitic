import content from "@/content/content.json";

/**
 * Heaks kiidetud eestikeelne sisu (handoffi content.json). Kogu lehe tekst
 * tuleb siit; koodi ei kirjutata teksti, mida siin ei ole, välja arvatud
 * ruumide lühikirjeldused failis rooms.ts ja tehnilised olekuteated.
 */
export { content };
export type Content = typeof content;
