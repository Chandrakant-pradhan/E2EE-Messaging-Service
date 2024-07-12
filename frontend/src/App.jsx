import './App.css'
import { Routes, Route  } from 'react-router-dom';
import Chatpage from './pages/Chatpage';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import FaceLogin from './components/Authentication/FaceLogin';
import { Navigate } from 'react-router-dom';

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
            <Route  path='/face' element={<FaceLogin/>}/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
   </>
  )
}

export default App
