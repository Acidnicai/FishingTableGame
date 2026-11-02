const { app, BrowserWindow, ipcMain, screen, nativeTheme } = require('electron');
const fs = require('fs');
const path = require('path');

app.setName('小鱼塘');
if (process.platform === 'win32') {
  app.setAppUserModelId('tablegame.desktop.pond');
}

app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

const EXPANDED = { width: 440, height: 720 };
const COMPACT = { width: 228, height: 96 };

function woodColor() {
  return nativeTheme.shouldUseDarkColors ? '#241610' : '#5c3a22';
}

nativeTheme.themeSource = 'system';

let win = null;
const savePath = () => path.join(app.getPath('userData'), 'pond.json');

function readSave() {
  try {
    return JSON.parse(fs.readFileSync(savePath(), 'utf8'));
  } catch {
    return {};
  }
}

function writeSave(data) {
  try {
    const prev = readSave();
    const pos = win && !win.isDestroyed() ? win.getPosition() : null;
    const next = { ...prev, ...data };
    if (pos) {
      next.x = pos[0];
      next.y = pos[1];
    }
    fs.mkdirSync(path.dirname(savePath()), { recursive: true });
    fs.writeFileSync(savePath(), JSON.stringify(next, null, 2));
  } catch (error) {
    console.error('save failed', error);
  }
}

function clampOpacity(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(1, Math.max(0.55, n));
}

function safePos(x, y, w, h) {
  const displays = screen.getAllDisplays();
  const visible = Number.isFinite(x) && Number.isFinite(y) && displays.some((d) => {
    const a = d.workArea;
    return x < a.x + a.width - 48 && x + w > a.x + 48 && y < a.y + a.height - 48 && y + h > a.y + 48;
  });
  if (visible) {
    const area = screen.getDisplayMatching({ x, y, width: w, height: h }).workArea;
    return {
      x: Math.round(Math.min(Math.max(x, area.x), area.x + area.width - w)),
      y: Math.round(Math.min(Math.max(y, area.y), area.y + area.height - h)),
    };
  }
  const a = screen.getPrimaryDisplay().workArea;
  return {
    x: Math.round(a.x + a.width - w - 28),
    y: Math.round(a.y + a.height - h - 28),
  };
}

function keepOnScreen(w, h) {
  const bounds = win.getBounds();
  const display = screen.getDisplayMatching(bounds);
  const a = display.workArea;
  let x = bounds.x;
  let y = bounds.y;
  if (x + w > a.x + a.width) x = a.x + a.width - w;
  if (y + h > a.y + a.height) y = a.y + a.height - h;
  if (x < a.x) x = a.x;
  if (y < a.y) y = a.y;
  return { x, y, width: w, height: h };
}

function createWindow() {
  const save = readSave();
  const compact = !!save.compact;
  const size = compact ? COMPACT : EXPANDED;
  const pos = safePos(save.x, save.y, size.width, size.height);
  const iconPath = path.join(__dirname, 'icon.png');

  win = new BrowserWindow({
    width: size.width,
    height: size.height,
    x: pos.x,
    y: pos.y,
    show: false,
    frame: false,
    transparent: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: false,
    hasShadow: false,
    thickFrame: false,
    roundedCorners: false,
    alwaysOnTop: save.top !== false,
    backgroundColor: woodColor(),
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
      zoomFactor: 1,
    },
  });

  win.setBackgroundColor(woodColor());
  win.setAlwaysOnTop(save.top !== false, 'floating');
  win.setOpacity(clampOpacity(save.opacity ?? 1));
  win.setMenuBarVisibility(false);
  win.webContents.setBackgroundThrottling(false);
  win.webContents.setVisualZoomLevelLimits(1, 1).catch(() => {});

  win.webContents.on('before-input-event', (event, input) => {
    const zoomKey = input.control && ['+', '-', '=', '0'].includes(input.key);
    if (zoomKey) event.preventDefault();
  });

  win.on('moved', () => writeSave({}));

  win.setTitle('工位');
  win.loadFile(path.join(__dirname, 'index.html'));
  const sendTheme = () => {
    if (!win || win.isDestroyed()) return;
    win.setBackgroundColor(woodColor());
    win.webContents.send('theme', nativeTheme.shouldUseDarkColors);
  };
  nativeTheme.on('updated', sendTheme);
  win.webContents.on('did-finish-load', sendTheme);

  setTimeout(() => {
    if (win && !win.isDestroyed() && !win.isVisible()) win.show();
  }, 2500);
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win || win.isDestroyed()) return;
    if (!win.isVisible()) win.show();
    win.focus();
  });

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => app.quit());
}

ipcMain.handle('load-save', () => readSave());
ipcMain.handle('get-theme', () => nativeTheme.shouldUseDarkColors);

ipcMain.on('save', (_event, data) => writeSave(data || {}));
ipcMain.on('save-sync', (event, data) => {
  writeSave(data || {});
  event.returnValue = true;
});

ipcMain.on('set-top', (_event, on) => {
  if (!win || win.isDestroyed()) return;
  win.setAlwaysOnTop(!!on, 'floating');
});

ipcMain.on('set-opacity', (_event, value) => {
  if (!win || win.isDestroyed()) return;
  win.setOpacity(clampOpacity(value));
});

ipcMain.on('set-compact', (_event, compact) => {
  if (!win || win.isDestroyed()) return;
  const size = compact ? COMPACT : EXPANDED;
  win.setBounds(keepOnScreen(size.width, size.height));
});

ipcMain.on('set-ignore', (_event, ignore) => {
  if (!win || win.isDestroyed()) return;
  if (ignore) win.setIgnoreMouseEvents(true, { forward: true });
  else win.setIgnoreMouseEvents(false);
});

ipcMain.on('flash', (_event, on) => {
  if (!win || win.isDestroyed()) return;
  win.flashFrame(!!on);
});

ipcMain.on('move-by', (_event, dx, dy) => {
  if (!win || win.isDestroyed()) return;
  const [x, y] = win.getPosition();
  win.setPosition(Math.round(x + dx), Math.round(y + dy));
});

ipcMain.on('close', () => {
  if (win && !win.isDestroyed()) win.destroy();
  app.quit();
});

ipcMain.on('ready', () => {
  if (!win || win.isDestroyed()) return;
  win.show();
});
