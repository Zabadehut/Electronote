import React, { useEffect, useRef, useState } from 'react';
import { fabric } from "fabric";
import { Card, CardContent, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './NoteTakingCard.css';

interface NoteTakingCardProps {
    query: { content: string }[];
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const NoteTakingCard: React.FC<NoteTakingCardProps> = ({}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    // Fonction pour arrêter la propagation des événements de souris
    const handleMouseInteraction = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    // Initialiser le canevas
    useEffect(() => {
        if (canvasRef.current && !canvas) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                height: canvasRef.current.clientHeight,
                width: canvasRef.current.clientWidth,
                selection: false,
            });
            setCanvas(initCanvas);
        }

        // Assurez-vous que la fonction de nettoyage retourne `void`
        return () => {
            if (canvas) {
                canvas.dispose();
            }
        };
    }, [canvas]);

    // Ajouter du texte au canevas
    const handleAddText = () => {
        if (canvas) {
            const text = new fabric.Text('Hello, world!', {
                left: 50,
                top: 50,
                fontSize: 20,
                borderColor: '#000000',
                fill: '#000000'
            });
            canvas.add(text);
            canvas.renderAll();
        }
    };

    return (
        <Card raised style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <CardContent className="canvas-container" onClick={handleMouseInteraction} onMouseDown={handleMouseInteraction}>
                <Typography variant="h5" component="h2" gutterBottom>Note Taking Card</Typography>
                <canvas ref={canvasRef} style={{ width: '100%', height: '300px', border: 'none' }} />
            </CardContent>
            <CardContent className="card-actions" onClick={handleMouseInteraction} onMouseDown={handleMouseInteraction}>
                <Button startIcon={<EditIcon />} color="primary" onClick={handleAddText}>Edit</Button>
                <Button startIcon={<DeleteIcon />} color="secondary">Delete</Button>
            </CardContent>
        </Card>
    );
};

export default NoteTakingCard;
