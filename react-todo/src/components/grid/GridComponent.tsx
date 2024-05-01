import React from 'react';
import {Layout, ReactGridLayoutProps, Responsive, WidthProvider} from 'react-grid-layout';
import CardId from '../card/CardId';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridLayoutProps = {
    data: {
        id: string;
        title: string;
        content: string;
        x: number;
        y: number;
        minW: number;
        minH: number;
        w: number;
        h: number;
    }[];
    onLayoutChange: (layout: Layout[]) => void;
    onResize?: ReactGridLayoutProps['onResize'];
};

const GridComponent: React.FC<GridLayoutProps> = ({ data, onLayoutChange, onResize }) => (
    <ResponsiveGridLayout
        className="layout"
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
        onLayoutChange={onLayoutChange}
        style={{ width: '100%', height: '100vh' }}
        onResize={onResize}
        onResizeStop={onResize}
    >
        {data.map(({ id, content, title, x, y, minW, minH }) => (
            <div key={id} data-grid={{x: x, y: y, w: minW, h: minH}}>
                <CardId title={title} content={content} />
            </div>
        ))}
    </ResponsiveGridLayout>
);

export default GridComponent;