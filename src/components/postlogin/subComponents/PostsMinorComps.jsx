import React, { useState } from "react";
import { Button, Row, Col, Image } from "react-bootstrap";

import axiosInstance from "../../../utils/axiosAPI";

import SubscribeToTopicModal from "../modals/SubscribeToTopicModal";

import "../../../static/css/Posts.css";

// This is a file for minor components that are used in the 'Post' component (Posts.jsx)

export function CurrentUserPost(props) {
  const userID = props.userID;
  const displayName = props.displayName;
  const userImage = props.userImage;
  const dateTime = props.dateTime;
  const message = props.message;
  const handleOtherUserClicked = props.handleOtherUserClicked;

  var rawDate = new Date(dateTime);
  rawDate = rawDate.toDateString() + " | " + rawDate.toLocaleTimeString();

  return (
    <Row noGutters className="singlePost-mainRow-currentUser">
      <Col xs={7} sm={11} className="posts-postCol-currentUser">
        <div className="postHeader-currentUser">
          <Row noGutters>
            <p>{displayName}</p>
          </Row>
          <Row noGutters>
            <small>
              <em>{rawDate}</em>
            </small>
          </Row>
        </div>

        <Row className="postMessage-row-currentUser" noGutters>
          <p>{message}</p>
        </Row>
      </Col>

      <Col xs={2} sm={1} className="posts-imageCol">
        <Image
          src={userImage}
          alt={displayName + " image"}
          onClick={() => handleOtherUserClicked(userID)}
          roundedCircle
        />
      </Col>
    </Row>
  );
}

export function OtherUserPost(props) {
  const userID = props.userID;
  const displayName = props.displayName;
  const userImage = props.userImage;
  const dateTime = props.dateTime;
  const message = props.message;
  const handleOtherUserClicked = props.handleOtherUserClicked;

  var rawDate = new Date(dateTime);
  rawDate = rawDate.toDateString() + " | " + rawDate.toLocaleTimeString();

  return (
    <Row noGutters className="singlePost-mainRow-otherUser">
      <Col xs={2} sm={1} className="posts-imageCol">
        <Image
          src={userImage}
          alt={displayName + " image"}
          onClick={() => handleOtherUserClicked(userID)}
          roundedCircle
        />
      </Col>

      <Col xs={7} sm={11} className="posts-postCol-otherUser">
        <div className="postHeader-otherUser">
          <Row noGutters>
            <p>{displayName}</p>
          </Row>
          <Row noGutters>
            <small>
              <em>{rawDate}</em>
            </small>
          </Row>
        </div>

        <Row noGutters className="postMessage-row-otherUser">
          <p>{message}</p>
        </Row>
      </Col>
    </Row>
  );
}

export function UserNotSubscribedAltView(props) {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  function subscribeToTopic() {
    // If the user is not subscribed, clicking the 'Subscribe' button execute
    axiosInstance
      .post("topics/subscriptions/new_subscriber/", { id: props.topicID })
      .then((response) => {
        console.log(response);
        setShowSubscribeModal(true);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="userNotSubscribed-div">
      <h3>You must be subscribed to view this board's posts.</h3>
      <Button
        onClick={subscribeToTopic}
        style={{ backgroundColor: "transparent" }}
        className="orange-primary-btn"
      >
        Subscribe?
      </Button>

      <SubscribeToTopicModal
        show={showSubscribeModal}
        setShow={setShowSubscribeModal}
      />
    </div>
  );
}
