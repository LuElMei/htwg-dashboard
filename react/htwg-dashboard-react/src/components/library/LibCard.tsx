import type { ReactNode } from 'react';
import type { LibraryStatus } from '../../types';

interface LibCardProps {
    title: string;
    variant: 'widget' | 'page';
    status?: LibraryStatus;
    children?: ReactNode;
}

export const LibCard = ({ title, variant, status, children }: LibCardProps) => {
    const isWidget = variant === 'widget';

    return (
        <article className={isWidget ? "widget box-small bib" : "bib-page-card"}>
            {isWidget ? (
                <h3 className="bib-text">{title}</h3>
            ) : (
                <h2>{title}</h2>
            )}

            {/* AUTOMATISCHE AUSLASTUNGS-LOGIK */}
            {status && (
                <>
                    {/* Hier wird die Textklasse und das Wording je nach Variante angepasst */}
                    <p className="bib-status-text">
                        {status.loadPercentage}% voll
                    </p>
                    
                    <div className="bib-status-container">
                        <div 
                            className="bib-status-bar" 
                            style={{ width: `${status.loadPercentage}%` }}
                        ></div>
                    </div>
                </>
            )}

            {!status && children}
        </article>
    );
};