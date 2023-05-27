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
import React, { SyntheticEvent, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import {
  Pencil,
  PersonXFill,
  ArrowRightCircleFill,
  ArrowDownCircleFill,
} from 'react-bootstrap-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import PersonForm from '../NewPersonForm';
import { IPerson, SortPeople } from '../types';
import DireWarning from './DireWarning';

interface TableColumn {
  key: string;
  label: string;
  ref?: React.RefObject<HTMLDivElement>;
}

export default function PersonTable() {
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [editingPerson, setEditingPerson] = React.useState<IPerson | null>(
    null
  );
  const [thisType, setTType] = useState<string>('');
  const [allDrivers, setAllDrivers] = useState<IPerson[]>([]);
  const [allAttendees, setAllAttendees] = useState<IPerson[]>([]);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [direText, setWarning] = useState<string>('');
  const [aboutToRemove, setAboutToRemove] = useState<IPerson | null>(null);
  const [showDrivers, setShowDrivers] = useState<boolean>(true);
  const [showRiders, setShowRiders] = useState<boolean>(true);
  const DriverTableClass = 'resize-table driver-table-all';

  const nameStyle = 'all-name';
  const tableHeight = 'auto';
  const Headers: TableColumn[] = [
    { key: 'driver', label: 'Name' },
    { key: 'info', label: 'Information' },
    { key: 'notes', label: 'Notes' },
  ];

  /* Get all drivers and attendees from the database */
  const getAll = () => {
    axios
      .get(`https://davidgs.com:3001/api/Drivers`)
      // eslint-disable-next-line promise/always-return
      .then((response) => {
        const newDrivers = response.data;
        setAllDrivers(SortPeople(newDrivers as IPerson[]) as IPerson[]);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });

    axios
      .get(`https://davidgs.com:3001/api/Attendees`)
      // eslint-disable-next-line promise/always-return
      .then((response) => {
        const newAtts = response.data;
        setAllAttendees(SortPeople(newAtts as IPerson[]) as IPerson[]);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  useEffect(() => {
    getAll();
  }, []);

  /*
   * Create the headers for the table
   * @param header - the list of headers to create
   * @returns - a list of headers
   */
  const createHeaders = (header: TableColumn[]) => {
    return header.map((item) => ({
      text: item.label,
      key: item.key,
    }));
  };

  const Columns = createHeaders(Headers);

  /*
   * Edit a person's information
   * @param e - the event that triggered this
   * @returns - nothing
   */
  const editThisPerson = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.value;
    // eslint-disable-next-line no-underscore-dangle
    const person = allDrivers.find((p) => p._id === idValue);
    if (person) {
      setEditingPerson(person);
      setTType('drivers');
      setShowForm(true);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      const person2 = allAttendees.find((p) => p._id === idValue);
      if (person2) {
        setEditingPerson(person2);
        setTType('attendees');
        setShowForm(true);
      }
    }
  };

  /*
   * Really remove a person from the database
   * @param value - true to remove, false to cancel
   * @returns - nothing
   */
  const reallyRemovePerson = (value: boolean) => {
    if (!value) {
      setAboutToRemove(null);
      setTType('');
      setShowWarning(false);
      return;
    }
    const p = aboutToRemove as IPerson;
    if (p === null) {
      return;
    }
    if (thisType === 'drivers') {
      axios
        // eslint-disable-next-line no-underscore-dangle
        .post(`https://davidgs.com:3001/api/delete/Drivers/${p._id}`)
        // eslint-disable-next-line promise/always-return
        .then(() => {
          getAll();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    } else {
      axios
        // eslint-disable-next-line no-underscore-dangle
        .post(`https://davidgs.com:3001/api/delete/Attendees/${p._id}`)
        // eslint-disable-next-line promise/always-return
        .then(() => {
          getAll();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    }
    setTType('');
    setAboutToRemove(null);
    setShowWarning(false);
  };

  /*
   * Remove a person from the database
   * @param e - the event that triggered this
   * @returns - nothing
   */
  const removePerson = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.value;
    // eslint-disable-next-line no-underscore-dangle
    const person = allDrivers.find((p) => p._id === idValue);
    if (person) {
      setAboutToRemove(person);
      setTType('drivers');
      setWarning(`Removing ${person.name} is permanent and cannot be undone!`);
      setShowWarning(true);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      const person2 = allAttendees.find((p) => p._id === idValue);
      if (person2) {
        setAboutToRemove(person2);
        setTType('attendees');
        setWarning(
          `Removing ${person2.name} is permanent and cannot be undone!`
        );
        setShowWarning(true);
      }
    }
  };

  /*
   * Edit a person's information
   * @param nPerson - the new person to add
   * @returns - nothing
   * @todo - update the person in the database
   */
  const editPerson = (nPerson: IPerson) => {
    if (nPerson) {
      setTType('');
    }
    setShowForm(false);
    setEditingPerson(null);
    getAll();
  };

  /*
     Create a tel: link for a phone number
     @param phone - the phone number to link
     @param kind - the kind of phone number (home, cell, etc)
     @returns - a ReactNode with the link
  */
  const phoneLink = (phone: string, kind: string) => {
    return (
      <>
        {kind}: <a href={`tel:${phone}`}>{phone}</a>
      </>
    );
  };

  /*
      Create a mailto: link for an email address
      @param email - the email address to link
      @returns - a ReactNode with the link
  */
  const emailLink = (email: string) => {
    return (
      <>
        Email: <a href={`mailto:${email}`}>{email}</a>
      </>
    );
  };

  /*
   * Create the rows for the table
   * @param personList - the list of people to create rows for
   * @returns - a list of rows
   */
  const rows = (personList: IPerson[]) => {
    return personList.map((person) => {
      return (
        <tr key={person.name} style={{ borderBottom: '2px solid black' }}>
          {/* buttons and Person's Name */}
          <td style={{ borderLeft: '1px solid black' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingBottom: '5px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Tooltip id="edit-btn-tooltip">
                      Edit {person.name}&apos;s Information.
                    </Tooltip>
                  }
                >
                  <Button
                    size="sm"
                    variant="success"
                    // eslint-disable-next-line no-underscore-dangle
                    value={person._id}
                    onClick={editThisPerson}
                  >
                    <Pencil />
                  </Button>
                </OverlayTrigger>
              </div>
              &nbsp;
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                &nbsp;
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Tooltip id="clear-btn-tooltip">
                      Remove {person.name} permanently.
                    </Tooltip>
                  }
                >
                  <Button
                    size="sm"
                    variant="danger"
                    // eslint-disable-next-line no-underscore-dangle
                    value={person._id}
                    onClick={removePerson}
                  >
                    <PersonXFill />
                  </Button>
                </OverlayTrigger>
              </div>
              &nbsp;
              <div className={nameStyle}>&nbsp; {person.name}</div>
            </div>
          </td>
          {/* Person's Contact Info */}
          <td style={{ borderLeft: '1px solid black', fontSize: '10pt' }}>
            {person.address}
            <br />
            {person.city}, {person.state} {person.zip}
            {person.homephone ? <br /> : null}
            {person.homephone ? phoneLink(person.homephone, 'Home') : null}
            {person.cellphone ? <br /> : null}
            {person.cellphone ? phoneLink(person.cellphone, 'Cell') : null}
            {person.email ? <br /> : null}
            {person.email ? emailLink(person.email) : null}
          </td>
          {/* Person's Notes */}
          <td style={{ borderLeft: '1px solid black', fontSize: '10pt' }}>
            {person.notes}
          </td>
        </tr>
      );
    });
  };

  /*
   * Change the view of the drivers table
   * @param event - the event that triggered this
   * @returns - nothing
   */
  const changeDriversView = (
    // eslint-disable-next-line no-unused-vars
    event: SyntheticEvent
  ) => {
    setShowDrivers(!showDrivers);
  };

  /*
   * Change the view of the riders table
   * @param event - the event that triggered this
   * @returns - nothing
   */
  const changeRiderView = (
    // eslint-disable-next-line no-unused-vars
    event: SyntheticEvent
  ) => {
    setShowRiders(!showRiders);
  };

  return (
    <div style={{ width: '95vw', margin: 'auto' }}>
      <div>
        <h1>
          Drivers Table &nbsp;{' '}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-disabled">Add a new driver.</Tooltip>}
          >
            <Button
              id="add-driver-button"
              variant="primary"
              value="drivers"
              onClick={() => {
                setShowForm(!showForm);
                setTType('drivers');
              }}
            >
              Add Driver
            </Button>
          </OverlayTrigger>
          &nbsp;{' '}
          <Button
            variant="icon-only"
            size="lg"
            onClick={changeDriversView}
            style={{ alignItems: 'center' }}
          >
            {showDrivers ? (
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip id="tooltip-disabled">Hide Drivers</Tooltip>}
              >
                <ArrowDownCircleFill size={36} />
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip id="tooltip-disabled">Show Drivers</Tooltip>}
              >
                <ArrowRightCircleFill size={36} />
              </OverlayTrigger>
            )}
          </Button>
        </h1>
        <div
          className="table-wrapper"
          style={{ display: `${showDrivers ? 'block' : 'none'}` }}
        >
          <table className={DriverTableClass}>
            <thead>
              <tr>
                {Columns.map(({ text }) => {
                  return (
                    <th key={text}>
                      <span>{text}</span>
                      <div style={{ height: tableHeight }} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>{rows(allDrivers)}</tbody>
          </table>
          <p>&nbsp;</p>
        </div>
      </div>
      <div>
        <h1>
          Attendees Table&nbsp;{' '}
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-disabled">Add a new attendee.</Tooltip>
            }
          >
            <Button
              id="add-driver-button"
              variant="primary"
              value="attendees"
              onClick={() => {
                setShowForm(!showForm);
                setTType('attendees');
              }}
            >
              Add Attendee
            </Button>
          </OverlayTrigger>
          &nbsp;{' '}
          <Button
            variant="icon-only"
            size="lg"
            onClick={changeRiderView}
            style={{ alignItems: 'center' }}
          >
            {showRiders ? (
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="tooltip-disabled">Hide Attendees</Tooltip>
                }
              >
                <ArrowDownCircleFill size={36} />
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="tooltip-disabled">Show Attendees</Tooltip>
                }
              >
                <ArrowRightCircleFill size={36} />
              </OverlayTrigger>
            )}
          </Button>
        </h1>
        <div
          className="table-wrapper"
          style={{ display: `${showRiders ? 'block' : 'none'}` }}
        >
          <table className={DriverTableClass}>
            <thead>
              <tr>
                {Columns.map(({ text }) => (
                  <th key={text}>
                    <span>{text}</span>
                    <div style={{ height: tableHeight }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{rows(allAttendees)}</tbody>
          </table>
        </div>
      </div>
      <PersonForm
        person={editingPerson}
        thesePeople={thisType === 'drivers' ? allDrivers : allAttendees}
        type={thisType}
        addPersonCallback={editPerson}
        showMe={showForm}
      />
      <DireWarning
        show={showWarning}
        warning={direText}
        onConfirm={reallyRemovePerson}
      />
    </div>
  );
}
