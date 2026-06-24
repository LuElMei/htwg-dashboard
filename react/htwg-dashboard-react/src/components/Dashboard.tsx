import type { Course, Meal, LibraryStatus } from './../types';
import { TimetableWidget } from './timetable/TimetableWidget';
import { MensaCard } from './mensa/MensaCard';
import { LibCard } from './library/LibCard';

interface DashboardPageProps {
    username: string;
    courses: Course[];
    meals: Meal[];
    mealsLoading: boolean;
    mealsError: string | null;
    bibStatus: LibraryStatus;
}

export const DashboardPage = ({
    username,
    courses,
    meals,
    mealsLoading,
    mealsError,
    bibStatus,
}: DashboardPageProps) => {
    const widgetMeals = meals.slice(0, 4);

    return (
        <main className="content">
            <h1>Guten Morgen, {username}</h1>
            <h3>4. April 2026, KW 20</h3>

            <section className="bento-box-grid">
                
                <TimetableWidget courses={courses} />

                <div className="widget box-tall mensa">
                    <h3 className="mensa-text">Mensa Angebot</h3>
                    {mealsLoading && <p>Mensa-Daten werden geladen...</p>}
                    {mealsError && <p role="alert">Mensa-Daten sind nicht verfuegbar.</p>}
                    {!mealsLoading && !mealsError && widgetMeals.map(meal => (
                        <MensaCard key={meal.id} meal={meal} variant="widget" />
                    ))}
                </div>

                <LibCard title="Bibliothek" variant="widget" status={bibStatus} />

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
