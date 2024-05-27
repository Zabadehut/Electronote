import React, { useState, useEffect } from 'react';
import './ThemeSwitcher.css';

const themes = [
    { name: 'Light', className: 'light-theme' },
    { name: 'Dark', className: 'dark-theme' },
    { name: 'Blue Light', className: 'blue-light-theme' },
    { name: 'Blue Dark', className: 'blue-dark-theme' },
    { name: 'Green Light', className: 'green-light-theme' },
    { name: 'Green Dark', className: 'green-dark-theme' },
    { name: 'Red Light', className: 'red-light-theme' },
    { name: 'Red Dark', className: 'red-dark-theme' },
    { name: 'Pastel Light', className: 'pastel-light-theme' },
    { name: 'Pastel Dark', className: 'pastel-dark-theme' },
    { name: 'Cool Aqua', className: 'theme1' },
    { name: 'Classic Blue', className: 'theme2' },
    { name: 'Soft Pink', className: 'theme3' },
    { name: 'Warm Peach', className: 'theme4' },
    { name: 'Earthy Brown', className: 'theme5' },
    { name: 'Bright Cyan', className: 'theme6' },
    { name: 'Sunny Yellow', className: 'theme7' },
    { name: 'Lavender Dream', className: 'theme8' },
    { name: 'Coral Sunset', className: 'theme9' },
    { name: 'Midnight Blue', className: 'theme10' },
    { name: 'Pale Sky', className: 'theme11' },
    { name: 'Candy Purple', className: 'theme12' },
    { name: 'Night Blue', className: 'modern-theme' } // Ajout du nouveau thème "Modern"
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
