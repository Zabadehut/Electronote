import React, { useState, useEffect } from 'react';
import GridComponent from './components/grid/GridComponent';
import { CardIdProps } from "./components/card/CardId";

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

        window.electron.ipcRenderer.on('zoom', handleZoom);

        return () => {
            window.electron.ipcRenderer.off('zoom', handleZoom);
        };
    }, []);

    return (
        <div>
            <GridComponent
                data={data}
                setData={setData}
                zoomFactor={zoomFactor} // Pass the zoomFactor prop
            />
        </div>
    );
};

export default App;
