import React, { useState } from "react";
import { Modal, Form, Button, Container } from "react-bootstrap";
import axiosInstance from "../../../utils/axiosAPI";
import UserSearchModal from "./UserSearchModal";
import CreateBoardModal from "./CreateBoardModal";

export default function EditTopicModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const topic = props.topic;

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  function prepData() {
    let data = {};
    if (newName !== "") data.name = newName;
    if (newDescription !== "") data.description = newDescription;
    return data;
  }

  function handleSubmit() {
    axiosInstance
      .patch("topics/" + topic.id + "/", prepData())
      .then((results) => {
        console.log(results);
        resetModal(true);
      })
      .catch((error) => console.log(error));
  }

  function reload() {
    return window.location.reload();
  }

  function resetModal(refresh = false) {
    setNewName("");
    setNewDescription("");
    setShow(false);
    if (refresh) reload();
  }

  function handleAddAdmin() {
    setShowUserSearchModal(true);
    resetModal(false);
  }

  function handleCreateBoard() {
    setShowCreateBoardModal(true);
    resetModal();
  }

  return (
    <>
      <Modal animation={false} show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <Modal.Title>
            {topic.name} <em>edit screen</em>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={topic.name}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group style={{ margin: "1rem 0" }}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder={topic.description}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Form.Group>
          </Form>

          <Container
            fluid
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="outline-secondary"
              onClick={handleCreateBoard}
              style={{ padding: "6px 6px" }}
            >
              <p style={{ margin: "0" }}>Add board</p>
            </Button>

            <Button
              variant="outline-secondary"
              onClick={handleAddAdmin}
              style={{ padding: "6px 6px" }}
            >
              <p style={{ margin: "0" }}>Add admin</p>
            </Button>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            variant="outline-dark"
            onClick={resetModal}
            style={{ marginRight: "1rem" }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <UserSearchModal
        show={showUserSearchModal}
        setShow={setShowUserSearchModal}
        topicAPI={props.topicAPI}
        topicDetails={true}
        topicID={topic.id}
      />

      <CreateBoardModal
        fromNewTopic={false}
        show={showCreateBoardModal}
        setShow={setShowCreateBoardModal}
        topicID={topic.id}
      />
    </>
  );
}
