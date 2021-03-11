import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import axiosInstance from "../../../utils/axiosAPI";
import CreateBoardModal from "./CreateBoardModal";

function CreateTopicModal(props) {
  const show = props.show;
  const setShow = props.setShow;

  // Topic form data
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [topicID, setTopicID] = useState("");
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  function handleSubmit() {
    axiosInstance
      .post("topics/", { name: newName, description: newDescription })
      .then((response) => {
        console.log("Form Submission:\n", response);
        setTopicID(response.data.id);
      })
      .catch((error) =>
        console.log("CREATE-TOPIC: Error submitting form: ", error)
      );
    resetModal();
    setShowCreateBoardModal(true);
  }

  function resetModal() {
    setNewName("");
    setNewDescription("");
    setShow(false);
  }

  return (
    <>
      <Modal show={show} onHide={resetModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new topic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form xs={12}>
            <Form.Group controlId="NewTopic-Name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="NewTopic-Description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="outline-dark" onClick={resetModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <CreateBoardModal
        topicID={topicID}
        show={showCreateBoardModal}
        setShow={setShowCreateBoardModal}
      />
    </>
  );
}

export default CreateTopicModal;
