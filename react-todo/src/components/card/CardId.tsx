import React, {useState} from 'react';
import './CardId.css';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import { v4 as uuidv4 } from 'uuid';
import "react-resizable/css/styles.css";

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
};

const CardId: React.FC<CardIdProps> = ({
                                           id,
                                           title,
                                           content,
                                           isPinned,
                                           onPinClicked = () => {},
                                       }) => {
    const [pinned, setPinned] = useState(isPinned);

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPinned(!pinned);
        onPinClicked(id);
    };

    return (
        <div className="card" id={id}>
            <h4>{title}</h4>
            <p>{content}</p>
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 5, right: 5 }}>
                <IconButton
                    onClick={handlePinClick}
                    aria-label="pin card"
                    className={`pin-btn ${pinned ? "pinned" : ""}`}
                    sx={{ color: 'info.main' }}
                >
                    <PushPinIcon />
                </IconButton>
            </Stack>
        </div>
    );
};

export default CardId;
