import type { Course, Meal, LibraryStatus, Grade } from './../types';
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
    grades: Grade[];
}

export const DashboardPage = ({
    username,
    courses,
    meals,
    mealsLoading,
    mealsError,
    bibStatus,
    grades,

}: DashboardPageProps) => {
    const widgetMeals = meals.slice(0, 4);

    const recentGrades = grades.filter((g) => g.grade && String(g.grade).trim() !== 'hidden')
        .slice(0, 3);

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
                    {recentGrades.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#888', margin: '5px 0' }}>
                            Noch keine Noten eingetragen.
                        </p>
                    ) : (
                        recentGrades.map((item) => (
                            <div key={item.id} className="noten-item">
                                <h4 className="noten-item-title">{item.subject}</h4>
                                <div className="noten-divider"></div>
                                <div className="noten-item-content">{item.grade}</div>
                            </div>
                        ))
                    )}
                </div>

            </section>
        </main>
    );
};
