import React, { useEffect, useState } from "react";
import { MarkerF } from "@react-google-maps/api";
import { IDriver, IRider } from "./types";
import Info from "./Info";

export default function PlaceInfo({
  markerPlaces,
  type,
  drivers,
  callback,
}: {
  markerPlaces: IDriver[] | IRider[];
  type: string;
  drivers: IDriver[] | null;
  callback: (rider: IRider | null, driver: IDriver | null) => void;
}) {
  const icon = () => {
    switch (type) {
      case "drivers":
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      case "attendees":
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      default:
        return "https://maps.google.com/mapfiles/kml/pal2/icon11.png";
    }
  };

  const [myPlaces, setMyPlaces] = useState<IDriver[] | IRider[]>(markerPlaces);
  const [myDrivers, setMyDrivers] = useState<IDriver[]>(drivers ? drivers : []);

  useEffect(() => {
    setMyPlaces(markerPlaces);
  }, [markerPlaces]);

  useEffect(() => {
    setMyDrivers(drivers ? drivers : []);
  }, [drivers]);

  const [selected, setSelected] = useState<IDriver | IRider | null>(null);

  const setDriver = (ri: IRider | null, dri: IDriver | null) => {
    setSelected(null);
    callback(ri, dri);
  };
  return (
    <>
      {myPlaces.map((marker) => (
        <MarkerF
          key={`${marker.location.lat * marker.location.lng}`}
          position={{
            lat: marker.location.lat,
            lng: marker.location.lng,
          }}
          title={marker.name}
          animation={window.google.maps.Animation.DROP}
          onClick={() => {
            setSelected(marker);
          }}
          icon={{
            url: icon(),
          }}
        />
      ))}
      {selected ? (
        <Info
          inf={selected}
          drivers={myDrivers}
          callback={setDriver}
        />
      ) : null}
    </>
  );
}
