# Beheerhandleiding – alleen voor jou (niet gepubliceerd)

Dit bestand staat buiten de map `public/` en is dus **niet** zichtbaar op de website.

## Mappenstructuur

| Map / bestand | Inhoud |
|---|---|
| `public/` | Alles wat op de website staat (HTML-pagina's, `style.css`, `script.js`, `images/`) |
| `public/images/middenrif.png` | Afbeelding van het middenrif op de homepage |
| `netlify/functions/` | Serverfuncties voor de verhalen (`stories.mts`) en het beheer (`admin-stories.mts`) |
| `db/` + `netlify/database/migrations/` | Database-opzet voor de ingestuurde verhalen |
| `netlify.toml` | Instellingen voor Netlify (welke map gepubliceerd wordt, beveiligingsheaders) |

---

## 1. Eenmalig instellen (doe dit eerst)

### a. Wachtwoord voor het verhalenbeheer
1. Ga in Netlify naar je project → **Project configuration → Environment variables**.
2. Klik **Add a variable** → naam: `ADMIN_PASSWORD`, waarde: een sterk wachtwoord dat alleen jij kent.
3. Ga naar **Deploys** → **Trigger deploy → Deploy project** zodat het wachtwoord actief wordt.

### b. Contactberichten naar je eigen mailbox
Het contactformulier gebruikt Netlify Forms. Je e-mailadres staat nergens in de website-code, dus bezoekers kunnen het niet zien. Netlify stuurt elk bericht door naar je mailbox:
1. Ga in Netlify naar **Project configuration → Notifications → Emails and webhooks**.
2. Klik bij **Form submission notifications** op **Add notification → Email notification**.
3. Vul je eigen e-mailadres in, kies bij *Form* het formulier **contact** en klik **Save**.

Klik je in de mail op **Beantwoorden**, dan gaat je antwoord direct naar het e-mailadres dat de bezoeker invulde.
Alle berichten zie je ook terug in Netlify onder **Forms → contact**. Kijk ook af en toe in de map **Spam** daar.

---

## 2. Verhalen beheren (dagelijks gebruik)

**Zo werkt het voor bezoekers:** ze vullen onderaan de pagina *Verhalen* het formulier in. Het verhaal wordt opgeslagen maar is **nog niet zichtbaar** totdat jij het goedkeurt.

**Zo keur je een verhaal goed:**
1. Ga naar `https://<jouw-site>/beheer-verhalen.html` (deze pagina staat niet in het menu en wordt niet door Google geïndexeerd).
2. Log in met het wachtwoord uit stap 1a.
3. Je ziet standaard de lijst **Te beoordelen**. Per verhaal zie je naam, rol, datum, het verhaal en (als ingevuld) het e-mailadres van de inzender – dat e-mailadres is alleen voor jou.
4. Kies per verhaal:
   - **Goedkeuren en plaatsen** → het verhaal staat direct op de pagina Verhalen.
   - **Verwijderen** → het verhaal wordt definitief gewist (je krijgt eerst een bevestigingsvraag).
5. Via de knoppen bovenaan wissel je tussen **Te beoordelen**, **Geplaatst** en **Alles**.
6. Een geplaatst verhaal weer offline halen? Ga naar **Geplaatst** en klik **Offline halen**.
7. Klaar? Klik **Uitloggen**. (Sluit je de browser, dan word je ook automatisch uitgelogd.)

Foutmeldingen bij inloggen:
- *Onjuist wachtwoord* → controleer het wachtwoord in Netlify.
- *Er is nog geen beheerderswachtwoord ingesteld* → stap 1a is nog niet gedaan of er is nog niet opnieuw gedeployed.

---

## 3. Inhoud aanpassen

### Link toevoegen (pagina Links)
Open `public/links.html` → kopieer een blok `<article class="link-card">…</article>` en pas aan:
- `href="…"` → het webadres
- het label (`link-tag`), bijv. *Wetenschap*, *Patiëntinformatie* of *Organisatie*
- de titel en de korte omschrijving, in het Nederlands (`lang-nl`) én Engels (`lang-en`)
- de domeinnaam onderaan (`link-url`)

### Publicatie toevoegen
Open `public/publicaties.html` → kopieer een `<article class="publication">…</article>` → pas titel, meta, samenvatting, tags en link aan.

### Voorbeeldverhaal aanpassen of verwijderen
Open `public/verhalen.html` → de blokken `<article class="story story-example">` onder *Voorbeeldverhalen*. Verwijder ze gerust zodra er echte verhalen zijn.

### Gast toevoegen
Open `public/gasten.html` → kopieer een `<div class="guest-card">…</div>`.

### Afbeelding homepage vervangen
Zet een nieuwe afbeelding in `public/images/` en pas in `public/index.html` de regel met `middenrif.png` aan. De afbeelding wordt automatisch verkleind en als snel WebP-bestand geleverd.

### Kleuren / animaties
Open `public/style.css` → verander de variabelen bovenaan (`--primary`, `--accent` enz.).

### Domeinnaam invullen (SEO)
Vervang `https://jouwdomein.nl` door je echte adres in `public/sitemap.xml`, `public/robots.txt` en de canonical-tag in `public/index.html`.

---

## Beveiliging
- HTTPS staat standaard aan op Netlify.
- Ingestuurde verhalen worden pas openbaar na goedkeuring; e-mailadressen worden nooit getoond.
- Formulieren hebben een verborgen spamval (honeypot).
- Beveiligingsheaders (clickjacking, MIME-sniffing, referrer) staan in `netlify.toml`.
