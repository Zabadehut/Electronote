const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Zabadehut1491!',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// Route pour récupérer toutes les cartes
app.get('/api/cards', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM cards ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Routes existantes
app.post('/api/cards', async (req, res) => {
    const { id, title, content, x, y, w, h, type } = req.body;
    try {
        const checkQuery = 'SELECT * FROM cards WHERE id = $1';
        const checkResult = await client.query(checkQuery, [id]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Duplicate UUID' });
        }

        const result = await client.query('INSERT INTO cards (id, title, content, x, y, w, h, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [id, title, content, x, y, w, h, type]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/cards/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, x, y, w, h, type } = req.body;
    try {
        const result = await client.query('UPDATE cards SET title = $2, content = $3, x = $4, y = $5, w = $6, h = $7, type = $8 WHERE id = $1 RETURNING *', [id, title, content, x, y, w, h, type]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/cards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteQuery = 'WITH deleted AS (DELETE FROM cards WHERE id = $1 RETURNING *) INSERT INTO cards_archive SELECT * FROM deleted RETURNING *';
        const values = [id];
        const result = await client.query(deleteQuery, values);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression et de l\'archivage de la carte' });
    }
});

app.get('/api/cards_archive', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM cards_archive ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching archived cards:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/cards_archive/:id/restore', async (req, res) => {
    const { id } = req.params;
    try {
        const restoreQuery = 'WITH restored AS (DELETE FROM cards_archive WHERE id = $1 RETURNING *) INSERT INTO cards SELECT * FROM restored RETURNING *';
        const values = [id];
        const result = await client.query(restoreQuery, values);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la restauration de la carte' });
    }
});

const startServer = () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

module.exports = { start: startServer };
