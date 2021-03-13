import React from "react";
import { Button } from "react-bootstrap";
import { ReactComponent as XIcon } from "../../static/svg/x-square.svg";

export default function XSquareButton(props) {
  const onClickFunction = props.onClickFunction;

  return (
    <Button
      className="oragne-danger-btn"
      variant="outline-danger"
      onClick={onClickFunction}
    >
      <XIcon />
    </Button>
  );
}
