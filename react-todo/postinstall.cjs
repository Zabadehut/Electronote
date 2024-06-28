const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();

if (platform === 'linux') {
    console.log('Installing Linux-specific dependencies...');
    execSync('yarn add @rollup/rollup-linux-x64-gnu', { stdio: 'inherit' });
} else if (platform === 'win32') {
    console.log('Skipping Linux-specific dependencies on Windows...');
}
