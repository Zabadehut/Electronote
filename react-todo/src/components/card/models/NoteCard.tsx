import React from 'react';

type NoteCardProps = {
    id: string;
    title: string;
    content: string;
    onDelete: (id: string) => void;
    onEdit: (id: string, newTitle: string, newContent: string) => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ id, title, content, onDelete, onEdit }) => {
    return (
        <div className="note-card">
            <h3>{title}</h3>
            <p>{content}</p>
            <button onClick={() => onEdit(id, title, content)}>Edit</button>
            <button onClick={() => onDelete(id)}>Delete</button>
        </div>
    );
};

export default NoteCard;
