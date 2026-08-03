import { useState, useEffect } from 'react';
import type { Course } from '../../types';
import { useAuth } from '../../context/useAuth';
import { getGrades, saveGrade } from '../../api';

interface GradesPageProps {
  courses: Course[];
}

export const GradesPage = ({ courses }: GradesPageProps) => {
  const { token } = useAuth();
  const [gradesMap, setGradesMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Eindeutige Fächernamen aus den hochgeladenen Kursen extrahieren
  const uniqueSubjects = Array.from(
    new Set(courses.map((c) => c.subject.trim()))
  ).filter(Boolean);

  // Noten beim Laden der Seite aus der DB abrufen
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();

    getGrades(token, controller.signal)
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((item) => {
          map[item.subject] = String(item.grade);
        });
        setGradesMap(map);
      })
      .catch((err) => console.error('Fehler beim Noten laden:', err))
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [token]);

  // Wenn der User eine Note einträgt, sofort in der DB speichern
  const handleGradeChange = async (subject: string, value: string) => {
    setGradesMap((prev) => ({ ...prev, [subject]: value }));

    if (token) {
      try {
        await saveGrade(token, subject, value);
      } catch (err) {
        console.error('Fehler beim Speichern der Note:', err);
      }
    }
  };

  // Schnitt-Berechnung
  const numericGrades = Object.values(gradesMap)
    .map((g) => parseFloat(g.replace(',', '.')))
    .filter((g) => !isNaN(g) && g > 0);

  const averageGrade =
    numericGrades.length > 0
      ? (numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length).toFixed(2)
      : '-';

  if (isLoading) {
    return (
      <main className="content">
        <p className="fetch-status">Noten werden geladen...</p>
      </main>
    );
  }

  return (
    <main className="content">
      <h1>Notenübersicht</h1>
      <h3>Durchschnitt: {averageGrade}</h3>

      {uniqueSubjects.length === 0 ? (
        <p style={{ marginTop: '20px' }}>
          Keine Fächer vorhanden. Lade zuerst eine <code>.ics</code>-Kalenderdatei auf der{' '}
          <strong>Stundenplan-Seite</strong> hoch.
        </p>
      ) : (
        <div className="timetable-wrapper">
          <table className="timetable-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Modul / Fach</th>
                <th style={{ width: '180px' }}>Note eintragen</th>
                <th style={{ width: '140px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {uniqueSubjects.map((subject) => {
                const currentGrade = gradesMap[subject] ?? '';
                const numGrade = parseFloat(currentGrade.replace(',', '.'));
                const isValid = !isNaN(numGrade) && numGrade > 0;
                const isPassed = isValid && numGrade <= 4.0;

                return (
                  <tr key={subject}>
                    <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                      {subject}
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="z.B. 1.7"
                        value={currentGrade}
                        onChange={(e) => handleGradeChange(subject, e.target.value)}
                        style={{
                          width: '80px',
                          padding: '6px',
                          textAlign: 'center',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          marginTop: 0,
                        }}
                      />
                    </td>
                    <td>
                      {isValid ? (
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            backgroundColor: isPassed
                              ? 'rgba(76, 175, 80, 0.15)'
                              : 'rgba(244, 67, 54, 0.15)',
                            color: isPassed ? '#2e7d32' : '#c62828',
                          }}
                        >
                          {isPassed ? 'Bestanden' : 'Nicht bestanden'}
                        </span>
                      ) : (
                        <span style={{ color: '#888' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};