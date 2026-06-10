import { useState } from 'react';
import type { Meal, MealCategory } from '../../types';
import { MensaCard } from './MensaCard';

interface Props {
  meals: Meal[];
}

type MensaFilter = MealCategory | 'Alle';

export const MensaPage = ({ meals }: Props) => {
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

  const filteredMeals = activeCategory === 'Alle'
    ? meals
    : meals.filter((meal) => meal.category === activeCategory);

  return (
    <main className="content">
      <h1>Mensa</h1>
      <h3>Heutige Angebote</h3>

      <div className="mensa-filter" aria-label="Mensa Kategorie Filter">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`mensa-filter-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <section className="mensa-page-grid">
        {filteredMeals.map((meal) => (
          <MensaCard 
            key={meal.id}
            meal={meal} 
            variant="page" // Schaltet auf die große Unterseite um
          />
        ))}
      </section>
    </main>
  );
};
