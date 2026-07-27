import type { Course } from '../../types';
import { TimetableEntry } from './TimetableEntry';
import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { uploadTimetable } from '../../api';

interface TimetablePageProps {
    courses: Course[];
}

export const TimetablePage = ({ courses }: TimetablePageProps) => {
    const startTimes = Array.from(new Set(courses.map(course => course.time.split(' - ')[0]))).sort();
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    const { token } = useAuth();
    const [isUploading, setIsUploading] = useState(false);

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
      <h3>KW 20, 4. April 2026</h3>
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
                  // filter() liefert uns ein Array ALLER Kurse zu dieser Startzeit
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
                          <TimetableEntry course={course} />
                          {/* Trennlinie einfügen, wenn mehr als ein Kurs in der Zelle ist */}
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