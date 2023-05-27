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
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  DirectionsService,
} from '@react-google-maps/api';
import { ICarpool, ChurchPlace } from '../types';

import '../App.css';
import MiniPlaceInfo from './MiniPlaces';

export default function Map({
  carpool,
  callback,
}: {
  carpool: ICarpool;
  callback: (directions: string[] | null, id: string | null) => void;
}) {
  const [mapCarpool, setMapCarpool] = useState<ICarpool>(carpool);
  const [id, setId] = useState<string>('');
  const [response, setResponse] = useState<google.maps.DirectionsResult>();
  const [respStatus, setRespStatus] = useState<boolean>(false);
  const [rendered, setRendered] = useState<boolean>(false);
  const [waypoints, setWaypoints] = useState<google.maps.DirectionsWaypoint[]>(
    []
  );
  const [drivingOptions, setDrivingOptions] =
    useState<google.maps.DirectionsRequest>();
  const map = useRef<google.maps.Map | null>(null);
  const [drivingDirections, setDrivingDirections] = useState<string[]>([]);
  const panel = useRef<HTMLDivElement | null>(null);

  // without height and width you won't see a map
  const miniMapContainerStyle = {
    height: '400px',
    width: '650px',
    margin: 'auto',
    paddingRight: '5px',
  };
  // RLC is the default center
  const defaultProps = {
    center: {
      lat: ChurchPlace.location.lat,
      lng: ChurchPlace.location.lng,
    },
    zoom: 12,
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapContainerStyle: { miniMapContainerStyle },
    center: defaultProps.center,
    zoom: 11,
  };

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setPanel(
    document.getElementById(
      `directions-${mapCarpool.driver._id}`
    ) as HTMLElement
  );

  function makeWaypoints(carp?: ICarpool) {
    const wayp: google.maps.DirectionsWaypoint[] = [];
    carp?.riders?.forEach((att) => {
      wayp.push({
        location: { lat: att.location.lat, lng: att.location.lng },
        stopover: true,
      });
    });
    setWaypoints(wayp);
    setDrivingOptions({
      origin: mapCarpool.driver.location,
      destination: ChurchPlace.location,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    });
  }

  useEffect(() => {
    if (carpool === undefined) return;
    setMapCarpool(carpool);
    makeWaypoints(carpool);
    setRendered(false);
    setId(carpool?.driver?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carpool]);

  const buildDirections = (resp: google.maps.DirectionsResult) => {
    // `directions-${carp.driver._id}`
    const dir: string[] = [];
    resp?.routes[0]?.legs[0]?.steps?.forEach((step) => {
      dir.push(step.instructions);
    });
    setDrivingDirections(dir);
    callback(dir, carpool?.driver?._id);
  };

  const directionsCallback = (
    resp: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (rendered) return;
    const mid = document.getElementById(id);

    if (resp !== null) {
      if (status === google.maps.DirectionsStatus.OK) {
        setResponse(resp);
        setRespStatus(true);
        setRendered(true);
        // buildDirections(resp);
      } else {
        setRespStatus(false);
      }
    }
  };

  const renderMap = () => {
    return (
      <>
        <div id={`map-${mapCarpool.driver._id}`} />
        <GoogleMap
          id={id}
          ref={map as React.RefObject<GoogleMap>}
          options={options}
          mapContainerStyle={miniMapContainerStyle}
        >
          {/* <MiniPlaceInfo markerPlaces={[ChurchPlace]} />
          <MiniPlaceInfo markerPlaces={[mapCarpool?.driver]} />
          <MiniPlaceInfo markerPlaces={mapCarpool?.riders} /> */}
          {mapCarpool.riders.length > 0 && !rendered ? (
            <DirectionsService
              // required
              options={{
                destination: ChurchPlace.location,
                waypoints,
                optimizeWaypoints: true,
                origin: mapCarpool.driver.location,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              // required
              callback={directionsCallback}
            />
          ) : null}
          {respStatus ? (
            <DirectionsRenderer
              directions={response}
              panel={
                document.getElementById(
                  `directions-${mapCarpool.driver._id}`
                ) as HTMLElement
              }
              // eslint-disable-line no-undef
            />
          ) : null}
        </GoogleMap>
      </>
    );
  };
  return renderMap();
}
// // Path: src/Places.tsx
