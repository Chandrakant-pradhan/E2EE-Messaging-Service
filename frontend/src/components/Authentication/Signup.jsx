import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { keyGenerator } from '../../utils/security';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [privateKeyJwk, setPrivateKeyJwk] = useState(null);
  const navigate = useNavigate();

  const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  };
   
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
    } else {
      setShowFailureToast(true);
      setErrorMessage('Please upload a valid JPEG or PNG image.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      setShowFailureToast(true);
      setErrorMessage('Please upload an image');
      return;
    }

    try {
      await loadModels();
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const img = await faceapi.fetchImage(reader.result);
        const faceAIData = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

        if(faceAIData.length > 1){
          setShowFailureToast(true);
          setErrorMessage('More than one face detected');
          return;
        }
        else if(faceAIData.length == 0){
          setShowFailureToast(true);
          setErrorMessage('No face detected');
          return;
        }

        // Generate public and private key
        const faceFeatures = Array.from(faceAIData[0].descriptor);

        const { publicKeyJwk, privateKeyJwk } = await keyGenerator();
        setPrivateKeyJwk(privateKeyJwk);
        const PublicKeyString = JSON.stringify(publicKeyJwk);

        // // Make the axios call
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          "/api/user/signup",
          { name, email, password, faceFeatures, PublicKeyString },
          config
        );

        // // Store private key in sessionStorage
        sessionStorage.setItem("privateKey", JSON.stringify(privateKeyJwk));
        setShowSuccessToast(true);
        setShowModal(true);
      };
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        console.log(error);
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

        <Form.Group className="mb-2" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            required
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
