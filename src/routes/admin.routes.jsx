import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/auth'; // Importa o useAuth do hook

import { Home } from '../pages/Home'; //Home principal
import { Profile } from '../pages/Profile';//Perfil principal
import { Food } from '../pages/Food'; //Comidas principais
import { Requests } from '../pages/Requests';//Solicitações dos pedidos do usuário
import { AddFood } from '../pages/AddFood';//Add pedidos de comida do usuário
import { EditFood } from '../pages/EditFood';//Editando pedidos de comida do usuário
import { PageError } from '../pages/PageError';//Pág. ñ foi possível achar

export function AdminRoutes() {
  const { user } = useAuth(); // Usa o useAuth hook para acessar informações de autenticação


  return (
    <Routes>
      <Route path="/"              element={<Home />}    />
      <Route path="/profile"       element={<Profile />} />
      <Route path="/food/:id"      element={<Food />}    />
      <Route path="/requests/:id"  element={<Requests />} />
      <Route path="/add"           element={<AddFood />} />
      <Route path="/edit/:id"      element={<EditFood />} />
      <Route path="*"              element={<PageError />} />
    </Routes>
  );
}



