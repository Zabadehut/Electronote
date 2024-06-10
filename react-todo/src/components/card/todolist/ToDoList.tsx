import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import ToDoInput from './ToDoInput';
import './ToDoList.css';

interface ToDo {
    id: string;
    task: string;
    completed: boolean;
    reminderTime: string;
    shouldTrigger?: boolean; // Ajoutez cette ligne
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
        const updatedTodos = [...todos, newTask].sort((a, b) => {
            if (!a.reminderTime) return 1;
            if (!b.reminderTime) return -1;
            return a.reminderTime.localeCompare(b.reminderTime);
        });
        setTodos(updatedTodos);
        console.log("Task added:", newTask);
    };

    const toggleTask = (id: string) => {
        setTodos(todos.map(todo => (
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )));
        console.log("Task toggled:", id);
    };

    const deleteTask = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
        console.log("Task deleted:", id);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTodos(prevTodos => prevTodos.map(todo => {
                if (!todo.reminderTime) return todo;

                const [hours, minutes] = todo.reminderTime.split(':').map(Number);
                const reminderDate = new Date();
                reminderDate.setHours(hours);
                reminderDate.setMinutes(minutes || 0);
                reminderDate.setSeconds(0);
                reminderDate.setMilliseconds(0);

                const now = new Date();
                if (reminderDate <= now && !todo.completed) {
                    console.log(`Alarm triggered for task: ${todo.task}`);
                    if (!todo.shouldTrigger) {
                        window.electron.ipcRenderer.send('trigger-alarm');
                        return { ...todo, shouldTrigger: true };
                    }
                }
                return todo;
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const filteredTodos = todos.filter(todo => showCompleted || !todo.completed);

    return (
        <div className="todolist-container">
            <ToDoInput onAddTask={addTask} onDisableDrag={onDisableDrag} onEnableDrag={onEnableDrag} />
            <div className="toggle-completed">
                <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={() => setShowCompleted(!showCompleted)}
                />
                <label>Show Completed Tasks</label>
            </div>
            <div className="tasks-container" onMouseDown={onDisableDrag}>
                {filteredTodos.length ? (
                    filteredTodos.map((todo) => (
                        <ToDoItem
                            key={todo.id}
                            id={todo.id}
                            task={todo.task}
                            completed={todo.completed}
                            reminderTime={todo.reminderTime}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
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
