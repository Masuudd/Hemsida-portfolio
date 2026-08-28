# Masuud Ali — Portfolio

En personlig portfolio-hemsida byggd med rent HTML, CSS och JavaScript
(inga ramverk, inget backend). Fungerar direkt på GitHub Pages.

## Filstruktur

```
portfolio/
├── index.html      Sidans struktur och innehåll
├── style.css        Allt utseende (färger, layout, animationer)
├── script.js        All interaktivitet (meny, formulär och animationer)
├── profile.jpg      Din profilbild
└── README.md        Den här filen
```

## Hur jag lägger till min profilbild

1. Döp din bildfil till exakt `profile.jpg` (skiftlägeskänsligt — inte `Profile.JPG`).
2. Lägg filen i samma mapp som `index.html`.
3. Klart — `index.html` letar automatiskt efter `profile.jpg`.
4. Om filen saknas visas istället automatiskt dina initialer ("MA") i en cirkel, så sidan ser fortfarande bra ut.

## Hur jag ändrar mitt namn

Sök (Ctrl+F i VS Code) efter `Masuud Ali` i `index.html` och byt ut mot ditt namn.
Byt även `MASUUD ALI` i loading-skärmen och `MA` i loggan (`<a class="logo">`).

## Hur jag ändrar personlig information

I `index.html` finns tydliga platshållare inom hakparenteser, t.ex.:

- `[DIN TITEL]` — din yrkestitel, t.ex. "Student & blivande utvecklare"
- `[DIN SKOLA]` — namnet på din skola
- `[DIN UTBILDNING]` — vad du studerar
- `[DITT FOKUS]` — ditt fokusområde
- `[DITT TELEFONNUMMER]` — ditt telefonnummer
- `[DIN GITHUB]` — länk till din GitHub-profil
- `[DIN LINKEDIN]` — länk till din LinkedIn-profil
- `[DIN BESKRIVNING]` — din "Om mig"-text

Sök på varje platshållare (Ctrl+F) och ersätt med din egen text.
Din e-post (`Masuud5@gmail.com`) är redan ifylld på rätt ställen.

## Hur jag lägger till fler projekt

Kopiera ett helt `<article class="project-card">...</article>`-block i
projekt-sektionen i `index.html`, klistra in det som ett nytt kort, och byt ut
titel, beskrivning, tekniker och länkar. Du kan ha hur många kort som helst —
de radar upp sig automatiskt i rutnätet.

## Hur jag kopplar kontaktformuläret till Formspree

Se avsnittet **"Formspree — steg för steg"** längre ner i den här filen.

## Hur jag testar hemsidan lokalt

Öppna `index.html` genom att dubbelklicka på filen — den öppnas då direkt i
din standardwebbläsare. Du kan testa hela sidan så här, utan internet
(förutom Google Fonts-typsnitten, som kräver internetuppkoppling).

## Hur jag deployar till GitHub Pages

Se avsnittet **"Git och GitHub — steg för steg"** längre ner i den här filen.

---

# Git och GitHub — steg för steg

Du har redan: ett GitHub-konto, Git installerat, och VS Code med projektet öppet.

**1. Öppna terminalen i VS Code**
Tryck `Ctrl+ \`` (backtick). Terminalen öppnas automatiskt i din projektmapp.

**2. Kontrollera att filerna finns**
```
dir
```
Du ska se `index.html`, `style.css`, `script.js`, `README.md` och mappen `assets`.

**3. Starta Git lokalt**
```
git init
```
Skapar en "loggbok" som håller koll på ändringar i mappen.

**4. Lägg till alla filer**
```
git add .
```
Säger "ta med allt i mappen till nästa sparade ögonblick".

**5. Spara ett första "foto" av projektet**
```
git commit -m "Första versionen av min portfolio"
```
Om Git klagar om saknat namn/e-post, kör:
```
git config --global user.name "Ditt Namn"
git config --global user.email "din@email.se"
```
och upprepa steg 4–5.

**6. Se till att huvudgrenen heter "main"**
```
git branch -M main
```

**7. Skapa ett repository på GitHub**
Gå till github.com → **New repository** → döp det till
`ditt-användarnamn.github.io` (byt ut mot ditt riktiga användarnamn,
exakt stavat) → **Create repository**. Bocka INTE i "Add a README".

**8. Koppla din lokala mapp till GitHub-repot**
GitHub visar en rad som liknar denna (kopiera din egen från github.com):
```
git remote add origin https://github.com/ditt-användarnamn/ditt-användarnamn.github.io.git
```

**9. Skicka upp koden**
```
git push -u origin main
```
Du kan behöva logga in med ett **Personal Access Token** istället för lösenord
(Settings → Developer settings → Personal access tokens på github.com).

**10. Kontrollera på GitHub**
Gå till `github.com/ditt-användarnamn/ditt-användarnamn.github.io` — dina filer
ska synas där.

**11. Aktivera GitHub Pages**
Repots **Settings → Pages** → kontrollera att **Source** är satt till
`main`-branchen, rotmappen (`/`). Om repot heter `användarnamn.github.io`
aktiveras sidan oftast automatiskt.

**12. Hitta din live-URL**
```
https://ditt-användarnamn.github.io
```
Vänta 1–2 minuter efter push innan sidan uppdateras.

**13. Uppdatera sidan senare**
Varje gång du ändrar något lokalt, kör i terminalen:
```
git add .
git commit -m "Beskrivning av vad du ändrade"
git push
```
Ändringarna syns på din live-sida efter någon minut.

---

# Formspree — steg för steg

Formspree tar emot formulärdata från din statiska sida och mejlar den vidare
till dig — helt utan att du behöver ett eget backend.

**1. Gå till** [formspree.io](https://formspree.io)

**2. Skapa ett konto** (gratis) med din e-post.

**3. Skapa ett nytt formulär**
Klicka **"New Form"**, ge det ett namn, t.ex. "Portfolio-kontakt".

**4. Ange din mottagaradress**
Ange `Masuud5@gmail.com` som mottagande e-post för formuläret.

**5. Hitta ditt Form ID**
Formspree visar en kodrad som liknar:
```
<form action="https://formspree.io/f/abc1234" method="POST">
```
Delen `abc1234` är ditt Form ID.

**6. Ersätt YOUR_FORM_ID i din kod**
Öppna `index.html`, sök (Ctrl+F) efter `YOUR_FORM_ID`, och byt ut mot ditt
riktiga ID. Raden ska sluta se ut ungefär så här:
```
action="https://formspree.io/f/abc1234"
```

**7. Testa formuläret**
Publicera sidan (se Git-guiden ovan), öppna den live, fyll i formuläret och
skicka ett testmeddelande.

**8. Vad händer när någon skickar ett meddelande?**
Formspree tar emot datan, skickar ett mejl till `Masuud5@gmail.com`, och
skickar tillbaka ett svar som `script.js` läser av för att visa antingen
"Tack! Ditt meddelande har skickats." eller ett felmeddelande.

**9. Bekräfta ditt formulär**
Första gången någon skickar ett meddelande kan Formspree skicka ett
bekräftelsemejl till dig — du måste bekräfta formuläret innan det börjar
vidarebefordra meddelanden skarpt.

**10. Felsökning**
- Kontrollera att `YOUR_FORM_ID` verkligen är utbytt.
- Kontrollera att du är på den gratis-nivå som tillåter din mängd
  meddelanden per månad.
- Öppna webbläsarens konsol (F12) och se om något felmeddelande visas
  vid inskickning.
- Kontrollera din skräppost om mejlen inte dyker upp i inkorgen.

---

Lycka till med din portfolio! 🚀
