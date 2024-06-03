import React, { useState } from 'react';
import ToDoItem from './ToDoItem';
import ToDoInput from './ToDoInput';
import './ToDoList.css';

interface ToDo {
    id: string;
    task: string;
    completed: boolean;
    reminderTime: string;
}

interface ToDoListProps {
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const ToDoList: React.FC<ToDoListProps> = ({ onDisableDrag, onEnableDrag }) => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [showCompleted, setShowCompleted] = useState<boolean>(true);

    const addTask = (task: string, reminderTime: string) => {
        const newTask: ToDo = { id: Date.now().toString(), task, completed: false, reminderTime };
        const updatedTodos = [...todos, newTask];
        setTodos(sortTodosByTime(updatedTodos));
    };

    const toggleTask = (id: string) => {
        const updatedTodos = todos.map(todo => (
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
        setTodos(sortTodosByTime(updatedTodos));
    };

    const deleteTask = (id: string) => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(sortTodosByTime(updatedTodos));
    };

    const sortTodosByTime = (todos: ToDo[]) => {
        return todos.sort((a, b) => {
            if (!a.reminderTime) return 1;
            if (!b.reminderTime) return -1;
            return new Date(`1970/01/01 ${a.reminderTime}`).getTime() - new Date(`1970/01/01 ${b.reminderTime}`).getTime();
        });
    };

    const filteredTodos = showCompleted ? todos : todos.filter(todo => !todo.completed);

    return (
        <div className="todolist-container">
            <ToDoInput onAddTask={addTask} onDisableDrag={onDisableDrag} onEnableDrag={onEnableDrag} />
            <div className="tasks-container" onMouseDown={onDisableDrag}>
                {filteredTodos.length ? (
                    filteredTodos.map((todo) => (
                        <ToDoItem
                            key={todo.id}
                            task={todo.task}
                            completed={todo.completed}
                            reminderTime={todo.reminderTime}
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
            <div className="toggle-completed">
                <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={() => setShowCompleted(!showCompleted)}
                />
                <label>Show Completed Tasks</label>
            </div>
        </div>
    );
};

export default ToDoList;
