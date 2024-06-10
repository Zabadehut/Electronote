import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import './MemoryUsageComponent.css';

const MemoryUsageComponent: React.FC = () => {
    const [memoryUsage, setMemoryUsage] = useState<number>(0);
    const [totalMemory, setTotalMemory] = useState<number>(1);

    useEffect(() => {
        const updateMemoryUsage = (_event: any, { memoryUsage, totalMemory }: { memoryUsage: any; totalMemory: number }) => {
            const usage = memoryUsage.rss / 1024 / 1024;
            setMemoryUsage(usage);
            setTotalMemory(totalMemory / 1024 / 1024);
            console.log('Memory usage updated:', usage, 'Total memory:', totalMemory);
        };

        window.electron.ipcRenderer.on('update-memory-usage', updateMemoryUsage);

        return () => {
            window.electron.ipcRenderer.off('update-memory-usage', updateMemoryUsage);
        };
    }, []);

    const percentage = totalMemory ? (memoryUsage / totalMemory) * 100 : 0;

    return (
        <motion.div
            className="memory-usage-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <CircularProgressbar
                value={percentage}
                text={`${memoryUsage.toFixed(2)} MB\n${percentage.toFixed(2)}%`}
                className="memory-usage-progressbar"
                styles={buildStyles({
                    textSize: '14px',
                    pathTransitionDuration: 0.5,
                    textColor: 'var(--color-text)',
                    pathColor: 'var(--color-primary)',
                    trailColor: 'var(--color-border)'
                })}
                aria-label={`Memory usage is ${memoryUsage.toFixed(2)} MB which is ${percentage.toFixed(2)}% of total memory`}
            />
        </motion.div>
    );
};

export default MemoryUsageComponent;
