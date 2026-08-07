export const getCurrentDateInfo = () => {
    const date = new Date();
    
    const formattedDate = new Intl.DateTimeFormat('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);

    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const kw = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

    return { formattedDate, kw };
};