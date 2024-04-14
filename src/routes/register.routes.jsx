import React from 'react';

import { Routes, Route } from 'react-router-dom';

import { useAuth } from '../hooks/auth'; // Importa o useAuth do hook

import { RegisterAdmin } from '../pages/RegisterAdmin'; // AdminRegister
import { PageError } from '../pages/PageError'; // NotFound


export function RegisterRoutes() {
    const { user } = useAuth(); // Usa o useAuth hook para acessar informações de autenticação

    return (
        <Routes>
            <Route path="/" element={<RegisterAdmin />} />
            <Route path="*" element={<PageError />} />
        </Routes>
    );
}
