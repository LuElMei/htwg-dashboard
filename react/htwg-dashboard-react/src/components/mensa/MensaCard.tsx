import type { Meal } from '../../types';

interface MensaCardProps {
    meal: Meal;
    variant: 'widget' | 'page';
}

export const MensaCard = ({ meal, variant }: MensaCardProps) => {
    const isWidget = variant === 'widget';

    return (
        <article className={isWidget ? "mensa-item" : "mensa-page-card"}>
            
            <h4 className={isWidget ? "mensa-item-title" : "mensa-page-title"}>
                {meal.category}
            </h4>

            <div className="mensa-content">
                {meal.items ? (
                    <ul className={isWidget ? "mensa-beilagen-list" : "mensa-page-list"}>
                        {meal.items.map(item => (
                            <li key={item} className={isWidget ? "mensa-beilagen-item" : ""}>
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={isWidget ? "mensa-item-content" : "mensa-page-description"}>
                        {meal.description}
                    </p>
                )}

                {!isWidget && meal.price && (
                    <p className="mensa-page-price">Preis: {meal.price}</p>
                )}
            </div>
        </article>
    );
};