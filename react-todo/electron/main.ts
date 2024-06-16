import { app, BrowserWindow, ipcMain, Tray, nativeImage, Notification, Menu } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os'; // Importer os ici
// @ts-ignore
import windowConfig from './windowConfig'; // Assurez-vous que le chemin est correct

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.APP_ROOT = path.join(__dirname, '..');

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let tray: Tray | null = null;
let win: BrowserWindow | null = null;
let blinkInterval: NodeJS.Timeout | null = null;

const iconPath = path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'); // Chemin de l'icône

function createWindow() {
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
      preload: path.join(__dirname, 'preload.mjs'), // Assurez-vous que le chemin est correct
    },
  });

  tray = new Tray(icon);
  tray.setToolTip('Your App Name');

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL).catch(console.error);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html')).catch(console.error);
  }

  // Créer le menu d'application
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

  // Gestion des commandes de la fenêtre via IPC
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

  // IPC pour définir le facteur de zoom
  ipcMain.on('set-zoom-factor', (_event: Electron.IpcMainEvent, factor: number) => {
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

  // Alarme
  ipcMain.on('trigger-alarm', () => {
    if (win && tray) {
      const emptyIcon = nativeImage.createEmpty(); // Utiliser une icône vide pour clignoter

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

      // Arrêter le clignotement après une certaine période (par exemple, 10 secondes)
      setTimeout(() => {
        if (blinkInterval) clearInterval(blinkInterval);
        if (tray) tray.setImage(icon); // Réinitialiser à l'icône originale
      }, 10000);
    }
  });

  // Mise à jour de l'utilisation de la mémoire
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

