import React, { useState, useEffect } from 'react';
import { CardIdProps } from '../CardId';  // Assurez-vous que le chemin est correct
import "./NoteTakingCard.css";

const NoteTakingCard: React.FC<CardIdProps> = (props) => {
    const [note, setNote] = useState({
        id: props.id,
        title: "New Note",
        content: "Type here...",
        x: 0, y: 0, w: 2, h: 2,
        minW: 1, minH: 1,
        isNew: true,
        isPinned: false,
        type: 'note',
        cards: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(note.content);

    useEffect(() => {
        setNote({
            ...note,
            id: props.id
        });
    }, [props.id]);

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsEditing(true);
    };


    const handleSaveClick = () => {
        setIsEditing(false);
        setNote({
            ...note,
            content: editedContent
        });
        // Logic to save the note can be implemented here
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedContent(event.target.value);
    };

    return (
        <div className={`note-taking-card ${note.isPinned ? 'pinned' : ''}`} onMouseDown={e => e.stopPropagation()}>
            {isEditing ? (
                <>
                    <textarea
                        value={editedContent}
                        onChange={handleContentChange}
                        rows={4}
                        cols={50}
                    />
                    <button onClick={handleSaveClick}>Enregistrer</button>
                </>
            ) : (
                <>
                    <p>{note.content}</p>
                    <button onClick={handleEditClick}>Éditer</button>
                </>
            )}
        </div>
    );
};

export default NoteTakingCard;
