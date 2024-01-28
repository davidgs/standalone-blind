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
import { app, BrowserWindow, shell, autoUpdater, ipcMain } from 'electron';
import Store from 'electron-store';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import  { Hmac, createHmac } from 'crypto';
import nodemailer, {SentMessageInfo} from 'nodemailer';

const electronApp = require('electron').app;

const store = new Store();
console.log(`Store Path: ${store.path}`);
console.log(`App Path: ${electronApp.getAppPath()}`);
const transporter = nodemailer.createTransport({
  host: "blind-ministries.org",
  port: 465,
  secure: true,
  auth: {
    user: "routing@blind-ministries.org",
    pass: process.env.BLIND_PASSWD,
  },
});

/*
 * get the params from the last set of routes
 * @return QR Configuration settings
 */
ipcMain.handle('get-last-routes', () => {
  return JSON.stringify(store.get('blind-routes', null));
});

function Signer(contents: string) : {signature: string, ts: string} | null {
const ts = Date.now();
    const sig_basestring = `V0:${ts}:${contents}`;
    console.log(`Sig Base String: ${sig_basestring}`);
    let hm;
    if (process.env.BLIND_SECRET !== undefined) {
      hm = createHmac('sha256', process.env.BLIND_SECRET);
      hm.update(sig_basestring);
      const my_signature = hm.digest('hex');
      return {signature: my_signature, ts: ts.toString()};
    } else {
      return null;
    }
  };

ipcMain.handle('sign-request', (e: Event, contents: string) => {
  return JSON.stringify(Signer(contents));
});

async function SendIt(recipient: string, body: string) {
  const mailOptions = {
    from: 'routing@blind-ministries.org', // sender address
    name: 'Blind Ministry Drivers',
    to: recipient, // list of receivers
    replyTo: 'routing@blind-ministries.org',
    // cc: 'annette.langefeld1@gmail.com',
    cc: 'routing@blind-ministries.org',
    subject: 'Blind Ministry Routing', // Subject line
    html: body, // plain text body
  };
  const foo = await transporter.sendMail(mailOptions)
  return JSON.stringify(foo);
}

ipcMain.handle('send-mail', (e: Event, recipient: string, body: string) => {
  return SendIt(recipient, body);
});

/*
 * save the params from the last set of routes
 * @return QR Configuration settings
 */
ipcMain.handle('save-last-routes', (e: Event, routes: string) => {
  store.delete('blind-routes');
  store.set('blind-routes', JSON.parse(routes));
  return JSON.stringify(store.get('blind-routes', null));
});

// setInterval(() => {
//   up.checkForUpdates();
// }, 1.8e6);
let mainWindow: BrowserWindow | null = null;

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

  const options = {
    applicationName: 'Blind Ministry Routing',
    applicationVersion: '1.0.6',
    copyright: '© 2023',
    version: 'b16',
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
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
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

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
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
