// HourTime.tsx
import React, { useEffect, useState } from 'react';
import './HourTime.css';

type HourTimeProps = {
    onTimeUpdate: (time: Date) => void;
};

const HourTime: React.FC<HourTimeProps> = ({ onTimeUpdate }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTime = new Date();
            setTime(newTime);
            onTimeUpdate(newTime); // Appel de la fonction de mise à jour du parent
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeUpdate]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour12: false });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    return (
        <div className="hour-time-container">
            <div className="digital-clock">
                {formatTime(time)}
            </div>
            <div className="date-display">
                {formatDate(time)}
            </div>
            <div className="analog-clock">
                <div className="hand hour" style={{ transform: `rotate(${time.getHours() * 30 + time.getMinutes() / 2}deg)` }}></div>
                <div className="hand minute" style={{ transform: `rotate(${time.getMinutes() * 6}deg)` }}></div>
                <div className="hand second" style={{ transform: `rotate(${time.getSeconds() * 6}deg)` }}></div>
                <div className="center"></div>
            </div>
        </div>
    );
};

export default HourTime;
