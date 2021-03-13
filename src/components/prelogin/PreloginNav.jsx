import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import logo from "../../static/svg/logo.svg";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

export default function PreLoginNav() {
  const [hideReactLogo, setHideReactLogo] = useState(false);

  function handleLogout() {
    axiosInstance
      .post("users/logout/")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  if (!axiosInstance.defaults.headers.common["Authorization"]) {
    getAndSetToken();
  }

  useEffect(() => {
    if (window.screen.width < 992) {
      setHideReactLogo(true);
    }
  }, []);

  return (
    <>
      <Navbar
        sticky="top"
        variant="dark"
        className="prelogin-nav-outer"
        expand="lg"
      >
        <Container fluid style={{ display: "flex", alignItems: "flex-start" }}>
          <Navbar.Brand>d-Auth</Navbar.Brand>

          <Navbar.Toggle aria-controls="prelogin-nav-collapse" />
          <Navbar.Collapse id="prelogin-nav-collapse">
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/login/">Login</Nav.Link>
              <Nav.Link href="/register/">Register</Nav.Link>
              <Nav.Link href="/main/">Main</Nav.Link>

              <Button variant="dark" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>

        <Navbar.Brand
          style={{ padding: 0, display: hideReactLogo ? "none" : "auto" }}
        >
          <img src={logo} className="App-logo" alt="logo" />
        </Navbar.Brand>
      </Navbar>
    </>
  );
}


