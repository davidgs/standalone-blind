import React from "react";
import { IRider, IDriver } from "./types";
import PersonTable from "./PersonTable";
import { Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import PersonForm from "./NewPersonForm";
import axios from "axios";

export default function PeopleManager({
  drivers,
  riders,
  driverCallback,
  riderCallback,
  reload
}: {
  drivers: IDriver[];
  riders: IRider[];
  driverCallback: (value: IDriver) => void;
  riderCallback: (value: IRider) => void;
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

  const deleteDriver = (driver: IDriver) => {
    const r = myDrivers.filter(
      (drivers) => drivers._id === driver?._id
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

  };

  const deleteAttendee = (rider: IRider) => {
    const newRiders = myRiders.filter((r) => r._id !== rider._id);
    setMyRiders(newRiders);
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
                value="drivers"
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
          callback={driverCallback}
          removeCallback={deleteDriver}
        />
        <PersonTable
          people={myRiders}
          type="attendees"
          all={true}
          callback={riderCallback}
          removeCallback={deleteAttendee}
        />
      </div>
      <PersonForm
        person={null}
        type={addType}
        addPersonCallback={addPerson}
        showMe={showForm}
      />
    </>
  );
}
