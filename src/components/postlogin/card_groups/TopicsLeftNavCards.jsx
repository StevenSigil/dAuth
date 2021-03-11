import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import axiosInstance from "../../../utils/axiosAPI";

import { ReactComponent as RightCarrot } from "../../../static/svg/caret-right.svg";
import "../../../static/css/LeftSidePanel.css";
import { Link } from "react-router-dom";

function TopicsLeftNavCards(props) {
  const user = props.user;
  const open = props.open;
  const setOpen = props.setOpen;
  const propsTopics = props.topics;
  const showTopicDetails = props.showTopicDetails;
  // const setActiveTopicID = props.setActiveTopicID;

  // const [topics, setTopics] = useState([]);

  // useEffect(() => {
  //   // Retrieves the topics for specifically the side bar. Topics as props doesn't pass well to this component.
  //   if (user !== undefined && user.pk && open === false) {
  //     axiosInstance
  //       .post("/topics/subscriptions/condensed_topics/", { id: user.pk })
  //       .then((response) => {
  //         console.log(response);
  //         setTopics(response.data);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // }, [user, open, propsTopics]);

  function handleTopicMainClick(topic) {
    // setActiveTopicID(topic.id);
    setOpen(!open);
    if (props.setActiveTopicName) {
      props.setActiveTopicName(topic.name);
    }
  }

  function handleTopicDetailsClick(id) {
    // showTopicDetails();
    window.location = "/topics/" + id
    // setActiveTopicID(id);
  }

  return propsTopics.length > 0 ? (
    <div>
      {propsTopics.map((topic) => {
        return (
          <div key={topic.id} className="inner-map-topicCards">
            <Card className="cardColor2">
              <Card.Header className="lg-card-header">
                <Row noGutters>
                  <Col
                    xs={10}
                    className="my-auto"
                    onClick={() => handleTopicMainClick(topic)}
                  >
                    <Card.Title>{topic.name}</Card.Title>
                    <Card.Text className="left-cards-nowrapText">
                      {topic.description}
                    </Card.Text>
                  </Col>

                  <Col xs={2} className="my-auto">
                    <Button
                      className="orange-primary-btn right-carrot-svgbutton"
                      onClick={() => handleTopicDetailsClick(topic.id)}
                    >
                      {/* <Link to={"/topics/" + topic.id}> */}
                        <RightCarrot />
                      {/* </Link> */}
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
          </div>
        );
      })}
    </div>
  ) : null;
}
export default TopicsLeftNavCards;
