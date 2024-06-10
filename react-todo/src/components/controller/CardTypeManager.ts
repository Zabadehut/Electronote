import { CardIdProps } from '../card/CardId'; // Assurez-vous que le chemin est correct
import React from 'react';

export const updateCardType = (
    cards: CardIdProps[],
    setCards: React.Dispatch<React.SetStateAction<CardIdProps[]>>,
    id: string,
    newType: CardIdProps['type']
) => {
    const updatedCards = cards.map(card => {
        if (card.id === id) {
            return { ...card, type: newType };
        }
        return card;
    });
    setCards(updatedCards);
};

import TextContentCard from '../card/models/TextContentCard';
import CodeContentCard from '../card/models/CodeContentCard';
import FileContentCard from '../card/models/FileContentCard';
import WebContentCard from '../card/models/WebContentCard';
import YouTubeVideoCard from '../card/models/YouTubeVideoCard';
import WeatherContentCard from '../card/models/WeatherContentCard';
import SearchContentInApp from '../card/models/SearchContentInApp';
import NoteTakingCard from '../card/notes/NoteTakingCard';
import FluxRssReader from '../card/models/FluxRssReader';
import LoadContentCard from '../card/models/LoadContentCard';
import ToDoList from '../card/todolist/ToDoList';
import HourTime from '../card/times/HourTime';
import ThreadManager from '../thread/ThreadManager'; // Import du ThreadManager

const cardComponentMap = {
    text: TextContentCard,
    code: CodeContentCard,
    file: FileContentCard,
    web: WebContentCard,
    you: YouTubeVideoCard,
    weather: WeatherContentCard,
    search: SearchContentInApp,
    note: NoteTakingCard,
    rss: FluxRssReader,
    loadContent: LoadContentCard,
    hourTime: HourTime,
    toDoList: ToDoList,
    threadManager: ThreadManager, // Ajout du ThreadManager
};

const cardComponentProps: Record<string, any> = {
    web: { query: '' },
    you: { url: '' },
};

export type CardType = keyof typeof cardComponentMap;

export { cardComponentMap, cardComponentProps };
