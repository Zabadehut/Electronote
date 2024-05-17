import React, { useState, useEffect, useRef } from 'react';
import { CardIdProps } from '../CardId';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import "./NoteTakingCard.css";

// Enregistrement du module de redimensionnement d'image
Quill.register('modules/imageResize', ImageResize);

const NoteTakingCard: React.FC<CardIdProps> = (props) => {
    const [note, setNote] = useState({
        id: props.id,
        title: 'New Note',
        content: 'Type here...',
        x: 0, y: 0, w: 2, h: 2,
        minW: 1, minH: 1,
        isNew: true,
        isPinned: false,
        type: 'note',
        cards: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(note.content);
    const quillRef = useRef<HTMLDivElement | null>(null);
    const quillInstanceRef = useRef<Quill | null>(null);

    const calculateCounts = (text: string) => {
        const div = document.createElement('div');
        div.innerHTML = text;

        // Ignorer les images et vidéos pour le comptage des lettres, mots, phrases et paragraphes
        const innerText = Array.from(div.childNodes).reduce((acc, node) => {
            if (node.nodeName !== 'IMG' && node.nodeName !== 'IFRAME') {
                return acc + (node.textContent || '');
            }
            return acc;
        }, '');

        const letters = innerText.length;
        const words = innerText.trim().split(/\s+/).filter(Boolean).length;
        const sentences = innerText.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = innerText.split(/\n+/).filter(paragraph => paragraph.trim().length > 0).length;

        // Compter les images et vidéos
        const images = div.getElementsByTagName('img').length;
        const videos = div.getElementsByTagName('iframe').length;

        return { letters, words, sentences, paragraphs, images, videos };
    };

    const [counts, setCounts] = useState({ letters: 0, words: 0, sentences: 0, paragraphs: 0, images: 0, videos: 0 });

    useEffect(() => {
        setCounts(calculateCounts(editedContent));
    }, [editedContent]);

    useEffect(() => {
        if (props.id !== note.id) {
            setNote(prevNote => ({
                ...prevNote,
                id: props.id,
                content: 'Type here...'
            }));
            setEditedContent('Type here...');
        }
    }, [props.id]);

    useEffect(() => {
        if (quillRef.current && !quillInstanceRef.current) {
            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'font': [] }, { 'size': [] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    imageResize: {
                        parchment: Quill.import('parchment'),
                        modules: ['Resize', 'DisplaySize', 'Toolbar']
                    }
                }
            });

            quill.on('text-change', () => {
                const textContent = quill.root.innerHTML;
                setEditedContent(textContent);
                setCounts(calculateCounts(textContent));
            });

            quillInstanceRef.current = quill;
        }

        if (isEditing && quillInstanceRef.current) {
            quillInstanceRef.current.enable();
            quillInstanceRef.current.root.innerHTML = editedContent;
        } else if (quillInstanceRef.current) {
            quillInstanceRef.current.disable();
        }
    }, [isEditing]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        setNote(prevNote => ({
            ...prevNote,
            content: editedContent
        }));
    };

    return (
        <div className={`note-taking-card ${note.isPinned ? 'pinned' : ''}`} onMouseDown={e => e.stopPropagation()}>
            <div className="note-taking-card-content">
                <div ref={quillRef} className="quill-editor-container" />
            </div>
            <div className="note-taking-controls">
                {isEditing ? (
                    <button onClick={handleSaveClick}>Enregistrer</button>
                ) : (
                    <button onClick={handleEditClick}>Éditer</button>
                )}
                <div className="note-taking-card-info">
                    Lettres: {counts.letters}, Mots: {counts.words}, Phrases: {counts.sentences}, Paragraphes: {counts.paragraphs}, Images: {counts.images}, Vidéos: {counts.videos}
                </div>
            </div>
        </div>
    );
};

export default NoteTakingCard;
