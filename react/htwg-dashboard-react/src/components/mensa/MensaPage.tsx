import type { Meal } from '../../types';
import { MensaCard } from './MensaCard';

interface Props {
  meals: Meal[];
}

export const MensaPage = ({ meals }: Props) => {
  return (
    <main className="content">
      <h1>Mensa</h1>
      <h3>Heutige Angebote</h3>
      
      <section className="mensa-page-grid">
        {meals.map((meal) => (
          <MensaCard 
            key={meal.id}
            meal={meal} 
            variant="page"
          />
        ))}
      </section>
    </main>
  );
};