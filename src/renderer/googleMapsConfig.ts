import type { Library } from '@googlemaps/js-api-loader';

/** Injected at build time by webpack DefinePlugin from .env. */
export const GOOGLE_MAPS_API_KEY = __GOOGLE_MAPS_API_KEY__;

/**
 * Packaged Electron uses file:// (empty Referer → 403). Main process injects a
 * Referer; whitelist the same value on your API key (HTTP referrers):
 * - https://localhost/*
 * - http://localhost:1212/* (dev)
 * Enable: Maps JavaScript API, Routes API, Places API, Geocoding API.
 */

/** Required for AdvancedMarkerElement; use DEMO_MAP_ID or a Cloud Console map ID. */
export const GOOGLE_MAP_ID = 'DEMO_MAP_ID';

export const GOOGLE_MAPS_LIBRARIES: Library[] = [
  'routes',
  'marker',
];
