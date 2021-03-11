import React, { useState, useEffect } from "react";

import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Image,
  Card,
} from "react-bootstrap";
import "../../static/css/EditProfile.css";

import axiosInstance, { getAndSetToken } from "../../utils/axiosAPI";

import TopicMdCards from "./card_groups/TopicMdCards";
import EditProfileModal from "./modals/EditProfileModal";
import UnsubscribeTopicModal from "./modals/UnsubscribeTopicModal";
import ProfileImageUploadModal from "./modals/ProfileImageUploadModal";

import LeftSidePanel from "./LeftSidePanel";
import NavBar from "./NavBar";
import RightSidePanel from "./RightSidePanel";
import EditProfileForm from "./forms/EditProfileForm";

function EditProfile() {
  // User info.
  const [userDetails, setUserDetails] = useState(null);
  const [curUser, setCurUser] = useState("");

  // Form data.
  const [inputData, setInputData] = useState({}); // Keys & Values set after userDetails API call.
  const [newData, setNewData] = useState({
    email: "",
    display_name: "",
    bio: "",
    instagram_handle: "",
    twitter_handle: "",
  });

  // topics --> display & ID to unsubscribe.
  const [topicID, setTopicID] = useState("");
  const [subscribedTopics, setSubscribedTopics] = useState(false);

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [showUpdatePictureModal, setShowUpdatePictureModal] = useState(false);

  getAndSetToken();

  function prepUserPrimaryData() {
    // Transforms the 'newEmail' & 'newUsername' to a JSON object to send to API.
    let data = {};
    if (newData.email !== "") data.email = newData.email;
    return data;
  }

  function prepUserProfileData() {
    // Transforms the profile related data to JSON to send to the API
    let data = {};
    if (newData.display_name !== "") data.display_name = newData.display_name;
    if (newData.bio !== "") data.bio = newData.bio;

    if (newData.instagram_handle !== "") {
      var newInstagramHandle = newData.instagram_handle;
      if (newInstagramHandle[0] === "@") {
        data.instagram_handle = newInstagramHandle;
      } else {
        data.instagram_handle = "@" + newInstagramHandle;
      }
    }
    if (newData.twitter_handle !== "") {
      var newTwitterHandle = newData.twitter_handle;
      if (newTwitterHandle[0] === "@") {
        data.twitter_handle = newTwitterHandle;
      } else {
        data.twitter_handle = "@" + newTwitterHandle;
      }
    }
    return data;
  }

  function patchUserPrimaryData(data) {
    // Sends the 'data' JSON object as a PATCH (per the API) to update the user's email and username.
    axiosInstance
      .patch("/users/basic_user_details/", data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function patchUserSecondaryData(data) {
    // Sends the 'data' JSON objects as a PUT (per the API) to update the bio of a user.
    axiosInstance
      .patch("profiles/bio/" + curUser.pk + "/", data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleProfileSave() {
    let userPrimaryData = prepUserPrimaryData();
    let userSecondaryData = prepUserProfileData();

    if (Object.keys(userPrimaryData).length > 0)
      patchUserPrimaryData(userPrimaryData);
    if (Object.keys(userSecondaryData).length > 0)
      patchUserSecondaryData(userSecondaryData);
    setShowSaveModal(true);
  }

  useEffect(() => {
    // Sets the signed in user ID to determine if the page is the users or another users profile.
    axiosInstance
      .get("users/basic_user_details/")
      .then((response) => {
        console.log(response);
        setCurUser(response.data);
      })
      .catch((error) => console.log(error));
  }, [setCurUser]);

  useEffect(() => {
    if (curUser !== "") {
      axiosInstance
        .post("/profiles/public/other_user_public_profile/", { id: curUser.pk })
        .then((response) => {
          console.log(response);
          setUserDetails(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [curUser, setUserDetails]);

  useEffect(() => {
    if (curUser !== "") {
      axiosInstance
        .post("/topics/subscriptions/condensed_topics/", { id: curUser.pk })
        .then((response) => {
          console.log(response);
          setSubscribedTopics(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [curUser, setSubscribedTopics]);

  useEffect(() => {
    if (userDetails !== null) {
      setInputData((prev) => {
        return {
          ...prev,
          email: curUser.email,
          display_name: userDetails.display_name,
          bio: userDetails.bio,
          instagram_handle: userDetails.instagram_handle,
          twitter_handle: userDetails.twitter_handle,
        };
      });
    }
  }, [userDetails, setInputData]);

  function handleUnsubscribeModal(id) {
    setShowUnsubscribeModal(true);
    setTopicID(id);
  }

  function handleBackButton() {
    window.location = "/" + curUser.pk + "/public";
  }

  if (userDetails) {
    return (
      <>
        <NavBar />

        <div></div>
        <Container fluid style={{ padding: 0 }}>
          <Row noGutters className="d-flex">
            <LeftSidePanel />

            <Col
              xs={{ span: 12 }}
              xl={{ order: 1, span: 8 }}
              className="d-table-row middle-main mx-auto"
            >
              <div className="editProfile-main">
                <Container fluid>
                  <Row noGutters className="row1-editProfile">
                    <Col md={0} lg={4}></Col>
                    <Col
                      md={6}
                      lg={4}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignContent: "center",
                      }}
                    >
                      <h1 style={{ textAlign: "center", margin: "auto" }}>
                        {"Welcome " + userDetails.username}
                      </h1>
                    </Col>

                    <Col md={6} lg={4}>
                      <div
                        className=" row2-outerdiv-ep"
                        style={{
                          height: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignContent: "center",
                        }}
                      >
                        <Button
                          className="orange-primary-btn"
                          style={{ margin: "1rem 0" }}
                          onClick={handleBackButton}
                        >
                          Back
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Container>

                <Container fluid>
                  <Row style={{ marginTop: "2rem" }}>
                    <Col lg={4} md={12}>
                      <div className="row2-outerdiv-ep">
                        <h2>Edit your details</h2>
                        <div className="row2-innerdiv-ep">
                          <div className="formWrapper-ep">
                            <EditProfileForm
                              inputData={inputData}
                              setInputData={setInputData}
                              newData={newData}
                              setNewData={setNewData}
                            />
                            <Button
                              className="orange-primary-btn custom-lgButton"
                              onClick={handleProfileSave}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={12}>
                      <div className="row2-outerdiv-ep">
                        <h2>Your profile picture</h2>
                        <div className="row2-innerdiv-ep">
                          <Card
                            className="cardColor2 image-card-ep"
                            style={{ border: 0 }}
                          >
                            <Card.Header>
                              <Image
                                src={userDetails.image}
                                rounded
                                className="profile-image-editProfile"
                              />
                            </Card.Header>
                            <Card.Body>
                              <Button
                                className="custom-lgButton orange-primary-btn "
                                onClick={() => setShowUpdatePictureModal(true)}
                              >
                                Edit
                              </Button>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={12}>
                      <div className=" row2-outerdiv-ep">
                        <h2>Subscribed topics</h2>

                        <div
                          className="row2-innerdiv-ep"
                          style={{ minHeight: "60vh" }}
                        >
                          <TopicMdCards
                            topicsToRender={subscribedTopics}
                            editButton={true}
                            buttonAction={handleUnsubscribeModal}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Col>

            <RightSidePanel />
          </Row>
        </Container>

        <EditProfileModal
          show={showSaveModal}
          setShow={setShowSaveModal}
          userID={curUser.pk}
        />

        <ProfileImageUploadModal
          userID={curUser.pk}
          show={showUpdatePictureModal}
          setShow={setShowUpdatePictureModal}
        />

        {/* TODO: Test this */}
        <UnsubscribeTopicModal
          show={showUnsubscribeModal}
          setShow={setShowUnsubscribeModal}
          activeTopicID={topicID}
        />
      </>
    );
  } else return null;
}

export default EditProfile;
