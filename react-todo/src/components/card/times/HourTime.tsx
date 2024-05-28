import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './HourTime.css';

type HourTimeProps = {
    onTimeUpdate: (time: Date) => void;
};

const HourTime: React.FC<HourTimeProps> = ({ onTimeUpdate }) => {

    useEffect(() => {
        const timer = setInterval(() => {
            const newTime = new Date();
            onTimeUpdate(newTime); // Appel de la fonction de mise à jour du parent
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeUpdate]);

    useEffect(() => {
        class Horloge {
            private interval: NodeJS.Timeout | null;
            private timer: number;

            constructor() {
                this.interval = null;
                this.timer = 1000;

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
                let time = new Date();

                let seconds = `rotate(${time.getSeconds() * 6})`;
                let minutes = `rotate(${time.getMinutes() * 6})`;
                let hours = `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5})`;

                ReactDOM.render(
                    <svg viewBox="0 0 200 200">
                        <circle className="border" cx="50%" cy="50%" r="45%"></circle>
                        <rect className="seconds" transform={seconds} x="49.5%" y="5%" width="1%" height="45%"></rect>
                        <rect className="minutes" transform={minutes} x="49%" y="10%" width="2%" height="40%"></rect>
                        <rect className="hours" transform={hours} x="48.5%" y="15%" width="3%" height="35%"></rect>
                        <circle className="center" cx="50%" cy="50%" r="2.5%"></circle>
                    </svg>,
                    document.querySelector('#app-horloge')
                );
            }
        }

        const horloge = new Horloge();
        horloge.start();
    }, []);

    return (
        <div className="hour-time-container">
            <div className="wrapper">
                <section id="app-horloge"></section>
            </div>
        </div>
    );
};

export default HourTime;
