import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../../utils/axiosAPI";
import UsersCards from "../card_groups/UsersCards";
import UserSearchConfirmModal from "./UserSearchConfirmModal";

function UserSearchModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const topicDetails = props.topicDetails;
  // const getUsersFriends = props.getUsersFriends;
  // const handleOtherUserClicked = props.handleOtherUserClicked;
  const [searchText, setSearchText] = useState("");
  const [returnedUsersList, setReturnedUsersList] = useState(null);
  const [showAddFriendConf, setShowAddFriendConf] = useState(false);

  function handleChange(text) {
    // TODO: Update the url name for this api request.
    setSearchText(text);
    axiosInstance
      .get("users/user-search/?search=" + text)
      .then((response) => setReturnedUsersList(response.data))
      .catch((error) => console.log(error));
  }

  function handleAddFriend(userID) {
    if (userID !== "") {
      axiosInstance
        .post("profiles/public/add_friend/", { id: userID })
        .then((response) => {
          console.log(response);
          // getUsersFriends();
          setShowAddFriendConf(true);
          setShow(false);
        })
        .catch((error) => console.log(error));
    }
  }

  function handleAddTopicAdmin(userID) {
    axiosInstance
      .post("topics/subscriptions/add_topic_admins/", {
        id: props.topicID,
        userID: [userID],
      })
      .then((response) => {
        console.log(response);
        setShow(false);
        props.topicAPI();
      })
      .catch((error) => console.log(error));
  }

  function resetModal() {
    setReturnedUsersList(null);
    setShowAddFriendConf(false);
    setSearchText("");
    setShow(false);
  }

  return (
    <>
      <Modal scrollable animation={false} show={show} onHide={resetModal}>
        <Modal.Header closeButton>
          <Modal.Title>Search for a user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="user-search">
              <Form.Label>Enter a username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a username to search"
                value={searchText}
                // onChange={(e) => setSearchText(e.target.value)}
                onChange={(e) => handleChange(e.target.value)}
              />
            </Form.Group>
          </Form>
          {returnedUsersList ? (
            <UsersCards
              usersList={returnedUsersList}
              // handleOtherUserClicked={handleOtherUserClicked}
              activeWindow={"UserSearchModal"}
              resetModal={resetModal}
              setFriendCardUserID={
                topicDetails === true ? handleAddTopicAdmin : handleAddFriend
              }
            />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => handleChange(searchText)}
          >
            Search
          </Button>
          <Button variant="outline-dark" onClick={resetModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <UserSearchConfirmModal show={showAddFriendConf} hide={setShowAddFriendConf} />
    </>
  );
}

export default UserSearchModal;
