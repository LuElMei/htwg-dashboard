import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/Dashboard';
import { TimetablePage } from './components/timetable/TimetablePage';
import { MensaPage } from './components/mensa/MensaPage';
import { BibliothekPage } from './components/library/LibPage';

// Typen importieren
import type { Course, Meal, LibraryStatus } from './types';

export default function App() {
  // 1. STATE FÜR DIE NAVIGATION (Standardmäßig auf 'dashboard')
  const [activePage, setActivePage] = useState<'dashboard' | 'timetable' | 'mensa' | 'bibliothek'>('dashboard');
  
  // State für den Usernamen (wird später von der LoginPage befüllt, jetzt als Dummy)
  const [username] = useState<string>('Luca');

  // 2. TESTDATEN (Entspricht exakt deinen originalen HTML-Inhalten)
  const [courses] = useState<Course[]>([
    { id: '1', day: 'Dienstag', time: '8:00 - 9:30', subject: 'Programmiertechnik 2', room: 'Raum 101', isCurrent: false },
    { id: '2', day: 'Dienstag', time: '9:45 - 11:15', subject: 'Datenbanken', room: 'Raum 303', isCurrent: false },
    { id: '3', day: 'Donnerstag', time: '8:00 - 9:30', subject: 'Algebra', room: 'Raum 202', isCurrent: false },
    { id: '4', day: 'Donnerstag', time: '9:45 - 11:15', subject: 'Betriebssysteme', room: 'Raum 404', isCurrent: false },
    { id: '5', day: 'Montag', time: '11:30 - 13:00', subject: 'Software Engineering', room: 'Raum 505', isCurrent: true }, // isCurrent für das Widget-Styling
  ]);

  const [meals] = useState<Meal[]>([
    { id: 'm1', category: 'Seezeit-Teller', title: 'Seezeit-Teller', description: 'Schwäbisches Linsengericht mit Spätzle und kleinem Blattsalat.', price: '3,80 €' },
    { id: 'm2', category: 'Hin und Weg', title: 'Hin und Weg', description: 'Kichererbsen-Curry mit Bulgur und frischen Kräutern.', price: '4,20 €' },
    { id: 'm3', category: 'Kombinierbar', title: 'Kombinierbar', description: 'Geflügel-Masala mit würziger Sauce.', price: '4,90 €' },
    { id: 'm4', category: 'Beilagen', title: 'Beilagen', items: ['MIE-Nudeln', 'Kartoffeln', 'Asiatisches Gemüse', 'Blattsalat mit Balsamicodressing'] },
    { id: 'm5', category: 'Dessert', title: 'Dessert', description: 'Joghurt mit Früchten oder Schokopudding.', price: '1,50 €' },
    { id: 'm6', category: 'Getraenke', title: 'Getränke', items: ['Wasser', 'Apfelschorle', 'Kaffee', 'Tee'] }
  ]);

  const [bibStatus] = useState<LibraryStatus>({
    loadPercentage: 65,
    freeSeats: 42,
    totalSeats: 120
  });

  // 3. SEITEN-SWITCHER LOGIK
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage username={username} courses={courses} meals={meals} bibStatus={bibStatus} />;
      case 'timetable':
        return <TimetablePage courses={courses} />;
      case 'mensa':
        return <MensaPage meals={meals} />;
      case 'bibliothek':
        return <BibliothekPage status={bibStatus} />;
      default:
        return <DashboardPage username={username} courses={courses} meals={meals} bibStatus={bibStatus} />;
    }
  };

  return (
    <div className="app-container">
      {/* Header bekommt den Seitennamen als Titel */}
      <Header title="Dashboard" />

      <div className="content-wrapper">
        {/* WICHTIG: Die Sidebar muss wissen, welche Seite aktiv ist */}
        <Sidebar activePage={activePage} />
        
        {/* Hier wird die jeweilige Seite dynamisch reingeladen */}
        {renderPage()}
      </div>
    </div>
  );
}
