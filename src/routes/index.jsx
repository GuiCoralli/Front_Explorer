import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useAuth } from '../hooks/auth'; // Importa o useAuth do hook

import { AdminRoutes } from './admin.routes';
import { RegisterRoutes } from './register.routes';
import { UsersRoutes } from './users.routes';
import { AuthRoutes } from './auth.routes';

export function AppRoutes() {
  const { user, isAdmin } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Renderiza as rotas de acordo com a autenticação e o status de administrador */}
        {isAdmin ? (
          <Route
            path="*"
            element={user ? <AdminRoutes /> : <RegisterRoutes />}
          />
        ) : (
          <>
            <Route
              path="*"
              element={user ? <UsersRoutes /> : <AuthRoutes />}
              />
            <Route path="/register" element={<RegisterRoutes />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}