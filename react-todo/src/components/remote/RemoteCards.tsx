import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {CardIdProps} from "../card/CardId.tsx";
//import { CardDataType } from "./types";

type RemoteCardsProps = {
    data: CardIdProps[];
    setData: (value: CardIdProps[]) => void;
};


const RemoteCards: React.FC<RemoteCardsProps> = ({ data, setData }) => {

    const handleRemoveCard = useCallback((id:string) => {
        setData(data.filter(card => card.id !== id));
    }, [data, setData]);

    const addCard = useCallback(() => {
        const id=uuidv4()
        const newCard: CardIdProps = {
            id: id,
            title: `New Title: ${id}`,
            content: 'New Content',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            minW: 1,
            minH: 1,
            isNew: true,
            handleRemoveCard: handleRemoveCard,
        };
        setData([...data, newCard]);
    }, [data, setData]);

    return (
        <div>
            <button onClick={addCard}>Ajouter une nouvelle carte</button>
        </div>
    );
};

export default RemoteCards;
