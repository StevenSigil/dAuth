import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axiosInstance from "../../../utils/axiosAPI";

export default function CreateBoardModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const topicID = props.topicID;

  const [boardName, setBoardName] = useState("");
  const [BoardDescription, setBoardDescription] = useState("");

  function resetModal(refresh = false) {
    setBoardName("");
    setBoardDescription("");
    setShow(false);
    if (refresh) window.location.reload();
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
        resetModal(true);
      })
      .catch((error) => console.log(error));
  }

  return (
    <Modal
      backdrop={props.fromNewTopic ? "static" : true}
      keyboard={false}
      animation={false}
      show={show}
      onHide={resetModal}
    >
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
          <Form.Group
            controlId="createBoard-description"
            style={{ marginTop: "1rem" }}
          >
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
        {!props.fromNewTopic ? (
          <Button variant="outline-secondary" onClick={() => resetModal(false)}>
            Cancel
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}
