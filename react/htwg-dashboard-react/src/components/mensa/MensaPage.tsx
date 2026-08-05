import { useState } from 'react';
import type { Meal, MealCategory } from '../../types';
import { MensaCard } from './MensaCard';

interface Props {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  isDemoMode: boolean;
  onToggleDemo: () => void;
}

type MensaFilter = MealCategory | 'Alle';

export const MensaPage = ({
  meals,
  isLoading,
  error,
  onRetry,
  isDemoMode,
  onToggleDemo,
}: Props) => {
  const [activeCategory, setActiveCategory] = useState<MensaFilter>('Alle');

  const categories: MensaFilter[] = [
    'Alle',
    'Seezeit-Teller',
    'Hin und Weg',
    'Kombinierbar',
    'Beilagen',
    'Dessert',
    'Getraenke',
  ];

  const filteredMeals =
    activeCategory === 'Alle'
      ? meals
      : meals.filter((meal) => meal.category === activeCategory);

  return (
    <main className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Mensa</h1>
          <h3>Heutige Angebote</h3>
        </div>

        {/* Demo-Toggle Button für die Präsentation */}
        <button
          type="button"
          className="mensa-filter-button active"
          onClick={onToggleDemo}
          style={{ height: 'fit-content', padding: '8px 16px', fontWeight: 'bold', position: 'relative', cursor: 'pointer', zIndex: 999, pointerEvents: 'auto' }}
        >
          {isDemoMode ? '🔴 Live-Status anzeigen (Geschlossen)' : '🟢 Demo-Speiseplan laden'}
        </button>
      </div>

      {isLoading && <p className="fetch-status">Mensa-Daten werden geladen...</p>}

      {error && (
        <div className="fetch-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Ansprechendes UI-Element, wenn die Mensa geschlossen ist */}
      {!isLoading && !error && meals.length === 0 && (
        <div
          className="mensa-page-card"
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            marginTop: '20px',
            backgroundColor: '#fff',
          }}
        >
          <h2>Mensa aktuell geschlossen</h2>
          <p className="mensa-page-description" style={{ maxWidth: '500px', margin: '15px auto' }}>
            Die Mensa an der HTWG Konstanz befindet sich aktuell in den Semesterferien /
            Betriebsferien. Es stehen derzeit keine aktuellen Tagesangebote zur Verfügung.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Aktivieren Sie oben rechts den <strong>Demo-Speiseplan</strong>, um die Ansicht für reguläre Vorlesungstage zu simulieren.
          </p>
        </div>
      )}

      {!isLoading && !error && meals.length > 0 && (
        <>
          <div className="mensa-filter" aria-label="Mensa Kategorie Filter">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`mensa-filter-button ${
                  activeCategory === category ? 'active' : ''
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <section className="mensa-page-grid">
            {filteredMeals.map((meal) => (
              <MensaCard key={meal.id} meal={meal} variant="page" />
            ))}
          </section>
        </>
      )}
    </main>
  );
};