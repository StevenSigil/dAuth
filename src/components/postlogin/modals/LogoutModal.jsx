import React from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../../../utils/axiosAPI";

function LogoutModal(props) {
  const show = props.show;
  const setShow = props.setShow;

  function handleLogout(e) {
    e.preventDefault();
    axiosInstance
      .post("users/logout/")
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          sessionStorage.removeItem("Token");
          console.log("Token removed from storage.");
        }
        window.location = window.location.origin;
      })
      .catch((error) => console.log(error));
  }

  return (
    <Modal animation={false} show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="outline-dark" size="sm" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutModal;
