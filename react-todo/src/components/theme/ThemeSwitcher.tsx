import React, { useState, useEffect } from 'react';
import './ThemeSwitcher.css';

const themes = [
    { name: 'Light', className: 'light-theme' },
    { name: 'Dark', className: 'dark-theme' },
    { name: 'Blue', className: 'blue-theme' },
    { name: 'Green', className: 'green-theme' },
    { name: 'Red', className: 'red-theme' }
];

type ThemeSwitcherProps = {
    isHeaderVisible: boolean;
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isHeaderVisible }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<string>('light-theme');

    const handleThemeChange = (theme: string) => {
        setSelectedTheme(theme);
        document.body.className = theme;
        setIsOpen(false); // Close the popup after selecting a theme
    };

    useEffect(() => {
        if (!isHeaderVisible) {
            setIsOpen(false); // Close the popup when the header is not visible
        }
    }, [isHeaderVisible]);

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
