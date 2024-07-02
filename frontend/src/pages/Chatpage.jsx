import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container , Toast, ToastContainer } from 'react-bootstrap';
import ShowUsers from '../components/ShowUsers';
import Chatbox from '../components/chatBox';
import Profile from '../components/profile';

function Chatpage() {
  const navigate = useNavigate();
  const [showFailureToast, setShowFailureToast] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('userInfo')) {
      setShowFailureToast(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate]);

  return (
    <>
      <Container className='d-flex justify-content-end w-100 p-2'>
        <ShowUsers/>
        <Chatbox/>
        <Profile/>
      </Container>
    
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="danger"
          onClose={() => setShowFailureToast(false)}
          show={showFailureToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Unauthorized Access</strong>
          </Toast.Header>
          <Toast.Body>Redirecting to Login Page</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Chatpage;
