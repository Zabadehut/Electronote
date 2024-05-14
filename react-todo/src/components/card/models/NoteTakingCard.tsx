import React, { useState, useEffect } from 'react';
import { CardIdProps } from '../CardId';
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

    const calculateCounts = (text: string) => {
        const letters = text.length;
        const words = text.match(/\b[-?(\w+)?]+\b/gi)?.length || 0;
        const sentences = text.match(/[\w|\)][.?!](\s|$)/g)?.length || 0;
        const paragraphs = text.split(/\n+/).filter(paragraph => paragraph.trim().length > 0).length;
        return { letters, words, sentences, paragraphs };
    };

    const [counts, setCounts] = useState({ letters: 0, words: 0, sentences: 0, paragraphs: 0 });

    useEffect(() => {
        if (props.id !== note.id) {
            setNote({
                ...note,
                id: props.id,
                content: "Type here..."
            });
        }
        setCounts(calculateCounts(editedContent));
    }, [props.id, note.id, editedContent]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        setNote({
            ...note,
            content: editedContent
        });
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedContent(event.target.value);
    };

    function formatContentForDisplay(content: string): JSX.Element[] {
        return content.split('\n').map((item, key) => (
            <React.Fragment key={key}>
                {item}
                <br />
            </React.Fragment>
        ));
    }

    return (
        <div className={`note-taking-card ${note.isPinned ? 'pinned' : ''}`} onMouseDown={e => e.stopPropagation()}>
            <div className="note-taking-card-content">
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={handleContentChange}
                        style={{ minHeight: '100px', maxHeight: '300px', overflowY: 'auto' }}
                    />
                ) : (
                    <div>{formatContentForDisplay(note.content)}</div>
                )}
            </div>
            <div className="note-taking-controls">
                {isEditing ? (
                    <button onClick={handleSaveClick}>Enregistrer</button>
                ) : (
                    <button onClick={handleEditClick}>Éditer</button>
                )}
                <div className="note-taking-card-info">
                    Lettres: {counts.letters}, Mots: {counts.words}, Phrases: {counts.sentences}, Paragraphes: {counts.paragraphs}
                </div>
            </div>
        </div>
    );


};

export default NoteTakingCard;
