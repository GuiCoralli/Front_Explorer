import React from 'react';
import { TfiSearch } from 'react-icons/tfi';
import { Container } from './styles';

export function Placeholder() {
    
    const IconComponent = <TfiSearch />;

    return (
        <Container>
            {IconComponent}
            <span></span>
        </Container>
    );
}
