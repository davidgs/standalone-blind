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
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from '../GoogleMapsProvider';
import { GOOGLE_MAP_ID } from '../googleMapsConfig';
import { ICarpool, ChurchPlace } from '../types';

import '../App.css';

function buildDirectionsFromRoute(route: google.maps.routes.Route): string[] {
  const dir: string[] = [];
  route.legs?.forEach((leg) => {
    leg.steps?.forEach((step) => {
      if (step.instructions) dir.push(step.instructions);
    });
  });
  return dir;
}

function clearPolylines(polylines: google.maps.Polyline[]) {
  polylines.forEach((polyline) => polyline.setMap(null));
}

export default function MiniMap({
  carpool,
  callback,
}: {
  carpool: ICarpool;
  callback: (directions: string[] | null, id: string | null) => void;
}) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [mapCarpool, setMapCarpool] = useState<ICarpool>(carpool);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  const miniMapContainerStyle = {
    height: '400px',
    width: '650px',
    margin: 'auto',
    paddingRight: '5px',
  };

  const options: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    center: {
      lat: ChurchPlace.location.lat,
      lng: ChurchPlace.location.lng,
    },
    zoom: 11,
    mapId: GOOGLE_MAP_ID,
  };

  useEffect(() => {
    setMapCarpool(carpool);
  }, [carpool]);

  const computeRoute = useCallback(async () => {
    if (!isLoaded || !mapInstance || mapCarpool.riders.length === 0) {
      clearPolylines(polylinesRef.current);
      polylinesRef.current = [];
      return;
    }

    clearPolylines(polylinesRef.current);
    polylinesRef.current = [];
    setRouteError(null);

    try {
      const { Route } = (await google.maps.importLibrary(
        'routes'
      )) as google.maps.RoutesLibrary;

      const { routes } = await Route.computeRoutes({
        origin: mapCarpool.driver.location,
        destination: ChurchPlace.location,
        intermediates: mapCarpool.riders.map((rider) => ({
          location: { lat: rider.location.lat, lng: rider.location.lng },
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypointOrder: true,
        fields: ['path', 'legs', 'optimizedIntermediateWaypointIndices'],
      });

      if (!routes?.length) {
        callback(null, mapCarpool.driver._id);
        return;
      }

      const route = routes[0];
      const newPolylines = route.createPolylines();
      newPolylines.forEach((polyline) => {
        polyline.setMap(mapInstance);
      });
      polylinesRef.current = newPolylines;

      if (route.path?.length) {
        const bounds = new google.maps.LatLngBounds();
        route.path.forEach((point) => bounds.extend(point));
        mapInstance.fitBounds(bounds);
      }

      callback(buildDirectionsFromRoute(route), mapCarpool.driver._id);
    } catch (err) {
      console.error('Route computation failed:', err);
      const message =
        err instanceof Error ? err.message : 'Route computation failed';
      setRouteError(message);
      callback(null, mapCarpool.driver._id);
    }
  }, [isLoaded, mapInstance, mapCarpool, callback]);

  useEffect(() => {
    computeRoute();
    return () => clearPolylines(polylinesRef.current);
  }, [computeRoute]);

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }
  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <>
      {routeError ? (
        <div
          className="alert alert-warning"
          role="alert"
          style={{ maxWidth: 650, margin: '0 auto 8px' }}
        >
          {routeError}
        </div>
      ) : null}
      <div id={`map-${mapCarpool.driver._id}`} />
      <GoogleMap
        mapContainerStyle={miniMapContainerStyle}
        options={options}
        onLoad={setMapInstance}
        onUnmount={() => {
          clearPolylines(polylinesRef.current);
          polylinesRef.current = [];
          setMapInstance(null);
        }}
      />
    </>
  );
}
