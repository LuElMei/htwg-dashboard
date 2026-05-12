import type { Meal } from '../../types'; // Aktive Typisierung
import { MensaCard } from './MensaCard';

interface Props {
  meals: Meal[];
}

export const MensaPage = ({ meals }: Props) => {
  return (
    <div className="mensa-page">
      <h1>Mensa Speiseplan</h1>
      
      {/* Container für das Grid-Layout aus deinem Screenshot */}
      <div className="mensa-grid">
        {meals.map((meal) => (
          <MensaCard 
            meal={meal} 
            variant="page" // Hier schalten wir das Layout auf 'Karten-Modus'
          />
        ))}
      </div>
    </div>
  );
};