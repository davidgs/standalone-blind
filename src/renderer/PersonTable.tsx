import React, { SyntheticEvent, useCallback, useRef, useState } from 'react';
import { IDriver, IRider } from './types';
import Button from 'react-bootstrap/Button';
import PersonForm from './NewPersonForm';
import {
  Columns,
  Pencil,
  PersonXFill,
  SignTurnRightFill,
} from 'react-bootstrap-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MiniMap from './miniMaps/MiniMap';
import { GoogleMap, DirectionsWaypoint } from '@react-google-maps/api';

interface TableColumn {
  key: string;
  label: string;
  ref?: React.RefObject<HTMLDivElement>;
}

interface ColWidth {
  [key: string]: string;
}
interface Row {
  [key: string]: React.ReactNode;
}

interface Props {
  columns: TableColumn[];
  data: Row[];
}

export default function PersonTable({
  people,
  type,
  all,
  updateCallback,
  removeCallback,
}: {
  people: IDriver[] | IRider[];
  type: string;
  all: boolean;
  updateCallback: (person: IDriver | IRider, type: string) => void;
  removeCallback: (
    rider: IRider | null,
    driver: IDriver | null,
    type: string
  ) => void;
}) {
  const minCellWidth = 50;
  const [personList, setPersonList] = React.useState<IDriver[] | IRider[]>(
    people
  );
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const thisType = type;
  // const [thisType, setThisType] = React.useState<string>(type);
  const [editingPerson, setEditingPerson] = React.useState<
    IDriver | IRider | null
  >(null);
  const [tableHeight, setTableHeight] = useState('auto');
  const [activeIndex, setActiveIndex] = useState(null);
  const tableRef = useRef(null);
  const [columnWidths, setColumnWidths] = useState<ColWidth>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);

  const riderHeaders: TableColumn[] = [
    { key: 'attendee', label: 'Attendee', ref: useRef(null) },
    { key: 'info', label: 'Information' },
    { key: 'notes', label: 'Notes' },
  ];

  const dataDriverHeaders: TableColumn[] = [
    { key: 'driver', label: 'Name' },
    { key: 'info', label: 'Information' },
    { key: 'notes', label: 'Notes' },
  ];

  const dataAttendeesHeaders: TableColumn[] = [
    { key: 'attendee', label: 'Name' },
    { key: 'info', label: 'Information' },
    { key: 'notes', label: 'Notes' },
  ];

  const driverHeaders: TableColumn[] = [
    { key: 'driver', label: 'Driver' },
    { key: 'info', label: 'Information' },
    { key: 'notes', label: 'Notes' },
    { key: 'riders', label: 'Riders' },
    { key: 'actions', label: 'Actions' },
    { key: 'map', label: 'Map' },
  ];

  const createHeaders = (header: TableColumn[]) => {
    return header.map((item) => ({
      text: item.label,
      key: item.key,
      ref: useRef(),
    }));
  };

  const driverColumns = all
    ? createHeaders(dataDriverHeaders)
    : createHeaders(driverHeaders);
  const riderColumns = all
    ? createHeaders(dataAttendeesHeaders)
    : createHeaders(riderHeaders);

  const mouseDown = (index) => {
    setActiveIndex(index);
  };
  const churchPlace: IDriver[] = [
    {
      name: 'RLC Church',
      address: '1234 Church St, Raleigh, NC 27609',
      homephone: '',
      cellphone: '',
      email: '',
      city: 'Cary',
      state: 'NC',
      zip: '27511',
      notes: '',
      _id: '1234',
      location: { lat: 35.7298286, lng: -78.77857179999999 },
      riders: [],
    },
  ];

  const routeDriver = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.id;
    const currentDrivers = personList;
    const index = currentDrivers.findIndex((driver) => driver._id === idValue);
    const person = currentDrivers[index] as IDriver;
    const waypoints: google.maps.LatLng[] = [];
    waypoints.push(person.location as unknown as google.maps.LatLng);
    person.riders.forEach((rider) => {
      waypoints.push(rider.location as unknown as google.maps.LatLng);
    });
    waypoints.push(churchPlace[0].location as unknown as google.maps.LatLng);

    const map = document.getElementById(`map-${person._id}`);
    const atts = map?.attributes;
    map?.setAttribute('waypoints', waypoints);

    console.log(`Route Driver: ${idValue} ${person.name}`);
  };

  const mouseMove = useCallback(
    (e) => {
      const columns = thisType === 'drivers' ? driverColumns : riderColumns;
      // Return an array of px values
      const gridColumns = columns.map((col, i) => {
        if (i === activeIndex) {
          const width = e.clientX - col.ref.current?.offsetLeft;

          if (width >= minCellWidth) {
            console.log(`width: ${width}`);
            return `${width}px`;
          }
        }
        return `${col.ref.current.offsetWidth}px`;
      });
      tableRef.current.style.gridTemplateColumns = `${gridColumns.join(' ')}`;
    },
    [activeIndex, driverColumns, minCellWidth]
  );
  const removeListeners = useCallback(() => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  React.useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }
    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  React.useEffect(() => {
    console.log(people);
    setPersonList(people);
  }, [people]);

  React.useEffect(() => {
    setTableHeight(tableRef?.current?.offsetHeight);
  }, [tableRef]);
  // React.useEffect(() => {
  //   console.log(type);
  //   setThisType(type);
  // }, [type]);

  const editThisPerson = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.value;
    const p = JSON.parse(idValue) as IDriver | IRider;
    console.log(`Edit Person: ${idValue}`);
    setEditingPerson(p);
    setShowForm(true);
  };

  const removeRider = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.value;
    const p = JSON.parse(idValue) as IRider;
    console.log(`Remove Rider: ${idValue}`);
    removeCallback(p, null, 'attendees');
  };

  const removePerson = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.value;
    const p = JSON.parse(idValue) as IDriver | IRider;
    console.log(`Remove Person: ${idValue}`);
    thisType === 'drivers'
      ? removeCallback(null, p as IDriver, thisType)
      : removeCallback(p as IRider, null, thisType);
  };

  const riders = (driver: IDriver) => {
    const riders = driver.riders;
    return riders?.map((rider) => {
      rider.driver = driver._id;
      return (
        <div id={`rider-${rider._id}`}>
          <Button
            size="sm"
            variant="warning"
            id={`delete-btn-${rider._id}`}
            value={JSON.stringify(rider)}
            onClick={removeRider}
          >
            <PersonXFill />
          </Button>
          &nbsp;
          {rider.name}
        </div>
      );
    });
  };

  const editPerson = (person: IDriver | IRider) => {
    if (person) {
      updateCallback(person, thisType);
    }
    setShowForm(false);
  };

  const noCallBack = (rider: IRider | null, driver: IDriver | null) => {
    console.log('No callback');
  };

  const phoneLink = (phone: string, kind: string) => {
    return (
      <>
        {kind}: <a href={'tel:' + phone}>{phone}</a>
      </>
    );
  };

  const emailLink = (email: string) => {
    return (
      <>
        Email: <a href={'mailto:' + email}>{email}</a>
      </>
    );
  };

  const getMyRiders = (driver: IDriver) => {
    const riders = driver.riders;
    return riders;
  };
  const rows = () => {
    return personList.map((person) => {
      return (
        <tr key={person.name} style={{ borderBottom: '2px solid black' }}>
          <td style={{ borderLeft: '1px solid black' }}>
            {/* on edit-all form, this deletes a person. On the routing form, this puts them back on the map */}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {all ? (
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
                      variant={all ? 'danger' : 'warning'}
                      value={JSON.stringify(person)}
                      onClick={removePerson}
                    >
                      <PersonXFill />
                    </Button>
                  </OverlayTrigger>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Tooltip id="clear-btn-tooltip">
                        Put {person.name} back on the map.
                      </Tooltip>
                    }
                  >
                    <Button
                      size="sm"
                      variant={all ? 'danger' : 'warning'}
                      value={JSON.stringify(person)}
                      onClick={removePerson}
                    >
                      <PersonXFill />
                    </Button>
                  </OverlayTrigger>
                </div>
              )}
              &nbsp;
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                &nbsp; {person.name}
              </div>
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
          {/* For Drivers only: Person's Riders */}
          {(thisType === 'drivers' && !all) ? (
            <td style={{ borderLeft: '1px solid black', fontSize: '10pt' }}>
              {riders(person as IDriver)}
            </td>
          ) : null}
          {/* For Drivers only: Person's Route Button */}
          {(thisType === 'drivers' && !all) ? (
            <td style={{ borderLeft: '1px solid black', fontSize: '10pt' }}>
              <Button
                variant="success"
                size="sm"
                id={person._id}
                disabled={person.riders ? person.riders.length === 0 : false}
                onClick={routeDriver}
              >
                <SignTurnRightFill />
              </Button>
            </td>
          ) : null}
          {/* For Drivers only: Person's Map Button */}
          {(thisType === 'drivers' && !all) ? (
            <td style={{ borderLeft: '1px solid black' }}>
              <MiniMap
                driver={person as IDriver}
                id={`map-${person._id}`}
                attendees={getMyRiders(person as IDriver)}
                callback={noCallBack}
              />
            </td>
          ) : null}
        </tr>
      );
    });
  };

  return (
    <div style={{ width: '95vw', margin: 'auto' }}>
      <h1>
        {`${type.charAt(0).toLocaleUpperCase()}${type.substring(1)}`} Table
      </h1>
      <div className="table-wrapper">
        <table
          className={
            thisType === 'drivers'
              ? 'resize-table driver-table'
              : 'resize-table attendee-table'
          }
          ref={tableRef}
        >
          <thead>
            {type === 'drivers' ? (
              <tr>
                {driverColumns.map(({ ref, text }, i) => (
                  <th ref={ref} key={text}>
                    <span>{text}</span>
                    <div
                      style={{ height: tableHeight }}
                      onMouseDown={() => mouseDown(i)}
                      className={`resize-handle ${
                        activeIndex === i ? 'active' : 'idle'
                      }`}
                    />
                  </th>
                ))}
              </tr>
            ) : (
              <tr>
                {riderColumns.map(({ ref, text }, i) => (
                  <th ref={ref} key={text}>
                    <span>{text}</span>
                    <div
                      style={{ height: tableHeight }}
                      onMouseDown={() => mouseDown(i)}
                      className={`resize-handle ${
                        activeIndex === i ? 'active' : 'idle'
                      }`}
                    />
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>{rows()}</tbody>
        </table>
      </div>
      <PersonForm
        person={editingPerson}
        people={personList}
        type={type}
        addPersonCallback={editPerson}
        showMe={showForm}
      />
    </div>
  );
}
