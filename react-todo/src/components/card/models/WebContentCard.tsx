import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, Typography, Link, Box, CircularProgress, TextField, Button } from '@mui/material';
import './WebContentCard.css'

interface ResultItem {
    link: string;
    title: string;
    snippet: string;
}

interface WebContentCardProps {
    query: string;
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const WebContentCard: React.FC<WebContentCardProps> = ({ query }) => {
    const [searchQuery, setSearchQuery] = useState(query);  // Modifié pour permettre la mise à jour de searchQuery
    const [results, setResults] = useState<ResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResults = async () => {
        setLoading(true);
        setError(null);
        const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyCJzTcuByky_0jz2omwCrm40AK1eAACKkA&cx=9525498c6235349b4&q=${encodeURIComponent(searchQuery)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setResults(data.items || []);
            } else {
                setError(data.error.message || 'Erreur lors de la récupération des données');
            }
        } catch (err: any) {
            setError('Erreur lors de la connexion au service de recherche');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            fetchResults();
        }
    }, [searchQuery]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    // Fonction pour arrêter la propagation des événements de souris
    const handleMouseInteraction = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <Card raised onClick={handleMouseInteraction} onMouseDown={handleMouseInteraction}>
            <CardHeader title={`Recherche Web`} />
            <CardContent>
                <form onSubmit={handleSearchSubmit}>
                    <TextField
                        fullWidth
                        label="Search Query"
                        value={searchQuery}
                        onChange={handleInputChange}  // Ajouté pour gérer les modifications de l'entrée
                        variant="outlined"
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Rechercher
                    </Button>
                </form>
                {loading ? (
                    <Box display="flex" justifyContent="center"><CircularProgress /></Box>
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
