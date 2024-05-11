import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { Card, CardContent, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './NoteTakingCard.css';

interface NoteTakingCardProps {
    query: { content: string }[];
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

// Utiliser directement les props déstructurées
const NoteTakingCard: React.FC<NoteTakingCardProps> = ({ query, onDisableDrag, onEnableDrag }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            height: canvasRef.current.clientHeight,
            width: canvasRef.current.clientWidth,
            selection: false,
        });

        const text = new fabric.Text(query.map(item => item.content).join(', '), {
            left: 10,
            top: 10,
            fontSize: 20,
        });
        canvas.add(text);

        return () => {
            canvas.dispose();
        };
    }, [query]);

    return (
        <Card raised style={{ width: '100%', height: '100%' }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>Note Taking Card</Typography>
                <div
                    onMouseEnter={onDisableDrag}
                    onMouseLeave={onEnableDrag}
                >
                    <canvas ref={canvasRef} style={{width: '100%', height: '300px', border: 'none'}}/>
                </div>
            </CardContent>
            <CardContent>
                <Button startIcon={<EditIcon/>} color="primary">Edit</Button>
                <Button startIcon={<DeleteIcon />} color="secondary">Delete</Button>
            </CardContent>
        </Card>
    );
};

export default NoteTakingCard;
