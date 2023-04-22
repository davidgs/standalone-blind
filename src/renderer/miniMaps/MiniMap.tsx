import React, { useEffect, useState, useRef } from "react";
import { IDriver, IRider } from "../types";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";

import "../App.css";
import MiniPlaceInfo from "./MiniPlaces";

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];

export default function Map({
  driver,
  attendees,
  id,
}: {
  driver: IDriver;
  attendees: IRider[];
  id: string;
}) {
  // const { isLoaded, loadError } = useJsApiLoader({
  //   googleMapsApiKey: "AIzaSyB6NXzTC1jKA4cQuBaTNLAun7pRFApVSbc",
  //   libraries: libraries,
  // });

  const [mapDrivers, setMapDrivers] = React.useState<IDriver[]>([driver]);
  const [mapAttendees, setMapAttendees] = React.useState<IRider[]>(attendees);
  const map = useRef<google.maps.Map>(null);

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
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
    console.log(driver);
    setMapDrivers([driver]);
  }, [driver]);

  const buildRoute = () => {
    if(mapAttendees === undefined || mapAttendees.length === 0) return;
    directionsRenderer.setMap(map.current);
    const waypoints: google.maps.DirectionsWaypoint[] = [];
    mapAttendees.forEach((att) => {
      waypoints.push({
        location: { lat: att.location.lat, lng: att.location.lng },
        stopover: true,
      });
    });
    const lat = mapDrivers[0].location.lat;
    const origin = {lat: mapDrivers[0].location.lat, lng: mapDrivers[0].location.lng};
    const destination = { lat: churchPlace[0].location.lat, lng: churchPlace[0].location.lng };

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };
  useEffect(() => {
    console.log("Map attendees useEffect");
    setMapAttendees(attendees);
    if (attendees === undefined || attendees.length === 0) return;
    directionsRenderer.setMap(map.current);
    const waypoints: google.maps.DirectionsWaypoint[] = [];
    attendees.forEach((att) => {
      waypoints.push({
        location: { lat: att.location.lat, lng: att.location.lng },
        stopover: true,
      });
    });
    const lat = mapDrivers[0].location.lat;
    const origin = {
      lat: mapDrivers[0].location.lat,
      lng: mapDrivers[0].location.lng,
    };
    const destination = {
      lat: churchPlace[0].location.lat,
      lng: churchPlace[0].location.lng,
    };

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
    buildRoute();
  }, [attendees]);

  // without height and width you won't see a map
  const miniMapContainerStyle = {
    height: "300px",
    width: "300px",
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
    mapContainerStyle: { miniMapContainerStyle },
    center: defaultProps.center,
    zoom: 11,
  };

  const noCallback = (rider: IRider | null, driver: IDriver | null) => {
    console.log("noCallback");
  };

  const renderMap = () => {
    return (
      <GoogleMap
        id={id}
        options={options}
        mapContainerStyle={miniMapContainerStyle}
        ref={map}
      >
        <MiniPlaceInfo
          markerPlaces={churchPlace}
          type="church"
          drivers={[]}
          callback={noCallback}
        />

        <MiniPlaceInfo
          markerPlaces={mapDrivers}
          type="drivers"
          drivers={[]}
          callback={noCallback}
        />
        <MiniPlaceInfo
          markerPlaces={mapAttendees}
          type="attendees"
          drivers={[]}
          callback={noCallback}
        />
      </GoogleMap>
    );
  };

  return renderMap();
}
// // Path: src/Places.tsx
