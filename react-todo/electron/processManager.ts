import { exec } from 'child_process';

export const getProcesses = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        exec('tasklist', (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            const processList = stdout.split('\n').slice(3).map(line => line.trim().split(/\s+/)[0]);
            resolve(processList);
        });
    });
};
