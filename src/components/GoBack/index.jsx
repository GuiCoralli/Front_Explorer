import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TfiAngleLeft } from 'react-icons/tfi';
import { Container } from './styles';

export function GoBack() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        document.documentElement.style.overflowY = "auto";
        navigate("/");
    };

    return (
        <Container onClick={handleGoBack}>
            <TfiAngleLeft /> Voltar
        </Container>
    );
}
