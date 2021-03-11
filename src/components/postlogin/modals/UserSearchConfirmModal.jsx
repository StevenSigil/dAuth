import React from "react";
import { Modal, Container, Button } from "react-bootstrap";

function UserSearchConfirmModal(props) {
  const show = props.show;
  const onHide = props.hide;
  const setGetFriends = props.setGetFriends;

  function resetAndClose() {
    onHide();
    setGetFriends(true);
  }

  return (
    <>
      <Modal animation={false} show={show} onHide={resetAndClose}>
        <Modal.Body>
          <Container style={{ textAlign: "center" }}>
            <h3>Friend added!</h3>
          </Container>
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

export default UserSearchConfirmModal;
