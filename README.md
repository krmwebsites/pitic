# Pitic – ruumide rent Keila keskväljakul

Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript. Disain põhineb
disaini-handoffil (`PITIC-DESIGN-SPEC.md`, `design-tokens.css`, `content.json`,
reference-mockup) ja lehestruktuur layout-artifactil (avaleht, ruumid, ruum + broneerimine,
kontakt).

## Käivitamine

```bash
npm install
npm run dev
```

Kontroll enne avaldamist:

```bash
npx tsc --noEmit && npm run lint && npm run build
```

## Struktuur

| Koht | Sisu |
| --- | --- |
| `src/content/content.json` | Heaks kiidetud eestikeelne sisu (handoffist, muutmata). |
| `src/lib/site.ts` | Kontaktandmed, lahtiolekuajad, menüü. |
| `src/lib/rooms.ts` | Kolm ruumi: nimed ja mahutavus content.json-ist, lühikirjeldused. |
| `src/lib/photos.ts` | Kõik fotod ja nende `placeholder`-olek. |
| `src/lib/booking.ts` | Broneerimise avalik seadistus ja API tüübid. |
| `src/lib/server/simplybook.ts` | SimplyBook.me API klient (ainult server, API-võti). |
| `src/app/api/booking/` | Otspunktid: saadavus ja broneeringu loomine. |
| `src/components/booking/` | Broneerimine: otsing (`booking-search`), ühe ruumi kaart (`booking-flow`), jagatud sammud ja vorm. |
| `src/components/reactbits/` | React Bits komponendid (Blur Text, Count Up), kohandatud meie tokenitele; sõltuvus `motion`. |
| `src/app/` | Lehed: `/` (hero + ruumid `#ruumid`), `/ruumide-rent/[ruum]`, `/broneerimine`, `/kontakt`, `/privaatsus`, `/kasutustingimused`. `/ruumide-rent` suunatakse `/#ruumid`. |
| `public/brand/` | Ametlik logo (originaal, päise lõige ilma tagline'ita, valge versioon footerisse). |
| `public/fotod/` | Fotod: ruumide galeriid (5 vaadet ruumi kohta) ja avalehe hero (näidis). |

## Fotod

Kaustas `public/fotod` on ruumide galeriid: `jousaal-1..5.webp`, `noupidamiste-ruum-1..5.webp`,
`suursaal-1..5.webp` (1536 × 1024, esimene on ruumi põhifoto kaartidel). Uue foto lisamiseks pane
fail kausta ja lisa alt-tekst vastavasse massiivi failis `src/lib/photos.ts`; fotode arv on vaba.

Avalehe hero-pilt `hero-space.webp` on veel **näidisfoto** (silt „Näidisfoto“). Enne avaldamist:

1. asenda see päris fotoga ja pane `src/lib/photos.ts`-is `placeholder: false`;
2. loo Open Graphi pilt päris fotoga (`src/app/opengraph-image.png`, 1200 × 630).

## Broneerimine

Broneerimisvaade on lehe enda kujunduses; saadavuse ja broneeringu teeb taustal SimplyBook.me
avaliku API kaudu. Vt [BOOKING-SETUP.md](BOOKING-SETUP.md). Ilma API-võtmeta näitab leht
varulahendust; arenduses saab kasutada `SIMPLYBOOK_MOCK=true` näidisaegu.

## Teadaolevad kohatäited

- Telefoninumber `123-456-7890` on handoffist saadud ajutine number.
- Sotsiaalmeedia linke ei ole, sest URL-e ei ole antud.
- Hinnad, tühistamistähtajad ja maksed seadistatakse SimplyBook.me-s, mitte lehel.

## Avaldamine Netlifysse

1. Lisa projekt GitHubi (või GitLabi/Bitbucketi) ja ühenda Netlifys *Add new site → Import an existing project*.
   Build command `npm run build`, publish directory `.next` (fail `netlify.toml` on olemas).
2. *Site configuration → Environment variables* alla lisa:

   | Muutuja | Demo väärtus |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Netlify saidi aadress, nt `https://pitic-demo.netlify.app` |
   | `NEXT_PUBLIC_SIMPLYBOOK_URL` | `https://pitictest.simplybook.it` |
   | `NEXT_PUBLIC_SIMPLYBOOK_SERVICE_JOUSAAL` | `2` |
   | `NEXT_PUBLIC_SIMPLYBOOK_SERVICE_NOUPIDAMISTE_RUUM` | `3` |
   | `NEXT_PUBLIC_SIMPLYBOOK_SERVICE_SUURSAAL` | `4` |
   | `SIMPLYBOOK_MOCK` | `true` demo ajaks; päris konto puhul `false` |
   | `SIMPLYBOOK_COMPANY` | `pitictest` (päris konto puhul uus login-nimi) |
   | `SIMPLYBOOK_API_KEY` | ainult päris konto puhul |

3. Deploy. Testrežiimis kannab broneerimine silti „Testrežiim“ ja päris broneeringuid ei tehta.
