import { useContext , createContext , useState , useEffect } from "react";
import {useNavigate} from "react-router-dom"
const ChatContext = createContext();

const ChatProvider = ({children}) => {

    const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem('userInfo')) || null);
    
    // Retrieve otherInfo from sessionStorage with default values if not available
      const otherInfo = JSON.parse(sessionStorage.getItem("otherInfo")) || {
        notifications: [],
        messages: [],
        newMessage: null,
        talkingUser: null,
        sentMessages: [],
      };

      const [notification, setNotification] = useState(otherInfo.notifications);
      const [messages, setMessages] = useState(otherInfo.messages);
      const [newMessage, setNewMessage] = useState(otherInfo.newMessage);
      const [talkingUser, setTalkingUser] = useState(otherInfo.talkingUser);
      const [sentMessages, setSentMessages] = useState(otherInfo.sentMessages);
    
      const navigate = useNavigate();

    //who is the logged in loggedUser
    //what are my notifications
    //what messages should i display on the chatbox -> nothing or something
    
    //if navigate is changed and you are not authenticated then redirect to home
    useEffect(()=>{
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        if(!userInfo){
          if (location.pathname !== '/' && location.pathname !== '/signup'
            && location.pathname !== '/face'
          ) {
            navigate("/");
          }
        }
        else{
          setLoggedUser(userInfo)
        }
    }, [navigate]);

    //now return the variables to be used globally
    return (
        <ChatContext.Provider
          value={{
            loggedUser,
            setLoggedUser,
            notification,
            setNotification,
            messages,
            setMessages,
            talkingUser ,
            setTalkingUser,
            newMessage , 
            setNewMessage,
            sentMessages,
            setSentMessages,
          }}
        >
          {children}
        </ChatContext.Provider>
      );

}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider
