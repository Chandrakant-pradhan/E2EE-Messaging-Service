import React, { useEffect, useState } from 'react';
import { Container, Button, Form, InputGroup, Stack, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import ClickableUser from './clickableUser';
import { ChatState } from '../context/ChatContext';

function ShowUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {talkingUser , setTalkingUser ,setMessages , messages} = ChatState();
  const otherInfo = JSON.parse(sessionStorage.getItem("otherInfo"));
  
  const accessChat = async (userID) => {
     try{
        const config = {
          "Content-type": "application/json",
          headers: {
            Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("userInfo")).token}`,
          },
        };
        const { data } = await axios.get(`/api/message/${userID}`, config);
        if(data){
           setMessages(data);
        }
        else{
           setMessages([]);
        }
        const temp = JSON.stringify({
          notifications: otherInfo.notifications,
          messages: messages,
          newMessage: otherInfo.newMessage,
          talkingUser: talkingUser,
          sentMessages: otherInfo.sentMessages,
        })
        sessionStorage.setItem("otherInfo" , temp)
     }
     catch (error) {
       console.log(error)
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("Unknown error occurred. Please try again.");
        }
        setShowFailureToast(true);
    }
  }//run only once only when chat is loaded 

  const searchUsers = async () => {
    try {
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("userInfo")).token}`,
        },
      };
      let { data } = await axios.get(`/api/user?search=${query}`, config);

      if (data) {
        setSearchResults(data);
      }
      else{
         setSearchResults([]);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Unknown error occurred. Please try again.");
      }
      setShowFailureToast(true);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("userInfo")).token}`,
        },
      };
      const { data } = await axios.get(`/api/user/users`, config);
      if (data) {
        setUsers(data);
      }
      else{
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Unknown error occurred. Please try again.");
      }
      setShowFailureToast(true);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      searchUsers();
    }
  }, [query]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchUsers();
  };

  return (
    <Container style={{ width: '30%', height: '65vh', margin: '10px', borderRadius: '10px', backgroundColor: '#979797' }}>
      <Container style={{ width: '90%', height: '8vh', margin: '20px', borderRadius: '10px' }}>
        <Form onSubmit={handleSearchSubmit}>
          <InputGroup className="mb-2">
            <Form.Control
              placeholder="Search User"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
              variant="btn btn-dark" 
              id="button-addon2"
              type="submit"
            >
              Search
            </Button>
          </InputGroup>
        </Form>
      </Container>

      <Container className="overflow-auto" style={{ width: '90%', height: '49vh', margin: '20px', borderRadius: '10px'}}>
        <Stack gap={3}>
          {
          (query.length > 0) ? (
            searchResults.length > 0 ? (
              searchResults.map((user) => (
                <ClickableUser
                  key={user.id || user._id}
                  user={user}
                  handleFunction={async () => { 
                    setTalkingUser(user)
                    accessChat(user)
                  }}
                />
              ))
            ) : (
              <div>No such user</div>
            )
          ) : (
            users.map((user) => (
              <ClickableUser
                  key={user.id || user._id}
                  user={user}
                  handleFunction={() => {setTalkingUser(user) , accessChat(user._id)}}
              />
            ))
          )}
        </Stack>
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
            <strong className="me-auto">Search Failed</strong>
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default ShowUsers;
