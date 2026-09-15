# CU MainWerk – Website

Statische Website für CU MainWerk / Demirel & Er GbR in Goldbach.
HTML, CSS und JavaScript ohne Build-Schritt oder externe UI-Bibliotheken.

## Vorschau und Veröffentlichung

Die Website aus dem Repository-Hauptverzeichnis mit einem lokalen HTTP-Server öffnen.
Beispiel: `python -m http.server 8000`, anschließend `http://localhost:8000`.
Für GitHub Pages müssen die Dateien einschließlich Unterordnern unverändert im
Veröffentlichungsverzeichnis liegen. `CNAME` behält die Domain `cu-mainwerk.de`.
Die Übernahme eines Änderungsbranches in den für Pages eingestellten Branch kann
die öffentliche Website aktualisieren. Vorher Vorschau und Firmenangaben prüfen.

## Aufbau

- `index.html`: Startseite, Leistungen, Projektbilder, Kontakt und FAQ.
- `style.css` / `script.js`: responsive Darstellung, Menü, Bildvergleich, Filter,
  Bildvergrößerung, Formular und Cookie-Auswahl.
- `impressum.html`, `datenschutz.html`: separate Informationsseiten.
- `danke.html`, `404.html`: Bestätigungs- und Fehlerseite.
- `images/brand`: vorhandenes transparentes Firmenlogo aus dem Firmen-Chat.
- `images/optimized`: lokal verkleinerte WebP-Varianten vorhandener Projektfotos.
- `assets/fonts`: lokal bereitgestellte Manrope-Schrift mit OFL-Lizenz.

Originalbilder sowie ältere v1/v2-Dateien bleiben zur Nachvollziehbarkeit erhalten.
Die neue Website bindet diese alten HTML-/CSS-/JS-Versionen nicht ein.
Projektbilder wurden nicht künstlich verändert; Größe und Dateiformat wurden optimiert.
Es wurden keine privaten Screenshots aus anderen Chats veröffentlicht.

## Kontaktformular

Empfänger bleibt `mainwerkcu@gmail.com` über FormSubmit. Pflichtfelder und
Datenschutzcheckbox werden im Browser geprüft. Mit JavaScript ist der Sendenknopf
bis zur Bestätigung gesperrt. Ohne JavaScript greift die native Pflichtfeldprüfung.
Zusätzlich: verstecktes `_honey`-Feld und aktivierte Standard-reCAPTCHA-Prüfung des
Dienstes (die bisherige Einstellung `_captcha=false` wurde entfernt).

Ein Browser-Häkchen ist kein serverseitiger Spamschutz. Direkte, manipulierte
Anfragen können Browserprüfungen umgehen; absolute Spamfreiheit ist nicht zugesagt.
Für eigene serverseitige Prüfungen und Ratenbegrenzung wäre ein zusätzlicher
Backend-Endpunkt nötig. GitHub Pages führt keinen solchen Servercode aus.
FormSubmit kann eine Bestätigung des Empfängerpostfachs verlangen. Die tatsächliche
Zustellung und dessen Sicherheitsprüfung müssen nach Veröffentlichung einmal mit
einer eigenen echten Anfrage geprüft werden. Lokale Tests versenden keine E-Mail.

## Statistik und Datenschutz

Google Analytics `G-N915KNK197` wird nur nach aktivem Opt-in und ausschließlich auf
der Produktionsdomain geladen. Die Auswahl gilt höchstens 180 Tage; sie lässt sich
im Seitenfuß ändern. Bei nicht verfügbarem Browserspeicher funktioniert die Auswahl
für den aktuellen Seitenaufruf. Widerruf sperrt weitere Analytics-Aufrufe und entfernt
erreichbare `_ga`-Cookies. Ohne Zustimmung werden keine Statistikskripte eingebunden.
Fonts und Bilder sind lokal. Das Formular lädt seinen externen Dienst beim Absenden.

Firmenangaben stammen aus der bisherigen Website. Die Informationsseiten beschreiben
die neue technische Umsetzung und sind keine individuell geprüfte Rechtsberatung;
Verantwortliche müssen ihre Angaben, Dienstleistervereinbarungen und tatsächlichen
Verarbeitungsabläufe vor Veröffentlichung bestätigen.

## Prüfung

Geprüft werden HTML-Dateipfade, IDs, Bildabmessungen und JavaScript-Syntax sowie im
Browser mobile/Tablet/Desktop-Darstellung, Navigation, Bildvergleich, Filter,
Dialogbedienung, Cookie-Auswahl und lokale Formularübermittlung. Kein Test sendet
Nachrichten an den echten Empfänger. Die Umstellung verändert die öffentliche
Website erst nach Veröffentlichung über GitHub Pages.
