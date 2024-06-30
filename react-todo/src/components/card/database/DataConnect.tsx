import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataConnect.css';
import { AxiosError } from 'axios';

// Définir le type des données
interface DataItem {
    id: number;
    column1: string;
}

const DataConnect: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [dbExists, setDbExists] = useState(false);
    const [query, setQuery] = useState('');
    const [queryResult, setQueryResult] = useState('');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prevLogs => [...prevLogs, message]);
    };

    // Exemple de correction pour une fonction
    const checkDatabase = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/check-db');
            setDbExists(response.data.exists);
        } catch (error) {
            const err = error as AxiosError;
            console.error('Error checking database', err.message);
            addLog(`Error checking database: ${err.message}`);
        }
    };

    useEffect(() => {
        checkDatabase();
    }, []);

    const createDatabase = async () => {
        try {
            await axios.post('http://localhost:3000/api/create-db');
            setDbExists(true);
            addLog('Database created successfully');
        } catch (error) {
            const err = error as AxiosError;
            console.error('Error creating database', err.message);
            addLog(`Error creating database: ${err.message}`);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/data');
            setData(response.data);
        } catch (error) {
            const err = error as AxiosError;
            console.error('Error fetching data', err.message);
            addLog(`Error fetching data: ${err.message}`);
        }
    };

    useEffect(() => {
        if (dbExists) {
            fetchData();
        }
    }, [dbExists]);

    const executeQuery = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/query', { query });
            setQueryResult(JSON.stringify(response.data, null, 2));
            addLog('Query executed successfully');
        } catch (error) {
            const err = error as AxiosError;
            console.error('Error executing query', err.message);
            setQueryResult('Error executing query');
            addLog(`Error executing query: ${err.message}`);
        }
    };

    const openPgAdmin = async () => {
        try {
            await axios.get('http://localhost:3000/open-pgadmin');
            addLog('pgAdmin opened successfully');
        } catch (error) {
            const err = error as AxiosError;
            console.error('Error opening pgAdmin', err.message);
            addLog(`Error opening pgAdmin: ${err.message}`);
        }
    };

    return (
        <div className="data-connect">
            <h1>Data from PostgreSQL</h1>
            {!dbExists ? (
                <>
                    <p>Database does not exist.</p>
                    <button onClick={createDatabase}>Create Database</button>
                    <button onClick={openPgAdmin}>Open pgAdmin</button>
                </>
            ) : (
                <>
                    <ul>
                        {data.map(item => (
                            <li key={item.id}>{item.column1}</li>
                        ))}
                    </ul>
                    <div className="query-console">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows={5}
                            cols={50}
                        />
                        <button onClick={executeQuery}>Execute Query</button>
                        <pre>{queryResult}</pre>
                    </div>
                </>
            )}
            <div className="logs">
                <h2>Logs</h2>
                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DataConnect;
