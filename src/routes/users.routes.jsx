import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/auth'; // Importa o useAuth do hook

import { Home } from '../pages/Home'; //Home principal
import { PageError } from '../pages/PageError'; //Pág. ñ foi possível achar
import { PaymentCart } from '../pages/PaymentCart'; // //Pág. de Carrinho de pgmto
import { Register } from '../pages/Register'; //SignUp
import { LogIn } from '../pages/LogIn'; //SignIn

export function UsersRoutes() {
  const { user } = useAuth(); /// Usa o useAuth hook para acessar informações de autenticação
  
  return (
    <Routes>
      <Route path="/"            element={<Home />} />;
      <Route path="*"            element={<PageError />}/>;
      <Route path="/paymentcart"        element={<PaymentCart />} />;
      <Route path="/register"    element={<Register />}      />;
      <Route path="/login"       element={<LogIn />}     />;
    </Routes>
  );
}
