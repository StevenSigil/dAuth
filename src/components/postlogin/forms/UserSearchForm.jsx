import React from "react";
import { Form } from "react-bootstrap";

export default function UserSearchForm(props) {
  const handleChange = props.handleChange;
  const searchText = props.searchText;

  return (
    <Form>
      <Form.Group controlId="user-search">
        <Form.Label>Enter a username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a username to search"
          value={searchText}
          onChange={(e) => handleChange(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
}
