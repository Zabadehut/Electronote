import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Typography, CircularProgress, TextField, Button } from '@mui/material';
import './WeatherContentCard.css';
import Clock from './Clock';   // Importation correcte du composant Clock

interface WeatherData {
    temp: number;
    humidity: number;
    wind_speed: number;
}

/*no drag&drop on class*/
interface WeatherContent {
    query: string;
    onDisableDrag: () => void;
    onEnableDrag: () => void;
}

const WeatherContentCard: React.FC<WeatherContent> = ({ onDisableDrag, onEnableDrag }) => {
    const [city, setCity] = useState<string>("Dijon");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getWeather = useCallback(() => {
        setLoading(true);
        setError(null);
        axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                units: 'metric',
                appid: 'c1fcbbe4f13f12a09fbc62bf1bfecbef' // Utilisez votre clé API valide
            }
        }).then(response => {
            const { main, wind } = response.data;
            setWeatherData({
                temp: main.temp,
                humidity: main.humidity,
                wind_speed: wind.speed
            });
            setLoading(false);
        }).catch(err => {
            setError(err.message || 'Error fetching weather data');
            setLoading(false);
        });
    }, [city]);

    const handleCityChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    }, []);

    // Fonction pour arrêter la propagation des événements de souris
    const handleMouseInteraction = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDisableDrag();
    };

    return (
        <Card raised onClick={handleMouseInteraction} onMouseDown={handleMouseInteraction} onMouseUp={onEnableDrag}>
            <CardHeader title="Weather Information" />
            <CardContent>
                <Clock />
                <form onSubmit={(e) => { e.preventDefault(); getWeather(); }}>
                    <TextField
                        fullWidth
                        label="Enter City Name"
                        value={city}
                        onChange={handleCityChange}
                        variant="outlined"
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        Get Weather
                    </Button>
                </form>
                {loading ? <CircularProgress /> : null}
                {error ? <Typography color="error">{error}</Typography> : null}
                {weatherData ? (
                    <div>
                        <Typography variant="h6">Temperature: {weatherData.temp} °C</Typography>
                        <Typography>Humidity: {weatherData.humidity}%</Typography>
                        <Typography>Wind Speed: {weatherData.wind_speed} km/h</Typography>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
};

export default WeatherContentCard;
