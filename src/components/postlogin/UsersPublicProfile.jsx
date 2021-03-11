import React, { useEffect, useState } from "react";

import "../../static/css/PublicProfile.css";
import "../../static/css/Main.css";

import { Button, Container, Col, Row, Image, Card } from "react-bootstrap";
import { ReactComponent as CheckMarkSVG } from "../../static/svg/check2-circle.svg";
import { ReactComponent as EditPencil } from "../../static/svg/pencil-square.svg";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

import UsersCards from "./card_groups/UsersCards";

import TopicMdCards from "./card_groups/TopicMdCards";
import LeftSidePanel from "./LeftSidePanel";
import RightSidePanel from "./RightSidePanel";
import NavBar from "./NavBar";
import RemoveFriendModal from "./modals/RemoveFriendModal";
import UserSearchConfirmModal from "./modals/UserSearchConfirmModal";

function UsersPublicProfile(props) {
  // const userID = props.userID;
  const currentUsersUsername = props.currentUsersUsername;

  // const getUsersFriends = props.getUsersFriends;
  const showTopicDetails = props.showTopicDetails;
  const setWindowIsShowing = props.setWindowIsShowing;
  const setActiveTopicID = props.setActiveTopicID;

  const [viewingUserID, setViewingUserID] = useState("");
  const [curUserID, setCurUserID] = useState("");
  const [curUserFriends, setCurUserFriends] = useState([]);

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
    setViewingUserID(props.match.params.userID);
  }, []);

  useEffect(() => {
    // Sets the signed in user ID to determine if the page is the users or another users profile.
    axiosInstance
      .get("users/basic_user_details/")
      .then((response) => {
        console.log(response);
        setCurUserID(response.data.pk);
      })
      .catch((error) => console.log(error));
  }, [setCurUserID]);

  useEffect(() => {
    // Retrieves the information for the user who's profile is to be displayed.
    if (viewingUserID) {
      axiosInstance
        .post("/profiles/public/other_user_public_profile/", {
          id: viewingUserID,
        })
        .then((response) => {
          console.log(response);
          setUserDetails(response.data);
          setFriendsList(response.data.friends);
        })
        .catch((error) => console.log(error));
    }
  }, [viewingUserID, setUserDetails, setFriendsList]);

  useEffect(() => {
    // Retrieves the current users friends list to compare to viewing users friends list.
    axiosInstance
      .get("profiles/public/users_friends/")
      .then((response) => {
        console.log(response);
        setCurUserFriends(response.data);
      })
      .catch((error) => console.log(error));
  }, [setCurUserFriends]);

  useEffect(() => {
    // Retrieves the Topics a user is subscribed to
    if (viewingUserID) {
      axiosInstance
        .post("/topics/subscriptions/condensed_topics/", { id: viewingUserID })
        .then((response) => {
          console.log(response);
          setSubscribedTopics(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [viewingUserID, setSubscribedTopics]);

  useEffect(() => {
    // Retrieves the public topics before filtering to get the topics a user has made
    axiosInstance
      // This might be better to do on the backend instead of filtering ALL public topics.
      .get("/topics/public/")
      .then((response) => {
        console.log(response);
        setPublicTopics(response.data);
      })
      .catch((error) => console.log(error));
    // }
  }, [setPublicTopics]);

  function prepUserMadeTopics() {
    // This might be better to do on the backend instead of filtering ALL public topics.
    let topics = publicTopics.filter(
      (x) => x.created_by === userDetails.username
    );
    return topics;
  }

  function handleAddFriend() {
    axiosInstance
      .post("profiles/public/add_friend/", { id: viewingUserID })
      .then((response) => {
        console.log(response);
        setShowUserConfirmModal(true);
      })
      .catch((error) => console.log(error));
  }

  function handleTopicClick(topicID) {
    setActiveTopicID(topicID);
    showTopicDetails();
    setWindowIsShowing(true);
  }

  useEffect(() => {
    // checks whether or not the signed in user is the user who's card/nav. link clicked.
    if (userDetails) {
      if (viewingUserID === curUserID) {
        setActiveWindow("currentUser");
      } else {
        setActiveWindow("otherUser");
      }
    }
  }, [viewingUserID, userDetails]);

  function ButtonChanger() {
    if (activeWindow === "currentUser") {
      // Edit button - only for current user
      return (
        <Button className="orange-primary-btn" onClick={props.editProfile}>
          <EditPencil />
        </Button>
      );
    } else if (friendsList.some((f) => f.user_id === curUserID)) {
      return (
        <p>
          You are friends <CheckMarkSVG />
        </p>
      );
    } else
      return (
        <Button className="orange-primary-btn" onClick={handleAddFriend}>
          Add friend?
        </Button>
      );
  }

  const [getFriends, setGetFriends] = useState(false);

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

                <RemoveFriendModal
                  getUsersFriends={() => setGetFriends(true)}
                  show={showUserManagerModal}
                  setShow={setShowUserManagerModal}
                  friendCardUserID={friendCardUserID}
                />
                <UserSearchConfirmModal
                  show={showUserConfirmModal}
                  hide={() => setShowUserConfirmModal(false)}
                  setGetFriends={setGetFriends}
                />
              </div>
            </Col>
            <RightSidePanel
              setGetFriends={setGetFriends}
              getFriends={getFriends}
            />
          </Row>
        </Container>
      </div>
    </>
  ) : null;
}

export default UsersPublicProfile;
