import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Image } from "react-bootstrap";

import { ReactComponent as CheckMarkSVG } from "../../../static/svg/check2-circle.svg";

function UsersCards(props) {
  // standardizes and reuses a series of cards, formatted for a user's basic info
  const usersList = props.usersList;
  const activeWindow = props.activeWindow;
  const setFriendCardUserID = props.setFriendCardUserID;
  const handleOtherUserClicked = props.handleOtherUserClicked;
  const setShowUserManagerModal = props.setShowUserManagerModal;

  const [smallCol, setSmallCol] = useState(false);
  const [showSecondayButton, setShowSecondaryButton] = useState(false);

  // Displays the Manage button on the current user's profile to edit friends.
  useEffect(() => {
    if (
      activeWindow === "currentUser" ||
      activeWindow === "UserSearchModal" ||
      activeWindow === "PublicTopics"
    ) {
      setShowSecondaryButton(true);
      setSmallCol(true);
    } else {
      setShowSecondaryButton(false);
      setSmallCol(false);
    }
  }, [activeWindow]);

  function handleCardClick(id) {
    handleOtherUserClicked(id);
    if (activeWindow === "UserSearchModal") props.resetModal();
  }

  function handleManageButtonClick(id) {
    if (activeWindow === "currentUser") {
      setShowUserManagerModal(true);
    }
    setFriendCardUserID(id);
  }

  return (
    <div className="UsersCards-outer-div">
      {usersList
        ? usersList.map((user) => {
            return (
              <div key={user.user_id} className="inner-map-centered-cards">
                <Card
                  className="cardColor2"
                  style={
                    activeWindow === "currentUser" ||
                    activeWindow === "PublicTopics" ||
                    activeWindow === "TopicDeatils" ||
                    activeWindow === "otherUser"
                      ? { width: "100%" }
                      : { width: "95%" }
                  }
                >
                  <Card.Header className="lg-card-header" style={{ margin: 0 }}>
                    <Row noGutters>
                      <Col
                        xs={2}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Image
                          roundedCircle
                          fluid
                          src={user ? user.image : null}
                          onClick={() => handleCardClick(user.user_id)}
                          alt={user.display_name + " image"}
                        />
                      </Col>

                      <Col
                        xs={smallCol ? 8 : 10}
                        onClick={() => handleCardClick(user.user_id)}
                        style={{ textAlign: "center" }}
                      >
                        <Card.Title>{user.display_name}</Card.Title>
                        <Card.Text>{user.username}</Card.Text>
                      </Col>

                      {/* 'Manage' & 'Add' buttons */}
                      <Col
                        xs={2}
                        style={{ paddingLeft: 0 }}
                        hidden={!showSecondayButton}
                        className="my-auto"
                      >
                        <Button
                          className="orange-primary-btn"
                          style={{ marginRight: "2rem" }}
                          size="sm"
                          onClick={() => handleManageButtonClick(user.user_id)}
                        >
                          {activeWindow === "UserSearchModal" ||
                          activeWindow === "PublicTopics" ? (
                            "Add"
                          ) : (
                            <CheckMarkSVG />
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Card.Header>
                </Card>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default UsersCards;
