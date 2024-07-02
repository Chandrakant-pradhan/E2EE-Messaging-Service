import React, { useState } from 'react';
import { Container, Card, Image, Row, Col, Button, Modal, Form, Toast } from 'react-bootstrap';
import { ChatState } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Profile() {
  const { loggedUser, setLoggedUser } = ChatState();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [profileURL, setProfileURL] = useState(loggedUser.profileURL);
  const [bio, setBio] = useState(loggedUser.bio);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const { notification, setTalkingUser } = ChatState();
  const navigator = useNavigate();

  const handleUpdateProfile = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("userInfo")).token}`,
        },
      };
      const { data } = await axios.put(
        `/api/user/`,
        { profileURL: profileURL, bio: bio },
        config
      );
      sessionStorage.setItem("userInfo", JSON.stringify(data));
      setLoggedUser(JSON.parse(sessionStorage.getItem("userInfo")));
      setShowUpdateModal(false);
      setShowSuccessToast(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    // Free the session storage and logout
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("otherInfo");
    sessionStorage.removeItem("privateKey");
    navigator("/");
  };

  return (
    <>
      <Container
        style={{
          width: '20%',
          height: '60vh',
          margin: '10px',
          borderRadius: '10px',
          backgroundColor: '#979797',
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Container style={{ display: 'flex', width: '100%' }}>
          <h3>Profile</h3>
        </Container>
        <Card
          style={{
            cursor: 'pointer',
            backgroundColor: '#E8E8E8',
            width: '100%',
            marginTop: '10px',
            marginBottom: '10px',
            borderRadius: '10px',
            padding: '5px'
          }}
          className="hoverable-card"
        >
          <Container>
            <Row className="align-items-center">
              <Col xs="auto">
                <Image
                  roundedCircle
                  src={loggedUser.profileURL}
                  alt={loggedUser.name}
                  style={{ width: '40px', height: '40px', marginRight: '10px' }}
                />
              </Col>
              <Col>
                <h5 style={{ marginBottom: '0' }}>{loggedUser.name}</h5>
                <small>
                  <b>Email:</b> {loggedUser.email}
                </small>
              </Col>
              <Col>
                <small>
                  <b>Bio:</b> {loggedUser.bio}
                </small>
              </Col>
            </Row>
          </Container>
        </Card>
        <Button variant="secondary" onClick={() => setShowUpdateModal(true)} style={{ marginTop: '10px', width: "100%" }}>
          Update Profile
        </Button>
        <Button variant="secondary" onClick={handleLogout} style={{ marginTop: '10px', width: "100%" }}>
          Logout
        </Button>
      </Container>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formProfileURL">
              <Form.Label>Profile URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Update Profile URL"
                value={profileURL}
                onChange={(e) => setProfileURL(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Update Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Toast
        onClose={() => setShowSuccessToast(false)}
        bg="success"
        show={showSuccessToast}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Profile updated successfully!</Toast.Body>
      </Toast>
    </>
  );
}

export default Profile;
