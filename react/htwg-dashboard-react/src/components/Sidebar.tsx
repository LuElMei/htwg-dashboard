import { LayoutDashboard, CalendarDays, Utensils, BookOpen } from 'lucide-react';

interface SidebarProps {
  activePage: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek';
  onPageChange: (page: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek') => void;
}

export const Sidebar = ({ activePage, onPageChange }: SidebarProps) => {
  
  const handleNav = (e: React.MouseEvent, page: 'dashboard' | 'timetable' | 'mensa' | 'bibliothek') => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menü</h2>
      <ul>
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