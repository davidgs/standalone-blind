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
/* eslint-disable no-unused-vars */
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { IPerson } from './types';
import PhoneInput from './components/PhoneInput';
import HelpTxt from './components/HelpTxt';
// import AddressField from "./components/AddressField";
import './style.css';
import DireWarning from './components/DireWarning';
import Signer from './components/signer';
import { parse } from 'path';

export default function
PersonForm({
  person,
  thesePeople,
  type,
  addPersonCallback,
  showMe,
}: {
  person: IPerson | null;
  thesePeople: IPerson[];
  type: string;
  addPersonCallback: (nPerson: IPerson) => void;
  showMe: boolean;
}): React.JSX.Element {
  const [thisPerson, setThisPerson] = useState<IPerson | null>(person);
  const [myPeople, setMyPeople] = useState<IPerson[]>(thesePeople);
  const [newPerson, setNewPerson] = useState<boolean>(true);
  const [personType, setType] = useState<string>(type);
  const [show, setShow] = useState<boolean>(showMe);
  const [warning, setWarning] = useState<string>('');
  const [duplicatePerson, setDuplicatePerson] = useState<IPerson | null>(null);
  const [showDireWarning, setShowDireWarning] = useState<boolean>(false);
  const [validated, setValidated] = useState(false);
  const [nameValid, setNameValid] = useState(true);
  const [addrValid, setAddrValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [stateValid, setStateValid] = useState(true);
  const [zipValid, setZipValid] = useState(true);
  const dbPrefix = '';

  const patterns = {
    email: /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
    state: /^[A-Z]{2}$/,
    zip: /^\d{5}$/,
    address: /^\d+\s[A-z]+\s[A-z]+/,
    phone: /^\(\d{3}\) \d{3}-\d{4}/,
    name: /^([A-Za-z]+ [A-Za-z]+)/,
  };

  /*
   *  Validates the 'addPerson form fields.
   *  @param event - the event that triggered the validation.
   */
  const handleValidate = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const value = target.value as string;
    const name = target.name as string;
    event.preventDefault();
    event.stopPropagation();
    if (name === 'name') {
      const n = patterns.name.test(value);
      target.className = n ? 'form-control valid' : 'form-control invalid';
      setNameValid(n);
      setValidated(!n);
      return;
    }
    if (name === 'email') {
      const f = patterns.email.test(value);
      target.className = f ? 'form-control valid' : 'form-control invalid';
      setEmailValid(f);
      setValidated(!f);
      return;
    }
    if (name === 'address') {
      const a = patterns.address.test(value);
      target.className = a ? 'form-control valid' : 'form-control invalid';
      setAddrValid(a);
      setValidated(!a);
      return;
    }
    if (name === 'city') {
      const c = value.length > 2;
      target.className = c ? 'form-control valid' : 'form-control invalid';
      setCityValid(c);
      setValidated(!c);
      return;
    }
    if (name === 'state') {
      const s = patterns.state.test(value.toUpperCase());
      target.className = s ? 'form-control valid' : 'form-control invalid';
      setStateValid(s);
      setValidated(!s);
      return;
    }
    if (name === 'zipCode') {
      const z = patterns.zip.test(value);
      target.className = z ? 'form-control valid' : 'form-control invalid';
      setZipValid(z);
      setValidated(!z);
      return;
    }
    setValidated(false);
  };

  /*
   * geocode a new person's address before adding to the database.
   */
  const geocodeAddress = () => {
    const newP = { ...(thisPerson as IPerson) };
    const address = thisPerson?.address;
    const city = thisPerson?.city;
    const state = thisPerson?.state;
    const zip = thisPerson?.zip;
    const fullAddress = `${address} ${city} ${state} ${zip}`;
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: fullAddress }, (results, status) => {
      if (status === 'OK' && results !== null) {
        const { location } = results[0].geometry;
        setThisPerson((prePerson) => {
          const np = { ...prePerson } as IPerson;
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
        // const ts = Date.now();
        // const sig = Signer(JSON.stringify(newP));
        window.electronAPI.signRequest(JSON.stringify(newP))
     .then((response) => {
        const r = JSON.parse(response);
        axios
          .post(
            // eslint-disable-next-line no-underscore-dangle
            `https://blind-ministries.org/api/${dbPrefix}${type}`, JSON.stringify(newP)
            ,
            {
              headers: {
                'x-request-timestamp': parseInt(r.ts),
                'X-Signature-SHA256': r.signature,
              },
            },

          )
          // eslint-disable-next-line promise/always-return
          .then((res) => {
            addPersonCallback(thisPerson as IPerson);
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
          });
        setShow(!show);
      }
      ).catch((err) => {
        console.log('error: ', err);
      });
      } else {
        // eslint-disable-next-line no-alert
        alert(`Geocode was not successful for the following reason: ${status}`);
      }
    });
  };

  /*
   *  Adds a person to the database.
   */
  const addPerson = () => {
    if (newPerson) {
      geocodeAddress();
    } else {
      // const ts = Date.now();
      // const sig = Signer(JSON.stringify(thisPerson));
      window.electronAPI.signRequest(JSON.stringify(thisPerson))
        .then((response) => {
          const r = JSON.parse(response);
          console.log('response: ', response);
          const ts = parseInt(r.ts);
          const sig = r.signature;
          axios
        .post(
          // eslint-disable-next-line no-underscore-dangle
          `https://blind-ministries.org/api/update/${dbPrefix}${type}/${thisPerson?._id}`, JSON.stringify(thisPerson),
          {
            headers: {
              'x-request-timestamp': parseInt(r.ts),
              'X-Signature-SHA256': r.signature,
            },
          },
        )
        // eslint-disable-next-line promise/always-return
        .then((res) => {
          addPersonCallback(thisPerson as IPerson);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
      })
      .catch((err) => {
        console.log('error: ', err);
      });
    }
    setShow(!show);
  };

  /*
   * close the DireWarning Dialog
   */
  const handleDireClose = (conf: boolean) => {
    setShowDireWarning(!showDireWarning);
    if (conf) {
      addPerson();
    }
  };

  useEffect(() => {
    if (person) {
      setThisPerson(person);
      setNewPerson(false);
    } else {
      const d: IPerson = {
        _id: '',
        name: '',
        cellphone: '',
        homephone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        notes: '',
        location: {
          lat: 0,
          lng: 0,
        },
      };
      setThisPerson(d);
    }
  }, [person, type]);

  useEffect(() => {
    setShow(showMe);
  }, [showMe]);

  useEffect(() => {
    setMyPeople(thesePeople);
  }, [thesePeople]);

  const handleCancel = () => {
    setShow(!show);
    addPersonCallback(thisPerson as IPerson);
  };

  /*
   *  Set the phone number for the person
   *  @param phoneType - the type of phone (Home or Cell)
   *  @param phone - the phone number
   *  @returns nothing
   */
  const setPhone = (phoneType: string, phone: string) => {
    if (phoneType === 'Home') {
      setThisPerson((prevPerson) => {
        const np = { ...prevPerson } as IPerson;
        np.homephone = phone;
        return np;
      });
    } else {
      setThisPerson((prevPerson) => {
        const np = { ...prevPerson } as IPerson;
        np.cellphone = phone;
        return np;
      });
    }
  };

  /*
   *  Check for duplicate person
   *  @param person - the person to check
   * @returns true if the person is a duplicate, false otherwise
   */
  const findDuplicate = (checkPerson: IPerson) => {
    if (personType.toLowerCase() === 'drivers') {
      const currentDrivers = thesePeople as IPerson[];
      const f = currentDrivers.filter(
        (driver) =>
          // eslint-disable-next-line no-underscore-dangle
          driver._id === checkPerson._id ||
          driver.name.trim() === checkPerson.name.trim()
      )[0];
      if (f) {
        setWarning(
          `This looks to be a duplicate ${type} entry for ${f.name}. Are you sure you want to do this?`
        );
        setDuplicatePerson(f);
        return true;
      }
      return false;
    }
    const currentRiders = thesePeople as IPerson[];
    const f = currentRiders.filter(
      (rider) =>
        // eslint-disable-next-line no-underscore-dangle
        rider._id === person?._id || rider.name.trim() === person?.name.trim()
    )[0];
    if (f) {
      setWarning(`This looks to be a duplicate ${type} entry for ${f.name}.`);
      setDuplicatePerson(f);
      return true;
    }
    return false;
  };

  /*
   *  Save the person to the database
   */
  const handleSave = () => {
    const found = findDuplicate(thisPerson as IPerson);
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
                        const np = { ...prevPerson } as IPerson;
                        np.name = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.name}
                  />
                  <HelpTxt
                    show={!nameValid}
                    txt="Please enter a complete first and last name"
                  />
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
                        const np = { ...prevPerson } as IPerson;
                        np.address = e.target.value;
                        return np;
                      });
                    }}
                  />
                  {addrValid ? (
                    <small id="addressHelp" className="form-text">
                      Enter a valid street address.
                    </small>
                  ) : null}
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
                        const np = { ...prevPerson } as IPerson;
                        np.city = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.city}
                  />
                  {cityValid ? (
                    <small id="cityHelp" className="form-text">
                      Enter valid City name.
                    </small>
                  ) : null}
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
                        const np = { ...prevPerson } as IPerson;
                        np.state = e.target.value.toUpperCase();
                        return np;
                      });
                    }}
                    value={thisPerson?.state}
                  />
                  {stateValid ? (
                    <small id="stateCodeHelp" className="form-text">
                      Enter a valid 2-letter state abbreviation.
                    </small>
                  ) : null}
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
                        const np = { ...prevPerson } as IPerson;
                        np.zip = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.zip}
                  />
                  {zipValid ? (
                    <small id="zipCodeHelp" className="form-text">
                      Enter valid 5-digit Zip Code.
                    </small>
                  ) : null}
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
                        const np = { ...prevPerson } as IPerson;
                        np.email = e.target.value;
                        return np;
                      });
                    }}
                    value={thisPerson?.email}
                  />
                  {emailValid ? (
                    <small id="emailHelp" className="form-text">
                      Enter valid email address like `something@something.com`.
                    </small>
                  ) : null}
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
                        const np = { ...prevPerson } as IPerson;
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
