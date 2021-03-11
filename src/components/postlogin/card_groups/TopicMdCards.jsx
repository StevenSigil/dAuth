import React from "react";
import { Card, Container } from "react-bootstrap";

import XSquareButton from "../../svg-components/XSquareButton";

function TopicMdCards(props) {
  const topics = props.topicsToRender;
  const editButton = props.editButton;
  const handleEditButtonClick = props.buttonAction;
  const handleTopicClick = props.handleTopicClick;

  const EditTitle = (topic) => {
    return (
      <>
        <Card.Title className="card-head">
          <Container className="topic-title-container">
            {topic.name}
            <XSquareButton
              onClickFunction={() => handleEditButtonClick(topic.id)}
            />
          </Container>
        </Card.Title>
      </>
    );
  };

  return (
    <>
      {topics
        ? topics.map((topic) => {
            return (
              <div key={topic.id} className="inner-map-centered-cards">
                <Card
                  className="cardColor2"
                  onClick={
                    handleTopicClick ? () => handleTopicClick(topic.id) : null
                  }
                >
                  <Card.Header>
                    {editButton ? (
                      EditTitle(topic)
                    ) : (
                      <Card.Title>{topic.name}</Card.Title>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Card.Subtitle className="mb-2 description-nowrap">
                      {topic.description}
                    </Card.Subtitle>
                    <Card.Text href="{null}">
                      <em>Created by: {topic.created_by}</em>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            );
          })
        : null}
    </>
  );
}

export default TopicMdCards;
