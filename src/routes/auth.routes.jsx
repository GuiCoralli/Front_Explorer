import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/auth'; // Importa o useAuth do hook

import { Preferences } from "../pages/Preferences"; //Preferidos do usuário
import { PageError } from "../pages/PageError"; //Pág. ñ foi possível achar
import { Requests } from "../pages/Requests"; //Solicitações dos pedidos do usuário
import { Home } from "../pages/Home"; //Home principal
import { Profile } from "../pages/Profile"; //Perfil principal
import { PaymentCart } from "../pages/PaymentCart"; //Pág. de Carrinho de pgmto

export function AuthRoutes() {
  const { user } = useAuth(); // Usa o useAuth hook para acessar informações de autenticação

  return (
    <Routes>
      <Route path="/preferences" element={<Preferences />} />;
      <Route path="*" element={<PageError />} />;
      <Route path="/requests/:id" element={<Requests />} />;
      <Route path="/" element={<Home />} />;
      <Route path="/profile" element={<Profile />} />;
      <Route path="/payment-cart" element={<PaymentCart />} />;
    </Routes>
  );
}

