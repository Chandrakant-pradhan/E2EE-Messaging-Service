import React, { useEffect } from 'react';
import { Container, Card, Stack, Form, InputGroup, Button } from 'react-bootstrap';
import { ChatState } from '../context/ChatContext';
import { useState } from 'react';
import axios from 'axios';
import {sendingMessageToOther , newMessageArrived, onRefresh} from '../socket';
import { decryptData, encryptData, sharedKeyGenerator } from '../utils/security';

function Chatbox() {
  const {setTalkingUser ,  talkingUser, messages, setMessages, newMessage, setNewMessage , 
    notification , setNotification , sentMessages , setSentMessages,
  setLoggedUser , loggedUser} = ChatState();
  const [showFailureToast, setShowFailureToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  useEffect(() => {
    if(talkingUser){
      const receiverPublicKeyJSON = JSON.parse(talkingUser.publicKey);
      const senderPrivateKeyJSON = JSON.parse(localStorage.getItem("privateKey"));
      const senderPublicKeyJSON = JSON.parse(loggedUser.publicKey);
      console.log(receiverPublicKeyJSON)
      console.log(senderPrivateKeyJSON)
      console.log(senderPublicKeyJSON)
    }
  }, [talkingUser])
  
  useEffect(() => {
     setTalkingUser(JSON.parse(sessionStorage.getItem('otherInfo')).talkingUser)
     setMessages(JSON.parse(sessionStorage.getItem('otherInfo')).messages)
     setNewMessage(JSON.parse(sessionStorage.getItem('otherInfo')).newMessage)
     setNotification(JSON.parse(sessionStorage.getItem('otherInfo')).notifications)
     setSentMessages(JSON.parse(sessionStorage.getItem('otherInfo')).sentMessages)
     setLoggedUser(JSON.parse(sessionStorage.getItem('userInfo')))
     onRefresh();
  }, [])
  
  useEffect(() => {
    newMessageArrived(async (msg) => {
      if(msg.sender._id ===  talkingUser._id){
          setMessages([...messages , msg])
          const otherInfo = JSON.parse(sessionStorage.getItem("otherInfo"));
          const temp = JSON.stringify({
            notifications: otherInfo.notifications,
            messages: messages,
            newMessage: otherInfo.newMessage,
            talkingUser:otherInfo.talkingUser,
            sentMessages:sentMessages,
          })
          sessionStorage.setItem("otherInfo" , temp)
      }
    })
  }, [messages])

  const sendMessage = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("userInfo")).token}`,
        },
      };

      //here encrypt 
      const receiverPublicKeyJSON = JSON.parse(talkingUser.publicKey);
      const senderPrivateKeyJSON = JSON.parse(localStorage.getItem("privateKey"));

      const sharedKey = await sharedKeyGenerator(receiverPublicKeyJSON , senderPrivateKeyJSON);

     

      const encrytedMessage = await encryptData(newMessage , sharedKey)

      const { data } = await axios.post(`/api/message/${talkingUser._id}`, { content: encrytedMessage}, config);
      // Ensure that the new message object includes all necessary properties
      setMessages([...messages, data]);
      const otherInfo = JSON.parse(sessionStorage.getItem("otherInfo"));
      const temp = JSON.stringify({
        notifications: otherInfo.notifications,
        messages: messages,
        newMessage: otherInfo.newMessage,
        talkingUser:otherInfo.newMessage,
        sentMessages: sentMessages,//let it be
      })
      sessionStorage.setItem("otherInfo" , temp)
      sendingMessageToOther(data)
      setNewMessage('');
    } 
    
    catch (error) {
      console.error(error);
      setErrorMessage('Failed to send message');
      setShowFailureToast(true);
    }
  };

  return (
    <Container style={{ width: '45%', height: '65vh', margin: '10px', borderRadius: '10px', backgroundColor: '#979797' }}>
      {!talkingUser ? (
        <Container className="w-100 h-100 d-flex align-items-center justify-content-center">
          <h2>Select a User to Start Chatting</h2>
        </Container>
      ) : (
        <>
          <Card className="h-75 mt-4">
            <Card.Header className='d-flex justify-content-center'>
              <h3>{talkingUser.name}</h3>
            </Card.Header>
            <Card.Body style={{ overflowY: 'auto' }}>
              <Stack gap={3}>
              {messages.length > 0 ? (
                <Stack gap={3}>
                  {messages.map((message , index) => (
                       <div key={message._id}>
                          <div className='d-flex justify-content-space-between'>
                             <strong>{message.sender.name}</strong>{message.content}
                             {!message.decrypted && (<Button 
                               variant="dark"
                               size="sm"
                               onClick={async () => {
                                const receiverPublicKeyJSON1 = JSON.parse(talkingUser.publicKey);
                                const senderPrivateKeyJSON1 = JSON.parse(localStorage.getItem("privateKey"));
                                const sharedKey1 = await sharedKeyGenerator(receiverPublicKeyJSON1 , senderPrivateKeyJSON1);
                                const tempo = await window.crypto.subtle.exportKey(
                                  "jwk",
                                  sharedKey1
                               );
                                console.log(JSON.stringify(tempo))
                                console.log(message.content)
                                const decoded = await decryptData(message.content , sharedKey1)
                                const updated = [...messages]
                                updated[index].content = decoded
                                updated[index].decrypted = true
                                setMessages(updated)
                                const otherInfo = JSON.parse(sessionStorage.getItem("otherInfo"));
                                const temp = JSON.stringify({
                                  notifications: otherInfo.notifications,
                                  messages: messages,
                                  newMessage: otherInfo.newMessage,
                                  talkingUser:otherInfo.talkingUser,
                                  sentMessages:otherInfo.sentMessages
                                })
                                sessionStorage.setItem("otherInfo" , temp)
                              }}
                             >
                               Decrypt
                             </Button>)}
                          </div>
                       </div>
                  ))}
                </Stack>
              ) : (
                <div>No messages yet. Start the conversation!</div>
              )}
              </Stack>
            </Card.Body>
          </Card>
          <Form onSubmit={sendMessage}>
            <InputGroup className="mt-4">
              <Form.Control
                placeholder="Send Message"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="btn btn-dark" id="button-addon2" type="submit">
                Send
              </Button>
            </InputGroup>
          </Form>
        </>
      )}
    </Container>
  );
}

export default Chatbox;
