// Right side panel to display other users who are subscribed to the currently activeTopic.

import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import axiosInstance from "../../utils/axiosAPI";
import UsersCards from "./card_groups/UsersCards";

import "../../static/css/RightSidePanel.css";

function RightSidePanel(props) {
  // const activeTopicID = props.activeTopicID;

  const [userProfiles, setUserProfiles] = useState([]);
  const [usersFriends, setUsersFriends] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("profiles/public/users_friends/")
      .then((response) => {
        setUsersFriends(response.data);
        console.log("usersFriends Response:\n", response);
      })
      .catch((error) => console.log(error));
  }, [setUsersFriends]);

  // dynamic styling
  const [area2Height, setArea2Height] = useState("100%"); // maybe a collapse instead of slicing in half?
  const [area1Hidden, setArea1Hidden] = useState(true);

  // useEffect(() => {
  //   if (activeTopicID) {
  //     return getOtherUsers(activeTopicID);
  //   }
  // }, [activeTopicID]);

  // function getOtherUsers(topicID) {
  //   console.log("ACTIVE TOPIC: getOtherUsers Response:\n", topicID);
  //   axiosInstance
  //     .post("topics/subscriptions/other_users_on_topic/", { id: topicID })
  //     .then((response) => {
  //       console.log("ACTIVE TOPIC", response);
  //       setUserProfiles(response.data.users_on_topic);
  //       setArea2Height("50%");
  //       setArea1Hidden(false);
  //     })
  //     .catch((error) => console.log(error));
  // }

  return (
    <>
      <Col
        xl={{ order: 2, span: 2 }}
        className="d-none d-xl-table-row RightNavColumn"
      >
        <div className="rightSidePanel-inner-div">
          <div hidden={area1Hidden} className="area2-rsp1">
            <Container>
              <h2>Users on topic</h2>
            </Container>

            <div className="area2-inner-rsp">
              <UsersCards
                // handleOtherUserClicked={props.handleOtherUserClicked}
                usersList={userProfiles}
              />
            </div>
          </div>

          <div className="area2-rsp2" style={{ height: area2Height }}>
            <Container>
              <h2>My friends</h2>
            </Container>
            <div className="area2-inner-rsp">
              <UsersCards
                // handleOtherUserClicked={props.handleOtherUserClicked}
                usersList={usersFriends}
              />
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}
export default RightSidePanel;
