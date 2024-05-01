import React from 'react';
import './CardId.css';

type CardIdProps = {
    id: string;
    addCard: (card: { id: string, title: string, content: string, x: number, y: number, minW: number, minH: number }) => void;
    removeCard: (id: string) => void;
    title: string;
    content: string;
};

const CardId: React.FC<CardIdProps> = ({ id, title, content }) => {
    return (
        <div className="card" id={id}>
            <h3>{title}</h3>
            <p>{content}</p>
        </div>
    );
};

export default CardId;