import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import './WebContentCard.css';

interface WebContentCardProps {
    query: string;
}

const WebContentCard: React.FC<WebContentCardProps> = ({ query }) => {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    return (
        <Card className="web-content-card">
            <CardHeader title={`Google Search: ${query}`} />
            <CardContent style={{ flexGrow: 1, padding: 0 }}>
                <iframe
                    src={googleSearchUrl}
                    title="Google Search"
                    className="web-content-iframe"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                />
            </CardContent>
        </Card>
    );
};

export default WebContentCard;
