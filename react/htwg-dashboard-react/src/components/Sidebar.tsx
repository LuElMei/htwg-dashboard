import { LayoutDashboard, CalendarDays, Utensils, BookOpen } from 'lucide-react';

interface SidebarProps {
  activePage: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek';
  onPageChange: (page: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek') => void; // Neu: Die "Fernbedienung" für die App.tsx
}

export const Sidebar = ({ activePage, onPageChange }: SidebarProps) => {
  
  // Kleine Hilfsfunktion für den Klick
  const handleNav = (e: React.MouseEvent, page: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek') => {
    e.preventDefault(); // WICHTIG: Verhindert, dass der Browser die Seite neu lädt
    onPageChange(page); // Hier feuern wir die Funktion ab!
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menü</h2>
      <ul>
        {/* Dashboard Link */}
        <li className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`}>
          <a 
            href="#dashboard" 
            onClick={(e) => handleNav(e, 'dashboard')} 
            className="sidebar-item-link"
          >
            <LayoutDashboard className="sidebar-icon" />
            <div className="sidebar-item-text">Dashboard</div>
          </a>
        </li>

        {/* Stundenplan Link */}
        <li className={`sidebar-item ${activePage === 'timetable' ? 'active' : ''}`}>
          <a 
            href="#timetable" 
            onClick={(e) => handleNav(e, 'timetable')} 
            className="sidebar-item-link"
          >
            <CalendarDays className="sidebar-icon" />
            <div className="sidebar-item-text">Stundenplan</div>
          </a>
        </li>

        {/* Mensa Link */}
        <li className={`sidebar-item ${activePage === 'mensa' ? 'active' : ''}`}>
          <a 
            href="#mensa" 
            onClick={(e) => handleNav(e, 'mensa')} 
            className="sidebar-item-link"
          >
            <Utensils className="sidebar-icon" />
            <div className="sidebar-item-text">Mensa</div>
          </a>
        </li>

        {/* Bibliothek Link */}
        <li className={`sidebar-item ${activePage === 'bibliothek' ? 'active' : ''}`}>
          <a 
            href="#bibliothek" 
            onClick={(e) => handleNav(e, 'bibliothek')} 
            className="sidebar-item-link"
          >
            <BookOpen className="sidebar-icon" />
            <div className="sidebar-item-text">Bibliothek</div>
          </a>
        </li>
      </ul>
    </aside>
  );
};