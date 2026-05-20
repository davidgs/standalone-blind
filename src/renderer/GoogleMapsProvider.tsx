import { createContext, useContext, type ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
} from './googleMapsConfig';

type GoogleMapsContextValue = {
  isLoaded: boolean;
  loadError: Error | undefined;
};

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  isLoaded: false,
  loadError: undefined,
});

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'script-loader',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps(): GoogleMapsContextValue {
  return useContext(GoogleMapsContext);
}
