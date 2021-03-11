import React, { useState, useEffect } from "react";
import { Row, Col, Card, Collapse, Container, Button } from "react-bootstrap";

import axiosInstance from "../../utils/axiosAPI";

import BoardsCards from "./card_groups/BoardsCards";
// import CreateTopicModal from "../modals/CreateTopicModal";
import TopicsLeftNavCards from "./card_groups/TopicsLeftNavCards";

import "../../static/css/LeftSidePanel.css";

function LeftSidePanel(props) {
  //   const activeTopicID = props.activeTopicID;
  //   const setActiveTopicID = props.setActiveTopicID;

  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState(null);
  const [activeTopicName, setActiveTopicName] = useState("");
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/profiles/public/profile_topics/")
      .then((response) => {
        console.log("Profile & Topics:\n", response);
        setTopics(response.data.topics_subscribed_to);
      })
      .catch((error) =>
        console.log("Error retrieving the User's Topics.\n", error)
      );
  }, [setTopics])

  //   useEffect(() => {
  //     if (open && activeTopicID) {
  //       axiosInstance
  //         .get("topics/boards-condensed/" + activeTopicID + "/")
  //         .then((response) => {
  //           console.log(response);
  //           setBoards(response.data.boards);
  //         })
  //         .catch((error) => console.log(error));
  //     } else setBoards(null);
  //   }, [open, activeTopicID]);

  return (
    <>
      <Col
        xs={{ span: 0, offset: 0, order: 0 }}
        xl={{ order: 0, span: 2 }}
        className="d-none d-xl-table-row LeftNavColumn"
      >
        <Collapse in={!open}>
          <div className="leftSidePanel-inner-div">
            <div
              id="collapse-cards"
              aria-expanded={open}
              aria-controls="collapse-cards"
              className="area2-lsp"
            >
              <Row noGutters>
                <Container>
                  <h2>My topics</h2>
                  <Button
                    size="small"
                    className="orange-primary-btn"
                    onClick={() => setShowCreateTopicModal(true)}
                  >
                    Create a new topic
                  </Button>
                </Container>
              </Row>

              <div className="area2-inner-lsp">
              <TopicsLeftNavCards
                // user={props.user}
                // setActiveTopicName={setActiveTopicName}
                // setActiveTopicID={setActiveTopicID}
                // showTopicDetails={props.showTopicDetails}
                // topics={props.topics}
                topics={topics}
                setOpen={setOpen}
                open={open}
              />
            </div>
            </div>
          </div>
        </Collapse>

        <Collapse in={open}>
          <div className="leftSidePanel-inner-div">
            <div
              className="area2-lsp"
              id="collapse-cards"
              aria-expanded={!open}
            >
              <Row noGutters>
                <Container>
                  <h2>{activeTopicName}</h2>
                  <em>boards</em>
                </Container>
              </Row>

              <div className="area2-inner-lsp">
                {/* <BoardsCards
                showPosts={props.showPosts}
                topicID={activeTopicID}
                setActiveBoard={props.setActiveBoard}
                boards={boards}
              /> */}

                <Card
                  className="left-cards cardColor"
                  style={{ textAlign: "center" }}
                  aria-controls="collapse-cards"
                  onClick={() => setOpen(!open)}
                >
                  <Card.Body style={{ padding: 2, margin: 5, borderRadius: 2 }}>
                    <Card.Text style={{ padding: 10, borderRadius: 3 }}>
                      Show topics
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </Collapse>
      </Col>

      {/* <CreateTopicModal
        show={showCreateTopicModal}
        setShow={setShowCreateTopicModal}
        usersProfile={props.usersProfile}
        setActiveTopicID={props.setActiveTopicID}
        getProfileAndTopics={props.getProfileAndTopics}
      /> */}
    </>
  );
}
export default LeftSidePanel;
