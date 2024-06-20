import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Définition des types pour les paramètres
type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void;

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel: string, listener: IpcRendererListener) {
      ipcRenderer.on(channel, listener);
    },
    off(channel: string, listener: IpcRendererListener) {
      ipcRenderer.off(channel, listener);
    },
    send(channel: string, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    invoke(channel: string, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
    once(channel: string, listener: IpcRendererListener) {
      ipcRenderer.once(channel, listener);
    }
  }
});
