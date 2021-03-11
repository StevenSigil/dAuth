import React from "react";
import { Button, Modal } from "react-bootstrap";

function EditProfileModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const userID = props.userID;

  function handleClick() {
    setShow(false);
    window.location = "/" + userID + "/public";
  }

  return (
    <>
      <Modal show={show} onHide={handleClick}>
        <Modal.Header>
          <Modal.Title>Profile Saved.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <em>Click continue to proceed</em>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={handleClick}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditProfileModal;
