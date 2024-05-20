import React, { useState, useEffect, useRef } from 'react';
import { CardIdProps } from '../CardId';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import './NoteTakingCard.css';
import QuillToolbar, { modules, formats } from './QuillToolbar';
import { v4 as uuidv4 } from 'uuid';

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
    const toolbarId = `toolbar-${uuidv4()}`;

    const calculateCounts = (text: string) => {
        const byteCount = new Blob([text]).size;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const elements = Array.from(doc.body.childNodes).filter(node => node.nodeName !== 'IMG' && node.nodeName !== 'IFRAME');
        const innerText = elements.reduce((acc, node) => acc + (node.textContent || ''), '');
        const letters = innerText.length;
        const words = innerText.trim().split(/\s+/).filter(Boolean).length;
        const sentences = innerText.split(/[.!?]+/).filter(Boolean).length;
        const blockElements = ['P', 'DIV', 'BLOCKQUOTE', 'PRE'];
        const paragraphs = elements.filter(node => blockElements.includes(node.nodeName) && (node.textContent || '').trim().length > 0).length;
        const images = doc.getElementsByTagName('img').length;
        const videos = doc.getElementsByTagName('iframe').length;
        return { byteCount, letters, words, sentences, paragraphs, images, videos };
    };


    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Octets';
        const k = 1024;
        const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };




    const [counts, setCounts] = useState({
        letters: 0, words: 0, sentences: 0, paragraphs: 0, images: 0, videos: 0, byteCount: 0
    });

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
                    toolbar: modules(toolbarId).toolbar,
                    imageResize: {} // Activation du module de redimensionnement d'image
                },
                formats: formats
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
                <QuillToolbar toolbarId={toolbarId} />
                <div ref={quillRef} className="quill-editor-container" />
            </div>
            <div className="note-taking-controls">
                {isEditing ? (
                    <button onClick={handleSaveClick}>Enregistrer</button>
                ) : (
                    <button onClick={handleEditClick}>Éditer</button>
                )}
                <div className="note-taking-card-info">
                    Lettres: {formatNumber(counts.letters)}, Mots: {formatNumber(counts.words)},
                    Phrases: {formatNumber(counts.sentences)}, Paragraphes: {formatNumber(counts.paragraphs)},
                    Images: {formatNumber(counts.images)}, Vidéos: {formatNumber(counts.videos)},
                    Octets: {formatBytes(counts.byteCount)}
                </div>
            </div>
        </div>
    );
};

export default NoteTakingCard;
