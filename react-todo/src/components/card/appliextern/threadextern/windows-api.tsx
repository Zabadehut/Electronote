import React, { useState, useEffect } from 'react';
import { Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import './windows-api.css';

const { ipcRenderer } = window.electron;

const WindowsApi: React.FC = () => {
    const [processes, setProcesses] = useState<string[]>([]);
    const [selectedProcess, setSelectedProcess] = useState<string>('');

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const processList = await ipcRenderer.invoke('get-process-list');
                setProcesses(processList);
            } catch (error) {
                console.error('Error fetching process list:', error);
            }
        };

        fetchProcesses();
    }, []);

    const handleOpenWindow = () => {
        if (selectedProcess) {
            ipcRenderer.invoke('open-process', selectedProcess);
        }
    };

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedProcess(event.target.value);
    };

    return (
        <div className="windows-api-container">
            <h2>Open External Window</h2>
            <Select
                value={selectedProcess}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                className="process-select"
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {processes.map((process, index) => (
                    <MenuItem key={index} value={process}>
                        {process}
                    </MenuItem>
                ))}
            </Select>
            <Button variant="contained" color="primary" onClick={handleOpenWindow}>
                Open Window
            </Button>
        </div>
    );
};

export default WindowsApi;
