import './App.css'
import { Routes, Route  } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';


function App() {
  return (
   <>
     <div className="centered">
        <h1 className='display-4 text-white chatName'>Kira Chat</h1>
        <div className='App'>
          <Routes>
            <Route  path="/chats" element={<Chatpage />} />
            <Route  path="/" element={<Login />} />
            <Route  path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
   </>
  )
}

export default App
