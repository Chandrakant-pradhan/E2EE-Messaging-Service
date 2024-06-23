import React, { useState } from 'react';
import { Container, Card, Image, Row, Col, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { ChatState } from '../context/ChatContext';

function Profile() {
  const { loggedUser } = ChatState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [profileURL, setProfileURL] = useState(loggedUser.profileURL);
  const [bio , setBio] = useState(loggedUser.bio);

  const {notification , setTalkingUser} = ChatState();


  const handleUpdateProfile = () => {
     console.log("hi")
  };
  
  const handleLogout = () => {
     //free the session storage and do to logout
     //sessionstorage("userInfo") and otherInfo
     sessionStorage.removeItem("userInfo");
     sessionStorage.removeItem("otherInfo");
     navigator("/login");
  };

  return (
    <>
      <Container
        style={{
          width: '20%',
          height: '40vh',
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
            </Row>
          </Container>
        </Card>
        <Button variant="secondary" onClick={() => setShowUpdateModal(true)} style={{ marginTop: '10px' }}>
          Update Profile
        </Button>
        {showNotifications && (
          <ListGroup style={{ marginTop: '10px', width: '100%' }}>
            {notification.map((notifs, index) => (
              <ListGroup.Item key={index}>
                  <ClickableNotifs
                    user = {notifs.sender}
                    handleFunction={() => { 
                      setTalkingUser(notifs.sender)
                     }
                    }
                  />
                </ListGroup.Item>
            ))}
          </ListGroup>
        )}
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
                placeholder="Update ProfileURL"
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
            <Button variant="primary" onClick={
              handleUpdateProfile}>
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleLogout} style={{ marginTop: '10px' , width: "100%"}}>
	       Logout
	    </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Profile;
