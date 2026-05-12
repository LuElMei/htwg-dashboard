export interface Course {
    id: string;
    day: string;
    time: string;
    subject: string;
    room: string;
    isCurrent: Boolean;
}

export type MealCategory = 
    | 'Seezeit-Teller'
    | 'Hin und Weg'
    | 'Kombinierbar'
    | 'Beilagen'
    | 'Dessert'
    | 'Getraenke';

export interface Meal {
    id: string;
    category: MealCategory;
    title: string;
    description?: string;
    items?: string[];
    price?: string,
}