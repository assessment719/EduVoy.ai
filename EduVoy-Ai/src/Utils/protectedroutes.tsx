import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './../config';

function ProtectedRoutes() {
    const [isLogin, setIsLogin] = useState(true);

    const checkingAuthentication = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsLogin(false);
                return;
            }

            const response = await fetch(`${BACKEND_URL}/users/authenticate`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });

            const data = await response.json();

            if (data.Message === "Authenticated") {
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    useEffect(() => {
        checkingAuthentication();
    }, []);

    return isLogin ? <Outlet /> : <Navigate to={"/users/sign"} />
}

export default ProtectedRoutes