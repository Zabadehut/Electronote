import React, { useState, memo } from 'react';
import { IconButton, Stack, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import { v4 as uuidv4 } from 'uuid';
import TextContentCard from './models/TextContentCard';
import CodeContentCard from './models/CodeContentCard';
import FileContentCard from './models/FileContentCard';
import WebContentCard from './models/WebContentCard';
import YouTubeVideoCard from './models/YouTubeVideoCard';
import WeatherContentCard from './models/WeatherContentCard';
import SearchContentInApp from './models/SearchContentInApp';
import NoteTakingCard from './notes/NoteTakingCard.tsx';
import FluxRssReader from './models/FluxRssReader';
import LoadContentCard from './models/LoadContentCard';
import "react-resizable/css/styles.css";

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
    type: 'text' | 'code' | 'file' | 'web' | 'weather' | 'search' | 'note' | 'none' | 'rss' | 'you' | 'loadContent';
    cards: CardProps[];
    isResizing?: boolean; // Add this line
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
    cards: []
};

const CardId: React.FC<CardIdProps & { changeCardType: (id: string, newType: CardIdProps['type']) => void }> = (props) => {
    const [pinned, setPinned] = useState(props.isPinned);
    const [selectedType, setSelectedType] = useState(props.type);
    const [isDraggable, setIsDraggable] = useState(true);

    const handlePinClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setPinned(!pinned);
        props.onPinClicked?.(props.id);
    };

    const handleChangeType = (event: SelectChangeEvent<string>) => {
        const newType = event.target.value as CardIdProps['type'];
        setSelectedType(newType);
        props.changeCardType(props.id, newType);
    };

    const disableDrag = () => setIsDraggable(false);
    const enableDrag = () => setIsDraggable(true);

    const renderCard = () => {
        const cardProps = {
            ...props,
            isDraggable,
            onDisableDrag: disableDrag,
            onEnableDrag: enableDrag
        };
        switch (selectedType) {
            case 'text':
                return <TextContentCard {...cardProps} />;
            case 'code':
                return <CodeContentCard {...cardProps} />;
            case 'file':
                return <FileContentCard {...cardProps} />;
            case 'web':
                return <WebContentCard query={props.content} onDisableDrag={disableDrag} onEnableDrag={enableDrag} />;
            case 'you':
                return <YouTubeVideoCard url={props.content} />;
            case 'weather':
                return <WeatherContentCard query={props.content} onDisableDrag={disableDrag} onEnableDrag={enableDrag} />;
            case 'note':
                return <NoteTakingCard {...cardProps} />;
            case 'search':
                return <SearchContentInApp {...cardProps} />;
            case 'rss':
                return <FluxRssReader query={props.content} onDisableDrag={disableDrag} onEnableDrag={enableDrag} />;
            case 'loadContent':
                return <LoadContentCard title={props.title} content={props.content} />;
            default:
                return <div>Unsupported card type</div>;
        }
    };

    return (
        <div className={`card ${selectedType} ${props.isResizing ? 'is-resizing' : ''}`} id={props.id}>
            <h4>{props.title}</h4>
            {renderCard()}
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 5, right: 5 }}>
                <IconButton onClick={handlePinClick} color="primary" aria-label="pin card">
                    <PushPinIcon />
                </IconButton>
                <Select value={selectedType} onChange={handleChangeType} displayEmpty inputProps={{ 'aria-label': 'Without label' }} sx={{ mt: 2, minWidth: 120 }}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="search">Search</MenuItem>
                    <MenuItem value="note">Note</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="code">Code</MenuItem>
                    <MenuItem value="file">File</MenuItem>
                    <MenuItem value="web">Web</MenuItem>
                    <MenuItem value="you">Youtube</MenuItem>
                    <MenuItem value="weather">Weather</MenuItem>
                    <MenuItem value="rss">Rss</MenuItem>
                    <MenuItem value="loadContent">Load Content</MenuItem>
                </Select>
            </Stack>
        </div>
    );
};

export default memo(CardId);
