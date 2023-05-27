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
import { useEffect, useState } from 'react';
import { MarkerF } from '@react-google-maps/api';
import { v4 as uuidv4 } from 'uuid';
import { ChurchPlace, ICarpool, IPerson } from '../types';
import MiniInfo from './MiniInfo';

export default function MiniPlaceInfo({
  markerPlaces,
}: {
  markerPlaces: ICarpool[] | IPerson[];
}) {
  const dIcon = () => {
    return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  };

  const aIcon = () => {
    return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  };

  const icon = () => {
    return 'https://maps.google.com/mapfiles/kml/pal2/icon11.png';
  };
  const [selected, setSelected] = useState<IPerson | null>(null);
  const [myType, setMyType] = useState<string>('');
  const [myCarpools, setMyCarpools] = useState<ICarpool[]>([]);
  const [myRiders, setMyRiders] = useState<IPerson[]>([]);

  useEffect(() => {
    if (!markerPlaces) return;

    // eslint-disable-next-line no-prototype-builtins
    if (markerPlaces?.hasOwnProperty('riders')) {
      setMyCarpools(markerPlaces as ICarpool[]);
      setMyType('carpool');
    } else {
      setMyRiders(markerPlaces as IPerson[]);
      setMyType('person');
    }
  }, [markerPlaces]);

  return (
    <>
      {myType === 'carpool' ? (
        myCarpools[0]?.riders?.map((mar: IPerson) => {
          return (
            <MarkerF
              key={uuidv4()}
              position={{
                lat: mar?.location.lat,
                lng: mar?.location.lng,
              }}
              title={mar?.name}
              animation={window.google.maps.Animation.DROP}
              onClick={() => {
                setSelected(mar);
              }}
              icon={{
                url: mar?.name === ChurchPlace.name ? icon() : aIcon(),
              }}
            />
          );
        })
      ) : (
        <MarkerF
          key={uuidv4()}
          position={{
            lat: myRiders[0]?.location.lat || 0,
            lng: myRiders[0]?.location.lng || 0,
          }}
          title={myRiders[0]?.name}
          animation={window.google.maps.Animation.DROP}
          onClick={() => {
            setSelected(myRiders[0]);
          }}
          icon={{
            url: myRiders[0]?.name === ChurchPlace.name ? icon() : dIcon(),
          }}
        />
      )}
      {selected ? <MiniInfo inf={selected} /> : null}
    </>
  );
}
