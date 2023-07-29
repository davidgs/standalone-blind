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
import { Row, Col, Button } from 'react-bootstrap';
import SelectButton from './components/SelectButton';
import './App.css';
import { IPerson } from './types';

export default function Nav({
  drivers,
  attendees,
  removeFromMenuCallback,
  resetCallback,
}: {
  drivers: IPerson[];
  attendees: IPerson[];
  // eslint-disable-next-line no-unused-vars
  removeFromMenuCallback: (id: string, personType: string) => void;
  resetCallback: (reset: boolean) => void;
}) {
  const resetForm = () => {
    resetCallback(true);
  }

  return (
    <div className="App" style={{ width: '90vw', margin: 'auto'}}>
      <Row>
        <p />
      </Row>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '15%' }}>
          <SelectButton
            availablePeople={drivers}
            buttonType="Driver"
            removePersonCallback={removeFromMenuCallback}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '5%' }} >&nbsp;</div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '15%' }}>
          <SelectButton
            availablePeople={attendees}
            buttonType="Attendee"
            removePersonCallback={removeFromMenuCallback}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '55%' }} >&nbsp;</div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '10%', float: 'right' }}>
          <Button variant="outline-danger" onClick={resetForm}>Reset</Button>
        </div>
      </div>
      <Row>&nbsp;</Row>
    </div>
  );
}
