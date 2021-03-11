import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";

import "../../static/css/Posts.css";
import { ReactComponent as RefreshIcon } from "../../static/svg/arrow-clockwise.svg";
import { ReactComponent as SendIcon } from "../../static/svg/box-arrow-in-up-right.svg";

import axiosInstance from "../../utils/axiosAPI";

import NavBar from "./NavBar";
import LeftSidePanel from "./LeftSidePanel";
// import SubscribeToTopicModal from "./modals/SubscribeToTopicModal";

// import {
//   CurrentUserPost,
//   OtherUserPost,
//   UserNotSubscribedAltView,
// } from "./subComponents/PostsMinorComps";

function Posts(props) {
  const activeBoardID = props.activeBoardID;
  const username = props.username;
  // const getPostsForWindow = props.getPostsForWindow;
  // const setGetPostsForWindow = props.setGetPostsForWindow;

  const [board, setBoard] = useState(null);
  const [postsList, setPostsList] = useState([]);

  const [usersOnTopic, setUsersOnTopic] = useState(null);
  const [userCanView, setUserCanView] = useState(false);
  const [inputText, setInputText] = useState("");
  const [topicID, setTopicID] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const [getPostsForWindow, setGetPostsForWindow] = useState(true);
  const [boardName, setBoardName] = useState("");
  const boardID = props.match.params.boardID;

  function getUsersOnTopic(IdTopic) {
    // Gets the users on the topic to allow for the
    //   user to view or asked to subscribe.
    axiosInstance
      .post("topics/subscriptions/other_users_on_topic/", { id: IdTopic })
      .then((response) => {
        console.log(response);
        setUsersOnTopic(response.data.users_on_topic);
      })
      .catch((error) => console.log(error));
  }

  const [initData, setInitData] = useState({
    assoc_channel: "",
    board_description: "",
    board_name: "",
    created_by: "",
    date_created: '',
    id: '',
    posts: [],
  });

  function postsHelper(boardID) {
    // Get's the posts to be rendered on screen.
    // Then activated other functions to finish render.
    if (boardID) {
      axiosInstance
        .get("boards/retrieve-boards/" + boardID + "/")
        .then((response) => {
          console.log("PostsHelper has been activated.\n", response);
          setInitData(response.data);
          // setPostsList(response.data.posts);
          // setBoardName(response.data.board_name);
          // getUsersOnTopic(response.data.assoc_channel);
          // setTopicID(response.data.assoc_channel);
        })
        .catch((error) => {
          console.log("ERROR Retrieving Posts\n", error);
          setPostsList([]);
        });
    }
    setGetPostsForWindow(false);
  }

  useEffect(() => {
    axiosInstance
        .get("boards/retrieve-boards/" + boardID + "/")
        .then((response) => {
          console.log("PostsHelper has been activated.\n", response);
          setInitData(response.data);
        })
        .catch((error) => {
          console.log("ERROR Retrieving Posts\n", error);
        });
  }, [setInitData])

  

  function sendPost(e) {
    // Sends the post to backend API
    e.preventDefault();
    if (inputText !== "" && board) {
      axiosInstance
        .post("boards/posts2/", { message: inputText, board: [boardID] })
        .then((response) => {
          console.log("MESSAGE SUBMITION: Response:\n", response);
          if (response.status === 201) {
            setInputText("");
            postsHelper(boardID);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  useEffect(() => {
    if (initData) {
      setTopicID(initData.date_created);
    }
  }, [initData, setTopicID]);
  console.log(topicID);

  function subscribeToTopic() {
    // If the user is not subscribed,
    //   clicking the 'Subscribe' button will execute this
    axiosInstance
      .post("topics/subscriptions/new_subscriber/", { id: topicID })
      .then((response) => {
        console.log(response);
        setShowSubscribeModal(true);
        setUserCanView(true);
        props.getProfileAndTopics(true);
      })
      .catch((error) => console.log(error));
  }

  // useEffect(() => {
  //   // Launches and cleans up 'postsHelper'
  //   if (getPostsForWindow === true) {
  //     postsHelper(boardID);
  //   }
  //   return () => {
  //     // setGetPostsForWindow(false);
  //   };
  // });

  useEffect(() => {
    // Returns whether or not a user can view the posts.
    if (
      usersOnTopic !== null &&
      usersOnTopic.some((user) => user.username === username)
    ) {
      setUserCanView(true);
    } else setUserCanView(false);
  }, [usersOnTopic, username]);

  // if (board) {
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
              {initData ? (
                <div className="postsMain">
                  <Row noGutters>
                    <Container fluid className="postWindow-heading">
                      <h1>{boardName}</h1>
                    </Container>
                  </Row>

                  <Row noGutters>
                    <Container fluid className="row2-outercontainer-posts">
                      {postsList && userCanView
                        ? postsList.map((post) => {
                            if (post.posting_user.username === username) {
                              return {
                                /* <CurrentUserPost
                        key={post.id}
                        userID={post.posting_user.user_id}
                        displayName={post.posting_user.display_name}
                        userImage={post.posting_user.image}
                        dateTime={post.date_time_created}
                        message={post.message}
                        handleOtherUserClicked={props.handleOtherUserClicked}
                      /> */
                              };
                            } else {
                              return {
                                /*  */
                              };
                            }
                          })
                        : {
                            /* <UserNotSubscribedAltView subscribeToTopic={subscribeToTopic} /> */
                          }}
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
                            onClick={() => postsHelper(boardID)}
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
                        <h3>There seems to be a problem. Please try again.</h3>
                      </>
                    ) : null}
                  </Row>
                </div>
              ) : (
                <Container style={{ textAlign: "center" }}>
                  <h3>NOPE</h3>
                </Container>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* <SubscribeToTopicModal
          show={showSubscribeModal}
          setShow={setShowSubscribeModal}
        /> */}
    </>
  );
  // } else {
  // return (
  // <Container style={{ textAlign: "center" }}>
  {
    /* <h3>There seems to be a problem. Please try again.</h3> */
  }
  {
    /* </Container> */
  }
  // );
  // }
}

export default Posts;
