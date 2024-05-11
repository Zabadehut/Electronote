import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { Card, CardContent, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface NoteTakingCardProps {
    query: { content: string }[];
}

const NoteTakingCard: React.FC<NoteTakingCardProps> = ({ query }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                height: canvasRef.current.clientHeight,
                width: canvasRef.current.clientWidth,
                selection: false, // Désactive la sélection
            });

            // Désactiver le drag and drop
            canvas.on('object:moving', (e) => {
                const target = e.target;
                if (target) {
                    // Annuler le mouvement en remettant l'objet à sa position précédente
                    target.set({
                        left: target.left,
                        top: target.top
                    });
                    canvas.renderAll();
                }
            });

            // Ajouter le contenu
            const text = new fabric.Text(query.map(item => item.content).join(', '), {
                left: 10,
                top: 10,
                fontSize: 20,
                selectable: false,
                evented: false
            });
            canvas.add(text);

            return () => {
                canvas.dispose();
            };
        }
        // Assurez-vous de retourner une fonction qui retourne void
        return () => {};
    }, [query]);

    return (

        <Card raised style={{ width: '100%', height: '100%' }}>
            <div className="drag-handle">Déplacer</div>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Note Taking Card
                </Typography>
                <canvas ref={canvasRef} style={{ width: '100%', height: '300px', border: 'none' }} />
            </CardContent>
            <CardContent>
                <Button startIcon={<EditIcon />} color="primary">
                    Edit
                </Button>
                <Button startIcon={<DeleteIcon />} color="secondary">
                    Delete
                </Button>
            </CardContent>
        </Card>
    );
};

export default NoteTakingCard;
