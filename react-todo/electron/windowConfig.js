import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export default {
    width: 1024,
    height: 768,
    useContentSize: true,
    center: true,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 7680,
    maxHeight: 4320,
    alwaysOnTop: false,
    fullscreen: false,
    skipTaskbar: false,
    kiosk: false,
    title: 'ElectroNote',
    icon: undefined,
    show: true,
    transparent: true, // Désactivez la transparence pour voir le cadre
    frame: false,        // Activez le cadre pour voir la barre de menu
    resizable: true,
    acceptFirstMouse: false,
    disableAutoHideCursor: true,
    autoHideMenuBar: false, // Désactivez l'auto-masquage de la barre de menu
    enableLargerThanScreen: false,
    backgroundColor: 'rgba(255,255,255,0)',
    darkTheme: true,
    titleBarStyle: 'default', // Utiliser une valeur valide ici
    webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.mjs'), // Assurez-vous que le chemin est correct
        partition: undefined,
        zoomFactor: 1.0,
        javascript: true,
        webSecurity: true,
        allowDisplayingInsecureContent: false,
        allowRunningInsecureContent: false,
        images: true,
        java: true,
        textAreasAreResizable: true,
        webgl: true,
        webviewTag: true,
        webaudio: true,
        plugins: true,
        experimentalFeatures: false,
        experimentalCanvasFeatures: false,
        overlayScrollbars: false,
        overlayFullscreenVideo: false,
        sharedWorker: true,
        directWrite: true,
        pageVisibility: true
    }
};
