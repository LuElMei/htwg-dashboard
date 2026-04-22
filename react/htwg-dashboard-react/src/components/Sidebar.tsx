import { LayoutDashboard, CalendarDays, Utensils, BookOpen } from 'lucide-react';

// Definition der Props, um den "active"-Zustand zu steuern
interface SidebarProps {
  activePage: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek';
}

export const Sidebar = ({ activePage }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menü</h2>
      <ul>
        {/* Dashboard Link */}
        <li className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`}>
          <a href="/dashboard" className="sidebar-item-link">
            <LayoutDashboard className="sidebar-icon" />
            <div className="sidebar-item-text">Dashboard</div>
          </a>
        </li>

        {/* Stundenplan Link */}
        <li className={`sidebar-item ${activePage === 'timetable' ? 'active' : ''}`}>
          <a href="/timetable" className="sidebar-item-link">
            <CalendarDays className="sidebar-icon" />
            <div className="sidebar-item-text">Stundenplan</div>
          </a>
        </li>

        {/* Mensa Link */}
        <li className={`sidebar-item ${activePage === 'mensa' ? 'active' : ''}`}>
          <a href="/mensa" className="sidebar-item-link">
            <Utensils className="sidebar-icon" />
            <div className="sidebar-item-text">Mensa</div>
          </a>
        </li>

        {/* Bibliothek Link */}
        <li className={`sidebar-item ${activePage === 'bibliothek' ? 'active' : ''}`}>
          <a href="/bibliothek" className="sidebar-item-link">
            <BookOpen className="sidebar-icon" />
            <div className="sidebar-item-text">Bibliothek</div>
          </a>
        </li>
      </ul>
    </aside>
  );
};