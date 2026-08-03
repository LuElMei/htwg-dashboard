import type { Grade } from '../../types';

interface GradesPageProps {
  grades?: Grade[];
}

// Dummy-Daten als Fallback
const defaultGrades: Grade[] = [
  { id: '1', subject: 'Programmiertechnik 2', grade: '3.3', semester: 'SoSe 2025' },
  { id: '2', subject: 'Algebra', grade: '5.0', semester: 'SoSe 2025' },
  { id: '3', subject: 'Datenbanken', grade: '1.7', semester: 'WiSe 2025/26' },
  { id: '4', subject: 'Web-Entwicklung', grade: '1.3', semester: 'WiSe 2025/26' },
];

export const GradesPage = ({ grades = defaultGrades }: GradesPageProps) => {
  // Berechnung des Notendurchschnitts (ohne bestandene/nicht bestandene Noten wie 5.0 bei Bedarf)
  const numericGrades = grades
    .map((g) => parseFloat(String(g.grade)))
    .filter((g) => !isNaN(g));

  const averageGrade =
    numericGrades.length > 0
      ? (numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length).toFixed(2)
      : '-';

  return (
    <main className="content">
      <h1>Notenübersicht</h1>
      <h3>Durchschnitt: {averageGrade}</h3>

      <div className="timetable-wrapper">
        <table className="timetable-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Modul / Fach</th>
              <th>Semester</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((item) => {
              const isPassed = parseFloat(String(item.grade)) <= 4.0;

              return (
                <tr key={item.id}>
                  <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                    {item.subject}
                  </td>
                  <td>{item.semester ?? '-'}</td>
                  <td>
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
                      {item.grade}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};
