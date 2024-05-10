// Dans chaque fichier, assurez-vous d'exporter le composant, par exemple :
import React from 'react';

const WebContentCard: React.FC<{content: string}> = ({ content }) => {
    return <div>{content}</div>;
};

export default WebContentCard;