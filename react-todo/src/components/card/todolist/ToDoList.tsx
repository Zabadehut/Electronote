import React, { useState } from 'react';
import ToDoItem from './ToDoItem';
import ToDoInput from './ToDoInput';
import './ToDoList.css';

interface ToDo {
    id: string;
    task: string;
    completed: boolean;
}

interface ToDoListProps {
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const ToDoList: React.FC<ToDoListProps> = ({ onDisableDrag, onEnableDrag }) => {
    const [todos, setTodos] = useState<ToDo[]>([]);

    const addTask = (task: string) => {
        const newTask: ToDo = { id: Date.now().toString(), task, completed: false };
        setTodos([...todos, newTask]);
    };

    const toggleTask = (id: string) => {
        setTodos(todos.map(todo => (
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )));
    };

    const deleteTask = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="todolist-container">
            <ToDoInput onAddTask={addTask} onDisableDrag={onDisableDrag} onEnableDrag={onEnableDrag} />
            <div className="tasks-container" onMouseDown={onDisableDrag}>
                {todos.length ? (
                    todos.map((todo) => (
                        <ToDoItem
                            key={todo.id}
                            task={todo.task}
                            completed={todo.completed}
                            onToggle={() => toggleTask(todo.id)}
                            onDelete={() => deleteTask(todo.id)}
                            onDisableDrag={onDisableDrag}
                            onEnableDrag={onEnableDrag}
                        />
                    ))
                ) : (
                    <span className="text-green-100">No tasks yet!</span>
                )}
            </div>
        </div>
    );
};

export default ToDoList;
