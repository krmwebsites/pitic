# SimplyBook.me seadistamine Pitici veebilehele

Veebileht kasutab broneerimiseks SimplyBook.me ametlikku iframe-vidinat. Kogu
broneerimisloogika (saadavus, kestused, kinnitused, meeldetuletused, tühistamine,
Google Calendar, maksed) hallatakse SimplyBook.me halduses. Veebileht loeb
ainult vidina aadressi ja teenuste ID-d keskkonnamuutujatest.

Menüünimed allpool vastavad SimplyBook.me halduse ingliskeelsele liidesele ja
võivad uuendustega veidi muutuda.

## 1. Konto loomine

1. Loo konto aadressil <https://simplybook.me> (ettevõtte nimi: Pitic).
2. Ettevõtte aadress SimplyBook.me-s määrab broneerimislehe aadressi, näiteks
   `https://pitic.simplybook.it`. Seda aadressi läheb vaja sammus 9.
3. **Settings → Main configuration**
   - Timezone: `Europe/Tallinn`
   - Language: eesti keel, kui see on valikus. Kui ei ole, lülita sisse
     **Custom Features → Google Translate**, mis lisab broneerimislehele keelevaliku.
   - Company details: Keskväljak 15, Keila; telefon 123-456-7890; e-post info@pitic.eu.

## 2. Tööajad

**Settings → Working hours (Company)**: esmaspäevast reedeni 09:00–17:00,
laupäev ja pühapäev suletud. Erandpäevad (pühad, remont) lisa samas
**Special days** alt. Teenusepakkujate ajad (samm 4) pärivad vaikimisi ettevõtte ajad.

## 3. Teenused = ruumid

**Manage → Services**. Loo kolm teenust:

| Teenus            | Mahutavus | Soovituslik kestus |
| ----------------- | --------- | ------------------ |
| Jõusaal           | kuni 8    | 60 min             |
| Nõupidamiste ruum | kuni 12   | 60 min             |
| Suur saal         | kuni 50   | 60 min             |

Igal teenusel:

- **Duration**: põhikestus. Kui klient peab saama valida pikema aja, kasuta üht kahest:
  lisa sama ruumi kohta eraldi kestusega teenused (1 h, 2 h, pool päeva) või lülita
  sisse **Custom Features → Multiple bookings / Service duration**, mis lubab valida
  mitu järjestikust aega. Vali variant, mis on teile halduses mugavam.
- **Buffer time before/after**: ettevalmistus- ja koristusaeg broneeringute vahel.
- **Description**: lühike ruumi kirjeldus (kuvatakse vidinas).
- Hind jäta praegu `0` või tühjaks (vt samm 8).

Teenuse ID on nähtav teenuse muutmisvaate lingis (`.../service/edit/id/12` → `12`).
Kirjuta ID-d üles sammu 9 jaoks.

## 4. Teenusepakkujad = ruumid füüsiliste ressurssidena

**Manage → Service providers**. Loo iga ruumi kohta oma teenusepakkuja
(Jõusaal, Nõupidamiste ruum, Suur saal) ja seo iga teenus ainult oma ruumi
teenusepakkujaga. Ühel teenusepakkujal saab olla ühes ajavahemikus vaid üks
broneering, seega ei ole võimalik sama ruumi topelt broneerida, kolme erinevat
ruumi saab aga sama ajal broneerida.

Kui te ei soovi kliendile teenusepakkuja valikut näidata, lülita
**Settings → Booking website settings** alt sisse „Hide provider selection” või
„Any provider” vastavalt sellele, mis liideses saadaval on.

## 5. Related Resources (topeltbroneeringu tõkestus ruumi tasandil)

Lülita sisse **Custom Features → Related Resources** ja ava **Manage → Related resources**.

1. Loo iga ruumi kohta ressursigrupp: „Jõusaal (ruum)”, „Nõupidamiste ruum (ruum)”,
   „Suur saal (ruum)”.
2. Tüüp: **One per booking** (iga broneering vajab tervet ruumi), kogus **1**.
3. Seo iga ressursigrupp oma teenusega (samm 3). Alles pärast sidumist mõjutab
   ressurss saadavust.

Nii on ruum ühtaegu nii teenusepakkuja kui ka piiratud ressurss ja SimplyBook.me
ei luba kattuvaid broneeringuid ka siis, kui hiljem lisandub uusi teenuseid või
teenusepakkujaid.

## 6. Broneerimisvorm ja tingimused

- **Custom Features → Intake forms**: lisa väljad
  - „Osalejate arv” (number, kohustuslik; lisa juhis, et Jõusaal kuni 8,
    Nõupidamiste ruum kuni 12, Suur saal kuni 50),
  - „Sõnum või erisoov” (tekst, valikuline).
- Kliendi nimi, e-post ja telefon on vaikimisi kohustuslikud:
  **Settings → Booking website settings → Client fields** (telefon: required).
- **Custom Features → Terms and conditions**: lisa broneerimis- ja
  tühistamistingimused; klient peab need enne kinnitamist aktsepteerima.
- **Custom Features → Approve bookings**: broneering jääb staatusesse „ootab
  kinnitust”, kuni Pitic selle halduses kinnitab. Klient saab sellekohase teate.
- **Settings → Booking website settings → Cancellation policy**: määra, mitu
  tundi enne algust saab klient ise tühistada või aega muuta. Tühistamise ja
  muutmise link on kliendi kinnituskirjas.
- **Custom Features → Limit bookings / Minimum time before booking**: minimaalne
  etteteatamisaeg (nt 24 h).

## 7. Teavitused, meeldetuletused ja Google Calendar

- **Settings → Notifications (E-mail)**: lülita sisse kinnitus, muudatus,
  tühistamine ja meeldetuletus (nt 24 h enne). Tõlgi kirjade tekstid eesti keelde.
- **Custom Features → Google Calendar sync**: ühenda Pitici Google'i konto,
  vali kahesuunaline sünkroonimine (SimplyBook → Google ja Google → SimplyBook),
  et ka Google Calendarisse käsitsi lisatud sündmused blokeeriksid aja.

## 8. Maksed (Stripe) – praegu välja lülitatud

Ruumide hinnad ja Stripe'i konto puuduvad, seega jäävad maksed välja lülitatuks.
Kui hinnad on olemas:

1. **Manage → Services**: sisesta iga teenuse hind.
2. **Custom Features → Accept payments**: lülita sisse ja vali makseviisiks Stripe.
   Sisesta Stripe'i võtmed SimplyBook.me halduses, mitte veebilehe koodis.
3. Vali, kas klient maksab kogu summa broneerimisel või ainult osamakse:
   samas seadistuses on **Deposit / Partial payment** valik, kus saab määrata
   protsendi või kindla summa. Ülejäänu tasutakse hiljem (arve või kohapeal).
4. Soovi korral „Payment required to confirm booking”, et kinnitamata makse korral
   aeg vabaneks.

Veebilehel muudatusi teha ei ole vaja: vidin näitab maksesammu automaatselt.

## 9. Vidina ühendamine veebilehega

1. Kopeeri ettevõtte broneerimislehe aadress (samm 1) ja teenuste ID-d (samm 3).
2. Loo projekti juurkausta fail `.env.local` (`.env.example` põhjal):

   ```bash
   NEXT_PUBLIC_SIMPLYBOOK_URL=https://pitic.simplybook.it
   NEXT_PUBLIC_SIMPLYBOOK_SERVICE_JOUSAAL=1
   NEXT_PUBLIC_SIMPLYBOOK_SERVICE_NOUPIDAMISTE_RUUM=2
   NEXT_PUBLIC_SIMPLYBOOK_SERVICE_SUURSAAL=3
   ```

3. Majutuses (nt Vercel) lisa samad muutujad projekti seadetesse ja tee uus build.
4. Ava `/ruumide-rent/jousaal`, `/ruumide-rent/noupidamiste-ruum` ja
   `/ruumide-rent/suursaal` ning kontrolli, et kalender laeb ja õige ruum on
   eelvalitud.

Kuni `NEXT_PUBLIC_SIMPLYBOOK_URL` on tühi, näitab veebileht kalendri asemel
ausat varulahendust: broneerimine e-posti ja telefoni teel ning pakkumise päringu vorm.

Vidina värvid ja paigutus on määratud failis
`src/components/booking/simplybook-widget.tsx` (`theme_settings`). Kui SimplyBook.me
halduses on kujundatud oma teema, võib seal olevad väärtused üle võtta.

## 10. Testimine

1. Tee testbroneering igasse ruumi ja kontrolli, et sama ajale teist broneeringut
   teha ei saa.
2. Kontrolli kinnitus-, meeldetuletus- ja tühistuskirju (ka eestikeelseid tekste).
3. Kontrolli, et Google Calendarisse tekib sündmus ja et Google Calendaris
   lisatud sündmus blokeerib aja SimplyBook.me-s.
4. Vaata broneerimisvoog läbi telefonis.
