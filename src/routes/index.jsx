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
                };

                setLoaded(true);
            } catch (error) {
                console.error("Erro ao verificar se o administrador existe:", error);
                toast("Erro ao verificar se existe um administrador, tente novamente.");
            };
        };

        checkIfAdminAccessExists();
    }, []);

    if (!loaded) {
        return (
            <div className='loading'>
                <div>
                    <div id="circular3dG">
                        <div id="circular3d_1G" className="circular3dG"></div>
                        <div id="circular3d_2G" className="circular3dG"></div>
                        <div id="circular3d_3G" className="circular3dG"></div>
                        <div id="circular3d_4G" className="circular3dG"></div>
                        <div id="circular3d_5G" className="circular3dG"></div>
                        <div id="circular3d_6G" className="circular3dG"></div>
                        <div id="circular3d_7G" className="circular3dG"></div>
                        <div id="circular3d_8G" className="circular3dG"></div>
                    </div>
                </div>
                <span>Carregando...</span>
            </div>
        );
    };

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