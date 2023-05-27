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
import { InfoWindowF } from '@react-google-maps/api';
import React, { useState } from 'react';
import { IPerson } from '../types';

export default function MiniInfo({ inf }: { inf: IPerson }) {
  const [info, setInfo] = useState(inf);

  React.useEffect(() => {
    setInfo(inf);
  }, [inf]);

  return (
    <InfoWindowF
      position={{
        lat: info.location.lat,
        lng: info.location.lng,
      }}
      onCloseClick={() => {}}
      zIndex={100}
    >
      <div>
        <h4>{info.name}</h4>
        <div style={{ textAlign: 'left' }}>
          <details>
            <summary>address</summary>
            <address>
              {info.address}
              <br />
              {info.city}, {info.state} {info.zip}
            </address>
            {info.homephone !== '' && info.homephone !== null ? (
              <p>
                Home: <a href={`tel:${info.homephone}`}>{info.homephone}</a>
              </p>
            ) : null}
            {info.cellphone !== '' && info.cellphone !== null ? (
              <p>
                Cell: <a href={`tel:${info.cellphone}`}>{info.cellphone}</a>
              </p>
            ) : null}
            {info.email !== '' && info.email !== null ? (
              <p>
                Email: <a href={`mailto:${info.email}`}>{info.email}</a>
              </p>
            ) : null}
            {info.notes !== '' && info.notes !== null ? (
              <p>
                <strong>Notes</strong>
                {info.notes}
              </p>
            ) : null}
          </details>
        </div>
      </div>
    </InfoWindowF>
  );
}
