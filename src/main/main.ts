/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
import { createHmac, type BinaryLike } from 'crypto';
import dotenv from 'dotenv';
import {
  app,
  BrowserWindow,
  session,
  shell,
  ipcMain,
  type IpcMainInvokeEvent,
} from 'electron';
import Store from 'electron-store';
import nodemailer, { type SentMessageInfo, type Transporter } from 'nodemailer';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

type StoreSchema = {
  BLIND_SECRET?: string;
  BLIND_PASSWD?: string;
  'blind-routes'?: unknown;
};

const store = new Store<StoreSchema>();

function getStoreString(key: 'BLIND_SECRET' | 'BLIND_PASSWD'): string | undefined {
  const value = store.get(key);
  return typeof value === 'string' ? value : undefined;
}

/** Load .env when running unpackaged; CI/production builds bake secrets via webpack. */
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

function initSecretsFromEnv(): void {
  if (process.env.BLIND_SECRET) {
    store.set('BLIND_SECRET', process.env.BLIND_SECRET);
  }
  if (process.env.BLIND_PASSWD) {
    store.set('BLIND_PASSWD', process.env.BLIND_PASSWD);
  }
}

initSecretsFromEnv();

const transporter: Transporter = nodemailer.createTransport({
  host: 'blind-ministries.org',
  port: 465,
  secure: true,
  auth: {
    user: 'routing@blind-ministries.org',
    pass: getStoreString('BLIND_PASSWD') ?? '',
  },
});

ipcMain.handle('get-last-routes', (): string => {
  return JSON.stringify(store.get('blind-routes', null));
});

function signRequest(
  contents: string
): { signature: string; ts: string } | null {
  const ts = Date.now();
  const sigBasestring = `V0:${ts}:${contents}`;
  const secret = getStoreString('BLIND_SECRET');
  if (!secret) {
    return null;
  }
  const hm = createHmac('sha256', secret as BinaryLike);
  hm.update(sigBasestring);
  return { signature: hm.digest('hex'), ts: ts.toString() };
}

ipcMain.handle(
  'sign-request',
  (_event: IpcMainInvokeEvent, contents: string): string => {
    return JSON.stringify(signRequest(contents));
  }
);

async function sendMail(recipient: string, body: string): Promise<string> {
  const result: SentMessageInfo = await transporter.sendMail({
    from: 'routing@blind-ministries.org',
    to: recipient,
    replyTo: 'routing@blind-ministries.org',
    cc: 'routing@blind-ministries.org',
    subject: 'Blind Ministry Routing',
    html: body,
  });
  return JSON.stringify(result);
}

ipcMain.handle(
  'send-mail',
  (
    _event: IpcMainInvokeEvent,
    recipient: string,
    body: string
  ): Promise<string> => sendMail(recipient, body)
);

ipcMain.handle(
  'save-last-routes',
  (_event: IpcMainInvokeEvent, routes: string): string => {
    store.delete('blind-routes');
    store.set('blind-routes', JSON.parse(routes) as unknown);
    return JSON.stringify(store.get('blind-routes', null));
  }
);

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

async function enableElectronDebug(): Promise<void> {
  if (!isDebug) return;
  const { default: enableDebug } = await import('electron-debug');
  enableDebug();
}

const GOOGLE_API_URL_FILTER = [
  '*://*.googleapis.com/*',
  '*://maps.googleapis.com/*',
  '*://maps.gstatic.com/*',
];

/** Electron file:// loads send no Referer; GCP keys with HTTP referrer restrictions return 403. */
function googleMapsReferer(): string {
  const override = process.env.GOOGLE_MAPS_REFERER?.trim();
  if (override) return override;
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    return `http://localhost:${port}/`;
  }
  return 'https://localhost/';
}

function configureGoogleMapsReferer(): void {
  const referer = googleMapsReferer();
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: GOOGLE_API_URL_FILTER },
    (details, callback) => {
      const requestHeaders = { ...details.requestHeaders };
      requestHeaders.Referer = referer;
      callback({ requestHeaders });
    }
  );
}

const installExtensions = async (): Promise<void> => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  try {
    const installer = await import('electron-devtools-installer');
    const install =
      installer.default ?? installer.installExtension;
    await install(installer.REACT_DEVELOPER_TOOLS, { forceDownload });
  } catch (err) {
    console.log(err);
  }
};

const createWindow = async (): Promise<void> => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const options = {
    applicationName: 'Blind Ministry Routing',
    applicationVersion: '1.2.1',
    copyright: '© 2023',
    version: '1.2.1',
    credits: 'Credits:\n\t• David G. Simmons\n\t• Electron React Boilerplate',
    authors: ['David G. Simmons'],
    website: 'https://github.com/davidgs/standalone-blind',
    iconPath: getAssetPath('icon.png'),
  };
  app.setAboutPanelOptions(options);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 1024,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
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

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    configureGoogleMapsReferer();
    await enableElectronDebug();
    await createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
