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
import UserNotLoggedInModal from "./modals/UserNotLoggedInModal";

export default function NavBar() {
  const [userID, setUserID] = useState("");

  const [topics, setTopics] = useState([]);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);

  const [usersFriends, setUsersFriends] = useState([]);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotLoggedIn, setShowNotLoggedIn] = useState(false);

  useEffect(() => {
    getAndSetToken();
    axiosInstance
      .get("users/basic_user_details/")
      .then((response) => {
        console.log(response);
        setUserID(response.data.pk);
      })
      .catch((error) => {
        console.log(error);
        setShowNotLoggedIn(true);
      });
  }, []);

  function handleSelect(eventKey) {
    if (eventKey === "user-search") {
      setShowUserSearchModal(true);
    } else if (eventKey === "topic-create") {
      setShowCreateTopicModal(true);
    } else if (eventKey === "logout") {
      setShowLogoutModal(true);
    }
  }

  function handleTopicCardClick(topicID) {
    window.location = "/topics/" + topicID + "/";
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
  }, [setTopics]);

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
        <Navbar.Brand href="/main/">d-Auth</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ minWidth: "90%" }} onSelect={handleSelect}>
            <Nav.Link href={"/" + userID + "/public"}>Profile</Nav.Link>
            <Nav.Link href="/public">Public Topics</Nav.Link>
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
                  <UsersCards usersList={usersFriends} />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          <Nav onSelect={handleSelect}>
            <Nav.Link eventKey="logout">Log out</Nav.Link>
          </Nav>

          <UserSearchModal
            show={showUserSearchModal}
            setShow={setShowUserSearchModal}
          />
          <CreateTopicModal
            show={showCreateTopicModal}
            setShow={setShowCreateTopicModal}
          />
          <LogoutModal show={showLogoutModal} setShow={setShowLogoutModal} />
        </Navbar.Collapse>
      </Container>
      <UserNotLoggedInModal
        show={showNotLoggedIn}
        setShow={setShowNotLoggedIn}
      />
    </Navbar>
  );
}
