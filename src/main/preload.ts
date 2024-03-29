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
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';

export type Events = 'get-last-routes' | 'save-last-routes';
export type electronAPI = {
  getLastRoutes: () => Promise<string>;
  saveLastRoutes: (routes: string) => Promise<string>;
  sendMail: (recipient: string, body: string) => Promise<string>;
  signRequest: (contents: string) => Promise<string>;
};

contextBridge.exposeInMainWorld('electronAPI', {
  getLastRoutes: () => ipcRenderer.invoke('get-last-routes'),
  saveLastRoutes: (routes: string) =>
    ipcRenderer.invoke('save-last-routes', routes),
  sendMail: (recipient: string, body: string) =>
    ipcRenderer.invoke('send-mail', recipient, body),
  signRequest: (contents: string) => ipcRenderer.invoke('sign-request', contents),
});

declare global {
  interface Window {
    electronAPI: {
      getLastRoutes: () => Promise<string>;
      saveLastRoutes: (routes: string) => Promise<string>;
      sendMail: (recipient: string, body: string) => Promise<string>;
      signRequest: (contents: string) => Promise<string>;
    };
  }
}
