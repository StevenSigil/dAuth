import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import NavBar from "./NavBar";
import LeftSidePanel from "./LeftSidePanel";
import RightSidePanel from './RightSidePanel'

import "../../static/css/Main.css";
import { getAndSetToken } from "../../utils/axiosAPI";

export default function Main() {
  getAndSetToken();
  
  return (
    <>
      <NavBar />

      <div>
        <Container fluid style={{ padding: 0 }}>
          <Row noGutters className="d-flex">
            <LeftSidePanel
            // user={user}
            // topics={topics} // used to control useEffect hook
            // activeTopicID={activeTopicID}
            // showPosts={showPosts}
            // setActiveBoard={setActiveBoard}
            // setActiveTopicID={setActiveTopicID}
            // getProfileAndTopics={getProfileAndTopics}
            // showTopicDetails={showTopicDetails}
            />

            <Col className="middle-main">
              <h1 className="temp-lg-text">Landing Page</h1>
            </Col>

            <RightSidePanel
              // activeTopicID={activeTopicID}
              // usersFriends={usersFriends}
              // getProfileAndTopics={getProfileAndTopics}
              // handleOtherUserClicked={handleOtherUserClicked}
            />
          </Row>
        </Container>
      </div>
    </>
  );
}
