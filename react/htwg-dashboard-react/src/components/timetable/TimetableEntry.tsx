import type { Course } from '../../types';


interface TimetableEntryProps {
    course: Course,
}

export const TimetableEntry = ({ course }: TimetableEntryProps) => {
    return (
        <div className="course-info">
            <h4 className="subject-name">{course.subject}</h4>
            <span className="subject-room">{course.room}</span>
        </div>
    );
};