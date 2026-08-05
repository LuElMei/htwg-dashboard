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
  const [newSubject, setNewSubject] = useState(''); // <-- Neuer State für die Eingabe

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

  const allSubjects = Array.from(
    new Set([
      ...courses.map((c) => c.subject.trim()),
      ...Object.keys(gradesMap)
    ])
  ).filter(Boolean);

  const visibleSubjects = allSubjects.filter(subject => gradesMap[subject] !== 'hidden');

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

  const handleDeleteSubject = async (subject: string) => {
    setGradesMap((prev) => ({ ...prev, [subject]: 'hidden' }));
    if (token) {
      try {
        await saveGrade(token, subject, 'hidden');
      } catch (err) {
        console.error('Fehler beim Ausblenden:', err);
      }
    }
  };

  const handleAddSubject = async () => {
    const subject = newSubject.trim();
    if (!subject) return;
    
    setGradesMap((prev) => ({ ...prev, [subject]: '' }));
    setNewSubject('');
    
    if (token) {
      try {
        await saveGrade(token, subject, '');
      } catch (err) {
        console.error('Fehler beim Hinzufügen:', err);
      }
    }
  };

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

      {visibleSubjects.length === 0 ? (
        <p style={{ marginTop: '20px' }}>
          Keine Fächer vorhanden. Lade einen Stundenplan hoch oder füge manuell Fächer hinzu.
        </p>
      ) : (
        <div className="timetable-wrapper">
          <table className="timetable-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Modul / Fach</th>
                <th style={{ width: '180px' }}>Note eintragen</th>
                <th style={{ width: '140px' }}>Status</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {visibleSubjects.map((subject) => {
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
                        value={currentGrade === 'hidden' ? '' : currentGrade}
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
                    <td>
                      <button 
                        onClick={() => handleDeleteSubject(subject)}
                        title="Fach entfernen"
                        style={{
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mensa-page-card" style={{ marginTop: '30px', textAlign: 'left', maxWidth: '500px' }}>
        <h3 style={{ marginTop: 0 }}>Eigenes Fach hinzufügen</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Fachname (z.B. Software Engineering)" 
            value={newSubject} 
            onChange={e => setNewSubject(e.target.value)} 
            style={{ flex: 1, margin: 0 }} 
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
          />
          <button 
            className="button-confirm-index" 
            style={{ padding: '6px 15px', fontSize: '14px', margin: 0 }}
            onClick={handleAddSubject}
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </main>
  );
};