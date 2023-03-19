import React from "react";
import "./style.css";
import Button from "react-bootstrap/Button";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function Header({ callback }: { callback: () => void }) {
  const [managing, setManaging] = React.useState<boolean>(false);
  const [manageLabel, setManageLabel] = React.useState<string>("Manage People");
  const managePeople = () => {
    setManaging(!managing);
    callback();
    console.log("Manage People");
  };

  React.useEffect(() => {
    if (managing) {
      setManageLabel("Done");
    } else {
      setManageLabel("Manage People");
    }
  }, [managing]);

  return (
    <div className="container-fluid">
      <div className="jumbotron text-center">
        <h1 style={{ paddingTop: "25px !important" }}>Blind Ministry</h1>
        <div className="row text-center" style={{ paddingTop: "25px" }}>
          <div className="col-sm-5"></div>
          <div className="col-sm-2">
            {managing ? (
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Finish edditing all members.
                  </Tooltip>
                }
              >
                <Button variant="success" id="manage" onClick={managePeople}>
                  Done
                </Button>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Add, Edit, or remove members.
                  </Tooltip>
                }
              >
                <Button variant="success" id="manage" onClick={managePeople}>
                  Manage People
                </Button>
              </OverlayTrigger>
            )}
          </div>
          <div className="col-sm-5"></div>
        </div>
      </div>
    </div>
  );
}
