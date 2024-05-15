import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';
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
    query: string;  // URL du flux RSS
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const FluxRssReader: React.FC<FluxRssReaderProps> = ({ query, onDisableDrag, onEnableDrag }) => {
    const [feed, setFeed] = useState<Feed | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRSS = async () => {
            setLoading(true);
            const parser = new Parser<Feed>();
            try {
                const fetchedFeed = await parser.parseURL(query);
                setFeed(fetchedFeed);
            } catch (error: any) {
                console.error("Failed to fetch RSS: " + error.message);
                setError("Failed to fetch RSS");
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchRSS();
        } else {
            setError("No RSS URL provided");
        }
    }, [query]);

    const handleMouseInteraction = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDisableDrag();
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Card raised onClick={handleMouseInteraction} onMouseDown={handleMouseInteraction} onMouseUp={onEnableDrag}>
            <CardHeader title="RSS Feed Information" />
            <CardContent>
                {feed ? (
                    <div>
                        <Typography variant="h5">{feed.title}</Typography>
                        {feed.items.map((item, index) => (
                            <div key={index}>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    <Typography variant="h6">{item.title}</Typography>
                                </a>
                                <Typography>{item.contentSnippet}</Typography>
                            </div>
                        ))}
                    </div>
                ) : <Typography>No feed data available.</Typography>}
            </CardContent>
        </Card>
    );
};

export default FluxRssReader;
