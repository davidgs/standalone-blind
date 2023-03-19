import { useEffect, useState } from "react";
import { Modal, Form, Button, Col, Row } from "react-bootstrap";
import { IDriver, IRider } from "./types";
import PhoneInput from "./components/PhoneInput";
import axios from "axios";
// import AddressField from "./components/AddressField";
import "./style.css";

export default function PersonForm({
  person,
  type,
  addPersonCallback,
  showMe,
}: {
  person: IRider | IDriver | null;
  type: string;
  addPersonCallback: (upPerson: IRider | IDriver | null, type: string) => void;
  showMe: boolean;
}): JSX.Element {
  const [thisPerson, setThisPerson] = useState<IRider | IDriver | null>(person);
  const [newPerson, setNewPerson] = useState<boolean>(true);
  const [personType, setType] = useState<string>(type);
  const [show, setShow] = useState<boolean>(showMe);
  const [validated, setValidated] = useState(false);
  const [addrValid, setAddrValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [stateValid, setStateValid] = useState(true);
  const [zipValid, setZipValid] = useState(true);

  const patterns = {
    email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
    state: /^[A-Z]{2}$/,
    zip: /^\d{5}$/,
    address: /^\d+\s[A-z]+\s[A-z]+/,
    phone: /^\(\d{3}\) \d{3}-\d{4}/,
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
    setType(type);
  }, [type]);

  useEffect(() => {
    console.log(`showMe: ${showMe} show: ${show} `);
    setShow(showMe);
  }, [showMe]);

  const handleCancel = () => {
    setShow(false);
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
        axios
          .post(`https://davidgs.com:3001/api/${type}s`, JSON.stringify(newP))
          .then((res) => {
            console.log(res);
            console.log(res.data);
            addPersonCallback(thisPerson, personType);

          })
          .catch((err) => {
            console.log(err);
          });
        // call server to add person
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  const handleSave = () => {
    console.log(`Handle Save Home Phone: ${thisPerson?.homephone}`);
    setShow(false);
    if (newPerson) {
      geocodeAddress();
      // call server to add person
    } else {
      axios
        .post(`https://davidgs.com:3001/api/update/${type}/${thisPerson._id}`, JSON.stringify(thisPerson))
        .then((res) => {
          console.log(res);
          console.log(res.data);
          addPersonCallback(thisPerson, personType);
        })
        .catch((err) => {
          console.log(err);
        });
      // remove riders or driver from person
      // call server to update person
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {newPerson ? "Add " : "Edit "}
            {!newPerson && thisPerson?.name !== "" ? "Edit " : "Add "}{" "}
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
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.name= e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.name}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                    placeholder="Address"
                    name="address"
                    value={thisPerson?.address}
                    onChange={(e) => {
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.address = e.target.value;
                        return np;
                      });
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide an address.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.city = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide a city.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                      const reg: RegExp = new RegExp(patterns.state);
                      if (reg.test(e.target.value)) {
                        e.target.className = "form-control valid";
                        setCityValid(true);
                      } else {
                        e.target.className = "form-control invalid";
                        setCityValid(false);
                      }
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.state = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.state}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide a 2-letter state.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
                      const reg: RegExp = new RegExp(patterns.zip);
                      if (reg.test(e.target.value)) {
                        e.target.className = "form-control valid";
                        setZipValid(true);
                      } else {
                        e.target.className = "form-control invalid";
                        setZipValid(false);
                      }
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.zip = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.zip}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide a valid zip code.
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <p />
            <Row>
              <Col sm={6}>
                <Form.Group controlId="formBasicEmail">
                  <PhoneInput
                    phone={thisPerson?.homephone ? thisPerson.homephone : ""}
                    type="Home"
                    callback={setPhone}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="formBasicEmail">
                  <PhoneInput
                    phone={thisPerson?.cellphone ? thisPerson.cellphone : ""}
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
                    type="text"
                    placeholder="Email address"
                    name="email"
                    onChange={(e) => {
                      const reg: RegExp = new RegExp(patterns.email);
                      if (reg.test(e.target.value)) {
                        e.target.className = "form-control valid";
                      } else {
                        e.target.className = "form-control invalid";
                      }
                      setThisPerson((prevPerson) => {
                        const np = { ...prevPerson } as IDriver | IRider;
                        np.email = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.email}
                  />
                  <small id="emailHelp" className="form-text">
                    Enter valid email address.
                  </small>
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
    </>
  );
}
