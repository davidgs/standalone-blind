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
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { SyntheticEvent, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Header from './Header';
import Nav from './Nav';
import Map from './Map';
import { IPerson, ICarpool, SortPeople } from './types';
import 'react-tabs/style/react-tabs.css';
import MyTabList from './components/MyTabList';
import PersonTable from './components/PersonTable';

function Hello() {
  const [allDrivers, setAllDrivers] = React.useState<IPerson[]>([]);
  const [allAttendees, setAllAttendees] = React.useState<IPerson[]>([]);
  const [selectedAttendees, setSelectedAttendees] = React.useState<IPerson[]>(
    []
  );
  const [myCarpools, setMyCarpools] = React.useState<ICarpool[]>([]);
  const [selectedDrivers, setSelectedDrivers] = React.useState<IPerson[]>([]);
  const [managePeople, setManagePeople] = React.useState<boolean>(false);
  const driversDB = 'drivers';
  const attendeesDB = 'attendees';

  /* Sort carpools by driver name
     @param carpools - the carpools to sort
   */
  const sortCarpools = (carpools: ICarpool[]) => {
    const sorted = carpools.sort((a, b) =>
      a.driver.name > b.driver.name ? 1 : -1
    );
    return sorted;
  };

  /* Remove a person from a carpool
     @param e - the event that triggered the removal
   */
  const removePerson = (e: SyntheticEvent) => {
    const target = e.currentTarget as HTMLInputElement;
    const pers = JSON.parse(target?.value);
    const newCarpools = myCarpools.map((carp) => {
      const newRiders = carp.riders.filter((rider) => rider._id !== pers._id);
      const newCarp: ICarpool = { driver: carp.driver, riders: newRiders };
      return newCarp;
    });
    const act = selectedAttendees;
    act.push(pers);
    setSelectedAttendees(act);
    setMyCarpools(sortCarpools(newCarpools));
    // eslint-disable-next-line no-use-before-define
  };

  /* Get all drivers and attendees from the database */
  const getAll = () => {
    axios.get(`https://davidgs.com:3001/api/${driversDB}`).then((response) => {
      const newDrivers = response.data;
      setAllDrivers(SortPeople(newDrivers as IPerson[]) as IPerson[]);
    });
    axios
      .get(`https://davidgs.com:3001/api/${attendeesDB}`)
      .then((response) => {
        const newAtts = response.data;
        setAllAttendees(SortPeople(newAtts as IPerson[]) as IPerson[]);
      });
  };

  useEffect(() => {
    if (!managePeople) {
      getAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managePeople]);

  /* when someone is seelcted in a menu, add them to the map and remove them
      from the menu.
      @param id - the id of the person to add to the map
      @param personType - the type of person to add to the map
    */
  const removeFromMenu = (id: string, personType: string) => {
    if (personType.toLocaleLowerCase() === 'driver') {
      // find in allDrivers
      const newDrivers = allDrivers.filter((driver) => driver._id === id);
      // get the current selectedDrivers
      const act = { selectedDrivers };
      // remove from allDrivers
      const th = allDrivers.filter((driver) => driver._id !== id);
      // set allDrivers to the new array
      setAllDrivers(th);
      // add the new driver to the selectedDrivers
      act.selectedDrivers.push(newDrivers[0]);
      // set the selectedDrivers to the new array
      setSelectedDrivers(act.selectedDrivers);
      // get the current carpools
      const cp = myCarpools;
      // find the carpool with the driver
      const newCarpool = cp.filter(
        (carpool) => carpool.driver._id === newDrivers[0]._id
      );
      // if there isn't a carpool with the driver, add the driver to a new carpool
      if (newCarpool.length <= 0) {
        const newCP = { driver: newDrivers[0], riders: [] };
        cp.push(newCP);
        setMyCarpools(sortCarpools(cp));
      }
    }
    if (personType.toLocaleLowerCase() === 'attendee') {
      const newAttendees = allAttendees.filter((att) => att._id === id);
      const act = selectedAttendees;
      const th = allAttendees.filter((att) => att._id !== id);
      setAllAttendees(th);
      act.push(newAttendees[0]);
      setSelectedAttendees(act);
    }
  };

  /* When someone is removed from the map, add them back to the menu
     @param rider - the person to add back to the menu
     @param driver - the driver to add the rider back to
   */
  const removeFromMap = (
    rider: IPerson | null | undefined,
    driver: IPerson | null | undefined
  ) => {
    const cp = myCarpools;
    const newCarpool = cp.filter(
      (carpool) => carpool.driver._id === driver?._id
    );
    if (newCarpool.length > 0) {
      newCarpool[0].riders.push(rider as IPerson);
      const cps = cp.filter((carpool) => carpool.driver._id !== driver?._id);
      cps.push(newCarpool[0]);
      setMyCarpools(sortCarpools(cps));
    } else {
      const newCarpool2: ICarpool = {
        driver: driver as IPerson,
        riders: [rider as IPerson],
      };
      cp.push(newCarpool2);
      setMyCarpools(cp);
    }
    const sa = selectedAttendees;
    const newAttendees = sa.filter((att) => att._id !== rider?._id);
    setSelectedAttendees(newAttendees);
  };

  /* Get all drivers and attendees from the database when the app loads */
  React.useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Save the current routes */
  const saveRoutes = () => {
    window.electronAPI
      .saveLastRoutes(JSON.stringify(myCarpools))
      .then((response) => {
        setMyCarpools(JSON.parse(response));
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('saveRoutes error: ', error);
      });
  };

  /* Load the last saved routes */
  const loadRoutes = () => {
    window.electronAPI
      .getLastRoutes()
      .then((response) => {
        if (response === "null") {
          return;
        }
        const newCarpools = JSON.parse(response);
        setMyCarpools(newCarpools);
        const sd = selectedDrivers;
        newCarpools.forEach((carpool: ICarpool) => {
          sd.push(carpool.driver);
        });
        setSelectedDrivers(sd);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('loadRoutes error: ', error);
      });
  };

  return (
    <div>
      <Header callback={setManagePeople} />
      {!managePeople ? (
        <Nav
          drivers={allDrivers}
          attendees={allAttendees}
          removeFromMenuCallback={removeFromMenu}
        />
      ) : null}
      {!managePeople ? (
        <Map
          drivers={selectedDrivers}
          attendees={selectedAttendees}
          mapCallback={removeFromMap}
        />
      ) : null}
      {!managePeople && myCarpools.length > 0 ? (
        <div
          style={{
            width: '90vw',
            position: 'relative',
            margin: 'auto',
            marginTop: '2rem',
          }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <h2>Drivers</h2>
          </div>
          <MyTabList carpools={myCarpools} removePerson={removePerson} />
        </div>
      ) : null}
      {/* All the Attendees stuff */}
      {!managePeople && selectedAttendees.length > 0 ? (
        <div
          style={{
            width: '90vw',
            position: 'relative',
            margin: 'auto',
            marginTop: '2rem',
          }}
        >
          <hr />
          <div
            style={{
              textAlign: 'center',
              marginTop: '2rem',
            }}
          >
            <h2>Attendees Needing a Ride</h2>
          </div>
          <div>
            {selectedAttendees.map((att) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: '3rem',
                  }}
                >
                  <div key={att._id}>
                    <h4>{att.name}</h4>
                    <div style={{ textAlign: 'left' }}>
                      <details>
                        <summary>address</summary>
                        <address>
                          {att.address}
                          <br />
                          {att.city}, {att.state} {att.zip}
                        </address>
                        {att.homephone !== '' && att.homephone !== null ? (
                          <p>
                            Home:{' '}
                            <a href={`tel:${att.homephone}`}>{att.homephone}</a>
                          </p>
                        ) : null}
                        {att.cellphone !== '' && att.cellphone !== null ? (
                          <p>
                            Cell:{' '}
                            <a href={`tel:${att.cellphone}`}>{att.cellphone}</a>
                          </p>
                        ) : null}
                        {att.email !== '' && att.email !== null ? (
                          <p>
                            Email:{' '}
                            <a href={`mailto:${att.email}`}>{att.email}</a>
                          </p>
                        ) : null}
                        {att.notes !== '' && att.notes !== null ? (
                          <p>
                            <strong>Notes</strong>
                            {att.notes}
                          </p>
                        ) : null}
                      </details>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {/* End of the Attendees stuff */}
      {/* Buttons for controlling the app */}
      {!managePeople ? (
        <div
          style={{
            paddingTop: '2rem',
            textAlign: 'center',
            width: '90vw',
            margin: 'auto',
          }}
        >
          <Button
            variant="primary"
            onClick={saveRoutes}
            disabled={myCarpools.length < 1}
          >
            Save All Routes
          </Button>
          &nbsp;
          <Button variant="primary" onClick={loadRoutes}>
            Reload last Routes
          </Button>
        </div>
      ) : null}
      {/* End of the buttons */}
      {managePeople ? <PersonTable /> : null}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
