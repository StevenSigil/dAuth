import React, { useState } from "react";
import axiosInstance, {
  checkForToken,
  getAndSetToken,
} from "../../utils/axiosAPI";
import { Form, Button } from "react-bootstrap";

function Login(props) {
  if (props.id) {
    console.log(props.id);
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    axiosInstance
      .post("users/login/", { email, password }, { with_credentials: true })
      .then((response) => {
        console.log(response);

        var token = response.data.auth_token;
        sessionStorage.setItem("Token", token);
        if (response.status === 200) {
          getAndSetToken();
          if (checkForToken) {
            window.location = "/main"; // CHANGE TO MAIN WHEN SET
          }
        } else {
          setEmail("");
          setPassword("");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="authform-outer">
      <div className="loginform-inner authform-inner">
        <h2>Please sign in</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              autoComplete="current-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            type="submit"
            onClick={handleSubmit}
            className="orange-primary-btn"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
