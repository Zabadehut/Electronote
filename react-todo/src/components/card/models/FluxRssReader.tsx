import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material';

interface Item {
    title: string;
    link: string;
    contentSnippet: string;
}

interface Feed {
    title: string;
    items: Item[];
}

interface FluxRssReaderProps {
    query: string;  // Liste des URLs de flux RSS
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}



const FluxRssReader: React.FC<FluxRssReaderProps> = ({onDisableDrag, onEnableDrag }) => {
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Simuler une réponse réussie
        setTimeout(() => {
            const exampleFeed = {
                title: "Example Feed",
                items: [{ title: "Test Article", link: "#", contentSnippet: "This is a test" }]
            };
            setFeeds([exampleFeed]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleMouseInteraction = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDisableDrag();
    };

    if (loading) return <CircularProgress />;


    return (
        <Card raised onClick={handleMouseInteraction} onMouseDown={handleMouseInteraction} onMouseUp={onEnableDrag}>
            <CardHeader title="RSS Feed Information" />
            <CardContent>
                {feeds.map((feed, index) => (
                    <div key={index}>
                        <Typography variant="h5">{feed.title}</Typography>
                        {feed.items.map((item, idx) => (
                            <div key={idx}>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    <Typography variant="h6">{item.title}</Typography>
                                </a>
                                <Typography>{item.contentSnippet}</Typography>
                            </div>
                        ))}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default FluxRssReader;