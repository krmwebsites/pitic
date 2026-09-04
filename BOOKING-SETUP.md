# Broneerimise seadistus (SimplyBook.me API)

Broneerimisvaade on lehe enda kujunduses (kalender, vabad ajad, andmed, kinnitus).
Taustal teeb kõik SimplyBook.me: saadavus, broneeringu loomine, kinnitus- ja
meeldetuletuskirjad, tühistamine, hinnad ja maksed. Leht suhtleb SimplyBookiga
ainult serveris (`src/lib/server/simplybook.ts`), API-võti brauserisse ei jõua.

## 1. Andmed, mida leht vajab

Fail `.env.local` (kohalikult) või serveri keskkonnamuutujad (avaldamisel):

```bash
# Avalik (jõuab brauserisse, ei ole salajane)
NEXT_PUBLIC_SIMPLYBOOK_URL=https://pitictest.simplybook.it
NEXT_PUBLIC_SIMPLYBOOK_SERVICE_JOUSAAL=2
NEXT_PUBLIC_SIMPLYBOOK_SERVICE_NOUPIDAMISTE_RUUM=3
NEXT_PUBLIC_SIMPLYBOOK_SERVICE_SUURSAAL=4

# Ainult server (salajane)
SIMPLYBOOK_COMPANY=pitictest
SIMPLYBOOK_API_KEY=<API-võti>
SIMPLYBOOK_MOCK=false
```

**Kust API-võti tuleb.** SimplyBook.me haldus → *Custom Features* (Kohandatud
funktsioonid) → otsi **API** → *Enable*. Seejärel *Settings* → *API* (või sama
funktsiooni seadete leht) näitab välja **API key**. Kopeeri see täpselt. Võti annab
ligipääsu avalikule API-le (teenused, vabad ajad, broneerimine), mitte admini andmetele.

**Company login** on aadressi algus: `pitictest` aadressist `https://pitictest.simplybook.it`.

**Teenuse ID** on halduses *Manage → Services* teenuse muutmisel aadressiriba lõpus
olev number (`#services/edit/2`).

## 2. Arendusrežiim ilma kontota

`SIMPLYBOOK_MOCK=true` näitab näidisaegu (tööpäevad, mõned kellaajad) ja
„broneerib“ ilma SimplyBooki poole pöördumata. Lehel on siis nähtav silt
„Testrežiim“. Ära lülita seda kunagi sisse avalikus keskkonnas.

## 3. Kuidas leht SimplyBooki kasutab

| Leht | SimplyBook.me API |
| --- | --- |
| Kalender ja vabad ajad | `getStartTimeMatrix(from, to, serviceId, unitId)` kuu kaupa |
| Kestus ja hind | `getEventList` (teenuse `duration`, `price`, `currency`) |
| Broneering | `book(serviceId, unitId, date, time, {name, email, phone}, {note})` |
| Lõpuaeg kinnituses | `calculateEndTime` |

Otspunktid lehes: `GET /api/booking/availability?service=&from=&to=` ja `POST /api/booking`.
Iga ruum on SimplyBookis eraldi teenus ja teenusel on üks teenusepakkuja (ruum ise),
seega saab ruumi samale ajale broneerida ainult üks kord.

## 4. Mida seadistada SimplyBook.me halduses

Täielik juhend: [docs/simplybook-seadistus.md](docs/simplybook-seadistus.md). Lühidalt:

- *Settings → General*: ajavöönd Europe/Tallinn, keel eesti;
- *Settings → Working hours*: esmaspäevast reedeni 09:00–17:00;
- *Manage → Services*: Jõusaal, Nõupidamiste ruum, Suur saal; kestus, etteteatamise aeg,
  puhveraeg ja tühistamisreeglid teenuse seadetes;
- *Manage → Providers*: üks pakkuja ruumi kohta, seotud õige teenusega;
- kinnitus- ja meeldetuletuskirjad eesti keeles; soovi korral admini kinnitus
  (siis näitab leht „Broneering on vastu võetud“ ja kinnitus tuleb e-postiga);
- Google Calendar kahesuunaline sünkroonimine;
- hind teenusele ja Stripe alles siis, kui hinnad on teada. Kui teenusel on hind,
  kuvab leht selle automaatselt real „Kokku“.

## 5. Lehe olekud

- **Seadistamata** (API-võti puudub, mock väljas): kontaktivariant.
- **Ruum ühendamata** (teenuse ID puudub): sama ruumi kohta kontaktivariant.
- **Laadimine**: „Laadime vabu aegu…“, kalender ootab.
- **SimplyBook ei vasta**: veateade, „Proovi uuesti“ ja kontaktid.
- **Aeg vahepeal broneeritud**: teade ja tagasi kalendrisse värske saadavusega.
