// ToDoItem.tsx
import React from 'react';

interface ToDoItemProps {
    task: string;
    completed: boolean;
    onToggle: () => void;
    onDelete: () => void;
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({ task, completed, onToggle, onDelete, onDisableDrag, onEnableDrag }) => {
    return (
        <div className="todo-item" onMouseDown={onDisableDrag} onMouseUp={onEnableDrag}>
            <div className="flex gap-2 items-center">
                <input type="checkbox" checked={completed} onChange={onToggle} />
                <span className="task-text" style={{ textDecoration: completed ? 'line-through' : 'none' }}>
                    {task}
                </span>
            </div>
            <button
                className="delete-button"
                type="button"
                onClick={onDelete}
            >
                Delete
            </button>
        </div>
    );
};

export default ToDoItem;
