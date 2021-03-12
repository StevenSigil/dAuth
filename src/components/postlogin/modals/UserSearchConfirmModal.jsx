import React from "react";
import { Modal, Container, Button } from "react-bootstrap";

export default function UserSearchConfirmModal(props) {
  const show = props.show;
  const onHide = props.hide;
  // const setGetFriends = props.setGetFriends;

  function resetAndClose() {
    onHide(true);
    window.location.reload();
    // setGetFriends(true);
  }

  return (
    <>
      <Modal animation={false} show={show} onHide={resetAndClose}>
        <Modal.Body>
          <Modal.Title style={{ textAlign: "center" }}>
            <h3>Friend added!</h3>
          </Modal.Title>
          <Modal.Body style={{ textAlign: "center" }}>
            <p style={{ margin: 0 }}>Close to Reload</p>
          </Modal.Body>

          <Container style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button variant="outline-primary" onClick={resetAndClose}>
              Close
            </Button>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
