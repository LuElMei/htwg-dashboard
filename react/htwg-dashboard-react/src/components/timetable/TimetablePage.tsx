import type { Course } from '../../types'; // Aktive Typisierung
import { TimetableEntry } from './TimetableEntry';

interface TimetablePageProps {
    courses: Course[];
}

export const TimetablePage = ({ courses }: TimetablePageProps) => {
    const timeSlots = ["8:00 - 9:30", "9:45 - 11:15", "11:30 - 13:00", "13:00 - 14:00", "14:00 - 15:30", "15:45 - 17:15"];
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    return (
    <div className="timetable-page-container">
      <table className="timetable-table">
        <thead>
          <tr>
            <th>Zeit</th>
            {days.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(slot => (
            <tr key={slot}>
              <td className="time-column">{slot}</td>
              {days.map(day => {
                const course = courses.find(c => c.day === day && c.time === slot);
                return (
                  <td key={`${day}-${slot}`}>
                    {course ? (
                      <TimetableEntry course={course} />
                    ) : (
                      slot === "13:00 - 14:00" ? "-" : "" 
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};