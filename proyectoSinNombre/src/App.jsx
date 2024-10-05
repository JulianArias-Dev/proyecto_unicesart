import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './Componets/Footer.jsx';
import DashBoard from './Pages/DashBoard.jsx';
import Profile from './Pages/Profile.jsx';
import Configuration from './Pages/Configuration.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import NavBar from './Componets/NavBar.jsx';
import Login from "./Pages/LoginPage.jsx";
import Register from "./Pages/RegisterPage.jsx";
import Welcome from "./Pages/Welcome.jsx";
import RecuperarContraseña from './Pages/RecuperarContraseña.jsx';
import { PostProvider } from './context/PostContext.jsx';

function App() {
  return (
      <AuthProvider>
        <PostProvider>
          <Router>
            <div className='App'>
              <NavBar />
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/singin" element={<Login />} />
                <Route path="/singup" element={<Register />} />
                <Route path="/recover" element={<RecuperarContraseña />} />
                <Route path='/home' element={<DashBoard />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path='/configuration' element={<Configuration />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </PostProvider>
      </AuthProvider>
  );
}

export default App;
