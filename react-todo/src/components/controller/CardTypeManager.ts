//CardTypeManager.ts
import {CardIdProps} from "@components/card/CardId.tsx";
import React from "react";


export const updateCardType = (cards: CardIdProps[], setCards: React.Dispatch<React.SetStateAction<CardIdProps[]>>, id: string, newType: CardIdProps['type']) => {
    const updatedCards = cards.map(card => {
        if (card.id === id) {
            return { ...card, type: newType };
        }
        return card;
    });
    setCards(updatedCards);
};