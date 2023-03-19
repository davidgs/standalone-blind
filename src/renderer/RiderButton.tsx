import React, { useEffect } from "react";
import { IDriver } from "./types";
import "./App.css";

export default function RiderButton({
  drivers,
  callback,
}: {
  drivers: IDriver[];
  callback: (driver: IDriver | null) => void;
}): JSX.Element {
  const dropdownTitle = "Select Driver";
  const [dropdownItems, setDropdownItems] = React.useState<IDriver[]>([]);

  useEffect(() => {
    setDropdownItems(drivers);
  }, [drivers]);

  const items = dropdownItems.map((item: IDriver) => {
    return (
      <option
        id={`map-select-${item._id}`}
        key={item._id}
        onSelect={function (e) {
          const ev = e.target as HTMLSelectElement;
          console.log("handleSelect");
          console.log(e);
          console.log(ev);
        }}
      >
        {item.name}
      </option>
    );
  });

  return (
    <div className="App" style={{ zIndex: 1000, textAlign: "left" }}>
      <select
        id="dropdown-basic-button"
        onChange={function (eventKey) {
          console.log(eventKey.target.selectedOptions[0].id);
          const dr = dropdownItems.find(
            (d) => d._id === eventKey.target.selectedOptions[0].id
          );
          if (dr) {
            console.log(dr);
            callback(dr);
          }
        }}
      >
        <option value="None Selected">{dropdownTitle}</option>
        {items}
      </select>
    </div>
  );
}
