/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { lstat, readdir, stat } from 'fs/promises';
import { readFileSync, readSync, writeFileSync } from 'fs';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const VAULT_PATH =
  'C:/Users/Jonas/Documents/code/notes-app/v11/default-bunker/';

interface Directory {
  createdAt: Number;
  editedAt: Number;
  contents: (File | Directory)[];
  contentSize: string;
  contentSizeBytes: number;
  name: string;
  isDir: true;
  path: string;
}

interface File {
  createdAt: Number;
  editedAt: Number;
  contentSizeBytes: number;
  path: string;
  basename: string;
  name: string;
  contents: [];
  isDir: false;
}

let lastDeepScan = {};
let lastDeepScanned = new Date();

async function getDirectoryContents(dirPath: string): Promise<Directory> {
  const contents = await readdir(dirPath);
  const dirStats = await stat(dirPath);
  const createdAt = Date.parse(dirStats.birthtime.toString());
  const editedAt = Date.parse(dirStats.mtime.toString());
  const name = path.basename(dirPath);
  const isDir = true;

  let contentSizeBytes = 0;
  const contentsPromises = contents.map(async (content) => {
    const contentPath = path.join(dirPath, content);
    const stats = await stat(contentPath);

    if (stats.isDirectory()) {
      const dir = await getDirectoryContents(contentPath);
      contentSizeBytes += dir.contentSizeBytes;
      return dir;
    }

    const file: File = {
      createdAt: Date.parse(stats.birthtime.toString()),
      editedAt: Date.parse(stats.mtime.toString()),
      contentSizeBytes: stats.size,
      path: contentPath,
      basename: path.basename(contentPath),
      name: content,
      contents: [],
      isDir: false,
    };

    contentSizeBytes += file.contentSizeBytes;
    return file;
  });

  const dirContents = await Promise.all(contentsPromises);
  const contentSize = formatSizeUnits(contentSizeBytes);

  return {
    createdAt,
    editedAt,
    contents: dirContents,
    contentSize,
    contentSizeBytes,
    name,
    isDir,
    path: dirPath,
  };
}

function formatSizeUnits(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }
  return `${bytes.toFixed(2)} ${units[index]}`;
}

const hourDiff = (date1: any, date2: any) => Math.abs(date1 - date2) / 36e5;

async function deepScanFileSystem(startPath: string): Promise<any> {
  const stats = await stat(startPath);
  if (stats.isDirectory()) {
    const dir = await getDirectoryContents(startPath);
    if (dir != lastDeepScan) lastDeepScan = dir;
    return dir;
  } else {
    const file: File = {
      createdAt: Date.parse(stats.birthtime.toString()),
      editedAt: Date.parse(stats.mtime.toString()),
      contentSizeBytes: stats.size,
      path: startPath,
      basename: path.basename(startPath),
      name: path.basename(startPath),
      contents: [],
      isDir: false,
    };
    if (file != lastDeepScan) lastDeepScan = file;
    return file;
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('load-vault', async (event, arg) => {
  let vault = await deepScanFileSystem(VAULT_PATH);
  event.reply('load-vault', vault);
});

ipcMain.on('get-file-contents', (event, args) => {
  let obj = { path: args[0] };
  console.log('opening note: ', VAULT_PATH + obj.path, 'utf-8');

  if (obj.path == undefined || obj.path == '') {
    console.log('path may never be null nor undefined');
    return;
  }

  let contents;
  try {
    contents = readFileSync(VAULT_PATH + obj.path, { encoding: 'utf-8' });
  } catch {
    contents =
      'error opening file ({path: "' +
      VAULT_PATH +
      obj.path +
      '", encoding: "utf-8", forced: false})';
  }

  event.reply('get-file-contents', contents);
});

ipcMain.on('restart-all', async (args) => {
  app.relaunch();
  app.exit();
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1700,
    height: 1000,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    frame: false,
    titleBarStyle: 'hidden',
    transparent: false,
    titleBarOverlay: {
      height: 40,
      color: '#00000000',
      symbolColor: '#ffffffff',
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

app.on('before-quit', () => {
  mainWindow?.webContents.send('save-all', []);
});

ipcMain.on('save-file', (event, args) => {
  console.log(args);
  let path = VAULT_PATH + args[0];
  let contents = args[1];
  writeFileSync(path, contents);
});
