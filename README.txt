FURKAPASS SOUVENIRS – KÉSZLET APP
==================================

Ez a csomag mindent tartalmaz, ami kell az újratelepítéshez:
- index.html      (maga az app)
- manifest.json    (PWA telepíthetőség)
- service-worker.js (offline működés)
- icons/           (app ikonok)

--------------------------------------------------
1) CSOMAG KICSOMAGOLÁSA
--------------------------------------------------
Csomagold ki ezt a zip-et egy tetszőleges mappába, pl.:
Dokumentumok / Souvenir készlet

--------------------------------------------------
2) MEGNYITÁS VS CODE-BAN
--------------------------------------------------
VS Code → File → Open Folder → válaszd ki a kicsomagolt mappát.
Látnod kell: index.html, manifest.json, service-worker.js, icons mappa.

--------------------------------------------------
3) TERMINÁL MEGNYITÁSA
--------------------------------------------------
VS Code-ban: Terminal menü → New Terminal
(vagy Ctrl+ő billentyűkombináció)

--------------------------------------------------
4) NODE.JS ELLENŐRZÉSE (ha még nincs telepítve)
--------------------------------------------------
node -v
Ha hibát ír, töltsd le: https://nodejs.org (LTS verzió), telepítsd,
majd indítsd újra a VS Code-ot.

--------------------------------------------------
5) VERCEL CLI TELEPÍTÉSE
--------------------------------------------------
npm install -g vercel

--------------------------------------------------
6) BEJELENTKEZÉS
--------------------------------------------------
vercel login
(Megadod az e-mail címed, a levélben kapott linkre kattintasz,
a terminál automatikusan visszaigazolja.)

--------------------------------------------------
7) TELEPÍTÉS
--------------------------------------------------
A projekt mappában (ahol az index.html van):

vercel

Kérdések és válaszok:
  Set up and deploy?        -> Enter (igen)
  Which scope?               -> a saját fiókod / csapatod
  Link to existing project?  -> N   (ha teljesen újrakezded)
                                 VAGY válaszd a meglévő "souvenir-keszlet"
                                 projektet, ha csak frissíteni akarod
  Project's name?            -> pl. souvenir-keszlet
  Code directory?             -> Enter (marad ./)
  Customize settings?         -> N / Enter

A végén kapsz egy előnézeti linket (xxxxx.vercel.app).

--------------------------------------------------
8) ÉLESÍTÉS
--------------------------------------------------
vercel --prod

Ez adja a végleges, stabil linket, amit a telefonon telepítesz.
Ha korábban már volt "souvenir-keszlet" nevű projekted, ugyanaz
a link marad: souvenir-keszlet.vercel.app

--------------------------------------------------
9) TELEFONRA TELEPÍTÉS
--------------------------------------------------
Nyisd meg a linket a telefon böngészőjében (Chrome/Safari).
iPhone:   Megosztás -> "Kezdőképernyőhöz adás"
Android:  Menü (⋮) -> "Telepítés" / "Hozzáadás a kezdőképernyőhöz"

--------------------------------------------------
HA KÉSŐBB MÓDOSÍTASZ VALAMIT
--------------------------------------------------
Csak ennyi kell a projekt mappájában:

vercel --prod

A telefonon utána ZÁRD BE TELJESEN az appot (ne csak háttérbe tedd),
majd nyisd meg újra internetkapcsolattal, hogy a friss verziót töltse le.

--------------------------------------------------
FONTOS TUDNIVALÓ
--------------------------------------------------
Az adatok (készlet, eladások, fotók) a TELEFON/BÖNGÉSZŐ saját
tárolójában vannak, eszközönként külön. Ha törlöd a böngésző
adatait vagy lecseréled a telefont, az adatok elvesznek – ha
fontos, időnként érdemes a Napló fület átnézni / lefotózni.
