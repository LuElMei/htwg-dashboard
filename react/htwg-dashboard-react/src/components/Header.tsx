import { LogOut } from 'lucide-react';

interface HeaderProps {
    title: string;
    onLogout: () => void;
}

export const Header = ({ title, onLogout }: HeaderProps) => {
    return (
        <header className="header">
            <img 
                src="/assets/htwg-logo-no-bg.png" 
                alt="HTWG Logo"
                className="header-logo" 
            />
            <p className="header-text">{title}</p>
            <button
                type="button"
                className="dashboard-profile"
                onClick={onLogout}
                aria-label="Abmelden"
                title="Abmelden"
            >
                <LogOut className="dashboard-profile-icon" size={28} />
            </button>
        </header>
    )
}
