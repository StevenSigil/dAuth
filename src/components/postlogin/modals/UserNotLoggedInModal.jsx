import React from "react";

import { Modal, Button } from "react-bootstrap";

export default function UserNotLoggedInModal(props) {
  const show = props.show;
  const setShow = props.setShow;

  function handleClose() {
    setShow(false);
    window.location = "/login/";
  }
  return (
    <>
      <Modal
        animation={false}
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>You are not signed in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please press continue to go to the login page.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
