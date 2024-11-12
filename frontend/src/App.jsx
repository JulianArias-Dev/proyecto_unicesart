import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Welcome, Login, Register, RecuperarContraseña, Profile, DashBoard, Configuration, CommentPage } from './Pages/pages.jsx'
import { Footer, NavBar } from './Componets/components.jsx'
import { AuthProvider, PostProvider, ReportProvider, ProtectedRoute } from './context/providers.jsx'


function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <ReportProvider>
          <Router>
            <div className='App'>
              <NavBar />
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/singin" element={<Login />} />
                <Route path="/singup" element={<Register />} />
                <Route path="/recover" element={<RecuperarContraseña />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path='/home' element={<DashBoard />} />
                <Route path='/comments/:postid' element={<CommentPage />} />
                <Route path='/configuration' element={<ProtectedRoute element={<Configuration />} />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </ReportProvider>
      </PostProvider>
    </AuthProvider >
  );
}

export default App;
