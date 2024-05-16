import React, { useState } from 'react';
import './LoadContentCard.css';

interface LoadContentCardProps {
    title: string;
    content: string;
}

const LoadContentCard: React.FC<LoadContentCardProps> = ({ title, content }) => {
    const [loadedContent, setLoadedContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleLoadContent = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(content);
            if (!response.ok) {
                throw new Error('Failed to load content');
            }
            const data = await response.text();
            setLoadedContent(data);
        } catch (err: any) {  // Typage explicite de l'erreur
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="load-content-card">
            <h4>{title}</h4>
            <button onClick={handleLoadContent} disabled={loading}>
                {loading ? 'Loading...' : 'Load Content'}
            </button>
            {error && <div className="error">{error}</div>}
            {loadedContent && <div className="content">{loadedContent}</div>}
        </div>
    );
};

export default LoadContentCard;