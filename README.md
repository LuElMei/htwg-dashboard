# **HTWG-Dashboard**

**Team:** 
* Alexander Bille (310855)
* Luca Meier (313655)
* Elischa Ediger (310358)

**repository:** 
[github.com/LuElMei/htwg-dashboard](https://github.com/LuElMei/htwg-dashboard)

**Setup:**
```bash
cd react\htwg-dashboard-react
npm install
npm run dev
```
Die App laeuft dann unter http://localhost:5173.
Der Build wurde mit `npm run build` geprueft.

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
