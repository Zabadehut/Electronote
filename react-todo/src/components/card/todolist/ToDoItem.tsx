import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

interface ToDoItemProps {
    id: string;
    task: string;
    completed: boolean;
    reminderTime: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({
                                               id,
                                               task,
                                               completed,
                                               reminderTime,
                                               onToggle,
                                               onDelete,
                                               onDisableDrag,
                                               onEnableDrag,
                                           }) => {
    const [isVibrating, setIsVibrating] = useState(false);

    useEffect(() => {
        if (!reminderTime) return;

        const parseReminderTime = (time: string) => {
            const [hours, minutes] = time.split(/[:Hh]/).map(Number);
            const now = new Date();
            const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes || 0, 0, 0);
            return reminderDate;
        };

        const reminderDate = parseReminderTime(reminderTime);
        if (!reminderDate) {
            console.log(`Invalid reminder date for task: ${task}`);
            return;
        }

        const checkAlarm = () => {
            const now = new Date();
            console.log(`Checking alarm for task: ${task}, Reminder time: ${reminderDate}, Now: ${now}`);
            if (reminderDate <= now && !completed) {
                setIsVibrating(true);
                console.log(`Alarm triggered for task: ${task}`);
            }
        };

        checkAlarm(); // Check immediately in case the time has already passed
        const timer = setInterval(checkAlarm, 1000); // Check every second

        return () => clearInterval(timer);
    }, [reminderTime, completed, task]);

    const handleClick = () => {
        setIsVibrating(false);
        onToggle(id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(id);
    };

    return (
        <div
            className={`todo-item ${isVibrating ? 'vibrating blinking' : ''}`}
            onMouseDown={onDisableDrag}
            onMouseUp={onEnableDrag}
            onClick={handleClick}
        >
            <div className="flex gap-2 items-center justify-between w-full">
                <div className="flex items-center">
                    <input type="checkbox" checked={completed} onChange={handleClick} />
                    <span
                        className="task-text"
                        style={{ textDecoration: completed ? 'line-through' : 'none' }}
                    >
                        {task}
                    </span>
                </div>
                <div className="flex items-center">
                    {reminderTime && <FaClock className="reminder-icon" />}
                    <button
                        className="delete-button"
                        type="button"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToDoItem;
