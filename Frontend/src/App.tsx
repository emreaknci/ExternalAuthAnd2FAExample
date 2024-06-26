import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from 'react-toastify';
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import TwoFactorAuthPage from './pages/TwoFactorAuthPage';
import { useContext, useEffect } from "react";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);



  useEffect(() => {
    console.log(isAuthenticated)
  }, [isAuthenticated])

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AuthProvider>
        <CssBaseline />
        <AppRoutes />

      </AuthProvider>
    </>
  )
}

export default App


const AppRoutes = () => {
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const authenticatedUserRoutes = () => {
    return (
      <Routes >
        <Route path="/" element={<HomePage />} />
        {!currentUser?.isTwoFactorEnabled && <Route path="/enable-2fa" element={<TwoFactorAuthPage />} />}
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    )
  }
  const unauthenticatedUserRoutes = () => {
    return (
      <Routes >
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    )
  }

  return (<>
    <Router>
      <Navbar />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin:"2rem"
      }}>
        {isAuthenticated ? authenticatedUserRoutes() : unauthenticatedUserRoutes()}
      </div>
    </Router>

  </>)
}