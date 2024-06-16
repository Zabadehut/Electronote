import React from 'react';
import './WhatsAppActivity.css';

const WhatsAppActivity: React.FC = () => {
    return (
        <div className="whatsapp-activity-container">
            <webview
                src="https://web.whatsapp.com/"
                className="whatsapp-webview"
                useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                webpreferences="allowRunningInsecureContent, enableRemoteModule, contextIsolation=false"
            />
        </div>
    );
};

export default WhatsAppActivity;
