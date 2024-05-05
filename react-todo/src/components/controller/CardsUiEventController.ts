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

        const id: string = uuidv4();
        const minW = 1;
        const minH = 1;
        const cols = 12;

        // Créer une grille de l'écran visible
        const visibleRows = 10;
        let grid = Array.from({ length: visibleRows }, () => Array(cols).fill(false));

        // Remplir la grille avec les positions des cartes existantes
        this.cards.forEach(card => {
            for (let x = card.x; x < card.x + card.w; x++) {
                for (let y = card.y; y < card.y + card.h; y++) {
                    if (y < visibleRows) {
                        grid[y][x] = true;
                    }
                }
            }
        });

        // Trouver la première position vide dans la grille visible
        let minX = 0;
        let minY = visibleRows;
        for (let y = 0; y < visibleRows; y++) {
            for (let x = 0; x <= cols - minW; x++) {
                if (grid[y].slice(x, x + minW).every(cell => !cell)) {
                    minX = x;
                    minY = y;
                    break;
                }
            }
            if (minY < visibleRows) {
                break;
            }
        }

        // Si aucun espace n'a été trouvé dans la zone visible, placer la carte en dessous de toutes les autres
        if (minY == visibleRows) {
            const positions = Array(cols).fill(0);
            this.cards.forEach(card => {
                for (let i = 0; i < card.w; i++) {
                    positions[card.x + i] = Math.max(positions[card.x + i], card.y + card.h);
                }
            });
            minY = Math.min(...positions);
            minX = positions.indexOf(minY);
        }

        const newCard: CardIdProps = {
            ...defaultCardIdProps,
            id,
            x: minX,
            y: minY,
            w: minW,
            h: minH,
            title: `New Title: ${id}`,
            onRemoveClicked: (id: string): void => this.removeCard(id),
            onPinClicked: (id: string): void => this.pinCard(id),
            onCardSizeChange: (id: string, dx: number, dy: number): void => this.resizeCard(id, dx, dy),
        };

        const newData: CardIdProps[] = [...this.cards, newCard];
        this.setCards(newData);
    };


    moveCardsToTopLeft = (): void => {
        const cols = 12;
        const positions = Array(cols).fill(0);
        const newData = [...this.cards].sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }
            return a.y - b.y || a.x - b.x;
        }).map(card => {
            if (card.isPinned) {
                // Garder la position pour les cartes verrouillées
                for (let i = 0; i < card.w; i++) {
                    positions[card.x + i] = Math.max(positions[card.x + i], card.y + card.h);
                }
                return card;
            }

            // Trouver la première position vide pour la carte
            let minX = 0;
            let minY = Math.max(...positions);
            for (let x = 0; x <= cols - card.w; x++) {
                const y = Math.max(...positions.slice(x, x + card.w));
                if (y < minY) {
                    minY = y;
                    minX = x;
                }
            }

            // Mettre à jour les positions
            for (let i = 0; i < card.w; i++) {
                positions[minX + i] = minY + card.h;
            }

            return { ...card, x: minX, y: minY };
        });

        this.setCards(newData);
    };
}