import React, { useEffect, useState, useRef } from "react";
import { IDriver, IRider } from "./types";
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";

import "./App.css";
import PlaceInfo from "./Places";

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

export default function Map({
  drivers,
  attendees,
  callback,
}: {
  drivers: IDriver[];
  attendees: IRider[];
  callback: (rider: IRider | null, driver: IDriver | null) => void;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyB6NXzTC1jKA4cQuBaTNLAun7pRFApVSbc",
    libraries: libraries,
  });

  const [mapDrivers, setMapDrivers] = React.useState<IDriver[]>(drivers);
  const [mapAttendees, setMapAttendees] = React.useState<IRider[]>(attendees);

  const churchPlace: IDriver[] = [
    {
      name: "RLC Church",
      address: "1234 Church St, Raleigh, NC 27609",
      homephone: "",
      cellphone: "",
      email: "",
      city: "Cary",
      state: "NC",
      zip: "27511",
      notes: "",
      _id: "1234",
      location: { lat: 35.7298286, lng: -78.77857179999999 },
      riders: [],
    },
  ];

  useEffect(() => {
    console.log("Map drivers useEffect");
    console.log(drivers);
    setMapDrivers(drivers);
  }, [drivers]);

  useEffect(() => {
    console.log("Map attendees useEffect");
    console.log(attendees);
    setMapAttendees(attendees);
  }, [attendees]);

  const addRider = (rider: IRider | null, driver: IDriver | null) => {
    console.log("addRider");
    callback(rider, driver);
  };

  // without height and width you won't see a map
  const mapContainerStyle = {
    height: "80vh",
    width: "80vw",
    margin: "auto",
  };
  // RLC is the default center
  const defaultProps = {
    center: {
      lat: 35.7298286,
      lng: -78.77857179999999,
    },
    zoom: 12,
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapContainerStyle: { mapContainerStyle },
    center: defaultProps.center,
    zoom: 11,
  };

  const renderMap = () => {
    return (
      <GoogleMap options={options} mapContainerStyle={mapContainerStyle}>
        {isLoaded && (
          <PlaceInfo
            markerPlaces={churchPlace}
            type="church"
            drivers={[]}
            callback={addRider}
          />
        )}
        <PlaceInfo
          markerPlaces={mapDrivers}
          type="drivers"
          drivers={[]}
          callback={addRider}
        />
        <PlaceInfo
          markerPlaces={mapAttendees}
          type="attendees"
          drivers={mapDrivers}
          callback={addRider}
        />
      </GoogleMap>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return renderMap();
}
// // Path: src/Places.tsx
