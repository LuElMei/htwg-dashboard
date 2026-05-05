import { CircleUserRound } from 'lucide-react';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    return (
        <header className="header">
            <img 
                src="/assets/htwg-logo-no-bg.png" 
                alt="HTWG Logo"
                className="header-logo" 
            />
            <p className="header-text">{title}</p>
            <a href="/" className="dashboard-profile">
                <CircleUserRound className="dashboard-profile-icon" size={32} />
            </a>
        </header>
    )
}