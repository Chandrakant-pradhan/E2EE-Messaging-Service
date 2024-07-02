import React, { useState } from 'react';
import { Button, Form, Container, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { keyGenerator } from '../../utils/security';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [privateKeyJwk, setPrivateKeyJwk] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Generate public and private key
      const { publicKeyJwk, privateKeyJwk } = await keyGenerator();
      setPrivateKeyJwk(privateKeyJwk);
      const PublicKeyString = JSON.stringify(publicKeyJwk);

      const { data } = await axios.post(
        "/api/user/signup",
        { name, email, password, PublicKeyString },
        config
      );

      // Store private key in localStorage
      sessionStorage.setItem("privateKey", JSON.stringify(privateKeyJwk));
      setShowSuccessToast(true);
      setShowModal(true);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Unknown error occurred. Please try again.");
      }
      setShowFailureToast(true);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(privateKeyJwk)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'privateKey.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      navigate("/");
    }, 2000); // Redirect after 2 seconds
  };

  return (
    <Container className="w-25 p-4 mb-4 bg-secondary rounded">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="btn btn-dark">
          Submit
        </Button>
      </Form>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Successfully Registered</strong>
          </Toast.Header>
          <Toast.Body>Redirecting to Login Page</Toast.Body>
        </Toast>

        <Toast
          bg="danger"
          onClose={() => setShowFailureToast(false)}
          show={showFailureToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Error in registration</strong>
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Download Private Key</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to download your private key? Make sure to store it securely.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No, Thanks
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Signup;
