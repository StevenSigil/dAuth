import React, { useState, useEffect } from "react";

import "../../static/css/PublicTopics.css";
import { Row, Container, Col, Form } from "react-bootstrap";

import axiosInstance from "../../utils/axiosAPI";
import TopicMdCards from "./card_groups/TopicMdCards";
import UsersCards from "./card_groups/UsersCards";
import UserSearchConfirmModal from "./modals/UserSearchConfirmModal";
import NavBar from "./NavBar";
import LeftSidePanel from "./LeftSidePanel";
import RightSidePanel from "./RightSidePanel";
import PublicTopicsAccordian from "./subComponents/PublicTopicsMinorComps";

function PublicTopics(props) {
  // const showTopicDetails = props.showTopicDetails;
  // const setActiveTopicID = props.setActiveTopicID;

  const [publicTopics, setPublicTopics] = useState([]);
  const [topicSearchText, setTopicSearchText] = useState("");
  const [returnedTopicList, setReturnedTopicList] = useState(null);

  function handleTopicSearchChange(text) {
    // Sends a search request to the backend text to filter
    //   for a Topic/Board a users searches for.
    setTopicSearchText(text);
    axiosInstance
      .get("topics/public/?search=" + text)
      .then((response) => setReturnedTopicList(response.data))
      .catch((error) => console.log(error));
  }

  function handleTopicClick(topicID) {
    // Switches the Main(page) to Topic Details
    // setActiveTopicID(topicID);
    // setTopicSearchText("");
    // showTopicDetails();
    setTopicSearchText("");
    window.location = "/topics/" + topicID + "/";
  }

  function resetWindowsToActiveTopic() {
    // Closes this componenet and resets the active topic.
    props.setActiveTopicID("");
    props.getProfileAndTopics();
    props.setHidePublicTopics(true);
  }

  useEffect(() => {
    // Initial topic api call
    axiosInstance
      .get("/topics/public/")
      .then((response) => {
        console.log(response);
        setReturnedTopicList(response.data);
        setPublicTopics(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  // Users portion
  const [userSearchText, setUserSearchText] = useState("");
  const [returnedUsersList, setReturnedUsersList] = useState(null);
  const [showAddFriendConf, setShowAddFriendConf] = useState(false);

  function handleUserSearchChange(text) {
    // TODO: Update the url name for this api request.
    setUserSearchText(text);
    axiosInstance
      .get("users/user-search/?search=" + text)
      .then((response) => setReturnedUsersList(response.data))
      .catch((error) => console.log(error));
  }

  function handleAddFriend(userID) {
    axiosInstance
      .post("profiles/public/add_friend/", { id: userID })
      .then((response) => {
        console.log(response);
        // props.getUsersFriends();
        setShowAddFriendConf(true);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    if (returnedUsersList === null || returnedUsersList === "") {
      axiosInstance
        .get("profiles/usercards/")
        .then((res) => {
          console.log(res);
          setReturnedUsersList(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [returnedUsersList]);

  function handleSubmit(e) {
    e.preventDefault();
    return null;
  }

  return (
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
              <div className="publicTopic-main">
                <Container fluid>
                  <Row
                    noGutters
                    className="publicTopic-cards-mainRow"
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        paddingLeft: "2.5%",
                        paddingRight: "2.5%",
                        width: "100%",
                      }}
                    >
                      <h2>Popular topics</h2>
                      <PublicTopicsAccordian
                        publicTopics={publicTopics}
                        resetWindowsToActiveTopic={resetWindowsToActiveTopic}
                        handleTopicClick={handleTopicClick}
                      />
                    </div>
                  </Row>
                </Container>

                <Container fluid>
                  <Row noGutters>
                    <Col md={12} lg={6}>
                      <div className="area2-outerdiv-pt">
                        <Container
                          fluid
                          className="area2-innerdiv-pt"
                          style={{
                            overflowY: "hidden",
                            maxHeight: "20%",
                            height: "initial",
                            paddingBottom: "1.25rem",
                            paddingTop: 0,
                          }}
                        >
                          <h2>All topics</h2>
                          <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="topic-search">
                              <Form.Control
                                type="text"
                                placeholder="Enter a Topic to search"
                                value={topicSearchText}
                                onChange={(e) =>
                                  handleTopicSearchChange(e.target.value)
                                }
                              />
                            </Form.Group>
                          </Form>
                        </Container>
                        <div className="area2-innerdiv-pt">
                          <TopicMdCards
                            topicsToRender={returnedTopicList}
                            handleTopicClick={handleTopicClick}
                          />
                        </div>
                      </div>
                    </Col>

                    <Col md={12} lg={6}>
                      <div className="area2-outerdiv-pt">
                        <Container
                          fluid
                          className="area2-innerdiv-pt"
                          style={{
                            overflowY: "hidden",
                            maxHeight: "20%",
                            height: "initial",
                            paddingBottom: "1.25rem",
                            paddingTop: 0,
                          }}
                        >
                          <h2>User Search</h2>
                          <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="public-user-search">
                              <Form.Control
                                type="text"
                                placeholder="Enter a name to search"
                                value={userSearchText}
                                onChange={(e) =>
                                  handleUserSearchChange(e.target.value)
                                }
                              />
                            </Form.Group>
                          </Form>
                        </Container>

                        <div className="area2-innerdiv-pt">
                          <UsersCards
                            usersList={returnedUsersList}
                            handleOtherUserClicked={
                              props.handleOtherUserClicked
                            }
                            activeWindow={"PublicTopics"}
                            setFriendCardUserID={handleAddFriend}
                          />
                          <UsersCards
                            usersList={returnedUsersList}
                            handleOtherUserClicked={
                              props.handleOtherUserClicked
                            }
                            activeWindow={"PublicTopics"}
                            setFriendCardUserID={handleAddFriend}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Col>

            <RightSidePanel />
          </Row>
        </Container>
      </div>

      <UserSearchConfirmModal
        show={showAddFriendConf}
        hide={() => setShowAddFriendConf(false)}
      />
    </>
  );
}

export default PublicTopics;
