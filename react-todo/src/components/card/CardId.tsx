import React from 'react';
import './CardId.css';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

export type CardIdProps = {
    title: string,
    content: string,
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    minW: number,
    minH: number,
    maxW?: number,
    maxH?: number,
    isNew: boolean;
    isPinned: boolean;
    onRemoveClicked: (id: string) => void;
    onPinClicked: (id: string) => void;
    onCardSizeChange: (id: string, dx: number, dy: number) => void;
};

export const defaultCardIdProps = {
    title:'Rename Your Card',
    content: "",
    id: uuidv4(),
    x:0,
    y: 0,
    w: 1,
    h: 1,
    minW: 1,
    minH: 1,
    maxW: undefined,
    maxH: undefined,
    isNew: true,
    isPinned: false,
};

const CardId: React.FC<CardIdProps> = ({
                                           id, title, content,
                                           onPinClicked = () => {},  // Fournissez une valeur par défaut pour éviter les appels sur undefined
                                           onCardSizeChange }) => {

        return (
            <div className="card" id={id}>
                <h4>{title}</h4>
                <p>{content}</p>
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <IconButton
                        onClick={() => onPinClicked(id)}
                        aria-label="pin card"
                        sx={{ color: 'info.main' }}>
                        <PushPinIcon />
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 5, right: 5 }}>
                    <IconButton
                        onClick={() => onCardSizeChange(id, 1, 1)}
                        aria-label="resize handle"
                        sx={{ color: 'info.main' }}>
                        <AspectRatioIcon />
                    </IconButton>
                </Stack>
            </div>
        );
    };

    export default CardId;