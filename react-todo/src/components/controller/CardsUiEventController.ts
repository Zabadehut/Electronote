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

        const id: string = uuidv4();
        const minW = 1;
        const minH = 1;
        const cols = 12;

        let grid = Array.from({ length: 100 }, () => Array(cols).fill(false));
        let newCards: React.SetStateAction<CardIdProps[]> = [...this.cards];

        this.cards.forEach(card => {
            for (let x = card.x; x < card.x + card.w; x++) {
                for (let y = card.y; y < card.y + card.h; y++) {
                    grid[y][x] = true;
                }
            }
        });

        let minX = 0;
        let minY = 0;
        let placed = false;

        for (let y = 0; y < grid.length && !placed; y++) {
            for (let x = 0; x <= cols - minW && !placed; x++) {
                if (grid[y].slice(x, x + minW).every(cell => !cell)) {
                    minX = x;
                    minY = y;
                    placed = true;
                }
            }
        }

        const newCard: CardIdProps = {
            ...defaultCardIdProps,
            id,
            x: minX,
            y: minY,
            w: minW,
            h: minH,
            title: `New Title: ${id}`,
        };

        newCards.push(newCard);
        this.setCards(newCards);
    };


    moveCardsToTopLeft = (): void => {
        const cols = 12;
        let filledPositions = Array.from({ length: 100 }, () => Array(cols).fill(false));
        const pinnedCards = this.cards.filter(card => card.isPinned);
        const unpinnedCards = this.cards.filter(card => !card.isPinned);

        // Trier les cartes non épinglées par taille (les plus grandes d'abord)
        unpinnedCards.sort((a, b) => (b.w * b.h) - (a.w * a.h));

        // Conserver les positions des cartes épinglées
        pinnedCards.forEach(card => {
            for (let x = card.x; x < card.x + card.w; x++) {
                for (let y = card.y; y < card.y + card.h; y++) {
                    filledPositions[y][x] = true;
                }
            }
        });

        const newUnpinnedCards = unpinnedCards.map(card => {
            let minX = 0;
            let minY = 0;
            let placed = false;

            for (let y = 0; y < filledPositions.length && !placed; y++) {
                for (let x = 0; x <= cols - card.w && !placed; x++) {
                    if (filledPositions[y].slice(x, x + card.w).every(cell => !cell)) {
                        minX = x;
                        minY = y;
                        placed = true;
                    }
                }
            }

            for (let x = minX; x < minX + card.w; x++) {
                for (let y = minY; y < minY + card.h; y++) {
                    filledPositions[y][x] = true;
                }
            }

            return { ...card, x: minX, y: minY };
        });

        // Compact the layout by moving cards up into empty spaces
        filledPositions = Array.from({ length: 100 }, () => Array(cols).fill(false));
        pinnedCards.forEach(card => {
            for (let x = card.x; x < card.x + card.w; x++) {
                for (let y = card.y; y < card.y + card.h; y++) {
                    filledPositions[y][x] = true;
                }
            }
        });

        const compactedCards = newUnpinnedCards.map(card => {
            for (let y = 0; y < filledPositions.length; y++) {
                for (let x = 0; x <= cols - card.w; x++) {
                    if (filledPositions[y].slice(x, x + card.w).every(cell => !cell)) {
                        card.x = x;
                        card.y = y;
                        for (let i = x; i < x + card.w; i++) {
                            for (let j = y; j < y + card.h; j++) {
                                filledPositions[j][i] = true;
                            }
                        }
                        return card;
                    }
                }
            }
            return card;
        });

        this.setCards([...pinnedCards, ...compactedCards]);
    };

}