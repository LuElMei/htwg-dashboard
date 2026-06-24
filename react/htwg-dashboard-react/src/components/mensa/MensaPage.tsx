import { useState } from 'react';
import type { Meal, MealCategory } from '../../types';
import { MensaCard } from './MensaCard';

interface Props {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

// Erlaubt echte Kategorien plus die Gesamtansicht.
type MensaFilter = MealCategory | 'Alle';

export const MensaPage = ({ meals, isLoading, error, onRetry }: Props) => {
  // Merkt sich, welche Kategorie gerade ausgewählt ist.
  const [activeCategory, setActiveCategory] = useState<MensaFilter>('Alle');

  // Aus dieser Liste werden die Filter-Buttons erzeugt.
  const categories: MensaFilter[] = [
    'Alle',
    'Seezeit-Teller',
    'Hin und Weg',
    'Kombinierbar',
    'Beilagen',
    'Dessert',
    'Getraenke',
  ];

  // Zeigt entweder alle Gerichte oder nur die passende Kategorie.
  const filteredMeals = activeCategory === 'Alle'
    ? meals
    : meals.filter((meal) => meal.category === activeCategory);

  return (
    <main className="content">
      <h1>Mensa</h1>
      <h3>Heutige Angebote</h3>

      {isLoading && <p className="fetch-status">Mensa-Daten werden geladen...</p>}

      {error && (
        <div className="fetch-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>Erneut versuchen</button>
        </div>
      )}

      {!isLoading && !error && meals.length === 0 && (
        <p className="fetch-status">Aktuell sind keine Mensa-Angebote vorhanden.</p>
      )}

      <div className="mensa-filter" aria-label="Mensa Kategorie Filter">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`mensa-filter-button ${activeCategory === category ? 'active' : ''}`}
            // Klick aktualisiert den Filter-State.
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {!isLoading && !error && <section className="mensa-page-grid">
        {filteredMeals.map((meal) => (
          <MensaCard 
            key={meal.id}
            meal={meal} 
            variant="page"
          />
        ))}
      </section>}
    </main>
  );
};
