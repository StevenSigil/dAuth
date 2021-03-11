import React from "react";
import { Modal, Button } from "react-bootstrap";

import axiosInstance from "../../../utils/axiosAPI";

function DeleteBoardModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const activeBoard = props.activeBoard;

  function handleDelete() {
    axiosInstance
      .delete("boards/" + activeBoard.id + "/")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    setShow(false);
    window.location.reload();
  }

  return (
    <Modal
      className="delete-board-modal"
      show={show}
      onHide={() => setShow(false)}
    >
      <Modal.Header>
        <Modal.Title>Are you sure you want to delete this board?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This action can not be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" size="sm" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="outline-dark" size="sm" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteBoardModal;
