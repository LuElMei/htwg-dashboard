import type { Course, Meal, LibraryStatus } from './../types';
import { TimetableWidget } from './timetable/TimetableWidget';
import { MensaCard } from './mensa/MensaCard';
import { LibCard } from './library/LibCard';

interface DashboardPageProps {
    username: string;
    courses: Course[];
    meals: Meal[];
    bibStatus: LibraryStatus;
}

export const DashboardPage = ({ username, courses, meals, bibStatus }: DashboardPageProps) => {
    // Sichere dir die ersten 3 Mahlzeiten für das kompakte Widget-Layout
    const widgetMeals = meals.slice(0, 4);

    return (
        <main className="content">
            {/* Dynamische Begrüßung basierend auf dem Login-Input */}
            <h1>Guten Morgen, {username}</h1>
            <h3>4. April 2026, KW 20</h3>

            <section className="bento-box-grid">
                
                {/* 1. STUNDENPLAN WIDGET */}
                <TimetableWidget courses={courses} />

                {/* 2. MENSA WIDGET */}
                <div className="widget box-tall mensa">
                    <h3 className="mensa-text">Mensa Angebot</h3>
                    {widgetMeals.map(meal => (
                        <MensaCard key={meal.id} meal={meal} variant="widget" />
                    ))}
                </div>

                {/* 3. BIBLIOTHEK WIDGET (Unsere extrem smarte Komponente!) */}
                <LibCard title="Bibliothek" variant="widget" status={bibStatus} />

                {/* 4. NOTEN WIDGET (Direkt hier integriert) */}
                <div className="widget box-small noten">
                    <h3 className="noten-title">Kürzliche Noten</h3>
                    <div className="noten-item">
                        <h4 className="noten-item-title">Programmiertechnik 2</h4>
                        <div className="noten-divider"></div>
                        <div className="noten-item-content">3.3</div>
                    </div>
                    <div className="noten-item">
                        <h4 className="noten-item-title">Algebra</h4>
                        <div className="noten-divider"></div>
                        <div className="noten-item-content">5.0</div>
                    </div>
                </div>

            </section>
        </main>
    );
};