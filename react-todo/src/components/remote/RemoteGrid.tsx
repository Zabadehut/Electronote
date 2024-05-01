import React, { useCallback } from 'react';

type RemoteGridProps = {
    slotCount: number; // Nombre réel de slots
    addSlot: () => void; // Ajoute un slot
    removeSlot: () => void; // Retire un slot
};


const RemoteGrid: React.FC<RemoteGridProps> = ({ slotCount, modifySlots }) => {

    const onAddSlot = useCallback(() => {
        addSlot();
    }, [addSlot]);

    const onRemoveSlot = useCallback(() => {
        removeSlot();
    }, [removeSlot]);

    const onHighlightSlots = useCallback((slots: number[]) => {
        // Dans le cas échéant "onHighlightSlots" pourrait nécessiter une logique plus complexe,
        // selon ce que "surligner" signifie dans le contexte de votre application.
        console.log(`Highlighting slots: ${slots.join(', ')}...`);
    }, [modifySlots]);

    return (
        <div>
            <p>Slots count: {slotCount}</p>
            <button onClick={onAddSlot}>Add Slot</button>
            <button onClick={onRemoveSlot}>Remove Slot</button>
            {/* Pour l'instant, onHighlightSlots est simplement raccroché à un bouton d'exemple. */}
            <button onClick={() => onHighlightSlots([0, 1, 2])}>Highlight Slots</button>
        </div>
    );
};

export default RemoteGrid;