import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function SubscribeToTopicModal(props) {
  const show = props.show;
  const setShow = props.setShow;

  function closeModal() {
    setShow(false);
    window.location.reload();
  }

  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Topic editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are now subscribed!</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-success" onClick={closeModal}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
