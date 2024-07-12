import React, { useState } from 'react';
import { Button, Form, Container, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {setupUser} from '../../socket'
import { ChatState } from '../../context/ChatContext';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {setLoggedUser} = ChatState(); 

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password},
        config
      )

      const temp = JSON.stringify({
        notifications: [],
        messages: [],
        newMessage: '',
        talkingUser: null,
        sentMessages: [],
      })

      sessionStorage.setItem("userInfo",JSON.stringify(data));
      sessionStorage.setItem("otherInfo", temp )

      setLoggedUser(JSON.parse(sessionStorage.getItem("userInfo")))
      setupUser(data);

      setShowSuccessToast(true);

      setTimeout(() => {
        navigate("/chats");
      }, 2000); // Redirect after 2 seconds

    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Unknown error occurred. Please try again.");
      }
      setShowFailureToast(true);
    }
  }
  return (
    <Container className="w-25 p-4 mb-4 bg-secondary rounded">
      <Form onSubmit={handleSubmit}>
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
        <div>
          <a href="/signup" style={{color : "black"}}>
            Don't have an account? Sign up
          </a>
          <br/>
          <a href="/face" style={{color : "black"}}>
            Want face login? 
          </a>
        </div>
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
            <strong className="me-auto">Login Success</strong>
          </Toast.Header>
          <Toast.Body>Welcome back!</Toast.Body>
        </Toast>

        <Toast
          bg="danger"
          onClose={() => setShowFailureToast(false)}
          show={showFailureToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Login Failed</strong>
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Login;
