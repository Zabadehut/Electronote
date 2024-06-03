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
        const timePattern = /\b(\d{1,2}[h:]\d{0,2})\b/i;
        const match = task.match(timePattern);
        const reminderTime = match ? match[0].replace('h', ':').replace(/^(\d{1,2}):$/, '$1:00') : '';

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
