import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import XSquareButton from "../../svg-components/XSquareButton";

import DeleteBoardModal from "../modals/DeleteBoardModal";

export default function BoardsCards(props) {
  // Standardizes and reuses a series of cards, formatted for basic Board info.

  const boards = props.boards;
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);

  const checkIfUserIsAdmin = props.checkIfUserIsAdmin
    ? props.checkIfUserIsAdmin
    : () => {
        return true;
      };

  function handleBoardClicked(obj) {
    window.location = "/board/" + obj.id;
  }

  function TrashButton() {
    if (checkIfUserIsAdmin()) {
      return (
        <Col xs={2} className="removeBoard-outerCol">
          <XSquareButton
            onClickFunction={() => setShowDeleteBoardModal(true)}
          />
        </Col>
      );
    } else return null;
  }

  if (boards) {
    return (
      <>
        {boards.map((board) => {
          return (
            <div key={board.id} className="inner-map-topicCards">
              <Card className="cardColor2">
                <Card.Header className="lg-card-header">
                  <Row noGutters>
                    <Col onClick={() => handleBoardClicked(board)}>
                      <Card.Title>{board.board_name}</Card.Title>
                      <Card.Text>{board.board_description}</Card.Text>
                    </Col>

                    <TrashButton />
                  </Row>
                </Card.Header>
              </Card>

              <DeleteBoardModal
                show={showDeleteBoardModal}
                setShow={setShowDeleteBoardModal}
                activeBoard={board}
              />
            </div>
          );
        })}
      </>
    );
  } else {
    return <h4>No boards.</h4>;
  }
}


