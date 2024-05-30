//utils/localStorageUtils.ts

import { CardIdProps } from '../components/card/CardId';

export const saveNotesToLocalStorage = (notes: CardIdProps[]) => {
    localStorage.setItem('notes', JSON.stringify(notes));
};

export const loadNotesFromLocalStorage = (): CardIdProps[] => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
};
