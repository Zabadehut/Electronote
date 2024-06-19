import React, { useEffect, useState } from 'react';
import './SpotifyActivity.css';

const SpotifyActivity: React.FC = () => {
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const webview: Electron.WebviewTag | null = document.querySelector('.spotify-webview');

        if (webview) {
            const handleFailLoad = () => {
                setError('Failed to load Spotify. Please try again later.');
            };

            const handleFinishLoad = () => {
                setError(null);
            };

            webview.addEventListener('did-fail-load', handleFailLoad);
            webview.addEventListener('did-finish-load', handleFinishLoad);

            return () => {
                webview.removeEventListener('did-fail-load', handleFailLoad);
                webview.removeEventListener('did-finish-load', handleFinishLoad);
            };
        }
    }, []);

    return (
        <div className="spotify-activity-container">
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <webview
                    src="https://open.spotify.com/"
                    className="spotify-webview"
                    useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                    webpreferences="allowRunningInsecureContent, enableRemoteModule, contextIsolation=false"
                />
            )}
        </div>
    );
};

export default SpotifyActivity;
