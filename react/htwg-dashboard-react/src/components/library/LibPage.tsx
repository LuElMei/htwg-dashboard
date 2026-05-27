import type { LibraryStatus } from '../../types';
import { LibCard } from './LibCard';

interface LibPageProps {
    status: LibraryStatus;
}

export const BibliothekPage = ({ status }: LibPageProps) => {
    
    // Die statischen Zusatzinfos sauber als Datenstruktur ausgelagert
    const libInfos = [
        {
            id: 'hours',
            title: 'Öffnungszeiten',
            content: (
                <ul>
                    <li>Mo - Fr: 08:00 - 20:00</li>
                    <li>Sa: 09:00 - 16:00</li>
                    <li>So: geschlossen</li>
                </ul>
            )
        },
        {
            id: 'seats',
            title: 'Lernplätze',
            content: (
                <>
                    <p>Freie Plätze: {status.freeSeats}</p>
                    <p>Gesamtplätze: {status.totalSeats}</p>
                </>
            )
        },
        {
            id: 'services',
            title: 'Services',
            content: (
                <ul>
                    <li>WLAN (eduroam) verfügbar</li>
                    <li>Drucker & Scanner</li>
                    <li>Gruppenräume reservierbar</li>
                    <li>Buchausleihe & Fernleihe</li>
                </ul>
            )
        },
        {
            id: 'tip',
            title: '💡 Tipp',
            content: <p>Die Bibliothek ist morgens am leersten. Perfekt für eine produktive Lernsession!</p>
        }
    ];

    return (
        <main className="content">
            <h1>Bibliothek</h1>
            <h3>Informationen & Auslastung</h3>

            <section className="bib-page-grid">
                <LibCard title="Aktuelle Auslastung" variant="page" status={status} />

                {libInfos.map(info => (
                    <LibCard key={info.id} title={info.title} variant="page">
                        {info.content}
                    </LibCard>
                ))}
            </section>
        </main>
    );
};