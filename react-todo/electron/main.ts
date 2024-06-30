import { app, BrowserWindow, ipcMain, Tray, nativeImage, Notification, Menu, session } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';
import { execSync, exec } from 'child_process';
import axios from 'axios';
import windowConfig from './windowConfig';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const server = require('../src/backend/server.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.APP_ROOT = path.join(__dirname, '..');

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let tray: Tray | null = null;
let win: BrowserWindow | null = null;
let blinkInterval: NodeJS.Timeout | null = null;

const iconPath = path.join(__dirname, '..', 'public', 'electron-vite.svg');

const startPostgres = () => {
  try {
    execSync(`"C:\\Program Files\\PostgreSQL\\13\\bin\\initdb.exe" -D "C:\\Users\\zaba8\\IdeaProjects\\Electronote\\react-todo\\postgres\\data"`);
    console.log('PostgreSQL initialized');
  } catch (error) {
    console.error('Error starting PostgreSQL:', error);
  }
};

const startPgAdmin = () => {
  try {
    execSync('"C:\\Program Files\\pgAdmin 4\\runtime\\pgAdmin4.exe"');
    console.log('pgAdmin started');
  } catch (error) {
    console.error('Error starting pgAdmin:', error);
  }
};

const loadCardsFromDatabase = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/cards');
    return response.data;
  } catch (error) {
    console.error('Error loading cards from database:', error);
    return [];
  }
};

async function createWindow() {
  startPostgres();
  startPgAdmin();

  let icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    console.error(`Failed to load icon from path: ${iconPath}, using default Electron icon.`);
    icon = nativeImage.createFromNamedImage('electron', [32, 64, 128, 256, 512]);
  }

  win = new BrowserWindow({
    ...windowConfig,
    icon,
    webPreferences: {
      ...windowConfig.webPreferences,
      preload: path.join(__dirname, 'preload.mjs'),
      plugins: true,
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  tray = new Tray(icon);
  tray.setToolTip('Your App Name');

  win.webContents.on('did-finish-load', async () => {
    const cards = await loadCardsFromDatabase();
    win?.webContents.send('load-cards', cards);
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL).catch(console.error);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html')).catch(console.error);
  }

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  ipcMain.on('window-control', (_event, action) => {
    if (!win) return;
    switch (action) {
      case 'minimize':
        win.minimize();
        break;
      case 'maximize':
        win.isMaximized() ? win.unmaximize() : win.maximize();
        break;
      case 'close':
        win.close();
        break;
    }
  });

  ipcMain.on('zoom', (_event, deltaY) => {
    if (win) {
      win.webContents.send('zoom', deltaY);
    }
  });

  ipcMain.on('set-zoom-factor', (_event, factor) => {
    if (win) {
      win.webContents.setZoomFactor(factor);
    }
  });

  ipcMain.handle('get-zoom-factor', async () => {
    if (win) {
      return win.webContents.getZoomFactor();
    }
    return 1;
  });

  ipcMain.handle('open-window', async (_event, url) => {
    const externalWin = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      },
    });
    await externalWin.loadURL(url);
  });

  ipcMain.handle('get-process-list', async () => {
    return getProcesses(); // Fonction pour récupérer la liste des processus
  });

  ipcMain.handle('open-process', async (_event, processName) => {
    return new Promise((resolve, reject) => {
      const command = `start ${processName}`; // Utilisation de `start` pour lancer Notepad++ sous Windows
      exec(command, (error, stdout) => {
        if (error) {
          console.error(`Error starting process: ${error.message}`);
          reject(error);
          return;
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      });
    });
  });

  ipcMain.on('trigger-alarm', () => {
    if (win && tray) {
      const emptyIcon = nativeImage.createEmpty();

      new Notification({
        title: 'Alarme',
        body: 'Votre alarme a sonné!',
        icon
      }).show();

      if (blinkInterval) clearInterval(blinkInterval);

      let isOriginalIcon = true;
      blinkInterval = setInterval(() => {
        if (tray) {
          tray.setImage(isOriginalIcon ? emptyIcon : icon);
          isOriginalIcon = !isOriginalIcon;
        }
      }, 500);

      setTimeout(() => {
        if (blinkInterval) clearInterval(blinkInterval);
        if (tray) tray.setImage(icon);
      }, 10000);
    }
  });

  setInterval(() => {
    if (win) {
      const memoryUsage = process.memoryUsage();
      const totalMemory = os.totalmem();
      win.webContents.send('update-memory-usage', { memoryUsage, totalMemory });
    }
  }, 1000);

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*']
      }
    });
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    callback({ requestHeaders: details.requestHeaders });
  });

  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    if (details.url.includes('spotify') || details.url.includes('whatsapp')) {
      callback({ cancel: false });
    } else {
      callback({ cancel: false });
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

// Fonction pour récupérer la liste des processus
export const getProcesses = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    exec('tasklist', (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      const processList = stdout.split('\n').slice(3).map(line => line.trim().split(/\s+/)[0]);
      resolve(processList);
    });
  });
};
