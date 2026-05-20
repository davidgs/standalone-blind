import type { Library } from '@googlemaps/js-api-loader';

/** Injected at build time by webpack DefinePlugin from .env. */
export const GOOGLE_MAPS_API_KEY = __GOOGLE_MAPS_API_KEY__;

/** Required for AdvancedMarkerElement; use DEMO_MAP_ID or a Cloud Console map ID. */
export const GOOGLE_MAP_ID = 'DEMO_MAP_ID';

export const GOOGLE_MAPS_LIBRARIES: Library[] = [
  'places',
  'routes',
  'marker',
];
