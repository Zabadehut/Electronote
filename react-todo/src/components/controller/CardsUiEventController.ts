import React from 'react';
import {CardIdProps, defaultCardIdProps} from "../card/CardId.tsx"; // Assurez-vous que le chemin d'importation est correct
import { v4 as uuidv4 } from 'uuid';



export class CardsUiEventController {
    private readonly cards: CardIdProps[];
    private readonly setCards: React.Dispatch<React.SetStateAction<CardIdProps[]>>;

    constructor(data: CardIdProps[], setData: React.Dispatch<React.SetStateAction<CardIdProps[]>>) {
        this.cards = data;
        this.setCards = setData;
    }

    getNextPosition = () => {
        const maxY = Math.max(...this.cards.map(card => card.y + card.h), 0);
        return {x: 0, y: maxY};
    }

    // Méthodes
    pinCard = (id: string) => {
        console.log("pinCard")
        const newData = this.cards.map(card => {
            if (card.id === id) {
                return {...card, isPinned: !card.isPinned};
            }
            return card;
        });
        this.setCards(newData);
    };

    removeCard = (id: string) => {
        console.log("removeCard")
        const newData = this.cards.filter(card => card.id !== id && !card.isPinned);
        this.setCards(newData);
    };

    resizeCard = (id: string, dx: number, dy: number) => {
        console.log("resizeCard")
        const newData = this.cards.map(item => {
            if (item.id === id) {
                const newW = Math.max(item.minW, Math.min(item.maxW || Infinity, item.w + dx));
                const newH = Math.max(item.minH, Math.min(item.maxH || Infinity, item.h + dy));
                return {...item, w: newW, h: newH};
            }
            return item;
        });
        this.setCards(newData);
    };

    addCard = (): void => {
        console.log("addCard");

        // Generates a unique `id`
        const id: string = uuidv4();
        const {x, y}: { x: number, y: number } = this.getNextPosition();

        const newCard: CardIdProps = {
            ...defaultCardIdProps,
            id,  // Uses the unique `id`
            x,
            y,
            title: `New Title: ${id}`,
            onRemoveClicked: (id: string): void => this.removeCard(id),
            onPinClicked: (id: string): void => this.pinCard(id),
            onCardSizeChange: (id: string, dx: number, dy: number): void => this.resizeCard(id, dx, dy),
        };

        const newData: CardIdProps[] = [...this.cards, newCard];
        this.setCards(newData);
    };
}