import React from 'react';
import {CardIdProps, defaultCardIdProps} from "../card/CardId.tsx"; // Assurez-vous que le chemin d'importation est correct



export class CardsUiEventController {
    // Initialisation de l'état

        private cards: CardIdProps[];
        private setCards: React.Dispatch<React.SetStateAction<CardIdProps[]>>;
    constructor(data: CardIdProps[], setData:React.Dispatch<React.SetStateAction<CardIdProps[]>>) {
        this.cards = data;
        this.setCards = setData;
    }

    // Méthodes
    pinCard = (id: string) => {
        const newData = this.cards.map(card => {
            if (card.id === id) {
                return { ...card, isPinned: !card.isPinned };
            }
            return card;
        });
        this.setCards(newData);
    };

    removeCard = (id: string) => {
        const newData = this.cards.filter(card => card.id !== id && !card.isPinned);
        this.setCards(newData);
    };

    resizeCard = (id: string, dx: number, dy: number) => {
        const newData = this.cards.map(item => {
            if (item.id === id) {
                const newW = Math.max(item.minW, Math.min(item.maxW || Infinity, item.w + dx));
                const newH = Math.max(item.minH, Math.min(item.maxH || Infinity, item.h + dy));
                return { ...item, w: newW, h: newH };
            }
            return item;
        });
        this.setCards(newData);
    };

    addCard = () => {
        const newCard: CardIdProps = {
            ...defaultCardIdProps,
            onRemoveClicked: this.removeCard,
            onPinClicked: this.pinCard,
            onCardSizeChange: this.resizeCard,
        };

        const newData = [...this.cards, newCard];
        this.setCards(newData);
    };
}


