import React, { useState, useEffect } from 'react';
import GridComponent from './components/grid/GridComponent';
import { CardIdProps } from "./components/card/CardId";
import ThreadManager from './components/thread/ThreadManager';

const App: React.FC = () => {
    const [data, setData] = useState<CardIdProps[]>([]);
    const [zoomFactor, setZoomFactor] = useState<number>(1);

    useEffect(() => {
        const handleZoom = (_event: any, deltaY: number) => {
            setZoomFactor((prev) => {
                let newZoomFactor = prev + (deltaY > 0 ? -0.1 : 0.1);
                newZoomFactor = Math.max(0.5, Math.min(2.0, newZoomFactor)); // Limites du zoom
                return newZoomFactor;
            });
        };

        if (window.electron && window.electron.ipcRenderer) {
            window.electron.ipcRenderer.on('zoom', handleZoom);

            return () => {
                window.electron.ipcRenderer.off('zoom', handleZoom);
            };
        }
    }, []);

    const handleTerminateThread = (id: string) => {
        setData(prevData => prevData.filter(card => card.id !== id));
    };

    return (
        <div>
            <GridComponent
                data={data}
                setData={setData}
                zoomFactor={zoomFactor} // Pass the zoomFactor prop
            />
            <ThreadManager onTerminateThread={handleTerminateThread} />
        </div>
    );
};

export default App;
