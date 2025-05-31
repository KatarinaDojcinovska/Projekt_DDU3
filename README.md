# Projekt_DDU3 GifCast -- Katarina Dojcinovska, Leith, Judy, Katarina Wällenhoff

GifCast är en webbaserad applikation som visar väderinformation i realtid och matchar vädret med relevanta GIF:ar. 
Användare kan registrera sig, logga in och spara sina favorit-GIF:ar kopplade till väder. Projektet är byggt med 
HTML, CSS, Javascript och Deno samt använder externa API:er för väder och GIF:ar.

För att starta upp applikationen: 
Öppna terminalen(git bash) i projektets rotmapp (där backend/server.js finns) och kör följande kommando: (deno run --allow-read --allow-write --allow-net backend/server.js)
Öppna hemsidan i webbläsaren och gå till: (http://localhost:8000/index.html). Här kan du registrera eller logga in som användare, se dagens väder och vädret 2 dagar framåt, se 
vädermatchade GIF:ar och spara eller ta bort GIF:ar som är kopplade till din användare

🧪 Så kör du testet
För att checka av att servern och funktionerna fungerar (t.ex. registrering, login, väder och GIF:ar), gör så här: 
Öppna terminalen i projektets rotmapp och kör: (deno run --allow-read --allow-write --allow-net backend/server.js)
Öppna testfilen i webbläsaren. Gå till mappen test/ i din dator och dubbelklicka på test.html för att öppna den i webbläsaren.
Alternativt, högerklicka på filen och välj "Öppna med > Webbläsare".
Du behöver inte öppna test.html via localhost. Den fungerar direkt eftersom den är en fristående testfil som använder fetch mot backend.

Felsökning - plats (location)
Om vädret inte visas och liknande visas under "Location" (Null Null Null), kan det bero på att webbläsaren har blockerat platsåtkomst.
Så här fixar du det:

Återställ platsbehörighet
Chrome:
1. Gå till (chrome://settings/content/location) och leta upp "localhost" eller din domän under "Tillåt" eller "Blockera". 
2. Klicka på 🗑️ papperskorgen för att ta bort inställningen.
3. Ladda om sidan, du ska nu få en ny platsfråga!

🦊 Firefox:
1. Gå till about:preferences#privacy i adressfältet.
2. Scrolla ner till Behörigheter > Plats och klicka på Inställningar...
3. Ta bort localhost från listan.
4. Ladda om sidan – du får en ny platsförfrågan.

🍏 Safari (Mac)
1. Gå till Safari > Inställningar > Webbplatser > Plats.
2. Leta upp din sida och välj “Fråga” eller “Tillåt”.
3. Ladda om sidan.

🛑 Inget händer?
1. Kontrollera att du kör servern med rätt rättigheter: (deno run --allow-read --allow-write --allow-net backend/server.js)
2. Kontrollera att du använder en modern webbläsare (Chrome, Firefox, Safari).
3. Använd http://localhost:8000/index.html, inte direkt från filsystemet (file:// fungerar inte med geolocation).



