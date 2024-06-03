import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

interface ToDoItemProps {
    task: string;
    completed: boolean;
    reminderTime: string;
    onToggle: () => void;
    onDelete: () => void;
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({ task, completed, reminderTime, onToggle, onDelete, onDisableDrag, onEnableDrag }) => {
    const [isVibrating, setIsVibrating] = useState(false);

    useEffect(() => {
        if (reminderTime) {
            const reminderDate = new Date();
            const [hours, minutes] = reminderTime.split(':').map(Number);
            reminderDate.setHours(hours);
            reminderDate.setMinutes(minutes || 0);
            reminderDate.setSeconds(0);

            const timeout = reminderDate.getTime() - new Date().getTime();
            if (timeout > 0) {
                const timer = setTimeout(() => {
                    setIsVibrating(true);
                }, timeout);
                return () => clearTimeout(timer);
            }
        }
    }, [reminderTime]);

    const handleClick = () => {
        setIsVibrating(false);
        onToggle();
    };

    return (
        <div className={`todo-item ${isVibrating ? 'vibrating' : ''}`} onMouseDown={onDisableDrag} onMouseUp={onEnableDrag} onClick={handleClick}>
            <div className="flex gap-2 items-center justify-between w-full">
                <div className="flex items-center">
                    <input type="checkbox" checked={completed} onChange={handleClick} />
                    <span className="task-text" style={{ textDecoration: completed ? 'line-through' : 'none' }}>
                        {task}
                    </span>
                </div>
                <div className="flex items-center">
                    {reminderTime && <FaClock className="reminder-icon" />}
                    <button
                        className="delete-button"
                        type="button"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToDoItem;
