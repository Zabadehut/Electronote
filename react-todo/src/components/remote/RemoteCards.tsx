import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type CardDataType = {
    id: string,
    title: string,
    content: string,
    x: number,
    y: number,
    w: number,
    h: number,
    minW: number,
    minH: number,
    locked?: boolean;
    isNew?: boolean;
};

type RemoteCardsProps = {
    data: CardDataType[];
    setData: (value: CardDataType[]) => void;
};

const RemoteCards: React.FC<RemoteCardsProps> = ({ data, setData }) => {

    const addCard = useCallback((card: Partial<CardDataType>) => {
        const newCard: CardDataType = {
            id: card.id || uuidv4(), // générer un nouvel id si aucun n'est passé
            title: card.title || '',
            content: card.content || '',
            w: card.w || 1,
            h: card.h || 1,
            x: card.x || 0,
            y: card.y || 0,
            minW: card.minW || 1,
            minH: card.minH || 1,
            isNew: true,
        };

        setData([...data, newCard]);
    }, [data, setData]);

    return (
        <div>
            {data.map(card => (
                <div key={card.id}>
                    <h2>{card.title}</h2>
                    <p>{card.content}</p>
                    {!card.isNew && (<>
                        <button onClick={() => removeCard(card.id)}>Remove this card</button>
                        <button onClick={() => card.locked ? onUnlockCard(card.id) : onLockCard(card.id)}>
                            {card.locked ? 'Unlock this card' : 'Lock this card'}
                        </button>
                    </>)}
                </div>
            ))}
            <button onClick={() => addCard({})}>
                Add a new card
            </button>
        </div>
    );
};

export default RemoteCards;