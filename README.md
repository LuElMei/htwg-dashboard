# **HTWG-Dashboard**

**Team:** 
* Alexander Bille (310855)
* Luca Meier (313655)
* Elischa Ediger (310358)

**repository:** 
[github.com/LuElMei/htwg-dashboard](https://github.com/LuElMei/htwg-dashboard)

**Setup:**
```bash
cd \react\htwg-dashboard-react
npm install
npm run dev
```

**Projektidee:**

> Eine Web App die wichtige Informationen rund um die Hochschule HTWG-Konstanz zusammenfasst. Als Beispiel enthält die Web App den Stundenplan, das Mensamenü etc. . Die Idee kam, weil alle Informationen, rund um die HTWG-Konstanz, über mehrere Websiten verteilt sind.

| Kriterium | Datei | Zeile / Hinweis |
| :--- | :--- | :--- |
| **Sematische HTML-Struktur** | dashboard.html | ... |
| **Formular mit Labels** | index.html | Z. 22, 27 |
| **Responsive Layout** | style.css | Z. 113-121 |
| **Media Query** | style.css | Z. 297-386 u. Z. 463-468 |
| **URL-Struktur** | index.html | Pfade: \htwg-dashboard\index.html |


| Kriterium | Datei | Zeile / Hinweise |
| :--- | :--- | :--- |
| **npm + Vite** | package.json, vite.config.js | react/htwg-dashboard-react |
| **TypeScript aktiv genutzt** | src/types.ts, src/components/mensa/MensaCard.tsx | Z. 18-25, Z. 3-6 |
| **Komponentenzerlegung** | src/components/ | library, mensa, timetable |
| **Props-Übergabe** | src/App.tsx | Z. 68-81 |
| **useState** | src/App.tsx | Z. 26-56 |
| **useEffect** | src/App.tsx | Z. 15-24 |
| **Durchgängige Nutzeraktion** | src/components/LoginPage.tsx | Benutzername, Passwort -> Name wird auf Dashboard angezeigt |
