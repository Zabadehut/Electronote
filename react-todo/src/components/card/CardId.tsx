import React, { useState } from 'react';
import { IconButton, Stack, Select, MenuItem } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import { v4 as uuidv4 } from 'uuid';
import TextContentCard from './models/TextContentCard';
import CodeContentCard from './models/CodeContentCard';
import FileContentCard from './models/FileContentCard';
import WebContentCard from './models/WebContentCard';
import WeatherContentCard from './models/WeatherContentCard';
import SearchContentInApp from './models/SearchContentInApp';
import NoteTakingCard from "./models/NoteTakingCard.tsx";
import { SelectChangeEvent } from '@mui/material/Select';
import "react-resizable/css/styles.css";

export type CardProps = {
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
    type: 'text' | 'code' | 'file' | 'web' | 'weather' | 'Search' | 'note';
    cards: CardProps[];
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

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPinned(!pinned);
        props.onPinClicked?.(props.id);
    };



    const handleChangeType = (event: SelectChangeEvent<string>) => {
        const newType = event.target.value as CardIdProps['type'];
        setSelectedType(newType);
        props.changeCardType(props.id, newType);
    };

    const renderCard = () => {
        switch (selectedType) {
            case 'text':
                return <TextContentCard {...props}/>;
            case 'code':
                return <CodeContentCard {...props} />;
            case 'file':
                return <FileContentCard {...props} />;
            case 'web':
                return <WebContentCard query={props.content} />;
            case 'weather':
                return <WeatherContentCard {...props} />;
            case 'note':
                return <NoteTakingCard query={props.cards} />;
            case 'Search':
                return <SearchContentInApp cards={props.cards} />;
            default:
                return <div>Unsupported card type</div>;
        }
    };

    return (
        <div className={`card ${selectedType}`} id={props.id}>
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
                    <MenuItem value="weather">Weather</MenuItem>
                </Select>
            </Stack>
        </div>
    );
};

export default CardId;