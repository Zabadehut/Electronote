import React, { useState } from 'react';
import GridComponent from './components/grid/GridComponent';
import RemoteCards, { CardDataType } from './components/remote/RemoteCards';
import RemoteGrid from './components/remote/RemoteGrid';
import { Layout } from 'react-grid-layout';


const App: React.FC = () => {
    const [data, setData] = useState<CardDataType[]>([
        { id: "exampleId", title: "Example Title", content: "Example Content", x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 }
    ]);
    const [slotCount, setSlotCount] = useState(0);

    const onLayoutChange = (layout: Layout[]) => {
        const newData = layout.map(item => {
            const existingItem = data.find(d => d.id === item.i);
            if (existingItem) {
                return {
                    ...existingItem,
                    w: item.w,
                    h: item.h,
                    x: item.x,
                    y: item.y
                };
            }
            return null;
        }).filter(item => item !== null); // filtrer les non-valides
        setData(newData as CardDataType[]); // cast en CardDataType[]
    };

    return (
        <div>
            <RemoteCards data={data} setData={setData} /> {/* utilisez les fonctions déclarées */}
            <GridComponent data={data} onLayoutChange={onLayoutChange} />

        </div>
    );
};

export default App;