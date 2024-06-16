import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel: string, listener: (...args: any[]) => void) {
      ipcRenderer.on(channel, listener);
    },
    off(channel: string, listener: (...args: any[]) => void) {
      ipcRenderer.off(channel, listener);
    },
    send(channel: string, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    invoke(channel: string, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
    once(channel: string, listener: (...args: any[]) => void) {
      ipcRenderer.once(channel, listener);
    }
  }
});
