import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import NavBar from './NavBar';

import "../../static/css/Main.css";

export default function Main() {
  return (
    <>
      <NavBar />
      <h1 className="temp-lg-text">Landing Page</h1>

      {/* <div>
        <Container fluid style={{ padding: 0 }}>
          <Row noGutters className="d-flex">
            <Col
              xs={{ span: 0, offset: 0, order: 0 }}
              xl={{ order: 1, span: 2 }}
              className="d-none d-xl-table-row LeftNavColumn"
            >
              <LeftSidePanel
                user={user}
                topics={topics} // used to control useEffect hook
                activeTopicID={activeTopicID}
                showPosts={showPosts}
                setActiveBoard={setActiveBoard}
                setActiveTopicID={setActiveTopicID}
                getProfileAndTopics={getProfileAndTopics}
                showTopicDetails={showTopicDetails}
              />
            </Col>
          </Row>
        </Container>
      </div> */}
    </>
  );
}
