interface Meal {
    title: string;
    content: string;
    price: string;
}

interface MensaWidgetProps {
    variant: 'dashboard' | 'page'
}

export const MensaWidget = ({ variant }: MensaWidgetProps) => {
    const meals: Meal[] = [
        {
            title: "Seeeit-Teller",
            content: "Schwaebisches Linsengericht (Lauch, Karotte, Sellerie) mit Spaetzle dazu Blattsalat mit dunklem Balsamicodressing",
            price: "3, 80 $",
        }
        {
            title: "Hin und Weg",
            content: "Kichererbsen Curry mit Bulgur",
            price: "4, 20 $",
        }
        {
            title: "Kombinierbar",
            content: "Gefluegel Masala",
            price: 
        }
    ]
}

