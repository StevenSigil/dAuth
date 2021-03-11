import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axiosInstance from "../../../utils/axiosAPI";

function CreateBoardModal(props) {
  const [boardName, setBoardName] = useState("");
  const [BoardDescription, setBoardDescription] = useState("");

  const show = props.show;
  const setShow = props.setShow;
  const topicID = props.topicID;

  function resetModal() {
    setBoardName("");
    setBoardDescription("");
    setShow(false);
    window.location.reload();
  }

  function prepData() {
    const data = {};
    if (boardName) {
      data.board_name = boardName;
    }
    if (BoardDescription) {
      data.board_description = BoardDescription;
    }
    data.assoc_channel = topicID;
    return JSON.stringify(data);
  }

  function handleBoardSave() {
    let data = prepData();
    axiosInstance
      .post("boards/new_board/", data)
      .then((response) => {
        console.log(response);
        resetModal();
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      <Modal show={show} onHide={resetModal}>
        <Modal.Header>
          <Modal.Title>Create a new board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="createBoard-name">
              <Form.Label>Board Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a name for your board"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="createBoard-description">
              <Form.Label>Board Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a description for your board"
                value={BoardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleBoardSave}>
            Save
          </Button>
          <Button variant="outline-secondary" onClick={resetModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateBoardModal;
