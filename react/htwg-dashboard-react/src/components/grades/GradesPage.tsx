import { useState, useEffect } from 'react';
import type { Course, Grade } from '../../types';

interface GradesPageProps {
  courses: Course[];
}

const STORAGE_KEY = 'htwg-dashboard-user-grades';

export const GradesPage = ({ courses }: GradesPageProps) => {
  // Extract unique subjects from uploaded courses/timetable
  const uniqueSubjects = Array.from(
    new Set(courses.map((c) => c.subject.trim()))
  ).filter(Boolean);

  // Load existing grades from LocalStorage or initialize with empty grades
  const [gradesMap, setGradesMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gradesMap));
  }, [gradesMap]);

  const handleGradeChange = (subject: string, value: string) => {
    setGradesMap((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  // Calculate Average Grade
  const numericGrades = Object.values(gradesMap)
    .map((g) => parseFloat(g.replace(',', '.')))
    .filter((g) => !isNaN(g) && g > 0);

  const averageGrade =
    numericGrades.length > 0
      ? (numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length).toFixed(2)
      : '-';

  return (
    <main className="content">
      <h1>Notenübersicht</h1>
      <h3>Durchschnitt: {averageGrade}</h3>

      {uniqueSubjects.length === 0 ? (
        <div style={{ marginTop: '20px' }}>
          <p>
            Keine Fächer gefunden. Bitte lade zuerst deinen Stundenplan (ICS-Datei) auf der{' '}
            <strong>Stundenplan-Seite</strong> hoch.
          </p>
        </div>
      ) : (
        <div className="timetable-wrapper">
          <table className="timetable-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Modul / Fach</th>
                <th style={{ width: '180px' }}>Note eintragen</th>
                <th style={{ width: '120px' }}>Status</th>
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