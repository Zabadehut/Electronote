import React, { useState } from 'react';
import GridComponent from './components/grid/GridComponent';
import RemoteCards from './components/remote/RemoteCards';
import { CardIdProps } from "./components/card/CardId";

const App: React.FC = () => {
    const [data, setData] = useState<CardIdProps[]>([
        //template à prévoir
    ]);

    return (
        <div>
            <RemoteCards
                data={data}
                setData={setData}
            />
            <GridComponent
                data={data}
                setData={setData}
            />
        </div>
    );
};

export default App;