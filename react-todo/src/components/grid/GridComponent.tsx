import React from 'react';
import './GridComponent.css';
import {Responsive, WidthProvider} from 'react-grid-layout';
import CardId, {CardIdProps} from "../card/CardId.tsx";
import {CardsUiEventController} from "../controller/CardsUiEventController.ts";

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridLayoutProps = {
    data: CardIdProps[]; // Utilisez seulement 'data'
    setData: React.Dispatch<React.SetStateAction<CardIdProps[]>>;
};

const GridComponent: React.FC<GridLayoutProps> = ({data, setData}) => {
const controller = new CardsUiEventController(data, setData)
    return (
        <div>
            <button onClick={() => controller.addCard()}>Ajouter une nouvelle carte</button>
            <div style={{width: '100vw', height: '100vh'}}>
                <ResponsiveGridLayout
                    className="layout"
                    cols={{lg: 12, md: 10, sm: 8, xs: 4, xxs: 2}}
                    rowHeight={150}
                    autoSize={true}
                    compactType={null} // <-- ici
                    preventCollision={true}
                >
                    {data.map(item => (
                        <div key={item.id}
                             data-grid={{x: item.x, y: item.y, w: item.w, h: item.h, minW: item.minW, minH: item.minH}}>
                            <CardId {...item} onCardSizeChange={(id, dx, dy)=>controller.resizeCard(id, dx, dy)}/>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default GridComponent;