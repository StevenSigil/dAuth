import React, { useState, useEffect } from "react";

import "../../static/css/TopicDetails.css";
import "../../static/css/Main.css";
import { Col, Row, Container, Card, Button } from "react-bootstrap";
import { ReactComponent as EditPencil } from "../../static/svg/pencil-square.svg";
import { ReactComponent as CheckCircle } from "../../static/svg/check2-circle.svg";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

import NavBar from './NavBar'
import UsersCards from "./card_groups/UsersCards";
import BoardsCards from "./card_groups/BoardsCards";
import LeftSidePanel from "./LeftSidePanel";
import RightSidePanel from "./RightSidePanel";
// import EditTopicModal from "../modals/EditTopicModal";
// import UserSearchModal from "../modals/UserSearchModal";
// import SubscribeToTopicModal from "../modals/SubscribeToTopicModal";
// import UnsubscribeTopicModal from "../modals/UnsubscribeTopicModal";

function TopicDetails(props) {
  const user_id = props.user_id;
  const activeTopicID = props.activeTopicID;

  const hideTopicDetails = props.hideTopicDetails;
  const setHideTopicDetails = props.setHideTopicDetails;

  const getTopicForWindow = props.getTopicForWindow;
  const setGetTopicForWindow = props.setGetTopicForWindow;
  const handleOtherUserClicked = props.handleOtherUserClicked;

  const [topic, setTopic] = useState(null);
  const [boards, setBoards] = useState(null);

  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

  const [topicID, setTopicID] = useState(props.match.params.id);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    getAndSetToken();
    axiosInstance
      .get("users/basic_user_details/")
      .then(response => {
        console.log(response);
        setUserID(response.data.pk);
      })
      .catch(error => console.log(error))
  }, [])

  

  function checkIfUserIsAdmin(lTopic) {
    // Return true if the current user is in the 'topic_admins'
    let admins = lTopic.topic_admins;
    let result = admins.some((x) => x.user_id === userID);
    return result;
  }
  function checkIfUserIsSubscribed(lTopic) {
    // Return true if the current user is in 'users_subscribed'
    let usersSubscribed = lTopic.users_subscribed;
    return usersSubscribed.some((x) => x.user_id === userID);
  }

  function subscribeToTopic() {
    // Handles a user pressing the subscribe button.
    axiosInstance
      .post("topics/subscriptions/new_subscriber/", { id: topicID })
      .then((response) => {
        console.log(response);
        setShowSubscribeModal(true);
        topicAPI();
        props.getProfileAndTopics(true);
      })
      .catch((error) => console.log(error));
  }

  function topicAPI() {
    // Gets the topic information to be rendered.
    axiosInstance
      .get("topics/SingleTopicBoardsUsersView/" + topicID + "/")
      .then((response) => {
        console.log(response);
        setTopic(response.data);
      })
      .catch((error) => console.log(error));
  }

  //   useEffect(() => {
  //     if (activeTopicID === "") return () => resetWindow();
  //   });

  useEffect(() => {
    // 'topicAPI()' then gets boards on topic -> on render and on user defined changes
    axiosInstance
      .get("topics/SingleTopicBoardsUsersView/" + topicID + "/")
      .then((response) => {
        console.log(response);
        setTopic(response.data);
      })
      .catch((error) => console.log(error));

    axiosInstance
      .get("topics/boards-condensed/" + topicID + "/")
      .then((response) => {
        console.log(response);
        setBoards(response.data.boards);
      })
      .catch((error) => console.log(error));
  }, [getTopicForWindow, setGetTopicForWindow, activeTopicID]);

  function getDateCreated(dateTime) {
    // Formats the dateTime of the topic
    let dt = new Date(dateTime);
    return dt.toDateString();
  }

  // function resetWindow() {
  //   // Resets and closes this componenet(window).
  //   setShowEditTopicModal(false);
  //   setShowSubscribeModal(false);
  //   setShowUnsubscribeModal(false);
  //   setTopic(null);
  //   setHideTopicDetails(!hideTopicDetails);
  // }

  function SubscribeButton() {
    // Componenet for the subscribe button depending on if the
    //   user is subscribed to the topic or not.
    if (checkIfUserIsSubscribed(topic)) {
      return (
        <Button
          onClick={() => setShowUnsubscribeModal(true)}
          className="orange-primary-btn"
        >
          <CheckCircle style={{ color: "#ffc107" }} />{" "}
          <p style={{ margin: "0 5px" }}>Subscribed</p>
        </Button>
      );
    } else {
      return (
        <Button onClick={subscribeToTopic} className="orange-primary-btn">
          Subscribe?
        </Button>
      );
    }
  }

  return topic ? (
    <>
      <NavBar />

      <div>
        <Container fluid style={{ padding: 0 }}>
          <Row noGutters className="d-flex">
            <LeftSidePanel />

            <Col
              xs={{ span: 12 }}
              xl={{ order: 1, span: 8 }}
              className="d-table-row middle-main mx-auto"
            >
              <Container fluid>
                <Row style={{ paddingBottom: "2rem" }}>
                  <Col md={2} className="editButton-col-td">
                    <div style={{ width: "100%" }}>
                      <Button
                        hidden={!checkIfUserIsAdmin(topic)}
                        onClick={() => setShowEditTopicModal(true)}
                        className="orange-primary-btn"
                      >
                        <EditPencil />{" "}
                        <p style={{ margin: "0 5px" }}>Edit topic</p>
                      </Button>
                    </div>
                  </Col>

                  <Col md={8}>
                    <div className="top-heading">
                      <h1> {topic.name} </h1>
                      <h4>
                        <em> {topic.description} </em>
                      </h4>
                    </div>
                  </Col>

                  <Col md={2} className="editButton-col-td">
                    <SubscribeButton />
                  </Col>
                </Row>

                <Row>
                  <Col md={4} style={{ padding: 0 }}>
                    <div className="boards-outerdiv-td">
                      <h2>Info</h2>
                      <div
                        className="boards-innerdiv-td3"
                        style={{ paddingTop: "0.5rem" }}
                      >
                        <div className="UsersCards-outer-div">
                          <h4>General info</h4>
                          <Card className="cardColor2">
                            <Card.Header>
                              <Card.Text>
                                Active since{" "}
                                <em>
                                  {" "}
                                  {getDateCreated(topic.date_time_created)}{" "}
                                </em>
                              </Card.Text>
                            </Card.Header>
                            <Card.Header>
                              <Card.Text>
                                Created by <em>{topic.created_by}</em>
                              </Card.Text>
                            </Card.Header>
                          </Card>
                        </div>
                        <Row
                          noGutters
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "1rem auto",
                          }}
                        >
                          <h4>Topic admins</h4>
                        </Row>
                        <UsersCards
                          usersList={topic.topic_admins}
                          handleOtherUserClicked={handleOtherUserClicked}
                          activeWindow="TopicDeatils"
                        />
                      </div>
                    </div>
                  </Col>

                  <Col md={4} style={{ padding: 0 }}>
                    <div className="boards-outerdiv-td">
                      <h2>Users on topic</h2>
                      <div className="boards-innerdiv-td3">
                        <UsersCards
                          usersList={topic.users_subscribed}
                          handleOtherUserClicked={handleOtherUserClicked}
                          activeWindow="TopicDeatils"
                        />
                      </div>
                    </div>
                  </Col>

                  <Col md={4} style={{ padding: 0 }}>
                    <div className="boards-outerdiv-td">
                      <h2>Boards on topic</h2>
                      <div className="boards-innerdiv-td3">
                        <BoardsCards
                          topicID={topic.id}
                          showPosts={props.showPosts}
                          isHidden={props.hidePublicTopicDetails}
                          setActiveBoard={props.setActiveBoard}
                          checkIfUserIsAdmin={() => checkIfUserIsAdmin(topic)}
                          topicAPI={topicAPI}
                          boards={boards}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>

              {/* <SubscribeToTopicModal
        show={showSubscribeModal}
        setShow={setShowSubscribeModal}
      /> */}

              {/* <EditTopicModal
        topic={topic}
        show={showEditTopicModal}
        setShow={setShowEditTopicModal}
        topicAPI={topicAPI}
        topicID={topic.id} // Users search modal props
        handleOtherUserClicked={handleOtherUserClicked}
        setGetTopicForWindow={setGetTopicForWindow}
        getProfileAndTopics={props.getProfileAndTopics}
      /> */}
              {/* 
      <UnsubscribeTopicModal
        activeTopicID={topic.id}
        show={showUnsubscribeModal}
        setShow={setShowUnsubscribeModal}
        resetUserDetailsForm={resetWindow}
        userIsAdmin={() => checkIfUserIsAdmin(topic)}
        getProfileAndTopics={props.getProfileAndTopics}
      /> */}

              {/* <UserSearchModal
        topicID={topic.id}
        topicDetails={true}
        topicAPI={topicAPI}
        show={showUserSearchModal}
        setShow={setShowUserSearchModal}
        handleOtherUserClicked={handleOtherUserClicked}
      /> */}
            </Col>

            <RightSidePanel />
          </Row>
        </Container>
      </div>
    </>
  ) : null;
}

export default TopicDetails;
