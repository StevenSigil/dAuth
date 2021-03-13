import React, { useState } from "react";
import axiosInstance from "../../utils/axiosAPI";
import { Form, Button, Col, Row } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const data = {
      username: username,
      display_name: displayName,
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name,
    };

    axiosInstance
      .post("users/register/", data)
      .then((response) => {
        if (response.status === 201) performLogin(data);
      })
      .catch((error) => console.log(error));
  }

  function performLogin(loginData) {
    const email = loginData.email;
    const password = loginData.password;

    axiosInstance
      .post("users/login/", { email, password })
      .then((response) => {
        console.log(response);
        var token = response.data.auth_token;
        sessionStorage.setItem("Token", token);
        axiosInstance.defaults.headers.common["Authorization"] =
          "Token " + token;

        if (response.status === 200) {
          window.location = "/main/";
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="authform-outer">
      <div className="authform-inner register-form">
        <h2>Register to join</h2>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Col} md={6} controlId="formGroupUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                autoComplete="new-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Text>Can't be changed</Form.Text>
              {/* {signupError.username ? signupError.username : null} */}
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="formGroupDisplayName">
              <Form.Label>Display name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Display name"
                autoComplete="new-display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              {/* {signupError.displayName ? signupError.displayName : null} */}
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} md={6} controlId="formGroupFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                autoComplete="new-first-name"
                value={first_name}
                onChange={(e) => setfirst_name(e.target.value)}
              />
              {/* {signupError.password ? signupError.password : null} */}
            </Form.Group>

            <Form.Group as={Col} md={6} controlId="formGroupLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                autoComplete="new-last-name"
                value={last_name}
                onChange={(e) => setlast_name(e.target.value)}
              />
              {/* {signupError.password ? signupError.password : null} */}
            </Form.Group>
          </Row>

          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              autoComplete="new-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* {signupError.email ? signupError.email : null} */}
          </Form.Group>

          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            {/* {signupError.password ? signupError.password : null} */}
          </Form.Group>

          <Button type="submit" className="orange-primary-btn">
            Submit
          </Button>

          {/* <h1>{signupError.unique ? signupError.unique : null}</h1> */}
        </Form>
      </div>
    </div>
  );
}
export default Register;
