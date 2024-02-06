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
    const [adminAccessExists, setAdminAccessExists] = useState(false);

    useEffect(() => {
        async function checkIfAdminAccessExists() {
            try {
                const response = await api.get("/adminaccess");
                if (response.data) {
                    setAdminAccessExists(true);
                } else {
                    setAdminAccessExists(false);
                };

            }   catch (error) {
                console.error("Erro ao verificar se o administrador existe:", error);

                if (error.response && error.response.status === 404) {
                    toast("Administrador não encontrado. Registre-se para obter acesso.");
                } else {
                    toast("Erro ao verificar se existe um administrador. Tente novamente.");
                }
            }
        }

        checkIfAdminAccessExists();
    }, []);

            
                

    return (
        <BrowserRouter>
            {adminAccessExists ? (
                user ? (
                    isAdminAccess ? <AdminAccessRoutes /> : <UserRoutes />
                ) : (
                    <AuthRoutes />
                )
            ) : (
                <RegisterRoutes />
            )}
        </BrowserRouter>
    );
}
