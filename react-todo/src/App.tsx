import React, { useState, useCallback } from 'react';
import GridComponent from './components/grid/GridComponent';
import RemoteGrid from './components/remote/RemoteGrid';
import RemoteCards from './components/remote/RemoteCards'; // <- Ajoutez cette ligne
import { Layout } from 'react-grid-layout';
import { CardDataType } from './components/remote/RemoteCards';

const App: React.FC = () => {
    const [data, setData] = useState<CardDataType[]>([
        { id: "exampleId", title: "Example Title", content: "Example Content", x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 }
    ]);

    const onUnlockCard = useCallback((id: string) => {
        console.log(`OnUnlockCard called with id: ${id}`);
    }, []);

    const onLockCard = useCallback((id: string) => {
        console.log(`OnLockCard called with id: ${id}`);
    }, []);

    const removeCard = useCallback((id: string) => {
        console.log(`RemoveCard called with id: ${id}`);
    }, []);

    const addSlot = useCallback(() => {
        console.log(`AddSlot called`);
    }, []);

    const removeSlot = useCallback(() => {
        console.log(`RemoveSlot called`);
    }, []);

    const onLayoutChange = useCallback((layout: Layout[]) => {
        console.log(`OnLayoutChange called with layout:`, layout);
    }, []);

    return (
        <div>
            <RemoteCards
                data={data}
                setData={setData}
                removeCard={removeCard}
                onUnlockCard={onUnlockCard}
                onLockCard={onLockCard}
            />
            <RemoteGrid
                data={data}
                setData={setData}
                modifySlots={() => {}}
                addSlot={addSlot}
                removeSlot={removeSlot}
                slotCount={0}
            />
            <GridComponent
                data={data}
                setData={setData}
                onLayoutChange={onLayoutChange}
            />
        </div>
    );
};

export default App;