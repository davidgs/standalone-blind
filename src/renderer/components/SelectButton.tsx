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
/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import {
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { IPerson } from '../types';
import '../App.css';

export default function SelectButton({
  availablePeople,
  buttonType,
  removePersonCallback,
}: {
  availablePeople: IPerson[];
  buttonType: string;
  // eslint-disable-next-line no-unused-vars
  removePersonCallback: (value: string, type: string) => void;
}): React.JSX.Element {
  const dropdownTitle = `Select ${buttonType}`;
  const [dropdownItems, setDropdownItems] = React.useState<IPerson[]>([]);

  useEffect(() => {
    setDropdownItems(availablePeople);
  }, [availablePeople]);

  const items = dropdownItems.map((item: IPerson) => {
    return (
      <Dropdown.Item
        id={`${buttonType}-${item._id}`}
        key={`select-${item._id}`}
        eventKey={item._id}
      >
        {item.name}
      </Dropdown.Item>
    );
  });

  const handleSelect = (eventKey: string | null) => {
    removePersonCallback(eventKey as string, buttonType);
  };

  return (
    <div className="App">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-disabled">
            Add a new {buttonType} to the map of available {buttonType}s.
          </Tooltip>
        }
      >
        <DropdownButton
          variant="success"
          id={`dropdown-basic-button-${buttonType}`}
          title={dropdownTitle}
          onSelect={handleSelect}
        >
          {items}
        </DropdownButton>
      </OverlayTrigger>
    </div>
  );
}
