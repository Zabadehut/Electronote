import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    transparent: true,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL).catch(console.error);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html')).catch(console.error);
  }

  // Handle window controls via IPC
  ipcMain.on('window-control', (_event: Electron.IpcMainEvent, action: string) => {
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

  // Gestion du zoom via IPC
  ipcMain.on('zoom', (_event, deltaY) => {
    if (win) {
      win.webContents.send('zoom', deltaY);
    }
  });

  // IPC pour zoom
  ipcMain.on('set-zoom-factor', (_event: Electron.IpcMainEvent, factor: number) => {
    if (win) {
      win.webContents.setZoomFactor(factor);
    }
  });

  ipcMain.handle('get-zoom-factor', async () => {
    if (win) {
      return win.webContents.getZoomFactor();
    }
    return 1; // Valeur par défaut si la fenêtre n'existe pas
  });

  // Envoi de l'utilisation de la mémoire toutes les secondes
  setInterval(() => {
    if (win) {
      const memoryUsage = process.memoryUsage();
      const totalMemory = os.totalmem();
      win.webContents.send('update-memory-usage', { memoryUsage, totalMemory });
    }
  }, 1000);
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
