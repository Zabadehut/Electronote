import React, { useState } from 'react';
import './ThemeSwitcher.css';

const themes = [
    { name: 'Light', className: 'light-theme' },
    { name: 'Dark', className: 'dark-theme' }
];

const ThemeSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<string>('light-theme');

    const handleThemeChange = (theme: string) => {
        setSelectedTheme(theme);
        document.body.className = theme;
    };

    return (
        <div className="theme-switcher">
            <button className="header-container-btn" onClick={() => setIsOpen(!isOpen)}>
                Change Theme
            </button>
            {isOpen && (
                <div className="theme-switcher-popup">
                    {themes.map((theme) => (
                        <div
                            key={theme.name}
                            className={`theme-preview ${theme.className} ${selectedTheme === theme.className ? 'selected' : ''}`}
                            onClick={() => handleThemeChange(theme.className)}
                        >
                            {theme.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;
