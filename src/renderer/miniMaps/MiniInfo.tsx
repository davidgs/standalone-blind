import { InfoWindowF } from "@react-google-maps/api";
import React, { useState } from "react";
import { IDriver, IRider } from "../types";

export default function MiniInfo({
  inf,
  drivers,
  callback,
}: {
  inf: IDriver | IRider;
  drivers: IDriver[];
  callback: (rider: IRider | null, driver: IDriver | null) => void;
}) {
  const [info, setInfo] = useState(inf);
  const [myDrivers, setMyDrivers] = React.useState<IDriver[]>(drivers);

  React.useEffect(() => {
    console.log(`Info useEffect drivers: ${drivers}`);
    setMyDrivers(drivers);
  }, [drivers]);

  React.useEffect(() => {
    console.log(`Info useEffect inf: ${inf}`);
    setInfo(inf);
  }, [inf]);

  const setDriver = (dr: IDriver | null) => {
    console.log("setDriver");
    console.log(dr);
    const rider = info as IRider;
    callback(rider, dr);
  };

  return (
    <InfoWindowF
      position={{
        lat: info.location.lat,
        lng: info.location.lng,
      }}
      onCloseClick={() => {
        callback(null, null);
      }}
      zIndex={100}
    >
      <div>
        <h4>{info.name}</h4>
        <div style={{ textAlign: "left" }}>
          <details>
            <summary>address</summary>
            <address>
              {info.address}
              <br />
              {info.city}, {info.state} {info.zip}
            </address>
            {info.homephone !== "" && info.homephone !== null ? (
              <p>
                Home: <a href={"tel:" + info.homephone}>{info.homephone}</a>
              </p>
            ) : null}
            {info.cellphone !== "" && info.cellphone !== null ? (
              <p>
                Cell: <a href={"tel:" + info.cellphone}>{info.cellphone}</a>
              </p>
            ) : null}
            {info.email !== "" && info.email !== null ? (
              <p>
                Email: <a href={"mailto:" + info.email}>{info.email}</a>
              </p>
            ) : null}
            {info.notes !== "" && info.notes !== null ? (
              <p>
                <strong>Notes</strong>
                {info.notes}
              </p>
            ) : null}
          </details>
        </div>
      </div>
    </InfoWindowF>
  );
}
