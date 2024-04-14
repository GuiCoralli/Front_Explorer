import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button';
import { Container } from './styles';


export function PageError() {

    const history = useNavigate();

    // Função para lidar com o retorno à página anterior
    const handleReturnHome = () => {
        history.push('/'); // Redireciona o usuário para a página inicial
    };

    return (
        <Container>
            <h1>404..Página não encontrada!...</h1>
            <p>Ops..Aconteceu algum erro. 
                A página que você quer acessar não conseguimos encontrar.</p>
            <Button
                title="Retornar à home"
                onClick={handleReturnHome}
            />
        </Container>
    );
}