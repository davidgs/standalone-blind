import React from 'react';
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SelectButton from './SelectButton';
import './App.css';
import { IDriver, IRider } from './types';
import PersonForm from './NewPersonForm';

export default function Nav({
  drivers,
  attendees,
  removeFromMenuCallback,
  reload,
}: {
  drivers: IDriver[];
  attendees: IRider[];
  removeFromMenuCallback: (value: string, type: string) => void;
  reload: (value: boolean) => void;
}) {
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [addType, setAddType] = React.useState<string>('');

  const addPerson = (person: IRider | IDriver | null, type: string) => {
    setShowForm(false);
    setAddType('');
    reload(true);
  };

  return (
    <div className="App">
      <Row>
        <p />
      </Row>
      <Row>
        <Col sm={1}></Col>
        <Col sm={2}>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-disabled">Add a new driver.</Tooltip>}
          >
            <Button
              id="add-driver-button"
              variant="primary"
              value="drivers"
              onClick={(e) => {
                setShowForm(true);
                setAddType('Driver');
              }}
            >
              Add Driver
            </Button>
          </OverlayTrigger>
        </Col>
        <Col sm={2}>
          <SelectButton
            availablePeople={drivers}
            buttonType="Driver"
            removePersonCallback={removeFromMenuCallback}
          />
        </Col>
        <Col sm={2}></Col>
        <Col sm={2}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-disabled">Add a new attendee.</Tooltip>
            }
          >
            <Button
              id="add-rider-button"
              variant="primary"
              value="drivers"
              onClick={(e) => {
                setShowForm(true);
                setAddType('Attendee');
              }}
            >
              Add Attendee
            </Button>
          </OverlayTrigger>
        </Col>
        <Col sm={2}>
          <SelectButton
            availablePeople={attendees}
            buttonType="Attendee"
            removePersonCallback={removeFromMenuCallback}
          />
        </Col>
        <Col sm={1}></Col>
      </Row>
      <Row>&nbsp;</Row>
      <PersonForm
        person={null}
        people={addType === 'Driver' ? drivers : attendees}
        type={addType}
        addPersonCallback={addPerson}
        showMe={showForm}
      />
    </div>
  );
}
