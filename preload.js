const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pond', {
  load: () => ipcRenderer.invoke('load-save'),
  save: (data) => ipcRenderer.send('save', data),
  saveSync: (data) => ipcRenderer.sendSync('save-sync', data),
  setTop: (on) => ipcRenderer.send('set-top', on),
  setOpacity: (value) => ipcRenderer.send('set-opacity', value),
  setCompact: (on) => ipcRenderer.send('set-compact', on),
  setIgnore: (ignore) => ipcRenderer.send('set-ignore', ignore),
  flash: (on) => ipcRenderer.send('flash', on),
  moveBy: (dx, dy) => ipcRenderer.send('move-by', dx, dy),
  close: () => ipcRenderer.send('close'),
  ready: () => ipcRenderer.send('ready'),
  getTheme: () => ipcRenderer.invoke('get-theme'),
  onTheme: (callback) => {
    const listener = (_event, dark) => callback(!!dark);
    ipcRenderer.on('theme', listener);
  },
});
