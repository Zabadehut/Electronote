import React, { useEffect, useState } from 'react';
import { activeThreads } from '../card/CardId';
import './ThreadManager.css';

interface ThreadManagerProps {
    onTerminateThread: (id: string) => void;
}

const ThreadManager: React.FC<ThreadManagerProps> = ({ onTerminateThread }) => {
    const [activeThreadsList, setActiveThreadsList] = useState<Array<{ id: string, type: string, content: string, result: string, memoryUsage: number }>>(Array.from(activeThreads.values()));

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveThreadsList(Array.from(activeThreads.values()));
        }, 1000); // Mettez à jour toutes les secondes

        return () => clearInterval(interval);
    }, []);

    const handleTerminateThread = (id: string) => {
        activeThreads.delete(id);
        setActiveThreadsList(Array.from(activeThreads.values()));
        onTerminateThread(id); // Appeler la fonction pour fermer le composant CardId correspondant
    };

    return (
        <div className="thread-manager">
            <h2>Thread Manager</h2>
            {activeThreadsList.map((thread) => (
                <div key={thread.id} className="thread">
                    <p>Thread ID: {thread.id}</p>
                    <p>Type: {thread.type}</p>
                    <p>Title: {thread.content}</p>
                    <p>Memory Usage: {thread.memoryUsage} bytes</p>
                    <button onClick={() => handleTerminateThread(thread.id)}>Terminate Thread</button>
                </div>
            ))}
        </div>
    );
};

export default ThreadManager;
