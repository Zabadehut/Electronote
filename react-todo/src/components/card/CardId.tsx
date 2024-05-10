import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Stack, Select, MenuItem } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import { v4 as uuidv4 } from 'uuid';
import TextContentCard from './models/TextContentCard';
import CodeContentCard from './models/CodeContentCard';
import FileContentCard from './models/FileContentCard';
import WebContentCard from './models/WebContentCard';
import WeatherContentCard from './models/WeatherContentCard';
import "react-resizable/css/styles.css";
import { SelectChangeEvent } from '@mui/material/Select';

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
    onPinClicked?: (id: string) => void;
    type: 'text' | 'code' | 'file' | 'web' | 'weather';
};

const id = uuidv4();
export const defaultCardIdProps: CardIdProps = {
    id,
    title: `New Title: ${id}`,
    content: 'New Content',
    x: Infinity,
    y: Infinity,
    w: 1,
    h: 1,
    minW: 0,
    minH: 0,
    maxW: Infinity,
    maxH: Infinity,
    isNew: true,
    isPinned: false,
    onPinClicked: () => {},
    type: 'text',
};

const CardId: React.FC<CardIdProps & { changeCardType: (id: string, newType: CardIdProps['type']) => void }> = (props) => {
    const [pinned, setPinned] = useState(props.isPinned);
    const [selectedType, setSelectedType] = useState('');

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPinned(!pinned);
        if (props.onPinClicked) {
            props.onPinClicked(props.id);
        }
    };

    const handleChangeType = (event: SelectChangeEvent<string>) => {
        const newType = event.target.value as CardIdProps['type'];
        setSelectedType(newType);
        if (newType) {
            props.changeCardType(props.id, newType);
        }
    };

    const renderCard = () => {
        if (!selectedType) return null; // Ne rien afficher tant qu'un type n'est pas sélectionné

        switch (selectedType) {
            case 'text':
                return <TextContentCard {...props} textContent={props.content} />;
            case 'code':
                return <CodeContentCard {...props} />;
            case 'file':
                return <FileContentCard {...props} />;
            case 'web':
                return <WebContentCard {...props} />;
            case 'weather':
                return <WeatherContentCard {...props} />;
            default:
                return <div>{props.content}</div>;
        }
    };

    return (
        <div className="card" id={props.id}>
            {selectedType ? null : <h4>{props.title}</h4>}  // N'afficher le titre que si aucun type n'est sélectionné
            {renderCard()}
            {selectedType ? null : (
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IconButton onClick={handlePinClick} aria-label="pin card" sx={{ color: 'info.main' }}>
                        <PushPinIcon />
                    </IconButton>
                </Stack>
            )}
            {selectedType ? null : (
                <div>
                    <Select value={selectedType} onChange={handleChangeType} displayEmpty inputProps={{ 'aria-label': 'Without label' }} sx={{ mt: 2, minWidth: 120 }}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="code">Code</MenuItem>
                        <MenuItem value="file">File</MenuItem>
                        <MenuItem value="web">Web</MenuItem>
                        <MenuItem value="weather">Weather</MenuItem>
                    </Select>
                </div>
            )}
        </div>
    );
};

export default CardId;
