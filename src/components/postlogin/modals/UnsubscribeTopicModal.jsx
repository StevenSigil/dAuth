import React from "react";
import { Button, Modal } from "react-bootstrap";

import axiosInstance from "../../../utils/axiosAPI";

export default function UnsubscribeTopicModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const userIsAdmin = props.userIsAdmin;
  const activeTopicID = props.activeTopicID;

  function UserIsAdmin() {
    if (userIsAdmin()) {
      return (
        <Modal.Body style={{ paddingBottom: 0, textAlign: "center" }}>
          <h2 className="text-danger">WARNING</h2>
          Unsubscribing from this topic will
          <strong> remove your admin status</strong>!{" "}
          {/* <em>
            If you are the only admin on this topic, the topic will be removed.
          </em> */}
        </Modal.Body>
      );
    } else return null;
  }

  function handleUnsubscribe() {
    axiosInstance
      .post("topics/subscriptions/remove_subscription/", {
        id: activeTopicID,
      })
      .then((response) => {
        console.log(response);
        resetWindows();
      })
      .catch((error) => console.log(error));
  }

  function resetWindows() {
    setShow(false);
    window.location.reload();
  }

  return (
    <>
      <Modal animation={false} show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <Modal.Title>Unsubscribe?</Modal.Title>
        </Modal.Header>
        {userIsAdmin ? <UserIsAdmin /> : null}
        <Modal.Body style={{ textAlign: "center" }}>
          Are you sure you want to unsubscribe from this topic?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleUnsubscribe}>
            Confirm
          </Button>
          <Button variant="outline-dark" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

