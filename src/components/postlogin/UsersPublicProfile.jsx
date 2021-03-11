import React, { useEffect, useState } from "react";

import "../../static/css/PublicProfile.css";
import "../../static/css/Main.css";

import { Button, Container, Col, Row, Image, Card } from "react-bootstrap";
import { ReactComponent as CheckMarkSVG } from "../../static/svg/check2-circle.svg";
import { ReactComponent as EditPencil } from "../../static/svg/pencil-square.svg";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

import UsersCards from "./card_groups/UsersCards";
// import RemoveFriendModal from "../modals/RemoveFriendModal";
import TopicMdCards from "./card_groups/TopicMdCards";
import LeftSidePanel from "./LeftSidePanel";
import RightSidePanel from "./RightSidePanel";
import NavBar from "./NavBar";
// import UserSearchConfirmModal from "../modals/UserSearchConfirmModal";

function UsersPublicProfile(props) {
  // const userID = props.userID;
  const currentUsersUsername = props.currentUsersUsername;

  const getUsersFriends = props.getUsersFriends;
  const showTopicDetails = props.showTopicDetails;
  const setWindowIsShowing = props.setWindowIsShowing;
  const setActiveTopicID = props.setActiveTopicID;

  const [userID, setUserID] = useState("");

  const [userDetails, setUserDetails] = useState(null);
  const [activeWindow, setActiveWindow] = useState("otherUser");

  const [friendsList, setFriendsList] = useState([]); // Assumes origin from 'profile_condensed_serializer'
  const [friendCardUserID, setFriendCardUserID] = useState("");

  const [publicTopics, setPublicTopics] = useState([]);
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  const [showUserConfirmModal, setShowUserConfirmModal] = useState(false);
  const [showUserManagerModal, setShowUserManagerModal] = useState(false);
getAndSetToken();
  useEffect(() => {
    
    axiosInstance
      .get("users/basic_user_details/")
      .then((response) => {
        console.log(response);
        setUserID(response.data.pk);
      })
      .catch((error) => console.log(error));

    // Retrieves the information for the user who's profile is to be displayed.
    // if (userID !== "") {
    axiosInstance
      .post("/profiles/public/other_user_public_profile/", { id: userID })
      .then((response) => {
        console.log(response);
        setUserDetails(response.data);
        setFriendsList(response.data.friends);
      })
      .catch((error) => console.log(error));

    axiosInstance
      .post("/topics/subscriptions/condensed_topics/", { id: userID })
      .then((response) => {
        console.log(response);
        setSubscribedTopics(response.data);
      })
      .catch((error) => console.log(error));

    axiosInstance
      // This might be better to do on the backend instead of filtering ALL public topics.
      .get("/topics/public/")
      .then((response) => {
        console.log(response);
        setPublicTopics(response.data);
      })
      .catch((error) => console.log(error));
    // }
  }, [userID, getUsersFriends]);

  function prepUserMadeTopics() {
    // This might be better to do on the backend instead of filtering ALL public topics.
    let topics = publicTopics.filter(
      (x) => x.created_by === userDetails.username
    );
    return topics;
  }

  function handleAddFriend() {
    axiosInstance
      .post("profiles/public/add_friend/", { id: userID })
      .then((response) => {
        console.log(response);
        getUsersFriends();
        setShowUserConfirmModal(true);
      })
      .catch((error) => console.log(error));
  }

  function handleTopicClick(topicID) {
    setActiveTopicID(topicID);
    showTopicDetails();
    setWindowIsShowing(true);
  }

  // checks whether or not the signed in user is the user who's card/nav. link clicked.
  useEffect(() => {
    if (userDetails) {
      if (currentUsersUsername === userDetails.username) {
        setActiveWindow("currentUser");
      } else {
        setActiveWindow("otherUser");
      }
    }
  }, [currentUsersUsername, userDetails]);

  function ButtonChanger() {
    if (activeWindow === "currentUser") {
      return (
        <Button className="orange-primary-btn" onClick={props.editProfile}>
          <EditPencil />
        </Button>
      );
    } else if (friendsList.some((f) => f.username === currentUsersUsername))
      return (
        <p>
          You are friends <CheckMarkSVG />
        </p>
      );
    else
      return (
        <Button className="orange-primary-btn" onClick={handleAddFriend}>
          Add friend?
        </Button>
      );
  }

  return userDetails ? (
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
              <div className="publicProfile-main">
                <Container fluid>
                  <Row noGutters>
                    <Col lg={4} md={12}>
                      <div className="row2-outer-div-pp">
                        <div className="row2-innerdiv-pp img-container ">
                          <Card className="cardColor2" style={{ border: 0 }}>
                            <Card.Header>
                              <Image
                                src={userDetails.image}
                                roundedCircle
                                className="profile-image"
                              />
                            </Card.Header>
                          </Card>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={12}>
                      <div className="row2-outer-div-pp">
                        <div
                          className="row2-innerdiv-pp"
                          style={{ width: "100%" }}
                        >
                          <Row
                            noGutters
                            className="profile-user-title-container"
                          >
                            <h1>{userDetails.display_name}</h1>
                          </Row>
                          <Row
                            noGutters
                            className="profile-user-info-container"
                          >
                            <Col>
                              <Row noGutters>
                                {"-->"} {userDetails.username} {"<--"}
                              </Row>
                              <Row noGutters>
                                instagram: {userDetails.instagram_handle}
                              </Row>
                              <Row noGutters>
                                Twitter: {userDetails.twitter_handle}
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={12}>
                      <div
                        className="row2-outer-div-pp"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="row2-innerdiv-pp"
                          style={{ width: "100%" }}
                        >
                          <div
                            className="inner-map-centered-cards"
                            style={{ height: "100%" }}
                          >
                            <Card
                              className="cardColor2"
                              style={{ height: "100%", border: 0 }}
                            >
                              <Card.Header
                                className="lg-card-header"
                                style={{ margin: 0 }}
                              >
                                <Row noGutters>
                                  <Col xs={7} className="my-auto">
                                    <Card.Title
                                      as="h2"
                                      style={{
                                        textAlign: "start",
                                        paddingLeft: "2px",
                                      }}
                                    >
                                      Bio
                                    </Card.Title>
                                  </Col>

                                  <Col xs={5} className="my-auto button-p-col">
                                    <ButtonChanger />
                                  </Col>
                                </Row>
                              </Card.Header>
                              <Card.Body>
                                <Card.Text>{userDetails.bio}</Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>

                <Container fluid>
                  <Row style={{ marginTop: "2rem" }}>
                    <Col lg={4} md={12}>
                      <div className="row2-outer-div-pp">
                        <h2>{userDetails.display_name} 's friends.</h2>

                        <div className="row2-innerdiv-pp">
                          {friendsList.length > 0 ? (
                            <UsersCards
                              handleOtherUserClicked={
                                props.handleOtherUserClicked
                              }
                              usersList={friendsList}
                              activeWindow={activeWindow}
                              setShowUserManagerModal={setShowUserManagerModal}
                              setFriendCardUserID={setFriendCardUserID}
                            />
                          ) : null}
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={12}>
                      <div className="row2-outer-div-pp">
                        <h2>Topics made</h2>

                        <div className="row2-innerdiv-pp">
                          <TopicMdCards
                            topicsToRender={prepUserMadeTopics()}
                            handleTopicClick={handleTopicClick}
                          />
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={12}>
                      <div className="row2-outer-div-pp">
                        <h2>Topics Subscribed</h2>
                        <div className="row2-innerdiv-pp">
                          <TopicMdCards
                            topicsToRender={subscribedTopics}
                            handleTopicClick={handleTopicClick}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>

                {/* <RemoveFriendModal
        getUsersFriends={getUsersFriends}
        show={showUserManagerModal}
        setShow={setShowUserManagerModal}
        friendCardUserID={friendCardUserID}
      /> */}
                {/* <UserSearchConfirmModal
        show={showUserConfirmModal}
        hide={() => setShowUserConfirmModal(false)}
      /> */}
              </div>
            </Col>
            <RightSidePanel />
          </Row>
        </Container>
      </div>
    </>
  ) : null;
}

export default UsersPublicProfile;
