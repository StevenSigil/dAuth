import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../../static/css/Main.css";

import { getAndSetToken } from "../../utils/axiosAPI";

import NavBar from "./NavBar";
import LeftSidePanel from "./LeftSidePanel";
import RightSidePanel from "./RightSidePanel";

export default function Main() {
  getAndSetToken();

  return (
    <>
      <NavBar />

      <div>
        <Container fluid style={{ padding: 0 }}>
          <Row noGutters className="d-flex">
            <LeftSidePanel />

            <Col className="middle-main">
              <h1 className="temp-lg-text">Landing Page</h1>
            </Col>

            <RightSidePanel />
          </Row>
        </Container>
      </div>
    </>
  );
}
