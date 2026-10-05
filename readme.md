# Diafragma-Flutter Website

Professionele, gratis website voor bewustwording over diafragma-flutter.

Gebaseerd op de **eerste schone opzet**, aangevuld met alle gevraagde functies.

## Pagina’s
- **Home** – introductie + afbeelding van het middenrif
- **Over de aandoening** – symptomen, oorzaken, vormen, behandeling + bronnen
- **Publicaties** – artikelen met steekwoorden en links naar de bron
- **Filmpjes** – voorbeeldvideo’s
- **Verhalen** – ervaringen + formulier
- **Gasten** – specialisten / organisaties
- **Links** – nuttige websites met korte omschrijving
- **Contact** – contactformulier (berichten via Netlify Forms naar de beheerder)

## Toegevoegde functies
1. Afbeelding middenrif op homepage  
2. Geanimeerd menu (bewegende onderstreping)  
3. Pagina Filmpjes met voorbeeldvideo’s  
4. Bronvermelding bij teksten  
5. Taalkeuze NL ↔ EN  
6. Bewerkinstructies alleen in **BEHEER.md** (niet op de site)  
7. Beveiligings-meta + veilig formulier  
8. SEO (robots.txt, sitemap, meta, structured data)

## Structuur
- `public/` – de website zelf (wordt gepubliceerd)
- `netlify/functions/` – API voor verhalen en beheer
- `db/` en `netlify/database/migrations/` – Netlify Database (Postgres) voor ingestuurde verhalen

## Beheer
Alle instructies om teksten, publicaties en gasten toe te voegen staan in **BEHEER.md**.
