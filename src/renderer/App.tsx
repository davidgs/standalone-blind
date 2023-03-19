import React from "react";
import "./App.css";
import Header from "./Header";
import Nav from "./Nav";
import Map from "./Map";
import { IDriver, IRider } from "./types";
import "./style.css";
import axios from "axios";
import PersonTable from "./PersonTable";
import PeopleManager from "./PeopleManager";

export default function App() {
  const [allDrivers, setAllDrivers] = React.useState<IDriver[]>([]);
  const [allAttendees, setAllAttendees] = React.useState<IRider[]>([]);
  const [selectedAttendees, setSelectedAttendees] = React.useState<IRider[]>(
    []
  );
  const [selectedDrivers, setSelectedDrivers] = React.useState<IDriver[]>([]);
  const [reload, setReload] = React.useState<boolean>(false);
  const [managePeople, setManagePeople] = React.useState<boolean>(false);


  const sortPeople = (people: IRider[] | IDriver[]) => {
    const sorted = people.sort((a, b) => (a.name > b.name ? 1 : -1));
    return sorted;
  };
  /* Get all drivers and attendees from the database */
  React.useEffect(() => {
    axios.get(`https://davidgs.com:3001/api/drivers`).then((response) => {
      const newDrivers = response.data;
      setAllDrivers(sortPeople(newDrivers as IDriver[]) as IDriver[]);
    });
    axios.get(`https://davidgs.com:3001/api/attendees`).then((response) => {
      const newAtts = response.data;
      setAllAttendees(sortPeople(newAtts as IRider[]) as IRider[]);
    });
  }, []);

  React.useEffect(() => {
    console.log(`reload: ${reload}`);
    if (!reload) return;
    axios.get(`https://davidgs.com:3001/api/drivers`).then((response) => {
      const newDrivers = response.data;
      setAllDrivers(sortPeople(newDrivers as IDriver[]) as IDriver[]);
    });
    axios.get(`https://davidgs.com:3001/api/attendees`).then((response) => {
      const newAtts = response.data;
      setAllAttendees(sortPeople(newAtts as IRider[]) as IRider[]);
    });
  }, [reload]);

  const updateSelectedAttendee = (attendee: IRider) => {
    const currentAttendees = selectedAttendees;
    const index = currentAttendees.findIndex((att) => att._id === attendee._id);
    currentAttendees[index] = attendee;
    setSelectedAttendees(sortPeople(currentAttendees) as IRider[]);
  };

  const updateSelectedDriver = (drivers: IDriver) => {
    const currentDrivers = selectedDrivers;
    const index = currentDrivers.findIndex(
      (driver) => driver._id === drivers._id
    );
    currentDrivers[index] = drivers;
    setSelectedDrivers(sortPeople(currentDrivers) as IDriver[]);
  };

  const updateAllAttendees = (attendee: IRider, type: string) => {
    const currentAttendees = allAttendees;
    const index = currentAttendees.findIndex((att) => att._id === attendee._id);
    currentAttendees[index] = attendee;
    setAllAttendees(sortPeople(currentAttendees) as IRider[]);
  };

  const updateAllDrivers = (drivers: IDriver, type: string) => {
    const currentDrivers = allDrivers;
    const index = currentDrivers.findIndex(
      (driver) => driver._id === drivers._id
    );
    currentDrivers[index] = drivers;
    setAllDrivers(sortPeople(currentDrivers) as IDriver[]);
  };

  const removeFromMenu = (value: string, type: string) => {
    switch (type) {
      case "Driver":
        const driver: IDriver | null = allDrivers.filter(
          (driver) => driver._id === value
        )[0];
        const d: IDriver[] = selectedDrivers;
        d.push(driver);
        setSelectedDrivers(sortPeople(d) as IDriver[]);
        setAllDrivers(sortPeople(allDrivers.filter((driver) => driver._id !== value) as IDriver[]) as IDriver[]);
        break;
      case "Attendee":
        const attendee: IRider | null = allAttendees.filter(
          (attendee) => attendee._id === value
        )[0];
        const a: IRider[] = selectedAttendees;
        a.push(attendee);
        setSelectedAttendees(sortPeople(a) as IRider[]);
        setAllAttendees(
          sortPeople(allAttendees.filter((attendee) => attendee._id !== value) as IRider[]) as IRider[]
        );
        break;
      default:
        break;
    }
  };

  const removeAttendeeFromMap = (rider: IRider | null) => {
    const r = selectedAttendees.filter(
      (attendee) => attendee._id === rider?._id
    )[0];
    if (r) {
      const sa: IRider[] = selectedAttendees.filter(
        (attendee) => attendee._id !== rider?._id
      );
      setSelectedAttendees(sortPeople(sa) as IRider[]);
      const ar: IRider[] = allAttendees;
      ar.push(r);
      setAllAttendees(sortPeople(ar) as IRider[]);
    }
  };

  const removeDriverFromMap = (driver: IDriver | null) => {
    const d = selectedDrivers.filter((dri) => dri._id === driver?._id)[0];
    if (d) {
      const sd: IDriver[] = selectedDrivers.filter(
        (driver) => driver._id !== d._id
      );
      setSelectedDrivers(sortPeople(sd) as IDriver[]);
      const dr: IRider[] = d.riders || [];
      dr.forEach((rider) => {
        const sa: IRider[] = selectedAttendees;
        sa.push(rider);
        setSelectedAttendees(sortPeople(sa) as IRider[]);
        const ar: IRider[] = allAttendees;
        ar.push(rider);
        setAllAttendees(sortPeople(ar) as IRider[]);
      });
      const dd: IDriver[] = allDrivers;
      dd.push(d);
      setAllDrivers(sortPeople(dd) as IDriver[]);
    }
  };

  const removeFromMap = (rider: IRider | null, driver: IDriver | null) => {
    const r = selectedAttendees.filter(
      (attendee) => attendee._id === rider?._id
    )[0];
    const d = selectedDrivers.filter((dri) => dri._id === driver?._id)[0];
    if (r) {
      const sa: IRider[] = selectedAttendees.filter(
        (attendee) => attendee._id !== rider?._id
      );
      setSelectedAttendees(sortPeople(sa) as IRider[]);
      const dr: IRider[] = d.riders || [];
      dr.push(r);
      d.riders = dr;
      const sd = selectedDrivers.filter((dv) => dv._id !== d._id);
      sd.push(d);
      setSelectedDrivers(sortPeople(sd) as IDriver[]);
    }
  };

  const managePeopleForm = () => {
    setManagePeople(!managePeople);
  };

  return (
    <div className="App">
      <Header callback={managePeopleForm} />
      {!managePeople ? (
        <>
          <Nav
            drivers={allDrivers}
            attendees={allAttendees}
            removeFromMenuCallback={removeFromMenu}
            reload={setReload}
          />
          <Map
            drivers={selectedDrivers}
            attendees={selectedAttendees}
            callback={removeFromMap}
          />
          <p />
          {selectedDrivers.length > 0 ? (
            <PersonTable
              people={selectedDrivers}
              type="drivers"
              all={false}
              callback={updateSelectedDriver}
              removeCallback={removeDriverFromMap}
            />
          ) : (
            <></>
          )}
          <p />
          {selectedAttendees.length > 0 ? (
            <PersonTable
              people={selectedAttendees}
              type="attendees"
              all={false}
              callback={updateSelectedAttendee}
              removeCallback={removeAttendeeFromMap}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <PeopleManager
          drivers={allDrivers}
          riders={allAttendees}
          driverCallback={updateAllDrivers}
          riderCallback={updateAllAttendees}
          reload={setReload}
        />
      )}
    </div>
  );
}
