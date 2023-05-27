import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { ICarpool } from "renderer/types";


export default function RemoveDriver(
  {driver, removeCallback} :
  {driver: ICarpool; removeCallback: (driver: ICarpool) => void }
  ): React.JSX.Element {

  const [thisDriver, setDriver] = useState<ICarpool>(driver || {} as ICarpool);

  const remove = () => {
    removeCallback(thisDriver);
  }

  return(
    <div>
      <Button variant="icon-only" onClick={remove}>X</Button>
    </div>
  )
}
