import React from 'react';
import { Container } from './styles';

export function Section({ title, children }) {
    
    const TitleComponent = <span>{title}</span>;

    return (
        <Container>
            {TitleComponent}
            {children}
        </Container>
    );
}
