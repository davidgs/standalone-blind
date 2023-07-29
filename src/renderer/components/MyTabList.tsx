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
/* eslint-disable react/self-closing-comp */
import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { v4 as uuidv4 } from 'uuid';
import 'react-tabs/style/react-tabs.css';
import '../App.css';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import {
  PersonXFill,
  EnvelopeAtFill,
  ArrowRightCircleFill,
} from 'react-bootstrap-icons';
import MiniMap from 'renderer/map-components/MiniMap';
import { ICarpool, IEmail, IPerson } from '../types';
import PersonModal from './EmailForm';
import RemoveDriver from './RemoveDriver';

export default function MyTabList({
  carpools,
  removePerson,
  removeDriver,
}: {
  carpools: ICarpool[];
  // eslint-disable-next-line no-unused-vars
  removePerson: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // eslint-disable-next-line no-unused-vars
  removeDriver: (driverID: string) => void;
}): React.JSX.Element {
  // const [myCarpools, setMyCarpools] = useState<ICarpool[]>(cps);
  const [tabs, setTabs] = React.useState<React.JSX.Element[]>([]);
  const [tabPanels, setTabPanels] = React.useState<React.JSX.Element[]>([]);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [routeDetails, setRouteDetails] = useState<IEmail>({
    directions: '',
    map: '',
    info: null,
  });

  // useEffect(() => {
  //   console.log(`carpools changed: '${cps.length}`);
  //   makeTabs(cps);
  //   setMyCarpools(cps);
  // }, [cps]);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    makeTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carpools]);

  /* Set the directions for a driver
     @param directions - the directions to set
     @param id - the id of the driver
   */
  const setDirections = (directions: string[] | null, id: string | null) => {
    const dirArea = document.getElementById(`directions-${id}`);
    if (dirArea) {
      dirArea.innerHTML = '';
      if (directions) {
        const dirList = document.createElement('ol');
        dirList.style.textAlign = 'left';
        dirList.style.marginLeft = '1rem';
        directions.forEach((dir) => {
          const dirItem = document.createElement('li');
          dirItem.innerHTML = dir;
          dirList.appendChild(dirItem);
        });
        dirArea.appendChild(dirList);
      }
    }
  };

  /* Make Tab Panels for Carpools
     @param cars - the carpools to make panels for
   */
  function makeTabPanels() {
    console.log(`makeTabPanels: ${carpools.length}`)
    const list = carpools.map((carp: ICarpool) => {
      const riders = carp.riders.map((rider: IPerson) => {
        return (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '1rem',
              }}
              key={uuidv4()}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '5%',
                  alignContent: 'center',
                }}
                key={uuidv4()}
              >
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Tooltip id="clear-btn-tooltip">
                      Put {rider.name} back on the map.
                    </Tooltip>
                  }
                >
                  <Button
                    size="sm"
                    variant="warning"
                    value={JSON.stringify(rider)}
                    onClick={removePerson}
                    id={uuidv4()}
                  >
                    <PersonXFill />
                  </Button>
                </OverlayTrigger>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '75%',
                  marginLeft: '1rem',
                }}
                key={rider._id}
              >
                <h4>{rider.name}</h4>
                <div style={{ textAlign: 'left' }} key={uuidv4()}>
                  <details id={`details-${rider._id}`}>
                    <summary>address</summary>
                    <address>
                      {rider.address}
                      <br />
                      {rider.city}, {rider.state} {rider.zip}
                    </address>
                    {rider.homephone !== '' && rider.homephone !== null ? (
                      <p>
                        Home:{' '}
                        <a href={`tel:${rider.homephone}`}>{rider.homephone}</a>
                      </p>
                    ) : null}
                    {rider.cellphone !== '' && rider.cellphone !== null ? (
                      <p>
                        Cell:{' '}
                        <a href={`tel:${rider.cellphone}`}>{rider.cellphone}</a>
                      </p>
                    ) : null}
                    {rider.email !== '' && rider.email !== null ? (
                      <p>
                        Email:{' '}
                        <a href={`mailto:${rider.email}`}>{rider.email}</a>
                      </p>
                    ) : null}
                    {rider.notes !== '' && rider.notes !== null ? (
                      <p>
                        <strong>Notes</strong>
                        {rider.notes}
                      </p>
                    ) : null}
                  </details>
                </div>
              </div>
            </div>
            <hr />
          </>
        );
      });
      const sendRouteMail = (
        event: SyntheticEvent<HTMLButtonElement, MouseEvent>
      ) => {
        event.preventDefault();
        const foo: ICarpool = JSON.parse(event.currentTarget.value);
        const id = foo.driver._id;
        const directions = document.getElementById(`directions-${id}`);
        const map = document.getElementById(`map-${id}`);
        const opt: IEmail = {
          directions: directions?.innerHTML as string,
          map: map?.innerHTML as string,
          info: carp,
        };
        setRouteDetails(opt);
        setShowEmailModal(true);
      };
      const setShow = (event: SyntheticEvent) => {
        event.preventDefault();
        const buttID = event.currentTarget;
        const newId = buttID.id.replaceAll(
          'directions-btn-',
          'directions-container-'
        );
        const dirContainer = document.getElementById(newId);
        if (dirContainer) {
          const d = dirContainer.style.display === 'none' ? 'block' : 'none';
          if (d === 'block') {
            buttID?.setAttribute('style', 'transform: rotate(90deg)');
          } else {
            buttID?.setAttribute('style', 'transform: rotate(0deg)');
          }
          dirContainer.style.display = d;
        }
      };

      return (
        <div
          style={{
            width: '90vw',
            overflow: 'scroll',
            borderLeft: '1px solid grey',
            borderRight: '1px solid grey',
            // borderBottom: '1px solid grey',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            backgroundColor: '#c0b3e9',
            paddingRight: '1rem',
          }}
          key={uuidv4()}
        >
          <TabPanel key={uuidv4()}>
            <div>
              <p />
            </div>
            <div
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'row',
              }}
              key={uuidv4()}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '35%',
                }}
                key={uuidv4()}
              >
                <h3>Riders</h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '65%',
                }}
                key={uuidv4()}
              >
                <div
                  style={{ display: 'flex', flexDirection: 'row' }}
                  key={uuidv4()}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '90%',
                      paddingLeft: '4rem',
                    }}
                    key={uuidv4()}
                  >
                    <h3>Map</h3>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '10%',
                    }}
                    key={uuidv4()}
                  >
                    <OverlayTrigger
                      placement="auto"
                      delay={{ show: 250, hide: 400 }}
                      overlay={
                        <Tooltip id="clear-btn-tooltip">
                          Send Route email to {carp.driver.name} @{' '}
                          {carp.driver.email}
                        </Tooltip>
                      }
                    >
                      <Button
                        size="sm"
                        variant="success"
                        value={JSON.stringify(carp)}
                        id={`email-route-${carp.driver._id}`}
                        onClick={sendRouteMail}
                        disabled={carp.riders.length === 0 }
                      >
                        <EnvelopeAtFill />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'row' }}
              key={uuidv4()}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '35%',
                }}
                key={uuidv4()}
              >
                {riders}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '5%',
                      alignContent: 'center',
                    }}
                    key={uuidv4()}
                  >
                    <h4>Driver:</h4></div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '75%',
                        marginLeft: '1rem',
                      }}
                      key={uuidv4()}
                    >
                      <h4>{carp.driver.name}</h4>
                      <div style={{ textAlign: 'left' }} key={uuidv4()}>
                        <details id={`details-${carp.driver._id}`}>
                          <summary>address</summary>
                          <address>
                            {carp.driver.address}
                            <br />
                            {carp.driver.city}, {carp.driver.state} {carp.driver.zip}
                          </address>
                          {carp.driver.homephone !== '' && carp.driver.homephone !== null ? (
                            <p>
                              Home:{' '}
                              <a href={`tel:${carp.driver.homephone}`}>{carp.driver.homephone}</a>
                            </p>
                          ) : null}
                          {carp.driver.cellphone !== '' && carp.driver.cellphone !== null ? (
                            <p>
                              Cell:{' '}
                              <a href={`tel:${carp.driver.cellphone}`}>{carp.driver.cellphone}</a>
                            </p>
                          ) : null}
                          {carp.driver.email !== '' && carp.driver.email !== null ? (
                            <p>
                              Email:{' '}
                              <a href={`mailto:${carp.driver.email}`}>{carp.driver.email}</a>
                            </p>
                          ) : null}
                          {carp.driver.notes !== '' && carp.driver.notes !== null ? (
                            <p>
                              <strong>Notes</strong>
                              {carp.driver.notes}
                            </p>
                          ) : null}
                        </details>
                      </div>

                  </div>
                  <hr />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '65%',
                  paddingBottom: '1rem',
                }}
                id={`map-${carp.driver._id}`}
                key={uuidv4()}
              >
                <MiniMap carpool={carp} callback={setDirections} />
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
              key={uuidv4()}
            >
              <h3 style={{ margin: 'auto' }}>
                Directions{' '}
                { carp.riders.length > 0 ?
                <Button
                  variant="icon-only"
                  size="lg"
                  onClick={setShow}
                  style={{ transform: 'rotate(0deg)' }}
                  id={`directions-btn-${carp.driver._id}`}
                  // disabled={carp.riders.length === 0}
                >
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Show/Hide Directions
                      </Tooltip>
                    }
                  >
                    <ArrowRightCircleFill
                      id={`show-directions-${carp.driver._id}`}
                      size={36}
                    />
                  </OverlayTrigger>
                </Button>
                : null }
              </h3>
            </div>
            <div
              style={{
                textAlign: 'center',
                flexDirection: 'row',
                width: '100%',
                marginLeft: '1rem',
                display: 'none',
              }}
              key={uuidv4()}
              id={`directions-container-${carp.driver._id}`}
            >
              <div
                style={{
                  width: '90%',
                  margin: 'auto',
                  border: '1px solid grey',
                  borderRadius: '10px',
                  padding: '1rem',
                }}
                id={`directions-${carp.driver._id}`}
                key={uuidv4()}
              ></div>
              {/* </div> */}
            </div>
          </TabPanel>
        </div>
      );
    });
    setTabPanels(list);
  }

  /* Remove a driver from the list
      @param event - the event that triggered the callback
  */
  const remove = (event: SyntheticEvent) => {
    event.preventDefault();
    const id = event.currentTarget.id;
    // close-${carpool.driver._id}
    const driverID = id.replace('close-', '');
    console.log('remove');
    removeDriver(driverID);
  }

  const makeTabs = () => {
    const newTabs: React.JSX.Element[] = [];
    carpools.forEach((carpool) => {
      newTabs.push(<Tab key={uuidv4()}>{carpool.driver.name}
      <OverlayTrigger
        placement="auto"
        overlay={
          <Tooltip id="clear-btn-tooltip">
            Remove {carpool.driver.name} from the active drivers.
          </Tooltip>
        }
      >
      <span
        role="button"
        className="close"
        id={`close-${carpool.driver._id}`}
        key={`${carpool.driver._id}-closer`}
        onClick={remove}
        onKeyPress={remove}
      />
      </OverlayTrigger>
      </Tab>);
    });
    setTabs(newTabs);
    makeTabPanels();
  };

  const handleClose = () => {
    setShowEmailModal(!showEmailModal);
  };

  return (
    <>
      <Tabs id={uuidv4()}>
        <TabList key={uuidv4()}>{tabs}</TabList>
        {tabPanels}
      </Tabs>
      <PersonModal
        details={routeDetails}
        show={showEmailModal}
        handleClose={handleClose}
      />
    </>
  );
}
