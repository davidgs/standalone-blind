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
import React, { useState } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { Form, Row, Col } from 'react-bootstrap';

export default function AddressField(): React.JSX.Element {
  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: "AIzaSyARN4ZLpzuzwGo2M6PKr2M--juR5zJyrew",
  //   libraries,
  // });
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  // const onLoad = (ref) => (this.searchBox = ref);

  const searchBox = React.useRef(null);
  // const onPlacesChanged = () => {
  //   const comps = searchBox.current?.getPlaces()[0];
  //   const thisAddr = comps.formatted_address;
  //   const addrComps = thisAddr.split(',');
  //   setAddress(addrComps[0]);
  //   setCity(addrComps[1]);
  //   const stZ = addrComps[2].split(' ');
  //   setState(stZ[1]);
  //   setZip(stZ[2]);
  // };

  return (
    <Form.Group>
      <Row>
        <Col sm={12}>
          <StandaloneSearchBox
            // onPlacesChanged={onPlacesChanged}
            ref={searchBox}
          >
            <Form.Control
              type="text"
              placeholder="address"
              name="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </StandaloneSearchBox>
        </Col>
      </Row>
      <p />
      <Row>
        <Col sm={6}>
          <Form.Control
            type="text"
            placeholder="City"
            name="City"
            onChange={(e) => {
              setCity(e.target.value);
            }}
            value={city}
          />
        </Col>
        <Col sm={3}>
          <Form.Control
            type="text"
            placeholder="State"
            name="State"
            onChange={(e) => {
              setState(e.target.value);
            }}
            value={state}
          />
        </Col>
        <Col sm={3}>
          <Form.Control
            type="text"
            placeholder="Zip Code"
            name="Zip"
            onChange={(e) => {
              setZip(e.target.value);
            }}
            value={zip}
          />
        </Col>
      </Row>
    </Form.Group>
  );
}
