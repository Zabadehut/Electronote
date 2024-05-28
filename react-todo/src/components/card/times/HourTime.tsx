import * as React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './HourTime.css';

type HourTimeProps = {
    onTimeUpdate: (time: Date) => void;
};

const HourTime: React.FC<HourTimeProps> = ({ onTimeUpdate }) => {
    const [clockType, setClockType] = useState<'Analogique' | 'Numérique' | 'Les deux'>('Analogique');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTime = new Date();
            onTimeUpdate(newTime);
            setCurrentTime(newTime);
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeUpdate]);

    useEffect(() => {
        class Horloge {
            private interval: NodeJS.Timeout | null;
            private timer: number;
            private root: ReactDOM.Root | null;

            constructor() {
                this.interval = null;
                this.timer = 1000;
                this.root = null;

                this.tick = this.tick.bind(this);
                this.end = this.end.bind(this);
                this.start = this.start.bind(this);

                this.tick();
            }

            end() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }

            start() {
                this.interval = setInterval(this.tick, this.timer);
            }

            tick() {
                const container = document.querySelector('#app-horloge');
                if (!container) return;

                let time = new Date();

                let seconds = `rotate(${time.getSeconds() * 6})`;
                let minutes = `rotate(${time.getMinutes() * 6})`;
                let hours = `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5})`;

                if (!this.root) {
                    this.root = ReactDOM.createRoot(container);
                }

                if (this.root) {
                    this.root.render(
                        <svg viewBox="0 0 200 200">
                            <circle className="border" cx="50%" cy="50%" r="45%"></circle>
                            <rect className="seconds" transform={seconds} x="49.5%" y="5%" width="1%" height="45%"></rect>
                            <rect className="minutes" transform={minutes} x="49%" y="10%" width="2%" height="40%"></rect>
                            <rect className="hours" transform={hours} x="48.5%" y="15%" width="3%" height="35%"></rect>
                            <circle className="center" cx="50%" cy="50%" r="2.5%"></circle>
                        </svg>
                    );
                }
            }
        }

        if (clockType !== 'Numérique') {
            const horloge = new Horloge();
            horloge.start();
            return () => horloge.end();
        }
    }, [clockType]);

    const renderDigitalClock = () => {
        return (
            <div className="digital-clock">
                {currentTime.toLocaleTimeString()}
            </div>
        );
    };

    const handleClockTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClockType(event.target.value as 'Analogique' | 'Numérique' | 'Les deux');
    };

    return (
        <div className="hour-time-container">
            <div className="wrapper">
                {clockType === 'Analogique' && <section id="app-horloge"></section>}
                {clockType === 'Numérique' && renderDigitalClock()}
                {clockType === 'Les deux' && (
                    <div className="wrapper-both">
                        <section id="app-horloge"></section>
                        {renderDigitalClock()}
                    </div>
                )}
                <div className="select-wrapper">
                    <select value={clockType} onChange={handleClockTypeChange}>
                        <option value="Analogique">Analogique</option>
                        <option value="Numérique">Numérique</option>
                        <option value="Les deux">Les deux</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default HourTime;
