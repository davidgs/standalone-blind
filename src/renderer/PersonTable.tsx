import React, { SyntheticEvent } from "react";
import { IDriver, IRider } from "./types";
import Button from "react-bootstrap/Button";
import PersonForm from "./NewPersonForm";
import { Pencil, PersonXFill, SignTurnRightFill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function PersonTable({
  people,
  type,
  all,
  callback,
  removeCallback,
}: {
  people: IDriver[] | IRider[];
  type: string;
  all: boolean;
  callback: (person: IDriver | IRider, type: string) => void;
  removeCallback: (person: IDriver | IRider) => void;
}) {
  const [personList, setPersonList] = React.useState<IDriver[] | IRider[]>(
    people
  );
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [thisType, setThisType] = React.useState<string>(type);
  const [editingPerson, setEditingPerson] = React.useState<
    IDriver | IRider | null
  >(null);

  React.useEffect(() => {
    console.log(people);
    setPersonList(people);
  }, [people]);

  React.useEffect(() => {
    console.log(type);
    setThisType(type);
  }, [type]);

  const editThisPerson = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.value;
    const p = JSON.parse(idValue) as IDriver | IRider;
    console.log(`Edit Person: ${idValue}`);
    setEditingPerson(p);
    setShowForm(true);
  };

  const removePerson = (e: SyntheticEvent) => {
    const id = e.currentTarget as HTMLButtonElement;
    const idValue = id.value;
    const p = JSON.parse(idValue) as IDriver | IRider;
    console.log(`Remove Person: ${idValue}`);
    removeCallback(p);
  };

  const riders = (riders: IRider[]) => {
    return riders?.map((rider) => {
      return (
        <div id={`rider-${rider._id}`} style={{ border: "1px solid black" }}>
          &nbsp;{" "}
          <Button
            size="sm"
            variant="primary"
            value={JSON.stringify(rider)}
            onClick={editThisPerson}
          >
            <Pencil />
          </Button>
          &nbsp;
          <Button
            size="sm"
            variant="warning"
            id={`delete-btn-${rider._id}`}
            value={JSON.stringify(rider)}
            onClick={removePerson}
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
      callback(person, type);
    }
    setShowForm(false);
  };

  const showIt = () => {
    setShowForm(!showForm);
  };

  const phoneLink = (phone: string) => {
    return <a href={"tel:" + phone}>{phone}</a>;
  };

  const emailLink = (email: string) => {
    return <a href={"mailto:" + email}>{email}</a>;
  };

  const rows = () => {
    return personList.map((person) => {
      return (
        <tr key={person.name} style={{ borderBottom: "2px solid black" }}>
          <td style={{ borderLeft: "1px solid black" }}>
            {/* on edit-all form, this deletes a person. On the routing form, this puts them back on the map */}
            {all ? (
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
                  variant={all ? "danger" : "warning"}
                  value={JSON.stringify(person)}
                  onClick={removePerson}
                >
                  <PersonXFill />
                </Button>
              </OverlayTrigger>
            ) : (
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
                  variant={all ? "danger" : "warning"}
                  value={JSON.stringify(person)}
                  onClick={removePerson}
                >
                  <PersonXFill />
                </Button>
              </OverlayTrigger>
            )}
            &nbsp;
            <OverlayTrigger
              placement="auto"
              overlay={
                <Tooltip id="edit-btn-tooltip">
                  Edit {person.name}'s information.
                </Tooltip>
              }
            >
              <Button
                size="sm"
                value={JSON.stringify(person)}
                variant="primary"
                onClick={editThisPerson}
              >
                <Pencil />
              </Button>
            </OverlayTrigger>
          </td>
          {/* Person's Name */}
          <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
            {person.name}
          </td>
          {/* Person's Address */}
          <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
            {person.address}
            <br />
            {person.city}, {person.state} {person.zip}
          </td>
          {/* Person's Home Phone Number */}
          <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
            {phoneLink(person.homephone)}
          </td>
          {/* Person's Cell Phone Number */}
          <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
            {phoneLink(person.cellphone)}
          </td>
          {/* Person's Email Address */}
          <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
            {emailLink(person.email)}
          </td>
          {/* Person's Notes */}
          <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
            {person.notes}
          </td>
          {/* For Drivers only: Person's Riders */}
          {thisType === "drivers" && !all ? (
            <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
              {riders(person.riders)}
            </td>
          ) : null}
          {/* For Drivers only: Person's Route Button */}
          {thisType === "drivers" && !all ? (
            <td style={{ borderLeft: "1px solid black", fontSize: "10pt" }}>
              <Button variant="success" size="sm">
                <SignTurnRightFill />
              </Button>
            </td>
          ) : null}
          {/* For Drivers only: Person's Map Button */}
          {thisType === "drivers" && !all ? (
            <td style={{ borderLeft: "1px solid black" }}>
              <button>Map</button>
            </td>
          ) : null}
        </tr>
      );
    });
  };

  return (
    <div style={{ width: "80vw", margin: "auto" }}>
      <h1>
        {`${type.charAt(0).toLocaleUpperCase()}${type.substring(1)}`} Table
      </h1>
      <table>
        <thead>
          <tr style={{ borderBottom: "4px solid black" }}>
            <th style={{ borderRight: "4px solid black" }}>Actions</th>
            <th style={{ borderRight: "4px solid black" }}>name</th>
            <th style={{ borderRight: "4px solid black" }}>address</th>
            <th style={{ borderRight: "4px solid black" }}>Home Phone</th>
            <th style={{ borderRight: "4px solid black" }}>Cell Phone</th>
            <th style={{ borderRight: "4px solid black" }}>Email</th>
            <th style={{ borderRight: "4px solid black" }}>Notes</th>
            {thisType === "drivers" && !all ? (
              <th style={{ borderRight: "4px solid black" }}>Riders</th>
            ) : null}
            {thisType === "drivers" && !all ? (
              <th style={{ borderRight: "4px solid black" }}>Actions</th>
            ) : null}
            {thisType === "drivers" && !all ? <th>Map</th> : null}
          </tr>
        </thead>
        <tbody>{rows()}</tbody>
      </table>
      <PersonForm
        person={editingPerson}
        type={type}
        addPersonCallback={editPerson}
        showMe={showForm}
      />
    </div>
  );
}
