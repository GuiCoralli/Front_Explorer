import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState({});

  const handleErrors = (error) => {
    if (error.response) {
      console.error("Erro: ", error.response.data.message);
      toast(error.response.data.message);
    } else {
      console.error("Erro: ", error);
      toast("Não foi possível realizar a operação. Tente novamente.");
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { data: { user, token, isAdminAccess } } = await api.post("/sessions", { email, password });
      const requestorder = isAdminAccess ? {} : JSON.parse(localStorage.getItem("@foodexplorer:requestorder")) || {
        user_id: user.id,
        status: "aberto",
        plates: []
      };

      localStorage.setItem("@foodexplorer:user", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }));
      localStorage.setItem("@foodexplorer:token", token);
      if (!isAdminAccess) localStorage.setItem("@foodexplorer:requestorder", JSON.stringify(requestorder));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setData({ user, token, isAdminAccess, requestorder });
    } catch (error) {
      handleErrors(error);
    }
  };

  const signOut = () => {
    localStorage.removeItem("@foodexplorer:token");
    localStorage.removeItem("@foodexplorer:user");
    localStorage.removeItem("@foodexplorer:requestorder");

    setData({});
  };

  const updateProfile = async ({ user, avatarFile }) => {
    try {
      if (avatarFile) {
        const fileUploadForm = new FormData();
        fileUploadForm.append("avatar", avatarFile);

        const { data: { avatar } } = await api.patch("/users/avatar", fileUploadForm);
        user.avatar = avatar;
      }

      await api.put("/users", user);

      const userLocalStorage = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      };

      localStorage.setItem("@foodexplorer:user", JSON.stringify(userLocalStorage));

      setData({ user, token: data.token, isAdminAccess: data.isAdminAccess, requestorder: data.requestorder });
      toast("Perfil atualizado com sucesso!");
    } catch (error) {
      handleErrors(error);
    }
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
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      updateProfile,
      user: data.user,
      isAdminAccess: data.isAdminAccess,
      requestorder: data.requestorder
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
