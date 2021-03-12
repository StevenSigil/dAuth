import React, { useState, useEffect } from "react";
import {
  Nav,
  Navbar,
  Dropdown,
  Container,
  NavItem,
  NavLink,
} from "react-bootstrap";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

import UserSearchModal from "./modals/UserSearchModal";
import LogoutModal from "./modals/LogoutModal";
import CreateTopicModal from "./modals/CreateTopicModal";

import TopicMdCards from "./card_groups/TopicMdCards";
import UsersCards from "./card_groups/UsersCards";

function NavBar(props) {
  // const setLogin = props.setLogin;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);

  const [userID, setUserID] = useState("");

  useEffect(() => {
    getAndSetToken();
    axiosInstance
      .get("users/basic_user_details/")
      .then((response) => {
        console.log(response);
        setUserID(response.data.pk);
      })
      .catch((error) => console.log(error));
  }, []);

  function handleSelect(eventKey) {
    if (eventKey === "profile") {
      // props.profile();
      window.location = "/" + userID + "/public";
      // } else if (eventKey === "public-topics") {
      //   props.publicTopics();
    } else if (eventKey === "user-search") {
      setShowUserSearchModal(true);
    } else if (eventKey === "topic-create") {
      setShowCreateTopicModal(true);
    } else if (eventKey === "logout") {
      setShowLogoutModal(true);
    }
  }

  // const topics = props.topics;
  // const showTopicDetails = props.showTopicDetails;
  // const setActiveTopicID = props.setActiveTopicID;
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);

  const [topics, setTopics] = useState([]);
  const [usersFriends, setUsersFriends] = useState([]);

  // const usersFriends = props.usersFriends;
  // const handleOtherUserClicked = props.handleOtherUserClicked;

  function handleTopicCardClick(topicID) {
    // Switches the Main(page) to Topic Details
    // setActiveTopicID(topicID);
    // showTopicDetails();
    window.location = "/topics/" + topicID + "/"
  }

  useEffect(() => {
    // Retrieve the user's subscribed-to topics when navbar has collapse nav's
    if (window.innerWidth < 1200) {
      axiosInstance
        .get("/profiles/public/profile_topics/")
        .then((response) => {
          console.log("Profile & Topics:\n", response);
          setTopics(response.data.topics_subscribed_to);
        })
        .catch((error) => console.log("Error retrievingTopics.\n", error));
    }
  }, [setTopics, window.innerWidth]);

  useEffect(() => {
    // Retrieve the user's friends topics when navbar has collapse nav's
    if (window.innerWidth < 1200) {
      axiosInstance
        .get("profiles/public/users_friends/")
        .then((response) => {
          setUsersFriends(response.data);
          console.log("usersFriends Response:\n", response);
        })
        .catch((error) => console.log(error));
    }
  }, [setUsersFriends]);

  return (
    <Navbar className="main-nav" variant="dark" expand="lg">
      <Container fluid style={{ display: "flex", alignItems: "flex-start" }}>
        <Navbar.Brand>d-Auth</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ minWidth: "90%" }} onSelect={handleSelect}>
            <Nav.Link eventKey="profile">Profile</Nav.Link>
            <Nav.Link eventKey="public-topics">Public Topics</Nav.Link>
            <Nav.Link eventKey="user-search">User Search</Nav.Link>
            <Nav.Link eventKey="topic-create">Creat a topic</Nav.Link>

            <Dropdown as={NavItem} className="d-auto d-xl-none">
              <Dropdown.Toggle as={NavLink} id="dropdown-topics">
                Topics
              </Dropdown.Toggle>
              <Dropdown.Menu align="left">
                <Dropdown.Item>
                  <TopicMdCards
                    topicsToRender={topics}
                    handleTopicClick={handleTopicCardClick}
                  />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              as={NavItem}
              id="drop-friends-outer"
              className="d-auto d-xl-none"
            >
              <Dropdown.Toggle as={NavLink} id="dropdown-friends">
                Friends
              </Dropdown.Toggle>
              <Dropdown.Menu align="left">
                <Dropdown.Item>
                  <UsersCards
                    usersList={usersFriends}
                    // handleOtherUserClicked={handleOtherUserClicked}
                  />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          <Nav onSelect={handleSelect}>
            <Nav.Link eventKey="logout">Log out</Nav.Link>
          </Nav>

          <UserSearchModal
            // handleOtherUserClicked={props.handleOtherUserClicked}
            show={showUserSearchModal}
            setShow={setShowUserSearchModal}
          />
          <CreateTopicModal
            show={showCreateTopicModal}
            setShow={setShowCreateTopicModal}
            // getProfileAndTopics={props.getProfileAndTopics}
          />
          <LogoutModal show={showLogoutModal} setShow={setShowLogoutModal} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
