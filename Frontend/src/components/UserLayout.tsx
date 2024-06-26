
import { Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from './Navbar';
import HomePage from '../pages/HomePage';
import TwoFactorAuthPage from '../pages/TwoFactorAuthPage';

const UserLayout = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authContext.isAuthenticated) {
            navigate("/");
        }
    }, [authContext.isAuthenticated, navigate])
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 3 }, pt: { xs: 10, md: 10 } }}>
                    {authContext.isAuthenticated &&
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/enable-2fa" element={<TwoFactorAuthPage />} />
                            <Route path="/*" element={<HomePage />} />
                            <Route path="*" element={<Navigate to={"/user"} />} />
                        </Routes>
                    }
                </Box>
            </Box>
        </>
    );
};

export default UserLayout;
