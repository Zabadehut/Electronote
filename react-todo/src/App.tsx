import React, {useState} from 'react';
import GridComponent from './components/grid/GridComponent';
import {CardIdProps} from "./components/card/CardId";

const App: React.FC = () => {
    const [data, setData] = useState<CardIdProps[]>([]);

    return (
        <div>
            <GridComponent
                data={data}
                setData={setData}
            />
        </div>
    );
};

export default App;
