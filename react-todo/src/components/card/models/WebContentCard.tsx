import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, Link, Box, CircularProgress } from '@mui/material';

interface ResultItem {
    link: string;
    title: string;
    snippet: string;
}

interface WebContentCardProps {
    query: string;
}

const WebContentCard: React.FC<WebContentCardProps> = ({ query }) => {
    const [results, setResults] = useState<ResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyCJzTcuByky_0jz2omwCrm40AK1eAACKkA&cx=YOUR_CX&q=${encodeURIComponent(query)}`;
        console.log("Fetching URL:", url);

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                setResults(data.items || []);
            } else {
                setError(data.error.message || 'Erreur lors de la récupération des données');
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError('Erreur lors de la connexion au service de recherche');  // Utilisation d'un message générique pour l'erreur
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchResults();
        }
    }, [query]);

    return (
        <Card raised>
            <CardHeader title={`Résultats de recherche pour : ${query}`} />
            <CardContent>
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>
                                <Link href={result.link} target="_blank" rel="noopener noreferrer" color="primary">
                                    {result.title}
                                </Link>
                                <Typography variant="body2" color="textSecondary">{result.snippet}</Typography>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default WebContentCard;
