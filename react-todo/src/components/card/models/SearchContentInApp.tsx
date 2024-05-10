import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface CardData {
    title: string;
    content: string;
}

interface SearchContentInAppProps {
    cards: CardData[];
}

const SearchContentInApp: React.FC<SearchContentInAppProps> = ({ cards }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredCards = cards.filter(card =>
        card.title.toLowerCase().includes(searchTerm) ||
        card.content.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="search-content-app">
            <h1>Search in App Content</h1>
            <TextField
                variant="outlined"
                fullWidth
                label="Search Cards"
                onChange={handleSearchChange}
            />
            {filteredCards.map((card, index) => (
                <Card key={index} style={{ margin: '10px 0' }}>
                    <CardContent>
                        <h2>{card.title}</h2>
                        <p>{card.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default SearchContentInApp;
