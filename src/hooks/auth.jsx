import React, { createContext, useContext, useState, useEffect  } from "react";

import { api } from '../services/api';

import { toast } from "react-hot-toast";

const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [data, setData] = useState({});

    async function logIn({ email, password }) {
        try {
            const response = await api.post("/sessions", { email, password });
            const { user, token, isAdmin } = response.data;
            let request = {};

            const userLocalStorage = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            };

            localStorage.setItem("@foodexplorer:user", JSON.stringify(userLocalStorage));
            localStorage.setItem("@foodexplorer:token", token);

            if (!isAdmin) {
                const storageRequest = JSON.parse(localStorage.getItem("@foodexplorer:request"));

                if (storageRequest && storageRequest.user_id === user.id) {
                    request = storageRequest;
                } else {
                    request = {
                        user_id: user.id,
                        status: "aberto",
                        foods: []
                    };

                    localStorage.setItem("@foodexplorer:request", JSON.stringify(request));
                };
            };

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setData({ user, token, isAdmin, request });

        } catch (error) {
            if (error.response) {
                console.error("Erro ao tentar realizar o login com o usuário: ", error.response.data.message);
                toast(error.response.data.message);
            } else {
                console.error("Aconteceu um erro ao tentar realizar o login com o usuário: ", error);
                toast("Não foi possível entrar. Por favor, tente novamente.");
            };
        };
    };

    function register() {
        localStorage.removeItem("@foodexplorer:token");
        localStorage.removeItem("@foodexplorer:user");

        setData({});
    };

    async function updateProfile({ user, avatarFile, isAdmin, request }) {
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

            setData({ user, token: data.token, isAdmin, request });
            toast("Perfil do usuário atualizado!");

        } catch (error) {
            if (error.response) {
                console.error("Aconteceu um erro ao tentar atualizar o perfil do uusário: ", error.response.data.message);
                toast(error.response.data.message);
            } else {
                console.error("Erro ao atualizar o perfil do usuário: ", error);
                toast("Não foi possível atualizar o perfil do usuário. Por favor, tente novamente.");
            }
        };
    };

    useEffect(() => {
        const token = localStorage.getItem("@foodexplorer:token");
        const user = localStorage.getItem("@foodexplorer:user");
        const request = localStorage.getItem("@foodexplorer:request");

        if (token && user) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const decodedToken = jwt_decode(token);
            const isAdmin = decodedToken.isAdmin;

            setData({
                token,
                user: JSON.parse(user),
                isAdmin,
                request: JSON.parse(request)
            });
        };

    }, []);

    return (
        <AuthContext.Provider value={{
            logIn,
            register,
            updateProfile,
            user: data.user,
            isAdmin: data.isAdmin,
            request: data.request
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