import React from "react";
import { Form } from "react-bootstrap";

export default function EditProfileForm(props) {
  const inputData = props.inputData;
  const newData = props.newData;
  const setNewData = props.setNewData;

  function handleChange(e) {
    const { value, name } = e.target;
    setNewData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  return (
    <>
      <Form id="edit-profile-form">
        <Form.Group controlId="editProfile-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder={inputData.email}
            value={newData.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Display name</Form.Label>
          <Form.Control
            hidden={false}
            type="text"
            name="display_name"
            placeholder={inputData.display_name}
            value={newData.display_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Bio</Form.Label>
          <Form.Control
            hidden={false}
            type="text"
            name="bio"
            placeholder={inputData.bio}
            value={newData.bio}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Instagram handle</Form.Label>
          <Form.Control
            hidden={false}
            type="text"
            name="instagram_handle"
            placeholder={inputData.instagram_handle}
            value={newData.instagram_handle}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Twitter handle</Form.Label>
          <Form.Control
            hidden={false}
            type="text"
            name="twitter_handle"
            placeholder={inputData.twitter_handle}
            value={newData.twitter_handle}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
    </>
  );
}
