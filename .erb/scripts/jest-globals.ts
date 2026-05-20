/** Webpack DefinePlugin values for Jest (no webpack in unit tests). */
(globalThis as typeof globalThis & { __GOOGLE_MAPS_API_KEY__: string }).__GOOGLE_MAPS_API_KEY__ =
  '';

const electronAPI = {
  getLastRoutes: async () => '[]',
  saveLastRoutes: async () => 'ok',
  sendMail: async () => 'ok',
  signRequest: async () =>
    JSON.stringify({ ts: '0', signature: 'test' }),
};

Object.defineProperty(window, 'electronAPI', {
  value: electronAPI,
  writable: true,
});
