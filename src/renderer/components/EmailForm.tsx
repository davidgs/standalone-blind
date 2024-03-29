/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { IEmail, IPerson } from '../types';

export default function PersonModal({
  details,
  show,
  handleClose,
}: {
  details: IEmail;
  show: boolean;
  handleClose: () => void;
}) {
  const [directions, setDirections] = useState<string>();
  const [textValue, setTextValue] = useState<string>('');
  // eslint-disable-next-line no-undef
  const [rideFolks, setFolks] = useState<string[] | TrustedHTML>([]);
  const [map, setMap] = useState<string>();
  const [mapLink, setMapLink] = useState<string>();
  const [sent, setSent] = useState<boolean>(false);
  const [sendOK, setSendOK] = useState<boolean>(false);
  const [deets, setDeets] = useState<IEmail>();


  const closeMe = () => {
    setSendOK(false);
    setSent(false);
    handleClose();
  };

  useEffect(() => {
    let dirlink = 'http://maps.google.com/maps/dir/';
    dirlink += `${details?.info?.driver.address} `;
    dirlink += `${details?.info?.driver.city} `;
    dirlink += `${details?.info?.driver.state} `;
    dirlink += `${details?.info?.driver.zip}/`;
    const folks = details?.info?.riders.map((person: IPerson) => {
      const addrInfo = `${person.address}\n${person.city}, ${person.state} ${person.zip}`;
      dirlink += `${person.address} ${person.city} ${person.state} ${person.zip}/`;
      const hPhone =
        person.homephone !== ''
          ? `<a href=tel:${person.homephone}>${person.homephone}</a>`
          : null;
      const cPhone =
        person.cellphone !== ''
          ? `<a href=tel:${person.cellphone}>${person.cellphone}</a>`
          : null;
      const email =
        person.email !== ''
          ? `<a href=mailto:${person.email}>${person.email}</a>`
          : null;
      const notes =
        person.notes !== undefined && person.notes !== ''
          ? `<p><strong>Notes:</strong> ${person.notes}</p>`
          : null;
      let txt = `<strong>${person.name}</strong></br><strong>Address:</strong> ${addrInfo}`;
      if (hPhone) {
        txt += `</br><strong>Home Phone:</strong> ${hPhone}`;
      }
      if (cPhone) {
        txt += `</br><strong>Cell Phone:</strong> ${cPhone}`;
      }
      if (email) {
        txt += `</br><strong>Email:</strong> ${email}`;
      }
      if (notes !== null && notes !== '') {
        txt += notes;
      }
      return `<p>${txt}</p>`;
    });
    dirlink += '100 W Lochmere Dr Cary NC 27518';
    setMapLink(dirlink?.replaceAll(' ', '+'));
    setFolks(folks as string[]);
    setDirections(details.directions);
    setMap(details.map);
  }, [details]);

  const sendit = () => {
    const email = {
      to: details?.info?.driver.email,
      data: document.getElementById('finalEmail')?.innerHTML,
    };
    window.electronAPI.sendMail(details.info?.driver.email as string, document.getElementById('finalEmail')?.innerHTML || '')
      .then((res) => {
        if (res) {
          console.log(res);
          const ponce = JSON.parse(res);
          if (ponce.accepted.length > 0){
            setSendOK(true);
            setSent(true);
          } else if (ponce.rejected.length > 0) {
            setSendOK(false);
          }
        }

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let txt = `<p>Hello ${details?.info?.driver.name},</p>`;
    txt += `<p>Thank you so much for volunteering to drive this month.</p>`;
    txt += `<p>Here are the names, addresses, and phone numbers of the people you will be driving:</p><ul>`;
    rideFolks?.forEach((person: string) => {
      txt += `<li>${person}</li>`;
    });
    txt += `</ul>
    <p>You can click on this <a href=${mapLink}>Map Link</a> to see the entire route on Google Maps.</p><p>Please call your riders at least 1 or 2 days ahead of time. If you are reading this email on a Smart Phone, you can simply click on the phone number in this email to call the number.</p><p>A number of times some of you have driven to a house only to find out that the person is not home or not feeling well. If you feel comfortable with that you can give them your phone number. I always leave for church around 3.30pm and might not be home anymore in case they call me.</p><p>Also, just in case you need it, my cell phone is <a href=tel:516-639-9847>516-639-9847</a>.</p><p>Thank you for all you do!</p>Annette</br>--</br>Annette Langefeld-Kennedy</br><a href=tel:919-768-1960>919-768-1960</a></p><hr>`;
    setTextValue(txt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideFolks]);

  return (
    <Modal size="xl" show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Email Route to {details?.info?.driver.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Route Information for {details?.info?.driver.name}</h1>
        <Form noValidate>
          <Row>
            {/* <AddressField /> */}
            <Col sm={2}>
              <Form.Label>
                <strong>Send to:</strong>{' '}
              </Form.Label>
            </Col>
            <Col sm={4}>
              <Form.Control
                type="email"
                placeholder="Email address"
                name="email"
                onChange={(e) => setDeets((prevDeets) => {
                  const d = {...prevDeets};
                  d.info.driver.email = e.target.value;
                  return d;
                })}
                 readOnly
                defaultValue={details?.info?.driver.email}
              />
            </Col>
            <Col sm={2} />
            <Col sm={4}>
              <Button variant={!sendOK ? "primary" : "success"}  onClick={sendit} disabled={sent}>
                {!sendOK ? 'Send' : 'Sent!'}
              </Button>{' '}
              <Button variant={sendOK ? "success" : "warning"} onClick={closeMe}>
                Close
              </Button>
            </Col>
          </Row>
        </Form>
        <p />
        <div
          id="finalEmail"
          style={{
            padding: '5px',
            border: '1px solid grey',
            borderRadius: '10px',
          }}
        >
          <p />
          <Row>
            <Col sm={12}>
              <div dangerouslySetInnerHTML={{ __html: textValue }} />
            </Col>
          </Row>
          <h2>Map</h2>
          <div dangerouslySetInnerHTML={{ __html: map as TrustedHTML }} />
          <hr />
          <h2>Directions</h2>
          <div dangerouslySetInnerHTML={{ __html: directions as TrustedHTML }} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
