import React from 'react';
import {Layout, ReactGridLayoutProps, Responsive, WidthProvider} from 'react-grid-layout';
import CardId from '../card/CardId';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { CardDataType } from "../remote/RemoteCards";

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridLayoutProps = {
    data: CardDataType[];
    setData: (value: CardDataType[]) => void;
    onResize?: ReactGridLayoutProps['onResize'];
};

const GridComponent: React.FC<GridLayoutProps> = ({ data, setData, onResize }) => {
    const onLayoutChange = (layout: Layout[]) => {
        const newData = layout.map(item => {
            const existingItem = data.find(d => d.id === item.i);
            return existingItem ? {
                ...existingItem,
                w: item.w,
                h: item.h,
                x: item.x,
                y: item.y
            }: null;
        }).filter(item => item !== null) as CardDataType[]; // filtration des non-valides et cast en CardDataType[]

        setData(newData);
    };

    return (
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            onLayoutChange={onLayoutChange}
            style={{ width: '100%', height: '100vh' }}
            onResize={onResize}
        >
            {data.map(({ id, content, title, x, y, w, h }) => (
                <div key={id} data-grid={{x: x, y: y, w: w, h: h}}>
                    <CardId id={id} title={title} content={content} />
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};

export default GridComponent;