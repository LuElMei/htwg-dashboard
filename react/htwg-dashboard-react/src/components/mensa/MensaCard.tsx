import type { Meal } from '../../types';

interface MensaCardProps {
    meal: Meal;
    variant: 'widget' | 'page';
}

export const MensaCard = ({ meal, variant }: MensaCardProps) => {
    const isWidget = variant === 'widget';

    return (
        // Schritt 1: Dynamischer Wechsel der äußeren Kasten-Klasse basierend auf der App.css
        <article className={isWidget ? "mensa-item" : "mensa-page-card"}>
            
            {/* Schritt 2: Dynamische Überschrift-Klasse */}
            <h4 className={isWidget ? "mensa-item-title" : "mensa-page-title"}>
                {meal.category}
            </h4>

            <div className="mensa-content">
                {meal.items ? (
                    // Wenn es eine Beilagen-/Getränkeliste ist
                    <ul className={isWidget ? "mensa-beilagen-list" : "mensa-page-list"}>
                        {meal.items.map(item => (
                            <li key={item} className={isWidget ? "mensa-beilagen-item" : ""}>
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    // Wenn es ein normales Gericht mit Beschreibung ist
                    <p className={isWidget ? "mensa-item-content" : "mensa-page-description"}>
                        {meal.description}
                    </p>
                )}

                {/* Preis wird nur auf der großen Page angezeigt (entspricht deinem M1-Layout) */}
                {!isWidget && meal.price && (
                    <p className="mensa-page-price">Preis: {meal.price}</p>
                )}
            </div>
        </article>
    );
};