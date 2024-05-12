// Dans chaque fichier, assurez-vous d'exporter le composant, par exemple :
import React from 'react';
import './WebContentCard.css'

const WeatherContentCard: React.FC<{content: string}> = ({ content }) => {
    return <div>{content}</div>;
};

export default WeatherContentCard;