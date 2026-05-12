import type { Meal } from '../../types';
import { MensaCard } from './MensaCard';

interface MensaWidgetProps {
    meals: Meal[];
}

export const MensaWidget = ({ meals }: MensaWidgetProps) => {
    const dashboardMeals = meals.slice(0, 4);

    return (
        <div className="widget box-tall mensa">
            <h3 className="mensa-text">Mensa Angebot</h3>
            <div className="mensa-widget-list">
                {dashboardMeals.map((meal) => (
                    <MensaCard
                        meal={meal}
                        variant="widget"
                    />
                ))}
            </div>
        </div>
    )
}