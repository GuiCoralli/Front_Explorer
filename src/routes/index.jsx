import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import { api } from '../services/api';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthRoutes } from './auth.routes';
import { AdminAccessRoutes } from './admin.access.routes';
import { UserRoutes } from './user.routes';
import { RegisterRoutes } from './register.routes';

export function Routes() {
    const { user, isAdminAccess } = useAuth();
    const [loaded, setLoaded] = useState(false);
    const [adminAccessExists, setAdminAccessExists] = useState(false);

    useEffect(() => {
        async function checkIfAdminAccessExists() {
            try {
                const response = await api.get("/adminaccess");
            
                if (response.data) {
                    setAdminAccessExists(true);
                } else {
                    setAdminAccessExists(false);
                }
            
                setLoaded(true);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // O servidor respondeu com um status 404 (Not Found)
                } else {
                    // Outro tipo de erro
                    console.error("Erro ao verificar se o administrador existe:", error);
                    toast("Erro ao verificar se existe um administrador, tente novamente.");
                }
        
                setLoaded(true);
            }
        };
        
        checkIfAdminAccessExists();
    }, []);

    return (
        <BrowserRouter>
            {
                adminAccessExists ? (
                    user ? (isAdminAccess ? <AdminAccessRoutes /> : <UserRoutes />) : <AuthRoutes />
                ) : (
                    <RegisterRoutes />
                )
            }
        </BrowserRouter>
    );
}