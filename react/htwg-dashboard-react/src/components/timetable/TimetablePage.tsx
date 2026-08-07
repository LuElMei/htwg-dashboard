import type { Course } from '../../types';
import { TimetableEntry } from './TimetableEntry';
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { uploadTimetable } from '../../api';
import { getCurrentDateInfo } from '../../utils';

interface TimetablePageProps {
    courses: Course[];
    onAddCourse: (course: Partial<Course>) => void;
    onDeleteCourse: (id: string) => void;
}

export const TimetablePage = ({ courses, onAddCourse, onDeleteCourse }: TimetablePageProps) => {
    const startTimes = Array.from(new Set(courses.map(course => course.time.split(' - ')[0]))).sort();
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    const { token } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newRoom, setNewRoom] = useState('');
    const [newDay, setNewDay] = useState('Montag');
    const [newTime, setNewTime] = useState('08:00 - 09:30');
    const { formattedDate, kw } = getCurrentDateInfo();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !token) return;

        setIsUploading(true);
        try {
            await uploadTimetable(token, file);
            alert('Stundenplan erfolgreich importiert! Bitte Seite neu laden.');
            window.location.reload();
        } catch (error) {
            alert('Fehler beim Importieren.');
        } finally {
            setIsUploading(false);
        }
    };


    return (
    <main className="content">
      <h1>Stundenplan</h1>
      <h3>KW {kw}, {formattedDate}</h3>
      <div className="timetable-wrapper">
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Zeit</th>
              {days.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {startTimes.map(startTime => (
              <tr key={startTime}>
                <td className="time-column">{startTime}</td>
                {days.map(day => {
                  const matchingCourses = courses.filter(
                    c => c.day === day && c.time.startsWith(startTime)
                  );

                  return (
                    <td 
                      key={`${day}-${startTime}`} 
                      className={matchingCourses.length > 0 ? "subject" : ""}
                    >
                      {matchingCourses.map((course, index) => (
                        <div key={course.id || index} className="timetable-cell-entry">
                          <TimetableEntry course={course} onDelete={() => course.id ? onDeleteCourse(course.id) : undefined} />
                          {index < matchingCourses.length - 1 && (
                            <div className="course-cell-divider" />
                          )}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="upload-container">
        <div className="mensa-page-card" style={{ marginTop: '30px', textAlign: 'left' }}>
        <h3 style={{ marginTop: 0 }}>Eigenes Fach hinzufügen</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" placeholder="Fach (z.B. Mathe)" value={newSubject} 
            onChange={e => setNewSubject(e.target.value)} style={{ flex: 1, minWidth: '150px' }} 
          />
          <input 
            type="text" placeholder="Raum (z.B. O 123)" value={newRoom} 
            onChange={e => setNewRoom(e.target.value)} style={{ flex: 1, minWidth: '100px' }} 
          />
          <select value={newDay} onChange={e => setNewDay(e.target.value)} style={{ padding: '5px', marginTop: '10px' }}>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input 
            type="text" placeholder="Zeit (z.B. 08:00 - 09:30)" value={newTime} 
            onChange={e => setNewTime(e.target.value)} style={{ flex: 1, minWidth: '150px' }} 
          />
          <button 
            className="button-confirm-index" 
            style={{ marginTop: '10px', padding: '6px 15px', fontSize: '14px' }}
            onClick={() => {
              if (newSubject && newTime) {
                onAddCourse({ subject: newSubject, room: newRoom, day: newDay, time: newTime });
                setNewSubject('');
                setNewRoom('');
              }
            }}
          >
            Hinzufügen
          </button>
        </div>
      </div>
        <label htmlFor="ics-upload" className="mensa-filter-button">
          {isUploading ? 'Wird hochgeladen...' : '.ics Datei hochladen'}
        </label>
        <input 
            id="ics-upload" 
            type="file" 
            accept=".ics" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
            disabled={isUploading}
        />
      </div>
    </main>
  );
};