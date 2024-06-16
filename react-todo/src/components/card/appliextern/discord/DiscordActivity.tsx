import React from 'react';
import './DiscordActivity.css';

type DiscordActivityProps = {
    onActivityUpdate: (activity: string) => void;
};

const DiscordActivity: React.FC<DiscordActivityProps> = ({}) => {

    return (
        <div className="discord-activity-container">
            <webview
                src="https://discord.com/app"
                className="discord-webview"
            />
        </div>
    );
};

export default DiscordActivity;
