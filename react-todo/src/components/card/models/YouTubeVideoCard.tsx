import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, Link } from '@mui/material';
import './YouTubeVideoCard.css';

interface VideoData {
    title: string;
    description: string;
    thumbnail_url: string;
}

interface YouTubeVideoCardProps {
    url: string;
    onDisableDrag?: () => void;
    onEnableDrag?: () => void;
}

const isValidUrl = (urlString: string): boolean => {
    try {
        const url = new URL(urlString);
        console.log("URL hostname:", url.hostname); // Log pour vérifier l'hôte de l'URL
        return url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com' || url.hostname === 'youtu.be';
    } catch (e) {
        console.error("Invalid URL:", urlString); // Log pour afficher les URL invalides
        return false;
    }
};

const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({ url, onDisableDrag, onEnableDrag }) => {
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("YouTubeVideoCard URL:", url); // Log pour vérifier l'URL reçue par le composant
        const fetchData = async () => {
            if (!isValidUrl(url)) {
                console.error('Invalid URL:', url);
                setError('Invalid URL');
                setLoading(false);
                return;
            }

            onDisableDrag?.();
            setLoading(true);

            try {
                const apiUrl = `http://localhost:5000/scrape?url=${encodeURIComponent(url)}`;
                console.log("API URL:", apiUrl); // Log pour vérifier l'URL de l'API
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched video data:", data); // Log pour vérifier les données récupérées
                setVideoData(data);
                setError(null);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error fetching video data:', error.message);
                    setError(error.message);
                } else {
                    console.error('Unexpected error:', error);
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
                onEnableDrag?.();
            }
        };

        fetchData().catch(error => {
            console.error('Failed to fetch data:', error);
            setError('Failed to load data');
            setLoading(false);
        });

    }, [url, onDisableDrag, onEnableDrag]);

    return (
        <Card raised className="YouTubeVideoCard">
            <CardHeader title={loading ? "Loading..." : (error ? "Error" : videoData?.title)} />
            <CardContent>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : videoData ? (
                    <>
                        <Typography variant="h5">{videoData.title}</Typography>
                        <Link href={url} target="_blank">Watch Video</Link>
                        <Typography>{videoData.description}</Typography>
                        <img src={videoData.thumbnail_url} alt="Thumbnail" />
                    </>
                ) : null}
            </CardContent>
        </Card>
    );
};

export default YouTubeVideoCard;
