import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from '../hooks/auth'; // Importa do AuthProvider
import { useAuth } from '../hooks/auth'; // Importa o useAuth do hook

import { AdminRoutes } from '../routes/admin.routes';
import { RegisterRoutes } from '../routes/register.routes';
import { UsersRoutes } from '../routes/users.routes';
import { AuthRoutes } from '../routes/auth.routes';

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