import React from "react";

import { Nav, Navbar, Container, Button } from "react-bootstrap";
import logo from "../../static/svg/logo.svg";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

function PreLoginNav() {
  function handleLogout() {
    axiosInstance
      .post("users/logout/")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  if (!axiosInstance.defaults.headers.common["Authorization"]) {
    getAndSetToken();
  }

  return (
    <>
      <Navbar
        sticky="top"
        variant="dark"
        className="prelogin-nav-outer"
      >
        <Navbar.Brand>d-Auth</Navbar.Brand>

        <Navbar.Collapse id="prelogin-nav-collapse">
          <Nav>
            <Container fluid>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/login/">Login</Nav.Link>
              <Nav.Link href="/register/">Register</Nav.Link>
              <Nav.Link href="/main/">Main</Nav.Link>

              <Button variant="dark" onClick={handleLogout}>
                Logout
              </Button>
            </Container>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Brand style={{ padding: 0 }}>
          <img src={logo} className="App-logo" alt="logo" />
        </Navbar.Brand>
      </Navbar>
    </>
  );
}

export default PreLoginNav;
