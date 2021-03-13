import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import axiosInstance from "../../../utils/axiosAPI";

import UsersCards from "../card_groups/UsersCards";
import UserSearchForm from "../forms/UserSearchForm";
import UserSearchConfirmModal from "./UserSearchConfirmModal";

export default function UserSearchModal(props) {
  const show = props.show;
  const setShow = props.setShow;
  const topicDetails = props.topicDetails;

  const [searchText, setSearchText] = useState("");
  const [returnedUsersList, setReturnedUsersList] = useState(null);
  const [showAddFriendConf, setShowAddFriendConf] = useState(false);

  function handleChange(text) {
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
        <Modal.Header>
          <Modal.Title>Search for a user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserSearchForm handleChange={handleChange} searchText={searchText} />

          <div style={{ marginTop: "1rem", width: 'inherit' }}>
            {returnedUsersList ? (
              <UsersCards
                usersList={returnedUsersList}
                activeWindow={"UserSearchModal"}
                resetModal={resetModal}
                setFriendCardUserID={
                  topicDetails === true ? handleAddTopicAdmin : handleAddFriend
                }
              />
            ) : null}
          </div>
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

      <UserSearchConfirmModal
        show={showAddFriendConf}
        hide={setShowAddFriendConf}
      />
    </>
  );
}
