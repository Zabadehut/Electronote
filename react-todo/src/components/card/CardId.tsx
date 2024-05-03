import React from 'react';
import './CardId.css';


export type CardIdProps = {
    id: string,
    title: string,
    content: string,
    x: number,
    y: number,
    w: number,
    h: number,
    minW: number,
    minH: number,
    isNew?: boolean;
    handleRemoveCard: (id:string) => void,
};


const CardId: React.FC<CardIdProps> = ({ id, title, content, handleRemoveCard }) => {
    return (
        <div className="card" id={id}>
            <h4>{title}</h4>
            <p>{content}</p>
            <button onClick={()=>handleRemoveCard(id)}>Supprimer cette carte</button>
        </div>
    );
};

export default CardId;
