# CU MainWerk

Statische Unternehmenswebsite von Demirel & Er GbR: https://cu-mainwerk.de

## Aufbau

- `index.html`: Leistungen, Projektgalerien und Kontaktformular.
- `danke.html`: Bestätigung nach dem Kontaktformular.
- `impressum.html`, `datenschutz.html`, `404.html`: ergänzende Seiten.
- `style.css`, `script.js`: gemeinsames Design und Interaktionen.
- `images/projekte/`: 33 Projektfotos in je zwei WebP-Größen (560/1200 px).
- `images/brand/`: verwendetes Logo.
- `assets/icons/`, `favicon.ico`: CU-Favicon und Apple-Touch-Icon.
- `assets/fonts/`: lokal eingebundene Schrift mit Lizenz.
- `CNAME`, `robots.txt`, `sitemap.xml`: Domain und Suchmaschinen.

## Cookies und Kontakt

Google Analytics wird ausschließlich auf der Produktionsdomain und erst nach ausdrücklicher Zustimmung geladen. Die Auswahl wird für höchstens 180 Tage lokal gespeichert. Über „Cookie-Einstellungen“ im Seitenfuß lässt sie sich ändern; ein Widerruf gilt auch für andere geöffnete Seiten derselben Domain. Ohne Zustimmung bleiben optionale Statistiken deaktiviert.

Das Kontaktformular verwendet FormSubmit mit Datenschutzhinweis, Pflichtfeldern und Spam-Schutz. Echte Formularsendungen lösen E-Mails aus.

## Entwicklung und Veröffentlichung

Kein Build-Schritt erforderlich. Zur Vorschau einen lokalen HTTP-Server im Repository starten, z. B. `python -m http.server 8766`.

GitHub Pages veröffentlicht den freigegebenen Stand von `main`. Vor dem Zusammenführen Änderungen mobil und am Desktop prüfen, Bildverweise kontrollieren und die Cookie-Auswahl testen. Danach den Pages-Lauf und die Live-Seite prüfen.

Alte Versionen und ungenutzte Medien gehören nicht in den veröffentlichten Dateibaum; frühere Stände bleiben in der Git-Historie verfügbar.
