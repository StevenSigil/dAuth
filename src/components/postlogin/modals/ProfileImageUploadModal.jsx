import React, { useState } from "react";
import ImageCropper from "../../../utils/ImageCropper";
import axiosInstance from "../../../utils/axiosAPI";

import { Button, Form, Modal } from "react-bootstrap";

function ProfileImageUploadModal(props) {
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState("");
  const show = props.show;
  const setShow = props.setShow;
  const userID = props.userID;

  const getBlob = (blob) => {
    // pass blob up from the ImageCropper component - blob is JPEG/PNG at this point.
    setBlob(blob); //
  };

  const onInputChange = (e) => {
    // convert image file to base64 string
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => setInputImg(reader.result), false);

    if (file) {
      reader.readAsDataURL(file);
      console.log(file);
    }
  };

  function handleSubmitImage(e) {
    e.preventDefault();

    let d = new Date();
    let day = d.getMonth() + 1 + d.getDate() + d.getFullYear() + "-";
    let time = d.getHours() + d.getMinutes() + d.getSeconds();

    let form_data = new FormData();
    form_data.append("image", blob, userID + ":" + day + time + ".png");

    axiosInstance
      .post("profiles/image/", form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        resetModal();
      })
      .catch((err) => console.log(err));
  }

  function resetModal() {
    // on submit --> close modal, reset profile/images.
    setShow(false);
    setInputImg("");
    setBlob(null);
    window.location = "/" + userID + "/public"
  }

  return (
    <div>
      <Modal centered show={show} onHide={resetModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select a new photo</Modal.Title>
        </Modal.Header>

        <Form>
          <Modal.Body>
            <Form.Group controlId="myForm">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    height: "320px",
                    width: "100%",
                    border: "0.5px solid gray",
                  }}
                >
                  <Form.Control
                    custom
                    as="input"
                    type="file"
                    accept="image/*"
                    onChange={onInputChange}
                    hidden={inputImg ? true : false}
                    style={{
                      position: "relative",
                      padding: "0.75rem",
                      height: inputImg ? "auto" : "100%",
                    }}
                  />

                  {inputImg && (
                    <ImageCropper getBlob={getBlob} inputImg={inputImg} />
                  )}
                </div>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmitImage}>Submit</Button>
            <Button variant="secondary" onClick={resetModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
export default ProfileImageUploadModal;
