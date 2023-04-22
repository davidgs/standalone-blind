import { SyntheticEvent, useEffect, useState } from "react";
import { Modal, Form, Button, Col, Row } from "react-bootstrap";
import { IDriver, IRider } from "./types";
import PhoneInput from "./components/PhoneInput";
import { AddPerson, UpdatePerson } from "./data/dataAccess";
import axios from "axios";
import HelpTxt from "./components/HelpTxt";
// import AddressField from "./components/AddressField";
import "./style.css";
import DireWarning from "./components/DireWarning";

export default function PersonForm({
  person,
  people,
  type,
  addPersonCallback,
  showMe,
}: {
  person: IRider | IDriver | null;
  people: IRider[] | IDriver[];
  type: string;
  addPersonCallback: (upPerson: IRider | IDriver | null, type: string) => void;
  showMe: boolean;
}): JSX.Element {
  const [thisPerson, setThisPerson] = useState<IRider | IDriver | null>(person);
  const thesePeople = people;
  const [newPerson, setNewPerson] = useState<boolean>(true);
  const [personType, setType] = useState<string>(type);
  const [show, setShow] = useState<boolean>(showMe);
  const [warning, setWarning] = useState<string>("");
  const [duplicatePerson, setDuplicatePerson] = useState<IRider | IDriver | null>(null);
  const [showDireWarning, setShowDireWarning] = useState<boolean>(false);
  const [validated, setValidated] = useState(false);
  const [nameValid, setNameValid] = useState(true);
  const [addrValid, setAddrValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [stateValid, setStateValid] = useState(true);
  const [zipValid, setZipValid] = useState(true);
  const dbPrefix = ''

  const patterns = {
    email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
    state: /^[A-Z]{2}$/,
    zip: /^\d{5}$/,
    address: /^\d+\s[A-z]+\s[A-z]+/,
    phone: /^\(\d{3}\) \d{3}-\d{4}/,
    name: /^([A-Za-z]+ [A-Za-z]+)/,
  };

  console.log(`Validated: ${validated}`);

  const handleValidate = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value as string;
    const name = target.name as string;
    event.preventDefault();
      event.stopPropagation();
    console.log(`handleValidate: ${name} = ${value}`);
    switch (name) {
      case 'name':
        const n = patterns.name.test(value);
        n ? target.className = 'form-control valid' :
                        target.className = 'form-control invalid';
        setNameValid(n);
        setValidated(!n);
        return;
      case 'email':
        const f = patterns.email.test(value);
        f ? target.className = 'form-control valid' :
                        target.className = 'form-control invalid';

        setEmailValid(f);
        return;
      case 'address':
        const a = patterns.address.test(value);
        a ? target.className = 'form-control valid' :
                        target.className = 'form-control invalid';
        setAddrValid(a);
        return;
      case 'city':
        const c = value.length > 2;
        c ? target.className = 'form-control valid' :
                        target.className = 'form-control invalid';
                        setCityValid(c);
        return;
      case 'state':
        const s = patterns.state.test(value.toUpperCase());
        s ? target.className = 'form-control valid' :
                        target.className = 'form-control invalid';
        setStateValid(s);
        return;
      case 'zipCode':
        const z = patterns.zip.test(value);
        z ? target.className = 'form-control valid' :
                        target.className = 'form-control invalid';
        setZipValid(z);
        return;
      default:
        break;
    }
    // console.log(`handleValidate: ${name} = ${value}`);
    // const form = event.currentTarget as HTMLFormElement;
    // if (form.checkValidity() === false) {
    //   console.log("handleValidate: invalid form")
    //   event.preventDefault();
    //   event.stopPropagation();
    //   setValidated(true);
    //   return;
    // }
    setValidated(false);
  };

  const handleDireClose = (conf: boolean) => {
    setShowDireWarning(!showDireWarning);
    if (conf) {
      addPerson();
    }
  };

  useEffect(() => {
    console.log("PersonForm useEffect");
    if (person) {
      setThisPerson(person);
      setNewPerson(false);
    } else {
      if (type === "Driver") {
        const d: IDriver = {
          _id: "",
          name: "",
          cellphone: "",
          homephone: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          notes: "",
          location: {
            lat: 0,
            lng: 0,
          },
          riders: [],
        };
        setThisPerson(d);
      } else {
        const r: IRider = {
          _id: "",
          name: "",
          cellphone: "",
          homephone: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          notes: "",
          location: {
            lat: 0,
            lng: 0,
          },
          driver: {
            _id: "",
            name: "",
            cellphone: "",
            homephone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            notes: "",
            location: {
              lat: 0,
              lng: 0,
            },
            riders: [],
          },
        };
        setThisPerson(r);
      }
    }
  }, [person, type]);

  useEffect(() => {
    setShow(showMe);
  }, [showMe]);

  const handleCancel = () => {
    setShow(!show);
    addPersonCallback(null, personType);
  };

  const setPhone = (type: string, phone: string) => {
    if (type === "Home") {
      console.log("Home phone: " + phone);
      setThisPerson((prevPerson) => {
        const np = { ...prevPerson } as IDriver | IRider;
        np.homephone = phone;
        return np;
      });
    } else {
      console.log("Cell phone: " + phone);
      setThisPerson((prevPerson) => {
        const np = { ...prevPerson } as IDriver | IRider;
        np.cellphone = phone;
        return np;
      });
    }
  };

  const geocodeAddress = () => {
    const newP = { ...(thisPerson as IDriver | IRider) };
    const address = thisPerson?.address;
    const city = thisPerson?.city;
    const state = thisPerson?.state;
    const zip = thisPerson?.zip;
    const fullAddress = `${address} ${city} ${state} ${zip}`;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        setThisPerson((prePerson) => {
          const np = { ...prePerson } as IDriver | IRider;
          np.location = {
            lat: location.lat(),
            lng: location.lng(),
          };
          return np;
        });
        newP.location = {
          lat: location.lat(),
          lng: location.lng(),
        };
        AddPerson(newP, `${dbPrefix}${type}s`)
          .then((res) => {
            console.log(res);
            if(res) {
              addPersonCallback(thisPerson, personType);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  const findDuplicate = (person: IRider | IDriver) => {
    if (type.toLowerCase() === "drivers") {
      const currentDrivers = thesePeople as IDriver[];
      const f = currentDrivers.filter(
        (driver) => driver._id === person._id || driver.name.trim() === person.name.trim()
      )[0];
      if(f) {
        setWarning(
          `This looks to be a duplicate ${type} entry for ${f.name}. Are you sure you want to do this?`
        );
        setDuplicatePerson(f);
        return true;
      } else {
        return false;
      }
    } else {
      const currentRiders = thesePeople as IRider[];
      const f = currentRiders.filter(
        (rider) => rider._id === person?._id || rider.name.trim() === person?.name.trim()
      )[0];
      console.log(f);
      if(f) {
        setWarning(
          `This looks to be a duplicate ${type} entry for ${f.name}.`
        );
        setDuplicatePerson(f);
        return true;
      } else {
        return false;
      }
    }
  };

  const addPerson = () => {
    if (newPerson) {
      geocodeAddress();
      // call server to add person
    } else {
      axios
        .post(`https://davidgs.com:3001/api/update/${dbPrefix}${type}/${thisPerson._id}`, JSON.stringify(thisPerson))
        .then((res) => {
          console.log(res);
          console.log(res.data);
          addPersonCallback(thisPerson, personType);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setShow(!show);
  };

  const handleSave = () => {
    const found = findDuplicate(thisPerson as IRider | IDriver);
    if (found && newPerson) {
      setShowDireWarning(true);
      return;
    }
    addPerson();
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {newPerson ? 'Add ' : 'Edit '}
            {!newPerson && thisPerson?.name !== '' ? 'Edit ' : 'Add '}{' '}
            {!newPerson && thisPerson?.name
              ? thisPerson.name
              : `New ${personType}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Row>
              <Col sm={12}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    placeholder="Full name"
                    name="name"
                    required
                    onChange={(e) => {
                      handleValidate(e);
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.name = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.name}
                  />
                  <HelpTxt show={!nameValid} txt='Please enter a complete first and last name'/>
                  {/* {nameValid ? <div id="nameHelp"></div> : <></> } */}
                </Form.Group>
              </Col>
            </Row>
            {/* <AddressField /> */}
            <p />
            <Row>
              <Col sm={12}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    required
                    placeholder="Address"
                    name="address"
                    value={thisPerson?.address}
                    onChange={(e) => {
                      handleValidate(e);
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.address = e.target.value;
                        return np;
                      });
                    }}
                  />
                  {addrValid ? <small id="addressHelp" className="form-text">
                    Enter a valid street address.
                  </small> : null }
                </Form.Group>
              </Col>
            </Row>
            <p />
            <Row>
              <Col sm={6}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    placeholder="City"
                    name="city"
                    required
                    onChange={(e) => {
                      handleValidate(e);
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.city = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.city}
                  />
                  {cityValid ? <small id="cityHelp" className="form-text">
                    Enter valid City name.
                  </small> : null }
                </Form.Group>
              </Col>
              <Col sm={3}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    placeholder="State"
                    name="state"
                    required
                    onChange={(e) => {
                      handleValidate(e);
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.state = e.target.value.toUpperCase();
                        return np;
                      });
                    }}
                    value={thisPerson?.state}
                  />
                  {stateValid ? <small id="stateCodeHelp" className="form-text">
                    Enter a valid 2-letter state abbreviation.
                  </small>  : null }
                </Form.Group>
              </Col>
              <Col sm={3}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    placeholder="Zip code"
                    name="zipCode"
                    required
                    onChange={(e) => {
                      handleValidate(e);
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.zip = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.zip}
                  />
                  {zipValid ? <small id="zipCodeHelp" className="form-text">
                    Enter valid 5-digit Zip Code.
                  </small> : null }
                </Form.Group>
              </Col>
            </Row>
            <p />
            <Row>
              <Col sm={6}>
                <Form.Group controlId="formBasicEmail">
                  <PhoneInput
                    phone={thisPerson?.homephone ? thisPerson.homephone : ''}
                    type="Home"
                    callback={setPhone}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="formBasicEmail">
                  <PhoneInput
                    phone={thisPerson?.cellphone ? thisPerson.cellphone : ''}
                    type="Cell"
                    callback={setPhone}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p />
            <Row>
              <Col sm={12}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    name="email"
                    onChange={(e) => {
                      handleValidate(e);
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.email = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.email}
                  />
                  {emailValid ? <small id="emailHelp" className="form-text">
                    Enter valid email address like `something@something.com`.
                  </small> : null }
                </Form.Group>
              </Col>
            </Row>
            <p />
            <Row>
              <Col sm={12}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Notes"
                    name="notes"
                    onChange={(e) => {
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.notes = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.notes}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <DireWarning
        show={showDireWarning}
        warning={warning}
        onConfirm={handleDireClose}
      />
    </>
  );
}
