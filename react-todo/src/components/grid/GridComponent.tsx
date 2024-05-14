import React, { useState, useEffect, useRef } from 'react';
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
    const [headerVisible, setHeaderVisible] = useState(true);
    const [headerHeight] = useState(60); // Default height
    let timeoutId: NodeJS.Timeout;
    const mainContainerRef = useRef<HTMLDivElement>(null); // Ref for the main container
    const [isDraggable, setIsDraggable] = useState(true); // State to control dragging

    const toggleDraggable = () => {
        setIsDraggable(!isDraggable); // Toggle the draggable state
    };

    const changeCardType = (id: string, newType: CardIdProps['type']) => {
        const updatedCards = data.map(card => {
            if (card.id === id) {
                return { ...card, type: newType };
            }
            return card;
        });
        setData(updatedCards);
    };


    const handleMoveCards = () => {
        controller.moveCardsToTopLeft();
    };

    const handleMouseMove = (e: MouseEvent) => {
        clearTimeout(timeoutId);
        if (e.clientY < 100) {
            setHeaderVisible(true);
        } else {
            timeoutId = setTimeout(() => {
                setHeaderVisible(false);
            }, 2000);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        if (mainContainerRef.current) {
            mainContainerRef.current.style.paddingTop = `${headerVisible ? headerHeight : 0}px`;
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeoutId);
        };
    }, [headerVisible, headerHeight]);

    return (
        <div>
            <div className={`header-container ${headerVisible ? "" : "header-hidden"}`}>
                <button className="header-container-btn" onClick={toggleDraggable}>{isDraggable ? "Locked Cards" : " Delocked Cards"}</button>
                <button className="header-container-btn" onClick={() => controller.addCard()}>Add New Card</button>
                <button className="header-container-btn" onClick={handleMoveCards}>Gather Cards</button>
            </div>
            <div ref={mainContainerRef} style={{ width: '100vw', height: '100vh' }}>
                <ResponsiveGridLayout
                    className="layout"
                    isDraggable={isDraggable}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    autoSize={true}
                    compactType={null}
                    preventCollision={false}
                    onLayoutChange={(layout: Layout[]) => {
                        const newCards = layout.map(({ i, x, y, w, h }) => {
                            const card = data.find(d => d.id === i);
                            if (!card) throw new Error(`Card not found for id ${i}`);
                            return { ...card, x, y, w, h, title: card.title || 'Default Title', content: card.content || 'Default Content', id: card.id };
                        });
                        setData(newCards);
                    }}
                >
                    {data.map(item => (
                        <div
                            key={item.id}
                            className={`react-grid-item ${!isDraggable ? 'locked' : ''}`}
                            data-grid={{
                                x: item.x,
                                y: item.y,
                                w: item.w,
                                h: item.h,
                                isDraggable,
                                isResizable: isDraggable
                            }}
                        >
                            <CardId {...item} changeCardType={changeCardType}/>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default GridComponent;


