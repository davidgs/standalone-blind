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
  const driversDB = 'drivers';
  const attendeesDB = 'attendees';

  {/* Sort people by name */}
  const sortPeople = (people: IRider[] | IDriver[]) => {
    const sorted = people.sort((a, b) => (a.name > b.name ? 1 : -1));
    return sorted;
  };


  const getAll = () => {
    axios.get(`https://davidgs.com:3001/api/drivers`).then((response) => {
      const newDrivers = response.data;
      setAllDrivers(sortPeople(newDrivers as IDriver[]) as IDriver[]);
    });
    axios.get(`https://davidgs.com:3001/api/attendees`).then((response) => {
      const newAtts = response.data;
      setAllAttendees(sortPeople(newAtts as IRider[]) as IRider[]);
    });
  };
  /* Get all drivers and attendees from the database */
  React.useEffect(() => {
    getAll();
  }, []);

  /* Reload drivers and attendees from the database if any component has
     made changes to the database */
  // React.useEffect(() => {
  //   console.log(`reload: ${reload}`);
  //   if (!reload) return;
  //   axios.get(`https://davidgs.com:3001/api/${driversDB}`).then((response) => {
  //     const newDrivers = response.data;
  //     setAllDrivers(sortPeople(newDrivers as IDriver[]) as IDriver[]);
  //   });
  //   axios.get(`https://davidgs.com:3001/api/${attendeesDB}`).then((response) => {
  //     const newAtts = response.data;
  //     setAllAttendees(sortPeople(newAtts as IRider[]) as IRider[]);
  //   });
  // }, [reload]);

  const timeToReload = (isIt: boolean) => {
    setReload(isIt);
    if(isIt) {
      getAll();
    }
  };

  /* Add a person to the selected list */
  const updateSelected = (person: IRider | IDriver, type: string) => {
    if (type === "driver") {
      const currentDrivers = selectedDrivers;
      const index = currentDrivers.findIndex(
        (driver) => driver._id === person._id
      );
      currentDrivers[index] = person as IDriver;
      setSelectedDrivers(sortPeople(currentDrivers) as IDriver[]);
    } else {
      const currentAttendees = selectedAttendees;
      const index = currentAttendees.findIndex((att) => att._id === person._id);
      currentAttendees[index] = person as IRider;
      setSelectedAttendees(sortPeople(currentAttendees) as IRider[]);
  }
};

  /* Add a person to the all list */
  const updateAll = (person: IRider | IDriver, type: string) => {
    if (type === "driver") {
      const currentDrivers = allDrivers;
      const index = currentDrivers.findIndex(
        (driver) => driver._id === person._id
      );
      currentDrivers[index] = person as IDriver;
      setAllDrivers(sortPeople(currentDrivers) as IDriver[]);
    } else {
      const currentAttendees = allAttendees;
      const index = currentAttendees.findIndex((att) => att._id === person._id);
      currentAttendees[index] = person as IRider;
      setAllAttendees(sortPeople(currentAttendees) as IRider[]);
    }
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

  const removeFromTable = (rider: IRider | null, driver: IDriver | null, type: string) => {
    switch (type) {
      case "drivers":
        const riders = driver?.riders || [];
        riders.forEach((rider) => {
          const sa: IRider[] = selectedAttendees;
          sa.push(rider);
          setSelectedAttendees(sortPeople(sa) as IRider[]);
        });
        const sd: IDriver[] = selectedDrivers.filter(
          (driver) => driver._id !== driver?._id
        );
        setSelectedDrivers(sortPeople(sd) as IDriver[]);
        const dd: IDriver[] = allDrivers;
        dd.push(driver as IDriver);
        setAllDrivers(sortPeople(dd) as IDriver[]);
        break;
      case "attendees":
        const d = rider?.driver || null;
        if (d) {
          const myDriver = selectedDrivers.filter((driver) => driver._id === d);
          rider.driver = null;
          const myRiders = myDriver[0].riders || [];
          const r = myRiders.filter((rider) => rider._id === rider?._id)[0];
          myRiders.splice(myRiders.indexOf(r), 1);
          myDriver[0].riders = myRiders;
          const newDrivers = selectedDrivers.filter((driver) => driver._id !== d);
          newDrivers.push(myDriver[0]);
          setSelectedDrivers(sortPeople(newDrivers) as IDriver[]);
          const sr = selectedAttendees || [];
          sr.push(rider as IRider);
          setSelectedAttendees(sr);
        }
        break;
      default:
        break;
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
            reload={timeToReload}
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
              updateCallback={updateSelected}
              removeCallback={removeFromTable}
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
              updateCallback={updateSelected}
              removeCallback={removeFromTable}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <PeopleManager
          drivers={allDrivers}
          riders={allAttendees}
          callback={updateAll}
          reload={timeToReload}
        />
      )}
    </div>
  );
}
