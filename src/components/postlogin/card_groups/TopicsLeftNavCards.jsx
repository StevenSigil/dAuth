import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";

import { ReactComponent as RightCarrot } from "../../../static/svg/caret-right.svg";
import "../../../static/css/LeftSidePanel.css";

function TopicsLeftNavCards(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const propsTopics = props.topics;

  const setActiveTopicID = props.setActiveTopicID;

  function handleTopicMainClick(topic) {
    setActiveTopicID(topic.id);
    setOpen(!open);
    if (props.setActiveTopicName) {
      props.setActiveTopicName(topic.name);
    }
  }

  function handleTopicDetailsClick(id) {
    window.location = "/topics/" + id;
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
                      <RightCarrot />
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
