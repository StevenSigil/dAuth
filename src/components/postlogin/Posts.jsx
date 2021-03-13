import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";

import "../../static/css/Posts.css";
import { ReactComponent as RefreshIcon } from "../../static/svg/arrow-clockwise.svg";
import { ReactComponent as SendIcon } from "../../static/svg/box-arrow-in-up-right.svg";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

import NavBar from "./NavBar";
import LeftSidePanel from "./LeftSidePanel";
import RightSidePanel from "./RightSidePanel";

// import SubscribeToTopicModal from "./modals/SubscribeToTopicModal";

import {
  CurrentUserPost,
  OtherUserPost,
  UserNotSubscribedAltView,
} from "./subComponents/PostsMinorComps";

export default function Posts(props) {
  const boardID = props.match.params.boardID;
  const [boardDetails, setBoardDetails] = useState(null);

  const [postsList, setPostsList] = useState([]);
  const [userCanView, setUserCanView] = useState(false); // Change back to false
  const [user, setUser] = useState(null);
  // const [usersSubscriptions, setUsersSubscriptions] = useState([]);

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    getAndSetToken();
    axiosInstance
      .get("users/basic_user_details/")
      .then((response) => {
        console.log(response);
        setUser(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (boardDetails) {
      axiosInstance
        .get("/profiles/public/profile_topics/")
        .then((response) => {
          console.log(response);
          setUserCanView(
            response.data.topics_subscribed_to.some(
              (topic) => topic.id === boardDetails.assoc_channel
            )
          );
        })
        .catch((error) =>
          console.log("Error retrieving the User's Topics.\n", error)
        );
    }
  }, [setUserCanView, boardDetails]);

  useEffect(() => {
    axiosInstance
      .get("boards/retrieve-boards/" + boardID + "/")
      .then((response) => {
        console.log(response);
        setBoardDetails(response.data);
        setPostsList(response.data.posts);
      })
      .catch((error) => console.log(error));
  }, [boardID]);

  function refreshPosts(boardId) {
    axiosInstance
      .get("boards/retrieve-boards/" + boardId + "/")
      .then((response) => {
        console.log(response);
        setBoardDetails(response.data);
        setPostsList(response.data.posts);
      })
      .catch((error) => console.log(error));
  }

  function sendPost(e) {
    e.preventDefault();

    if (inputText !== "" && boardDetails) {
      axiosInstance
        .post("boards/posts2/", {
          message: inputText,
          board: [boardDetails.id],
        })
        .then((response) => {
          console.log("MESSAGE SUBMISSION:\n", response);
          if (response.status === 201) {
            setInputText("");
            refreshPosts(boardDetails.id);
          }
        })
        .catch((error) => console.log(error));
    }
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
              {boardDetails ? (
                <div className="postsMain">
                  <Row noGutters>
                    <Container fluid className="postWindow-heading">
                      <h1>{boardDetails.board_name}</h1>
                    </Container>
                  </Row>

                  <Row noGutters>
                    <Container fluid className="row2-outercontainer-posts">
                      {postsList && userCanView ? (
                        postsList.map((post) => {
                          if (post.posting_user.username === user.username) {
                            return (
                              <div key={post.id}>
                                <CurrentUserPost
                                  userID={post.posting_user.user_id}
                                  displayName={post.posting_user.display_name}
                                  userImage={post.posting_user.image}
                                  dateTime={post.date_time_created}
                                  message={post.message}
                                  // Click on picture -> go to profile
                                />
                              </div>
                            );
                          } else {
                            return (
                              <div key={post.id}>
                                <OtherUserPost
                                  key={post.id}
                                  userID={post.posting_user.user_id}
                                  displayName={post.posting_user.display_name}
                                  dateTime={post.date_time_created}
                                  userImage={post.posting_user.image}
                                  message={post.message}
                                  // Click on picture -> go to profile
                                />
                              </div>
                            );
                          }
                        })
                      ) : (
                        <UserNotSubscribedAltView
                          topicID={boardDetails.assoc_channel}
                        />
                      )}
                    </Container>
                  </Row>

                  <Row noGutters className="postSubmitRow">
                    {userCanView ? (
                      <>
                        <Col xs={0} md={1}>
                          {/* Future button implimentations */}
                        </Col>
                        <Col
                          xs={3}
                          sm={2}
                          style={{ justifyContent: "flex-end" }}
                        >
                          <Button
                            className="orange-primary-btn"
                            onClick={() => refreshPosts(boardID)}
                          >
                            <RefreshIcon />
                          </Button>
                        </Col>

                        <Col
                          xs={6}
                          sm={8}
                          md={6}
                          style={{ justifyContent: "center" }}
                        >
                          <FormControl
                            placeholder="Share a message"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                          />
                        </Col>

                        <Col
                          xs={3}
                          sm={2}
                          style={{ justifyContent: "flex-start" }}
                        >
                          <Button
                            className="orange-primary-btn"
                            onClick={sendPost}
                          >
                            <SendIcon />
                          </Button>
                        </Col>
                        <Col xs={0} md={1}>
                          {/* Future button implimentations */}
                        </Col>
                      </>
                    ) : null}
                  </Row>
                </div>
              ) : null}
            </Col>

            <RightSidePanel />
          </Row>
        </Container>
      </div>
    </>
  );
}
