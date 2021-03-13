import React from "react";
import {
  Carousel,
  Accordion,
  Card,
  Row,
  Col,
  Button,
  Table,
} from "react-bootstrap";
import axiosInstance from "../../../utils/axiosAPI";

function PublicTopicsAccordian(props) {
  const publicTopics = props.publicTopics;
  // const resetWindowsToActiveTopic = props.resetWindowsToActiveTopic;
  const handleTopicClick = props.handleTopicClick;

  function getTopFiveTopicsPerUser(arr) {
    // returns the top five Topics for the Carousel
    var sortedArray = arr.sort(
      (a, b) => b.users_subscribed_count - a.users_subscribed_count
    );
    sortedArray = sortedArray.slice(0, 5);
    return sortedArray;
  }

  function handleSubscribeButtonClick(topicID) {
    // Handles a user subscribing to a Topic.
    axiosInstance
      .post("topics/subscriptions/new_subscriber/", { id: topicID })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    handleTopicClick(topicID);
  }

  return (
    <>
      <Carousel className="carousel-pt">
        {getTopFiveTopicsPerUser(publicTopics).map((topic) => {
          return (
            <Carousel.Item key={topic.id} className="carousel-item-pt">
              <Accordion className="publicTopic-cards-lg">
                <Card
                  key={topic.id}
                  className="cardColor2 publicTopic-cards-lg"
                >
                  <Accordion.Toggle as="div" eventKey={topic.id}>
                    <Card.Header>
                      <Card.Title as={"h4"} style={{ textAlign: "center" }}>
                        {topic.name}
                      </Card.Title>
                    </Card.Header>

                    <Card.Body>
                      <Card.Subtitle
                        className="mb-2"
                        style={{ textAlign: "center" }}
                        as={"h6"}
                      >
                        {topic.description}
                      </Card.Subtitle>

                      <Row>
                        <Col sm={9} className="carousel-infoText">
                          <div>
                            <Card.Text style={{ margin: 0 }}>
                              <em>Created by: {topic.created_by}</em>
                            </Card.Text>

                            <Card.Text>
                              Total Users: {topic.users_subscribed_count}
                            </Card.Text>
                          </div>
                        </Col>

                        <Col sm={3} className="carousel-customButton">
                          <div style={{ textAlign: "center" }}>
                            <Button
                              size="sm"
                              className="orange-primary-btn"
                              onClick={() =>
                                handleSubscribeButtonClick(topic.id)
                              }
                            >
                              Subscribe ?
                            </Button>

                            <Button
                              size="sm"
                              className="orange-primary-btn"
                              onClick={() => handleTopicClick(topic.id)}
                            >
                              Details
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Accordion.Toggle>

                  <Accordion.Collapse as="div" eventKey={topic.id}>
                    <Card.Body style={{ paddingBottom: "0" }}>
                      <Card.Subtitle as="h5" style={{ marginBottom: "5px" }}>
                        Boards on topic:
                      </Card.Subtitle>

                      <Table responsive style={{ marginBottom: "0" }}>
                        <tbody style={{ height: "10%" }}>
                          <tr>
                            {topic.boards.map((board) => {
                              return (
                                <td
                                  key={board.id}
                                  className="boardsCards-innerTd"
                                >
                                  <Card className="cardColor2">
                                    <Card.Header>
                                      <Card.Subtitle>
                                        {board.board_name}
                                      </Card.Subtitle>

                                      <Card.Text className="customBoard-noWrapText">
                                        {board.board_description}
                                      </Card.Text>
                                    </Card.Header>
                                  </Card>
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </>
  );
}

export default PublicTopicsAccordian;
