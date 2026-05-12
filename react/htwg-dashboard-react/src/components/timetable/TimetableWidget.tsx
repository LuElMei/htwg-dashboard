import type {Course } from '../../types';
import { TimetableEntry } from './TimetableEntry';

interface TimetableWidgetProps {
    courses: Course[];
}

export const TimetableWidget = ({ courses }: TimetableWidgetProps) => {
    const displayedCourses = courses.slice(0, 3);
    return (
        <div className="widget-box large timetable">
            <h3 className="timetable-text">Stundenplan</h3>
            {displayedCourses.length < 1 ? (
                <p>Keine Vorlesungen heute</p>
            ) : (
                displayedCourses.map((course) => (
                    <article key={course.id} className={`timetable-item ${course.isCurrent ? 'current' : 'later'}`}>
                        <section className="item-time">{course.time}</section>
                        <section className="divider"></section>
                        <section className="item-subject">
                            <TimetableEntry course={course} />
                        </section>
                    </article>
                ))
            )}
        </div>
    )
}