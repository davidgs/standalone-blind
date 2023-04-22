import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { IDriver, IRider } from "./types";
import "./App.css";

export default function SelectButton({
  availablePeople,
  buttonType,
  removePersonCallback,
}: {
  availablePeople: IDriver[] | IRider[];
  buttonType: string;
  removePersonCallback: (value: string, type: string) => void;
}): JSX.Element {
  const dropdownTitle = `Select ${buttonType}`;
  const [dropdownItems, setDropdownItems] = React.useState<
    IDriver[] | IRider[]
  >([]);

  useEffect(() => {
    console.log("SelectButton useEffect");
    setDropdownItems(availablePeople);
  }, [availablePeople]);

  const items = dropdownItems.map((item: IDriver | IRider) => {
    return (
      <Dropdown.Item
        id={`${buttonType}-${item._id}`}
        key={`select-${item._id}`}
        eventKey={item._id}
      >
        {item.name}
      </Dropdown.Item>
    );
  });

  return (
    <div className="App">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-disabled">
            Add a new {buttonType} to the map of available {buttonType}s.
          </Tooltip>
        }
      >
        <DropdownButton
          variant="success"
          id={`dropdown-basic-button-${buttonType}`}
          title={dropdownTitle}
          onSelect={function (eventKey) {
            console.log("handleSelect");
            console.log(eventKey);
            removePersonCallback(eventKey as string, buttonType);
          }}
        >
          {items}
        </DropdownButton>
      </OverlayTrigger>
    </div>
  );
}
