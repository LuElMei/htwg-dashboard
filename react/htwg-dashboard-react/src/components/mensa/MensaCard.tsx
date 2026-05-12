import type { Meal } from '../../types';

interface MensaCardProps {
    meal: Meal;
    variant: 'widget' | 'page'
}

export const MensaCard = ({ meal, variant}: MensaCardProps ) => {
    const isWidget = variant === 'widget'
    return (
        <article className={`mensa-card ${variant}-style`}>
            <h4 className="mensa-category">{meal.category}</h4>

            <div className="mensa-content">
                {meal.items ? (
                    <ul className="mensa-list">
                        {meal.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                ) : (
                    <p className="mensa-description">{meal.description}</p>
                )}

                {!isWidget && meal.price && (
                    <p className="mensa-price">Preis: {meal.price}</p>
                )}
            </div>
        </article>
    )
}