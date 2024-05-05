import React from 'react';
import './CardId.css';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { v4 as uuidv4 } from 'uuid';

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
    onRemoveClicked: (id: string) => void;
    onPinClicked?: (id: string) => void;
    onCardSizeChange?: (id: string, dx: number, dy: number) => void;
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
    isPinned: true,
    onRemoveClicked: () => {},
    onPinClicked: () => {},
    onCardSizeChange: () => {},
};

const CardId: React.FC<CardIdProps> = ({
                                           id,
                                           title,
                                           content,
                                           onPinClicked = () => {},
                                           onCardSizeChange = () => {}
                                       }) => {
    return (
        <div className="card" id={id}>
            <h4>{title}</h4>
            <p>{content}</p>
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 5, right: 5 }}>
                <IconButton
                    onClick={() => onPinClicked(id)}
                    aria-label="pin card"
                    sx={{ color: 'info.main' }}
                >
                    <PushPinIcon />
                </IconButton>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 5, right: 5 }}>
                <IconButton
                    onClick={() => onCardSizeChange(id, 1, 1)}
                    aria-label="resize handle"
                    className="resize-btn"
                    sx={{ color: 'info.main' }}
                >
                    <AspectRatioIcon />
                </IconButton>
            </Stack>
        </div>
    );
};

export default CardId;
