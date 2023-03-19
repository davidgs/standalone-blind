import React, { useState } from "react";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { Form, Row, Col } from "react-bootstrap";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

export default function AddressField(): JSX.Element {
  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: "AIzaSyARN4ZLpzuzwGo2M6PKr2M--juR5zJyrew",
  //   libraries,
  // });
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  // const onLoad = (ref) => (this.searchBox = ref);

  function onPlacesChanged(this: any) {
    console.log(this.searchBox.getPlaces());
    const comps = this.searchBox.getPlaces()[0];
    console.log(comps.formatted_address);
    const thisAddr = comps.formatted_address;
    const addrComps = thisAddr.split(",");
    setAddress(addrComps[0]);
    setCity(addrComps[1]);
    const stZ = addrComps[2].split(" ");
    setState(stZ[1]);
    setZip(stZ[2]);
    console.log(addrComps);
  }

  // if (loadError) return (<h1>Error</h1>);
  // if (!isLoaded) return (<h1>Loading...</h1>);

  return (
    <Form.Group>
      <Row>
        <Col sm={12}>
          <StandaloneSearchBox onPlacesChanged={onPlacesChanged}>
            <Form.Control
              type="text"
              placeholder="address"
              name="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </StandaloneSearchBox>
        </Col>
      </Row>
      <p />
      <Row>
        <Col sm={6}>
          <Form.Control
            type="text"
            placeholder="City"
            name="City"
            onChange={(e) => {
              setCity(e.target.value);
            }}
            value={city}
          />
        </Col>
        <Col sm={3}>
          <Form.Control
            type="text"
            placeholder="State"
            name="State"
            onChange={(e) => {
              setState(e.target.value);
            }}
            value={state}
          />
        </Col>
        <Col sm={3}>
          <Form.Control
            type="text"
            placeholder="Zip Code"
            name="Zip"
            onChange={(e) => {
              setZip(e.target.value);
            }}
            value={zip}
          />
        </Col>
      </Row>
    </Form.Group>
  );
}
