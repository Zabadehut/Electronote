import React, {useCallback} from 'react';
import './GridComponent.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import CardId, { CardIdProps } from "../card/CardId";


const ResponsiveGridLayout = WidthProvider(Responsive);

type GridLayoutProps = {
    data: CardIdProps[];
    setData: (value: CardIdProps[]) => void;
};

const GridComponent: React.FC<GridLayoutProps> = ({ data, setData }) => {

    const handleRemoveCard = useCallback((id:string) => {
        setData(data.filter(card => card.id !== id));
    }, [data, setData]);

    return (
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            style={{ width: '100%', height: '100vh' }}
        >
            {data.map(({ id, title, content, x, y, w, h, minW, minH }) => (
                <div
                    className="card"
                    key={id}
                    data-grid={{ x, y, w, h, minW, minH }}
                >
                    <CardId id={id} title={title} content={content} handleRemoveCard={handleRemoveCard} x={x} y={y} h={h} w={w} minH={minH} minW={minW} />
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};

export default GridComponent;
