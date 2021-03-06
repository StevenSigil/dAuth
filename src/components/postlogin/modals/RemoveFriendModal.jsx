import React from "react";
import { Modal, Button } from "react-bootstrap";

import axiosInstance from "../../../utils/axiosAPI";

export default function RemoveFriendModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const getUsersFriends = props.getUsersFriends;
  const removingUserID = props.friendCardUserID;

  function resetWindow() {
    setShow(false);
    getUsersFriends();
  }

  function handleUnfriend() {
    axiosInstance
      .post("profiles/public/remove_friend/", { id: removingUserID })
      .then((response) => {
        console.log(response);
        resetWindow();
      })
      .then((error) => console.log(error));
  }

  return (
    <>
      <Modal animation={false} show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <Modal.Title>User manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>Would you like to unfriend this person?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleUnfriend}>
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
