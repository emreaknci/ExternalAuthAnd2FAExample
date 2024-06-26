import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Navbar from './Navbar';


const MainLayout = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            <Navbar />
            <Routes>
                {/* <Route path="/" element={<HomePage />} />
                <Route path="/Home" element={<HomePage />} /> */}
                {!isAuthenticated && <Route path="/Login" element={<LoginPage />} />}
                {!isAuthenticated && <Route path="/Register" element={<RegisterPage />} />}
                <Route path="*" element={<Navigate to={"/Login"} />} />
            </Routes>
        </>
    );
};

export default MainLayout;
