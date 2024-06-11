import React, { useState, useEffect, useRef, memo } from 'react';
import { IconButton, Stack, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import { cardComponentMap, cardComponentProps, CardType } from '../controller/CardTypeManager';
import { MemoryManager } from './memory/MemoryManager';
import "react-resizable/css/styles.css";
import './CardId.css';
import Worker from './cardWorker?worker';

export type CardProps = {
    id: string;
    title: string;
    content: string;
};

export type CardIdProps = {
    title: string;
    content: string;
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW: number;
    minH: number;
    maxW?: number;
    maxH?: number;
    isNew: boolean;
    isPinned: boolean;
    disableDragAndDrop?: boolean;
    onPinClicked?: (id: string) => void;
    onClose?: (id: string) => void;
    type: CardType;
    cards: CardProps[];
    isResizing: boolean;
    isDragging: boolean;
    memoryUsage?: number;
};

export const defaultCardIdProps: CardIdProps = {
    id: uuidv4(),
    title: "New Title",
    content: "New Content",
    x: Infinity,
    y: Infinity,
    w: 1,
    h: 1,
    minW: 0,
    minH: 0,
    isNew: true,
    isPinned: false,
    type: 'text',
    cards: [],
    isResizing: false,
    isDragging: false,
    memoryUsage: 0,
};

// Créez une liste globale pour suivre les threads
const activeThreads = new Map<string, { id: string, type: string, content: string, result: string, memoryUsage: number }>();

const CardId: React.FC<CardIdProps & { changeCardType: (id: string, newType: CardIdProps['type']) => void }> = (props) => {
    const [pinned, setPinned] = useState(props.isPinned);
    const [selectedType, setSelectedType] = useState(props.type);
    const [isDraggable, setIsDraggable] = useState(true);
    const workerRef = useRef<Worker | null>(null);
    const memoryManagerRef = useRef(new MemoryManager());
    const [memoryUsage, setMemoryUsage] = useState<number>(0);

    useEffect(() => {
        const initializeWorker = () => {
            const worker = new Worker();
            worker.onmessage = (event) => {
                const { id, result, memoryUsage } = event.data;
                console.log(`Card ${id} processed result:`, result);
                console.log(`Memory usage for card ${id}: ${memoryUsage} bytes`);
                memoryManagerRef.current.allocateCard(id, memoryUsage);

                // Mettez à jour le thread actif
                activeThreads.set(props.id, { id: props.id, type: selectedType, content: props.content, result, memoryUsage });

                // Mettez à jour la mémoire de la carte
                setMemoryUsage(memoryUsage);
            };
            workerRef.current = worker;
        };

        initializeWorker();

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                activeThreads.delete(props.id); // Supprimez le thread actif
                memoryManagerRef.current.deallocateCard(props.id); // Libérez la mémoire
            }
        };
    }, [props.id]);

    useEffect(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({
                id: props.id,
                type: selectedType,
                content: props.content
            });
        }
    }, [props.content, selectedType]);

    useEffect(() => {
        setMemoryUsage(memoryManagerRef.current.getMemoryUsage(props.id));
    }, [props.id]);

    const handlePinClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setPinned(!pinned);
        props.onPinClicked?.(props.id);
    };

    const handleChangeType = (event: SelectChangeEvent) => {
        const newType = event.target.value as CardIdProps['type'];
        setSelectedType(newType);
        props.changeCardType(props.id, newType);
    };

    const handleClose = () => {
        if (workerRef.current) {
            workerRef.current.terminate();
            activeThreads.delete(props.id); // Supprimez le thread actif
            memoryManagerRef.current.deallocateCard(props.id); // Libérez la mémoire
        }
        props.onClose?.(props.id);
    };

    const handleStackClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    };

    const renderCard = () => {
        const CardComponent = cardComponentMap[selectedType];
        const additionalProps = cardComponentProps[selectedType] || {};
        const cardProps = {
            ...props,
            ...additionalProps,
            isDraggable,
            onDisableDrag: () => setIsDraggable(false),
            onEnableDrag: () => setIsDraggable(true),
            memoryManager: memoryManagerRef.current,
            memoryUsage
        };
        return <CardComponent {...cardProps} />;
    };

    return (
        <div className={`card ${selectedType} ${props.isResizing ? 'is-resizing' : ''} ${props.isDragging ? 'is-dragging' : ''}`} id={props.id}>
            {selectedType !== 'hourTime' && <h4>{props.title}</h4>}
            {renderCard()}
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 5, right: 5 }} onClick={handleStackClick} className="MuiStack-root css-1r84q1u-MuiStack-root">
                {selectedType !== 'hourTime' && (
                    <IconButton onClick={handlePinClick} color="primary" aria-label="pin card" className="no-drag">
                        <PushPinIcon />
                    </IconButton>
                )}
                <IconButton onClick={handleClose} color="secondary" aria-label="close card" className="no-drag">
                    <CloseIcon />
                </IconButton>
                {selectedType !== 'hourTime' && (
                    <Select
                        value={selectedType}
                        onChange={handleChangeType}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{
                            mt: 2,
                            minWidth: 120,
                            backgroundColor: 'var(--color-button-bg)',
                            color: 'var(--color-text)',
                            '& .MuiSelect-select': {
                                backgroundColor: 'var(--color-button-bg)',
                                color: 'var(--color-text)',
                                padding: '8px 32px 8px 14px',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-border)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-primary-hover)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-primary)',
                            },
                            '& .MuiSelect-icon': {
                                color: 'var(--color-text)',
                            },
                        }}
                        className="no-drag"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {Object.keys(cardComponentMap).map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                )}
            </Stack>
        </div>
    );
};

export default memo(CardId);

export { activeThreads };
