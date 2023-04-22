import React from "react";
import { IRider, IDriver } from "./types";
import PersonTable from "./PersonTable";
import { Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import PersonForm from "./NewPersonForm";
import axios from "axios";

export default function PeopleManager({
  drivers,
  riders,
  callback,
  reload
}: {
  drivers: IDriver[];
  riders: IRider[];
  callback: (value: IDriver | IRider, type: string) => void;
  reload: (value: boolean) => void;
}) {
  const [myDrivers, setMyDrivers] = React.useState<IDriver[]>(drivers);
  const [myRiders, setMyRiders] = React.useState<IRider[]>(riders);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [addType, setAddType] = React.useState<string>("");

  React.useEffect(() => {
    setMyDrivers(drivers);
  }, [drivers]);

  React.useEffect(() => {
    setMyRiders(riders);
  }, [riders]);

  const addPerson = (person: IRider | IDriver | null, type: string) => {
    setShowForm(false);
    setAddType("");
    reload(true);
  };

  const deletePerson = (person: IDriver | IRider, type: string) => {
    if (type === "Driver") {
      const r = myDrivers.filter(
        (drivers) => drivers._id === person?._id
      )[0];
      console.log(r);
      if (r) {
      axios
        .post(`https://davidgs.com:3001/api/delete/drivers/${r._id}`)
        .then((res) => {
          reload(true);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    } else {
      const r = myRiders.filter(
        (riders) => riders._id === person?._id
      )[0];
      console.log(r);
      if (r) {
      axios
        .post(`https://davidgs.com:3001/api/delete/attendees/${r._id}`)
        .then((res) => {
          reload(true);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    }
  };


  return (
    <>
      <div>
        <Row>
          <p />
        </Row>
        <Row>
          <Col sm={1}></Col>
          <Col sm={2}>
            <OverlayTrigger
              overlay={
                  <Tooltip id="clear-btn-tooltip">
                    Add a new Driver.
                  </Tooltip>
                }>
              <Button
                id="add-driver-button"
                variant="primary"
                value="drivers"
                onClick={(e) => {
                  setShowForm(true);
                  setAddType("Driver");
                }}
              >
                Add Driver
              </Button>
            </OverlayTrigger>
          </Col>
          <Col sm={6}></Col>
          <Col sm={2}>
            <OverlayTrigger
              overlay={
                <Tooltip id="clear-btn-tooltip">
                  Add a new Attendee.
                </Tooltip>
              }
            >
              <Button
                id="add-rider-button"
                variant="primary"
                value="Attendees"
                onClick={(e) => {
                  setShowForm(true);
                  setAddType("Attendee");
                }}
              >
                Add Attendee
              </Button>
            </OverlayTrigger>
          </Col>
          <Col sm={1}></Col>
        </Row>
        <Row>&nbsp;</Row>
        <PersonTable
          people={myDrivers}
          type="drivers"
          all={true}
          updateCallback={addPerson}
          removeCallback={deletePerson}
        />
        <PersonTable
          people={myRiders}
          type="attendees"
          all={true}
          updateCallback={addPerson}
          removeCallback={deletePerson}
        />
      </div>
      <PersonForm
        person={null}
        people={addType === "Driver" ? myDrivers : myRiders}
        type={addType}
        addPersonCallback={addPerson}
        showMe={showForm}
      />
    </>
  );
}
