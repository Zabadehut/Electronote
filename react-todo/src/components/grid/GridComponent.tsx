import React, { useState, useEffect, useRef } from 'react';
import './GridComponent.css';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import CardId, { CardIdProps } from "../card/CardId";
import { CardsUiEventController } from "../controller/CardsUiEventController";
import LoadContentCard from "../card/models/LoadContentCard";
import ThemeSwitcher from '../theme/ThemeSwitcher';

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridLayoutProps = {
    data: CardIdProps[];
    setData: React.Dispatch<React.SetStateAction<CardIdProps[]>>;
    zoomFactor: number; // Add zoomFactor prop
};

const GridComponent: React.FC<GridLayoutProps> = ({ data, setData, zoomFactor }) => {
    const controller = new CardsUiEventController(data, setData);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [headerHeight] = useState(60); // Default height
    let timeoutId: NodeJS.Timeout;
    let showHeaderTimeoutId: NodeJS.Timeout;
    const mainContainerRef = useRef<HTMLDivElement>(null); // Ref for the main container
    const [isDraggable, setIsDraggable] = useState(true); // State to control dragging
    const [resizingCardId, setResizingCardId] = useState<string | null>(null);
    const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
    const [collisionAllowed, setCollisionAllowed] = useState(false); // State to control collision

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
        clearTimeout(showHeaderTimeoutId);

        if (e.clientY < 100) {
            showHeaderTimeoutId = setTimeout(() => {
                setHeaderVisible(true);
            }, 500); // Delay of 1 second before showing the header
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
            clearTimeout(showHeaderTimeoutId);
        };
    }, [headerVisible, headerHeight]);

    const handleDragStart = (_layout: Layout[], _oldItem: Layout, newItem: Layout) => {
        setDraggingCardId(newItem.i);
        document.body.classList.add('no-select');
        setCollisionAllowed(false); // Initially, collision is not allowed
        setTimeout(() => setCollisionAllowed(true), 1000); // Allow collision after 1 second
    };

    const handleDrag = (_layout: Layout[], _oldItem: Layout, newItem: Layout, _placeholder: Layout, e: any, element: HTMLElement) => {
        if (element) {
            const zoomAdjustedX = e.clientX / zoomFactor;
            const zoomAdjustedY = e.clientY / zoomFactor;
            element.style.transform = `translate(${zoomAdjustedX - newItem.w * 25}px, ${zoomAdjustedY - newItem.h * 25}px)`;
        }
    };

    const handleDragStop = () => {
        setDraggingCardId(null);
        document.body.classList.remove('no-select');
    };

    const handleResizeStart = (_layout: Layout[], _oldItem: Layout, newItem: Layout): void => {
        setResizingCardId(newItem.i);
        document.body.classList.add('no-select');
    };

    const handleResizeStop = (_layout: Layout[], _oldItem: Layout, _newItem: Layout): void => {
        setResizingCardId(null);
        document.body.classList.remove('no-select');
    };

    const handleCloseCard = (id: string) => {
        const updatedCards = data.filter(card => card.id !== id);
        setData(updatedCards);
    };

    return (
        <div>
            <div className={`header-container ${headerVisible ? "" : "header-hidden"}`}>
                <button className="header-container-btn" onClick={toggleDraggable}>
                    {isDraggable ? "Locked Cards" : "Unlocked Cards"}
                </button>
                <button className="header-container-btn" onClick={() => controller.addCard()}>
                    Add New Card
                </button>
                <button className="header-container-btn" onClick={handleMoveCards}>
                    Gather Cards
                </button>
                <ThemeSwitcher isHeaderVisible={headerVisible} />
            </div>
            <div ref={mainContainerRef} className="main-container">
                <div className="grid-container" style={{ transform: `scale(${zoomFactor})`, transformOrigin: 'top left', width: `calc(100% / ${zoomFactor})`, height: `calc(100% / ${zoomFactor})` }}>
                    <ResponsiveGridLayout
                        className="layout"
                        isDraggable={isDraggable}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        autoSize={true}
                        compactType={null}
                        preventCollision={!collisionAllowed}
                        onDragStart={handleDragStart}
                        onDrag={handleDrag}
                        onDragStop={handleDragStop}
                        onResizeStart={handleResizeStart}
                        onResizeStop={handleResizeStop}
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
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                {item.type === 'loadContent' ? (
                                    <LoadContentCard title={item.title} content={item.content} />
                                ) : (
                                    <CardId {...item} changeCardType={changeCardType} isResizing={resizingCardId === item.id} isDragging={draggingCardId === item.id} onClose={handleCloseCard} />
                                )}
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                </div>
            </div>
        </div>
    );
};

export default GridComponent;
