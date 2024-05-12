import React from 'react';
import { Segment, Grid } from "semantic-ui-react";

interface ClockState {
    date: Date;
}

const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

class Clock extends React.Component<{}, ClockState> {
    private timer: NodeJS.Timeout | null = null;

    constructor(props: {}) {
        super(props);
        this.state = { date: new Date() };
    }

    static pad(num: number, digit: number): string {
        let zero = '';
        for (let i = 0; i < digit; ++i) zero += '0';
        return (zero + num).slice(-digit);
    }

    tick() {
        this.setState({ date: new Date() });
    }

    componentDidMount() {
        this.timer = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        if (this.timer) clearInterval(this.timer);
    }

    render() {
        const { date } = this.state;
        const h = Clock.pad(date.getHours(), 2);
        const m = Clock.pad(date.getMinutes(), 2);
        const s = Clock.pad(date.getSeconds(), 2);
        const d = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

        return (
            <Grid className="segmentdate" columns={4}>
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <div>
                                <p id="date">{d}</p>
                                <h3 id="hours">{h}:</h3>
                                <h3 id="minutes">{m}:</h3>
                                <h3 id="seconds">{s}</h3>
                            </div>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Clock;
