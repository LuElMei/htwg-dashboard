import type { Course } from '../../types';


interface TimetableEntryProps {
    course: Course;
    onDelete?: () => void;
}

export const TimetableEntry = ({ course, onDelete }: TimetableEntryProps) => {
    return (
        <div className="course-info" style={{ position: 'relative' }}>
            {onDelete && (
                <button 
                    onClick={onDelete}
                    title="Fach löschen"
                    style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✕
                </button>
            )}
            <h4 className="subject-name">{course.subject}</h4>
            <span className="subject-room">{course.room}</span>
        </div>
    );
};