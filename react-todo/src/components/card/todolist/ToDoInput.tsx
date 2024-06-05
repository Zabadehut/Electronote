import React, { useState } from 'react';

interface ToDoInputProps {
    onAddTask: (task: string, reminderTime: string) => void;
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const ToDoInput: React.FC<ToDoInputProps> = ({ onAddTask, onDisableDrag, onEnableDrag }) => {
    const [task, setTask] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const timePattern = /\b(\d{1,2})[:Hh]?(\d{0,2})?\b/;
        const match = task.match(timePattern);

        let reminderTime = '';
        if (match) {
            let hours = match[1];
            let minutes = match[2] || '00';
            if (minutes.length === 1) {
                minutes = `0${minutes}`;
            }
            reminderTime = `${hours.padStart(2, '0')}:${minutes}`;
        }

        if (task.trim()) {
            onAddTask(task, reminderTime);
            setTask('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-input-form" onMouseDown={onDisableDrag} onMouseUp={onEnableDrag}>
            <div className="input-container">
                <label className="input-label">Enter your next task:</label>
                <input
                    className="task-input"
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="add-task-button"
            >
                Add task
            </button>
        </form>
    );
};

export default ToDoInput;
