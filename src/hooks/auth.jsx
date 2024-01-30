import React, { createContext, useContext, useState, useEffect } from 'react';

import jwt_decode from 'jwt-decode';
import { api } from '../services/api';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [data, setData] = useState({});

    async function signIn({ email, password }) {
        try {
            const response = await api.post("/sessions", { email, password });
            const { user, token, isAdminAccess } = response.data;
            let requestorder = {};

            const userLocalStorage = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            };

            localStorage.setItem("@foodexplorer:user", JSON.stringify(userLocalStorage));
            localStorage.setItem("@foodexplorer:token", token);

            if (!isAdminAccess) {
                const storageRequestOrder = JSON.parse(localStorage.getItem("@foodexplorer:requestorder"));

                if (storageRequestOrder && storageRequestOrder.user_id === user.id) {
                    requestorder = storageRequestOrder;
                } else {
                    requestorder = {
                        user_id: user.id,
                        status: "aberto",
                        plates: []
                    };

                    localStorage.setItem("@foodexplorer:requestorder", JSON.stringify(requestorder));
                };
            };

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setData({ user, token, isAdminAccess, requestorder });

        } catch (error) {
            if (error.response) {
                console.error("Erro ao fazer login: ", error.response.data.message);
                toast(error.response.data.message);
            } else {
                console.error("Erro ao fazer login: ", error);
                toast("Não foi possível realizar seu login, tente novamente.");
            };
        };
    };

    function signOut() {
        localStorage.removeItem("@foodexplorer:token");
        localStorage.removeItem("@foodexplorer:user");

        setData({});
    };

    async function updateProfile({ user, avatarFile, isAdminAccess, requestorder }) {
        try {
            if (avatarFile) {
                const fileUploadForm = new FormData();
                fileUploadForm.append("avatar", avatarFile);

                const response = await api.patch("/users/avatar", fileUploadForm);
                user.avatar = response.data.avatar;
            };

            await api.put("/users", user);

            const userLocalStorage = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            };

            localStorage.setItem("@foodexplorer:user", JSON.stringify(userLocalStorage));

            setData({ user, token: data.token, isAdminAccess, requestorder });
            toast("Perfil atualizado com sucesso!");

        } catch (error) {
            if (error.response) {
                console.error("Erro ao atualizar o perfil: ", error.response.data.message);
                toast(error.response.data.message);
            } else {
                console.error("Erro ao atualizar o perfil: ", error);
                toast("Perfil do usuário não atualizado. Por favor, tente novamente.");
            }
        };
    };

    useEffect(() => {
        const token = localStorage.getItem("@foodexplorer:token");
        const user = localStorage.getItem("@foodexplorer:user");
        const requestorder = localStorage.getItem("@foodexplorer:requestorder");

        if (token && user) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const decodedToken = jwt_decode(token);
            const isAdminAccess = decodedToken.isAdminAccess;

            setData({
                token,
                user: JSON.parse(user),
                isAdminAccess,
                requestorder: JSON.parse(requestorder)
            });
        };

    }, []);

    return (
        <AuthContext.Provider value={{
            signIn,
            signOut,
            updateProfile,
            user: data.user,
            isAdminAccess: data.isAdminAccess,
            requestorder: data.requestorder
        }}
        >
            {children}
        </AuthContext.Provider>
    )
};

function useAuth() {
    const context = useContext(AuthContext);

    return context;
};

export { AuthProvider, useAuth };