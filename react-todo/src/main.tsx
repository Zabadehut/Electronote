import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const checkScrollbars = () => {
    const root = document.getElementById('root');
    if (!root) return;

    // Vérifier si le contenu dépasse la taille du conteneur
    if (root.scrollHeight > root.clientHeight || root.scrollWidth > root.clientWidth) {
        root.style.overflow = 'auto';
    } else {
        root.style.overflow = 'hidden';
    }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

document.getElementById('minimize-btn')?.addEventListener('click', () => {
    window.electron.ipcRenderer.send('window-control', 'minimize');
});

document.getElementById('maximize-btn')?.addEventListener('click', () => {
    window.electron.ipcRenderer.send('window-control', 'maximize');
});

document.getElementById('close-btn')?.addEventListener('click', () => {
    window.electron.ipcRenderer.send('window-control', 'close');
});

window.electron.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
});

useEffect(() => {
    // Vérifier l'état des ascenseurs lors du chargement initial
    checkScrollbars();

    // Vérifier l'état des ascenseurs lorsque la fenêtre est redimensionnée
    window.addEventListener('resize', checkScrollbars);

    const root = document.getElementById('root');
    if (root) {
        // Vérifier l'état des ascenseurs lorsque le contenu change
        const observer = new MutationObserver(checkScrollbars);
        observer.observe(root, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        // Nettoyage de l'observateur lors du démontage du composant
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', checkScrollbars);
        };
    }
}, []);
