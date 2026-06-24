# **HTWG-Dashboard**

**Team:** 
* Alexander Bille (310855)
* Luca Meier (313655)
* Elischa Ediger (310358)

**repository:** 
[github.com/LuElMei/htwg-dashboard](https://github.com/LuElMei/htwg-dashboard)

**Frontend-Setup:**
```bash
cd react\htwg-dashboard-react
npm install
npm run dev
```
Die App laeuft dann unter http://localhost:5173.
Der Build wurde mit `npm run build` geprueft.

**Backend-Setup (zweites Terminal):**
```bash
cd backend
npm install
npm run prisma:generate
npm run db:migrate
npm run dev
```
Das Backend laeuft dann unter http://localhost:3000.

**Testuser:**
```text
Username: testuser
Passwort: test1234
```

**Tests:**
```bash
cd backend
npm test
```

**Projektidee:**

> Eine Web App die wichtige Informationen rund um die Hochschule HTWG-Konstanz zusammenfasst. Als Beispiel enthält die Web App den Stundenplan, das Mensamenü etc. . Die Idee kam, weil alle Informationen, rund um die HTWG-Konstanz, über mehrere Websiten verteilt sind.

**Meilenstein_1**
| Kriterium | Datei | Zeile / Hinweis |
| :--- | :--- | :--- |
| **Sematische HTML-Struktur** | dashboard.html | ... |
| **Formular mit Labels** | index.html | Z. 22, 27 |
| **Responsive Layout** | style.css | Z. 113-121 |
| **Media Query** | style.css | Z. 297-386 u. Z. 463-468 |
| **URL-Struktur** | index.html | Pfade: \htwg-dashboard\index.html |

**Meilenstein_2**
| Kriterium | Datei | Zeile / Hinweise |
| :--- | :--- | :--- |
| **npm + Vite** | react/htwg-dashboard-react/package.json, react/htwg-dashboard-react/vite.config.ts | Projektordner |
| **TypeScript aktiv genutzt** | src/types.ts, src/components/mensa/MensaCard.tsx | Z. 18-25, Z. 3-6 |
| **Komponentenzerlegung** | src/components/ | library, mensa, timetable |
| **Props-Übergabe** | src/App.tsx | Z. 68-81 |
| **useState** | src/App.tsx, src/components/mensa/MensaPage.tsx | App-State Z. 15, 28-55; Mensa-Filter Z. 12 |
| **useEffect** | src/App.tsx | Z. 17-25 |
| **Eigener Beitrag Elischa** | src/components/mensa/MensaPage.tsx, src/App.css | Mensa-Kategoriefilter: TS-Typ Z. 9, State Z. 12, Filterlogik Z. 24-26, Buttons Z. 33-44, Styling Z. 582-603 |
| **Durchgängige Nutzeraktion** | src/components/LoginPage.tsx | Benutzername, Passwort -> Name wird auf Dashboard angezeigt |

**Meilenstein_3**
| Kriterium | Datei | Hinweis |
| :--- | :--- | :--- |
| **React Router** | react/htwg-dashboard-react/src/App.tsx, src/components/Sidebar.tsx | Login-, Dashboard-, Stundenplan-, Mensa- und Bibliotheksrouten; Navigation mit `Link` |
| **Datenfetching GET** | react/htwg-dashboard-react/src/api.ts, src/App.tsx | Mensa-Daten werden mit `fetch` von `/api/meals` geladen |
| **Schreibende REST-Methode** | backend/src/app.ts, react/htwg-dashboard-react/src/api.ts | Registrierung per POST; geschuetztes POST `/api/meals` vorhanden |
| **Lade- und Fehlerzustand** | src/components/mensa/MensaPage.tsx, src/components/Dashboard.tsx | Sichtbare Lade-, Fehler-, Leer- und Retry-Anzeige |
| **Geteilter State** | src/context/AuthContext.tsx | User und JWT stehen app-weit ueber React Context bereit |
| **Backend** | backend/src/app.ts, backend/src/server.ts | Express-API mit eigenen Endpunkten |
| **Datenbank** | backend/prisma/schema.prisma, backend/src/db.ts | Persistente SQLite-Datenbank mit Prisma |
| **Authentifizierung** | backend/src/app.ts, src/context/AuthContext.tsx, src/components/LoginPage.tsx | Registrierung, bcrypt-Hashing, Login und JWT |
| **Geschuetzter Endpunkt** | backend/src/app.ts | `/api/auth/me` und POST `/api/meals` pruefen den Bearer-Token |
| **Tests** | backend/src/auth.test.ts | Fuenf API-Tests mit Vitest und Supertest |

**Architektur M3**

```text
Browser / React-SPA (Port 5173)
        |
        | HTTP + JSON, JWT im Authorization-Header
        v
Express REST-API (Port 3000)
        |
        v
Prisma ORM -> SQLite-Datenbank
```

SSR oder SSG ist fuer dieses Dashboard nicht erforderlich, weil die Anwendung nach dem Login
interaktiv und benutzerspezifisch ist und ihre aktuellen Daten direkt von der REST-API bezieht.
