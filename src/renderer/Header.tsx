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
import React from 'react';
import './style.css';
import Button from 'react-bootstrap/Button';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Header({
  callback,
}: {
  // eslint-disable-next-line no-unused-vars
  callback: (value: boolean) => void;
}) {
  const [managing, setManaging] = React.useState<boolean>(false);
  const [manageLabel, setManageLabel] = React.useState<string>('Manage People');

  const managePeople = () => {
    setManaging(!managing);
  };

  React.useEffect(() => {
    if (managing) {
      setManageLabel('Done');
    } else {
      setManageLabel('Manage People');
    }
    callback(managing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managing]);

  return (
    <div className="container-fluid" style={{backgroundColor: '#143866'}}>
      <div
        className="text-center"
        style={{
          backgroundColor: '#143866',
          color: '#81c341',
          width: '100%',
          height: '125px',
          paddingTop: '10px',
        }}
      >
        <h1 style={{ paddingTop: '45px !important' }}>Blind Ministry</h1>
        <div className="row text-center" >
          <div className="col-sm-5" />
          <div className="col-sm-2">
            {managing ? (
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Finish edditing all members.
                  </Tooltip>
                }
              >
                <Button variant="success" id="manage" onClick={managePeople}>
                  Done
                </Button>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Add, Edit, or remove members.
                  </Tooltip>
                }
              >
                <Button variant="success" id="manage" onClick={managePeople}>
                  {manageLabel}
                </Button>
              </OverlayTrigger>
            )}
          </div>
          <div className="col-sm-5" />
        </div>
      </div>
    </div>
  );
}
