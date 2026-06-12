import { Link, useLocation } from 'react-router-dom';

import { LayoutDashboard, CalendarDays, Utensils, BookOpen } from 'lucide-react';

interface SidebarProps {
  activePage: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek';
  onPageChange: (page: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek') => void;
}

export const Sidebar = () => {
  
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menü</h2>
      <ul>
        <li className={`sidebar-item ${currentPath === 'dashboard' ? 'active' : ''}`}>
          <Link to="/dashboard" className="sidebar-item-link">
            <LayoutDashboard className="sidebar-icon" />
            <div className="sidebar-item-text">Dashboard</div>
          </Link>
        </li>

        <li className={`sidebar-item ${currentPath === 'timetable' ? 'active' : ''}`}>
          <Link to="/timetable" className="sidebar-item-link">
            <CalendarDays className="sidebar-icon" />
            <div className="sidebar-item-text">Stundenplan</div>
          </Link>
        </li>

        <li className={`sidebar-item ${currentPath === 'mensa' ? 'active' : ''}`}>
          <Link to="/mensa" className="sidebar-item-link">
            <Utensils className="sidebar-icon" />
            <div className="sidebar-item-text">Mensa</div>
          </Link>
        </li>

        <li className={`sidebar-item ${currentPath === 'bibliothek' ? 'active' : ''}`}>
          <Link to="/bibliothek" className="sidebar-item-link">
            <BookOpen className="sidebar-icon" />
            <div className="sidebar-item-text">Bibliothek</div>
          </Link>
        </li>
      </ul>
    </aside>
  );
};