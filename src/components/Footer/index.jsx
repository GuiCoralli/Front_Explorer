import React from 'react';
import { BsHexagonFill } from 'react-icons/bs';
import { Container, Logo } from './styles';


export function Footer() {

    const LogoContent = () => (
        <Logo>
            <BsHexagonFill />food explorer
        </Logo>
    );

    const TextContent = () => (
        <span>
            © 2023 - Todos os direitos reservados.
        </span>
    );

    return (
        <Container>
            {LogoContent()}
            {TextContent()}           
        </Container>
    );
}