/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ └── main.ts
     * │ │ └── preload.ts
     * │ │ └── processManager.ts
     * │ │ └── windowConfig.d.ts
     * │ │ └── windowConfig.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  electron: {
    ipcRenderer: {
      on(channel: string, listener: (...args: any[]) => void): void;
      off(channel: string, listener: (...args: any[]) => void): void;
      send(channel: string, ...args: any[]): void;
      invoke(channel: string, ...args: any[]): Promise<any>;
      once(channel: string, listener: (...args: any[]) => void): void;
    };
  };
}
