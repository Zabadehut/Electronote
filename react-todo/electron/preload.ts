import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on(channel, listener);
    },
    off: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.off(channel, listener);
    },
    send: (channel: string, ...args: any[]) => {
      ipcRenderer.send(channel, ...args);
    },
    invoke: (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args);
    },
    once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.once(channel, listener);
    }
  },
  zoom: {
    setZoomFactor: (factor: number) => {
      ipcRenderer.send('set-zoom-factor', factor);
    },
    getZoomFactor: () => {
      return ipcRenderer.invoke('get-zoom-factor');
    }
  },
  triggerAlarm: () => {
    ipcRenderer.send('trigger-alarm');
  }
});

// Ajout de l'écouteur de l'événement de molette avec Ctrl
window.addEventListener('wheel', (event) => {
  if (event.ctrlKey) {
    ipcRenderer.send('zoom', event.deltaY);
    event.preventDefault();
  }
});
