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
import { Row, Col } from 'react-bootstrap';
import SelectButton from './components/SelectButton';
import './App.css';
import { IPerson } from './types';

export default function Nav({
  drivers,
  attendees,
  removeFromMenuCallback,
}: {
  drivers: IPerson[];
  attendees: IPerson[];
  // eslint-disable-next-line no-unused-vars
  removeFromMenuCallback: (id: string, personType: string) => void;
}) {
  return (
    <div className="App">
      <Row>
        <p />
      </Row>
      <Row>
        <Col sm={1} />
        <Col sm={1}>
          <SelectButton
            availablePeople={drivers}
            buttonType="Driver"
            removePersonCallback={removeFromMenuCallback}
          />
        </Col>
        <Col sm={1} />
        <Col sm={1}>
          <SelectButton
            availablePeople={attendees}
            buttonType="Attendee"
            removePersonCallback={removeFromMenuCallback}
          />
        </Col>
        <Col sm={8} />
      </Row>
      <Row>&nbsp;</Row>
    </div>
  );
}
