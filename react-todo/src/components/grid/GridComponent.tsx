import React from 'react';
import './GridComponent.css';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import CardId, { CardIdProps } from "../card/CardId";
import { CardsUiEventController } from "../controller/CardsUiEventController";

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridLayoutProps = {
    data: CardIdProps[];
    setData: React.Dispatch<React.SetStateAction<CardIdProps[]>>;
};

const GridComponent: React.FC<GridLayoutProps> = ({ data, setData }) => {
    const controller = new CardsUiEventController(data, setData);

    return (
        <div>
            <button onClick={() => controller.addCard()}>Ajouter une nouvelle carte</button>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ResponsiveGridLayout
                    className="layout"
                    cols={{ lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 }}
                    autoSize={true}
                    isResizable={true}
                    compactType={null}
                    preventCollision={true}
                    onLayoutChange={(layout: Layout[]) => {
                        const newCards = layout.map(({ i, x, y, w, h }) => {
                            const card = data.find(d => d.id === i);
                            if (!card) {
                                throw new Error(`Card not found for id ${i}`);
                            }
                            return {
                                ...card,
                                x,
                                y,
                                w,
                                h,
                                title: card.title || 'Default Title',
                                content: card.content || 'Default Content',
                                id: card.id
                            };
                        });
                        setData(newCards);
                    }}
                    // Capture l'événement de redimensionnement
                    onResizeStop={(_, oldItem: Layout, newItem: Layout) => {
                        controller.resizeCard(newItem.i, newItem.w - oldItem.w, newItem.h - oldItem.h);
                    }}
                >
                    {data.map(item => (
                        <div
                            key={item.id}
                        data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h, minW: item.minW, minH: item.minH }}
                        >
                        <CardId {...item} onCardSizeChange={(id, dx, dy) => controller.resizeCard(id, dx, dy)} />
                        </div>
                        ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default GridComponent;